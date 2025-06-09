'use server'

import { unlink, access } from 'fs/promises'
import path from 'path'

/**
 * Deletes a file from /public/carousel if it exists.
 * @param filename - The exact file name (e.g., "uuid.png")
 */
export const deleteHomeCarouselImage = async (filename: string) => {
  
 const legacyFilePath = filename.split('?')[0]
  const filePath = path.join(process.cwd(), 'public', legacyFilePath)

  try {
    await access(filePath) // Check if file exists
    await unlink(filePath) // Delete file
  } catch {
    // Silently ignore if file does not exist or other errors
  }
}
