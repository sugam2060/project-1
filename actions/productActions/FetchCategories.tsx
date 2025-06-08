'use server'
import { db } from "@/lib/db";
import { unstable_cache } from "next/cache";

export const fetchCategories = unstable_cache(async () => {
    try {
        const categories = await db.product.findMany({
            distinct: ['category'],
            select: {
                category: true,
            }
        })
        return categories
    } catch (error) {
        console.log('error fetching categories', error)
    }
},
    ['fetchCategories'],
    {
        tags: ['fetchCategories'],
        revalidate: 60 * 60 // 1 hour
    }
)

export const fetchRawCategories = unstable_cache(async () => {
    try {
        const categories = await db.categories.findMany()
        return categories
    } catch (error) {

    }
},
    ['fetchRawCategories'],
    {
        tags: ['categories'],
        revalidate: 60 * 60 // 1 hour
    }
)