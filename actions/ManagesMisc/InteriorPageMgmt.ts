"use server";

import { db } from "@/lib/db";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { v4 as uuid4 } from "uuid";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

const uploadToCloudinary = async (files: File[]): Promise<string[]> => {
  const imageUrls: string[] = [];

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise<UploadApiResponse>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "interior",
            public_id: `${file.name}-${uuid4()}`,
          },
          (error, result) => {
            if (error || !result?.secure_url) {
              return reject(new Error("Cloudinary upload failed"));
            }
            resolve(result);
          }
        );

        uploadStream.end(buffer);
      }
    );

    imageUrls.push(uploadResult.secure_url);
  }

  return imageUrls;
};

// Get all interior categories
export const getInteriorCategories = unstable_cache(
  async () => {
    try {
      const categories = await db.interiorCategory.findMany({
        orderBy: { createdAt: 'desc' }
      });
      
      return categories;
    } catch (error) {
      console.error("Error fetching interior categories:", error);
      return [];
    }
  },
  ["interior-categories"],
  {
    tags: ["interior-categories"],
    revalidate: false,
  }
);

// Create a new interior category
export const createInteriorCategory = async (name: string) => {
  try {
    // Check if we already have 6 categories
    const categoryCount = await db.interiorCategory.count();
    if (categoryCount >= 6) {
      return { error: "Maximum 6 categories allowed. Please delete a category before creating a new one." };
    }

    const category = await db.interiorCategory.create({
      data: { name }
    });
    revalidatePath('/interior');
    revalidatePath('/admin/misc');
    revalidateTag('interior-categories');
    return { success: "Category created successfully", category };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { error: "Category name already exists" };
    }
    return { error: "Failed to create category" };
  }
};

// Get images by category (max 6)
export const getInteriorImagesByCategory = unstable_cache(
  async (categoryId: string) => {
    try {
      const images = await db.interiorProjectImage.findMany({
        where: { categoryId },
        orderBy: { createdAt: 'desc' },
        take: 6
      });
      return images.map(img => img.imageUrl);
    } catch (error) {
      console.error("Error fetching interior images by category:", error);
      return [];
    }
  },
  ["interior-images-by-category"],
  {
    tags: ["interior-images"],
    revalidate: false,
  }
);

// Upload images to a specific category
export const uploadInteriorImagesToCategory = async (images: File[], categoryId: string) => {
  try {
    if (!images || images.length === 0) {
      return { error: "No images provided" };
    }

    // Check current image count for the category
    const currentCount = await db.interiorProjectImage.count({
      where: { categoryId }
    });

    if (currentCount + images.length > 6) {
      return { error: `Only 6 images allowed per category. Current: ${currentCount}, trying to add: ${images.length}` };
    }

    // Upload images to Cloudinary
    const imageUrls = await uploadToCloudinary(images);

    // Check for duplicates before creating database records
    const existingUrls = await db.interiorProjectImage.findMany({
      where: { categoryId },
      select: { imageUrl: true }
    });

    const existingUrlSet = new Set(existingUrls.map(img => img.imageUrl));
    const newImageUrls = imageUrls.filter(url => !existingUrlSet.has(url));

    if (newImageUrls.length === 0) {
      return { error: "All images already exist in this category" };
    }

    if (newImageUrls.length < imageUrls.length) {
      const duplicateCount = imageUrls.length - newImageUrls.length;
      console.warn(`${duplicateCount} duplicate image(s) were skipped`);
    }

    // Create database records for each new image
    const uploadPromises = newImageUrls.map(async (imageUrl) => {
      return db.interiorProjectImage.create({
        data: {
          imageUrl,
          categoryId
        }
      });
    });

    await Promise.all(uploadPromises);
    
    revalidatePath('/interior');
    revalidatePath('/admin/misc');
    revalidateTag('interior-images');
    return { success: `${newImageUrls.length} image(s) uploaded successfully` };
  } catch (error) {
    console.error("Error uploading interior images:", error);
    return { error: "Failed to upload images" };
  }
};

// Delete a category and all its images
export const deleteInteriorCategory = async (categoryId: string) => {
  try {
    // Get all images in the category to delete from Cloudinary
    const images = await db.interiorProjectImage.findMany({
      where: { categoryId }
    });

    // Delete images from Cloudinary
    for (const image of images) {
      try {
        const { pathname } = new URL(image.imageUrl);
        const versionMatch = pathname.match(/\/v\d+\/(.+)$/);
        if (versionMatch) {
          const fullPath = versionMatch[1];
          const publicId = fullPath.replace(/\.[^.]+$/, "");
          
          await cloudinary.uploader.destroy(publicId, {
            invalidate: true,
            resource_type: 'image',
          });
        }
      } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
      }
    }

    // Delete the category (this will cascade delete all images due to onDelete: Cascade)
    await db.interiorCategory.delete({
      where: { id: categoryId }
    });
    
    revalidatePath('/interior');
    revalidatePath('/admin/misc');
    revalidateTag('interior-categories');
    revalidateTag('interior-images');
    return { success: "Category and all images deleted successfully" };
  } catch (error) {
    console.error("Error deleting interior category:", error);
    return { error: "Failed to delete category" };
  }
};

