"use server";

import { db } from "@/lib/db";
import { InteriorSchema } from "@/schemas/InteriorSchema";
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
            folder: "carousel",
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

export async function uploadRecentInteriorImage(files: File[]) {
  const validation = InteriorSchema.safeParse({ images: files });

  if (!validation.success) {
    return { error: "Invalid file input" };
  }

  const { images } = validation.data;
  // Count total images in DB (sum of all imageUrl arrays)
  const allEntries = await db.recentInteriorProjectImage.findMany();
  const currentCount = allEntries.reduce(
    (acc, entry) => acc + (entry.imageUrl?.length || 0),
    0
  );
  if (currentCount + images.length > 6) {
    return {
      error: "Only max 6 images allowed. Please remove one to add more.",
    };
  }

  try {
    const imageUrls = await uploadToCloudinary(images);

    const InteriorImage = await db.recentInteriorProjectImage.findFirst();
    if (!InteriorImage) {
      await db.recentInteriorProjectImage.create({
        data: {
          imageUrl:imageUrls
        },
      });
    } else {
      const data: string[] = [...InteriorImage.imageUrl, ...imageUrls];  // <-- Fix here
      await db.recentInteriorProjectImage.update({
        where: {
          id: InteriorImage.id,
        },
        data: {
          imageUrl: data,
        },
      });
    }
    revalidateTag("recent-interior-images");
    return { success: "Uploaded successfully" };
  } catch (error) {
    console.error("Upload error:", error);
    return { error: "Failed to upload images. Please try again." };
  }
}

export const getRecentInteriorImages = unstable_cache(
  async () => {
    const entries = await db.recentInteriorProjectImage.findMany();

    // Flatten and return all image URLs
    return entries.flatMap((entry) => entry.imageUrl);
  },
  ["recent-interior-images"],
  {
    tags: ["recent-interior-images"],
    revalidate: false,
  }
);

export const deleteImages = async ({
  imageUrl,
}: {
  imageUrl: string;
}) => {
  console.log(imageUrl)
  let publicId: string;
  try {
    const { pathname } = new URL(imageUrl);
    const versionMatch = pathname.match(/\/v\d+\/(.+)$/);
    if (!versionMatch) {
      throw new Error("No version found in Cloudinary URL");
    }
    const fullPath = versionMatch[1]; // "carosel/pexels-pixabay-276583.jpg-bf45f3d1-b696-4378-bf0f-2a59c3a97a37.jpg"
    publicId = fullPath.replace(/\.[^.]+$/, "");
  } catch (err) {
    throw new Error(`deleteInteriorImages: invalid imageUrl → ${err}`);
  }

  try {
    const cloudRes = await cloudinary.uploader.destroy(publicId, {
      invalidate: true,
      resource_type: 'image',
    });
  
    if(cloudRes.result !== 'ok') return
  
    if (cloudRes.result !== 'ok' && cloudRes.result !== 'not found') {
      throw new Error(`Cloudinary deletion failed: ${JSON.stringify(cloudRes)}`);
    }
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw error;
  }
  

  try {
    await db.$transaction(async (tx) => {
      const images = await tx.recentInteriorProjectImage.findFirstOrThrow();

      const updatedImages = images.imageUrl.filter((url) => url !== imageUrl);

      await tx.recentInteriorProjectImage.update({
        where: { id: images.id },
        data: { imageUrl: updatedImages },
      });
    });
    revalidatePath('/interior');
    revalidateTag('recent-interior-images')
  } catch (error) {
    //ignore the error
  }

};
