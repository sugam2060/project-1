'use server'
import { db } from "@/lib/db";

export const fetchCategories = async () => {
    try {
        const categories = await db.product.findMany({
            distinct: ['category'],
            select: {
                category: true,
                slug:true
            }
        })
        return categories
    } catch (error) {
        console.log('error fetching categories', error)
    }
}