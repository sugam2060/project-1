'use server'

import { v2 as cloudinary, UploadApiResponse, } from 'cloudinary';
import { v4 as uuid4 } from 'uuid'
import { db } from '@/lib/db';
// import { unstable_cache } from 'next/cache';
import { revalidateTag } from 'next/cache';

interface props {
  images: File[]
}

interface searchResponse {
  total_count: number
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!
})

export const uploadAndConvertHomeCaroselImages = async ({ images }: props) => {
  if (images.length === 0) {
    return { error: 'No image uploaded' }
  }

  const existingImages = await db.carosel.findFirst()
  const existingImageCount = existingImages?.images.length

  if (existingImageCount! >= 5) return { error: 'Only 5 images can be uploaded' }
  if ((existingImageCount! + images.length) > 5) return { error: 'Only 5 images can be uploaded' }
  console.log(existingImageCount)

  const ImageUrls = []
  for (const image of images) {
    const arrayBuffer = await image.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    try {
      const result = await new Promise<UploadApiResponse>((resolve, reject) => {
        cloudinary.uploader.upload_stream({
          folder: 'carosel',
          public_id: `${image.name}-${uuid4()}`,
        },
          (error, result) => {
            if (error) return reject('failed to upload')
            resolve(result as UploadApiResponse)
          }
        ).end(buffer)
      })

      ImageUrls.push(result.secure_url)
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      return { error: "Image upload failed" };
    }
  }

  try {
    const carosel = await db.carosel.findFirst();
    if (!carosel) {
      await db.carosel.create({
        data: {
          images: ImageUrls,
        },
      });
    } else {
      const data: string[] = [...carosel.images, ...ImageUrls];  // <-- Fix here
      await db.carosel.update({
        where: {
          id: carosel.id,
        },
        data: {
          images: data,
        },
      });
    }
    revalidateTag('carosel-cache')
    return { success: 'Image uploaded successfully' }
  } catch (error) {
    console.log('error uploading carosel', error)
    return { error: 'something went wrong' }
  }
}



export const getCaroselImages = async () => {
  try {
    const imageUrls = await db.carosel.findFirst({
      select: {
        images: true
      }
    })
    console.log(imageUrls)
    return imageUrls?.images
  } catch {
    // ignore the error
  }
}

