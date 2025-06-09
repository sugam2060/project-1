'use server'
import sharp from 'sharp'
import { writeFile, readdir, mkdir } from 'fs/promises'
import path from 'path'
import { randomUUID } from 'crypto'
import {put} from '@vercel/blob'


interface props {
  images: File[]
}

export const uploadAndConvertHomeCaroselImages = async ({ images }: props) => {
  if (images.length === 0) {
    return {}
  }

  const uploadDir = path.join(process.cwd(), 'public', 'carosel')

  // Ensure the directory exists or create it
  try {
    await mkdir(uploadDir, { recursive: true })
  } catch (mkdirErr) {
    console.error('Failed to create directory:', mkdirErr)
    return { error: 'Unable to create upload directory' }
  }

  let existingFiles: string[] = []
  try {
    existingFiles = await readdir(uploadDir)
  } catch (readErr) {
    console.error('Failed to read directory:', readErr)
    return { error: 'Unable to read upload directory' }
  }

  if (existingFiles.length >= 5) return { error: 'Only 5 images can be saved' }
  if (existingFiles.length + images.length > 5) return { error: 'Only 5 images can be saved' }

  try {
    await Promise.all(
      images.map(async (image) => {
        const buffer = Buffer.from(await image.arrayBuffer())
        const pngBuffer = await sharp(buffer).png({ quality: 90 }).toBuffer()
        const filename = `${randomUUID()}.png`
        const filepath = path.join(uploadDir, filename)

        await writeFile(filepath, pngBuffer, { flag: 'wx' }) // prevent overwrite
      })
    )
    return { success: 'Images uploaded' }
  } catch (error) {
    console.error('Upload failed:', error)
    return { error: 'Something went wrong during upload' }
  }
}


export const OnlyForVercel = async ({ images }: props) => {
  if (images.length === 0) return {};

  if (images.length > 5) return { error: 'Only 5 images can be saved' };

  try {
    const uploadedUrls: string[] = [];

    for (const image of images) {
      const buffer = Buffer.from(await image.arrayBuffer());
      const pngBuffer = await sharp(buffer).png({ quality: 90 }).toBuffer();
      const filename = `${randomUUID()}.png`;

      const { url } = await put(`carousel/${filename}`, pngBuffer, {
        contentType: 'image/png',
        access:'public'
      });

      uploadedUrls.push(url);
    }

    return { success: 'Images uploaded', urls: uploadedUrls };
  } catch (err) {
    console.error('Upload failed:', err);
    return { error: 'Something went wrong during upload' };
  }
};