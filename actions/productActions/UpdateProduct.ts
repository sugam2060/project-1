"use server"

import { db } from "@/lib/db"
import { productUpdateSchema } from "@/schemas/ProductUploadSchema"
import { z } from "zod"
import { v2 as cloudinary } from "cloudinary"
import { v4 as uuid4 } from "uuid"
import { revalidateTag } from "next/cache"

type UpdatedProduct = z.infer<typeof productUpdateSchema>

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
})

/** Upload a single File to Cloudinary and return its secure URL. */
const uploadToCloudinary = async (file: File): Promise<string> => {
  const buffer = Buffer.from(await file.arrayBuffer())

  return await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { folder: "products", public_id: `${file.name}-${uuid4()}` },
        (error, result) =>
          error || !result ? reject(error || "Upload failed") : resolve(result.secure_url)
      )
      .end(buffer)
  })
}

/** Extract the Cloudinary public ID (`folder/filename`) from a secure URL. */
const publicIdFromUrl = (url: string) => {
  const match = new URL(url).pathname.match(/\/v\d+\/(.+)\.[\w]+$/)
  return match ? match[1] : null
}

export const updateProduct = async (payload: UpdatedProduct) => {
  try {
    // 1. Validate input
    const parsed = productUpdateSchema.safeParse(payload)
    if (!parsed.success) return { error: "Invalid fields" }
    const data = parsed.data

    // 2. Fetch existing product
    const existing = await db.product.findUnique({
      where: { id: data.id },
      include: { images: true },
    })
    if (!existing) return { error: "Product not found" }

    // 3. Diff image lists
    const existingIds = new Set(existing.images.map((i) => i.id))
    const incomingIds = new Set(data.imageUrls.map((i) => i.id))

    const deleteIds = [...existingIds].filter((id) => !incomingIds.has(id))
    const newFiles = data.image ?? []

    // 4. Upload new images
    const uploadedUrls: string[] = []
    for (const file of newFiles) {
      try {
        const url = await uploadToCloudinary(file)
        uploadedUrls.push(url)
      } catch (err) {
        console.error("Cloudinary upload error:", err)
        return { error: "Image upload failed" }
      }
    }


    // 5. Perform database transaction
    try {
      await db.$transaction(async (tx) => {
        // 5a. Delete removed images
        if (deleteIds.length) {
          await tx.productImage.deleteMany({ where: { id: { in: deleteIds } } })

          for (const img of existing.images.filter((i) => deleteIds.includes(i.id))) {
            const pid = publicIdFromUrl(img.imageUrl)
            if (pid) {
              cloudinary.uploader.destroy(pid).catch((err) => {
                console.error("Cloudinary deletion failed:", err)
              })
            }
          }
        }

        // 5b. Add newly uploaded images
        if (uploadedUrls.length) {
          await tx.productImage.createMany({
            data: uploadedUrls.map((url,idx) => ({
              productId: data.id,
              imageUrl: url,
              position:idx
            })),
          })
        }

        // 5c. Update product fields
        await tx.product.update({
          where: { id: data.id },
          data: {
            name: data.name,
            description: data.description,
            price: Number(data.price),
            category: data.category,
            stock: Number(data.stock),
            brand: data.brand,
            discount: Number(data.discount),
            slug: data.slug,
          },
        })
      })
    } catch (err) {
      console.error("Database transaction failed:", err)
      return { error: "Failed to update product" }
    }

    // 6. Revalidate pages
    try {
      revalidateTag("products")
      revalidateTag("price-range")
      revalidateTag("fetchCategories")
    } catch (err) {
      console.warn("Revalidation failed:", err)
    }

    return { success: "Product updated successfully" }

  } catch (err) {
    console.error("Unhandled server error:", err)
    return { error: "Something went wrong while updating the product." }
  }
}
