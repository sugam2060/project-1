'use server'
import sharp from 'sharp'
import { writeFile, readdir } from 'fs/promises'
import path from 'path'
import { randomUUID } from 'crypto'

interface props {
  images: File[]
}

export const uploadAndConvertHomeCaroselImages = async ({ images }: props) => {
  if (images.length === 0) {
    return {}
  }

  const uploadDir = path.join(process.cwd(), 'public', 'carosel')
  const existingFiles = await readdir(uploadDir)

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
    console.error(error)
    return { error: 'Something went wrong during upload' }
  }
}
