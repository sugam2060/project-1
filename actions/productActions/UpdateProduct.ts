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
  /* 1. Validate */
  const parsed = productUpdateSchema.safeParse(payload)
  if (!parsed.success) return { error: "Invalid fields" }
  const data = parsed.data

  /* 2. Fetch current product with images */
  const existing = await db.product.findUnique({
    where: { id: data.id },
    include: { images: true },
  })
  if (!existing) return { error: "Product not found" }

  /* 3. Diff images */
  const existingIds = new Set(existing.images.map((i) => i.id))
  const incomingIds = new Set(data.imageUrls.map((i) => i.id))

  const deleteIds = [...existingIds].filter((id) => !incomingIds.has(id))
  const newFiles = data.image ?? []

  /* 4. Upload newly-added files */
  const uploadedUrls: string[] = []
  for (const file of newFiles) {
    try {
      uploadedUrls.push(await uploadToCloudinary(file))
    } catch (err) {
      console.error("Cloudinary upload error:", err)
      return { error: "Image upload failed" }
    }
  }

  /* 5. Transaction: delete + create + update */
  await db.$transaction(async (tx) => {
    /* 5a. Remove deleted image rows (and optionally Cloudinary files) */
    if (deleteIds.length) {
      await tx.productImage.deleteMany({ where: { id: { in: deleteIds } } })
      existing.images
        .filter((i) => deleteIds.includes(i.id))
        .forEach((img) => {
          const pid = publicIdFromUrl(img.imageUrl)
          if (pid) cloudinary.uploader.destroy(pid).catch(console.error)
        })
    }

    /* 5b. Add new image rows */
    if (uploadedUrls.length) {
      await tx.productImage.createMany({
        data: uploadedUrls.map((url) => ({ productId: data.id, imageUrl: url })),
      })
    }

    /* 5c. Update scalar product fields */
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

  /* 6. Revalidate cached pages */
  revalidateTag("products")
  revalidateTag("price-range")
  revalidateTag("fetchCategories")

  return { success: "Product updated successfully" }
}
