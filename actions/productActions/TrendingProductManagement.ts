// app/actions/productActions/AddToTrending.ts
'use server'

import { db } from '@/lib/db'

export const fetchTrending = async (productId:string) => {
  try {
    const result = await db.trendingProduct.findUniqueOrThrow({
    where:{
      productId:productId
    }
  })
  if(!result) return false
  return true
  } catch (error) {
    console.log(error)
    return false
  }
}

export const addToTrending = async (productId: string) => {
  console.log(productId)
  try {
    // check if already trending
    const exists = await db.trendingProduct.findUnique({
      where: { productId },
    })

    if (exists) {
      return { error: 'Product already in trending list' }
    }

    await db.trendingProduct.create({
      data: {
        productId,
      },
    })

    return { success: 'Product added to trending successfully' }
  } catch (error) {
    console.error('Trending add error:', error)
    return { error: 'Something went wrong' }
  }
}


// file: actions/productActions/fetchTrendingProduct.ts

export const removeFromTrending = async (productId: string) => {
  try {
    // console.log(productId)
    await db.trendingProduct.delete({
      where: { productId },
    })

    return { success: 'Product removed from trending' }
  } catch (error) {
    console.error('Remove trending error:', error)
    return { error: 'Failed to remove from trending' }
  }
}


