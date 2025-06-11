'use server'
import { db } from "@/lib/db";
import { revalidatePath, revalidateTag } from "next/cache";

export const uploadCategory = async (category:string) => {
    try {
        const newCategory = await db.categories.create({
            data:{
                title:category,
            }
        })
        if(newCategory) {
            revalidateTag('categories')
            revalidatePath('/admin/product')
            return {success:'Category uploaded successfully!'}
        }
    } catch (error) {
        console.log('error uploading category',error)
        return {error:'Error uploading category'}
    }
}