'use server'

import { db } from "@/lib/db"
import { revalidateTag } from "next/cache"


export const deleteProduct = async (id:string) => {
    try {
        await db.product.delete({
            where:{
                id
            },
            include:{
                images: true
            }
        })
        revalidateTag('products')
        revalidateTag('price-range')
    } catch (error) {
        console.log(error)
    }
}