'use server'
import { readdir } from 'fs/promises'
import path from 'path'

export const getCaroselImages = async () => {
  const dir = path.join(process.cwd(), 'public', 'carosel')
  const files = await readdir(dir)

  // Add cache buster
  const version = Date.now()
  return files.map(file => `/carosel/${file}?v=${version}`)
}
