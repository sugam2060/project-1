'use server'
import { db } from "@/lib/db"
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { ProductFieldsSchema } from "@/schemas/ProductUploadSchema"
import { z } from "zod"
import { v5 as uuidv5 } from 'uuid'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!
})


export const uploadProducts = async (products: z.infer<typeof ProductFieldsSchema>) => {
    const validated = ProductFieldsSchema.safeParse(products)
    if (!validated.success) return { error: 'Invalid product data' }
    console.log(validated.data)
    const slugExists = await db.product.findUnique({
        where:{
            slug:validated.data.slug
        }
    })

    if( slugExists ) return { error: 'Slug already exists try different description and product name' }

    let imageUrls: string[] = []

    if (products.image && products.image.length > 0) {
        for (const file of products.image) {
            const arrayBuffer = await file.arrayBuffer()
            const buffer = Buffer.from(arrayBuffer)

            try {
                const result = await new Promise<UploadApiResponse>((resolve, reject) => {
                    cloudinary.uploader.upload_stream({
                        folder: 'products',
                        public_id: `${uuidv5(file.name, uuidv5.URL)}`,
                    },
                        (error, result) => {
                            if (error) return reject('failer to upload')
                            resolve(result as UploadApiResponse)
                        }
                    ).end(buffer)
                })
                imageUrls.push(result.secure_url)
            } catch (error) {
                console.error("Cloudinary upload error:", error);
                return { error: "Image upload failed" };
            }
        }
    }

    try {
        await db.product.create({
            data:{
                name:validated.data.name,
                description: validated.data.description,
                price: parseFloat(validated.data.price),
                category: validated.data.category,
                images: {
                    createMany:{
                        data: imageUrls.map(url => ({ imageUrl: url }))
                    }
                },
                slug: validated.data.slug,
                stock: parseInt(validated.data.stock),
                brand: validated.data.brand
            }
        })
        return { success: 'Product uploaded successfully' }
    } catch (error) {
        console.error("Database error:", error);
        return { error: "Failed to save products to the database" };
        
    }

    return { success: 'uploaded products successfully' }
}