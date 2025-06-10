import { z } from "zod"


export const ProductFieldsSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Product description is required"),
  price: z.string().min(1).refine(val => !isNaN(parseFloat(val)), "Price must be a number"),
  category: z.string().min(1, "Category is required"),
  discount: z.string().min(0).refine(val => !isNaN(parseFloat(val)), "discount must be a number"),
  image: z.array(z.any()).min(1,{message:'At least 1 image is required'}).max(5,{message: 'Only 5 images are allowded'}),
  slug: z.string().min(1, "Slug is required"),
  stock: z.string().min(1).refine(val => !isNaN(parseInt(val)), "Stock must be a number"),
  brand: z.string().optional(),
});

export const ProductFieldFetchsSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Product description is required"),
  price: z.number(),
  discount: z.number(),
  category: z.string().min(1, "Category is required"),
  images: z.array(z.object({
    id:z.string(),
    imageUrl: z.string(),
  })),
  slug: z.string().min(1, "Slug is required"),
  stock: z.number(),
  brand: z.string().optional(),
});

export const productUpdateSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Product description is required"),
  price: z.string().min(1).refine(val => !isNaN(parseFloat(val)), "Price must be a number"),
  category: z.string().min(1, "Category is required"),
  discount: z.string().min(0).refine(val => !isNaN(parseFloat(val)), "discount must be a number"),
  image: z.array(z.any()).optional(),
  imageUrls:z.array(z.string()),
  slug: z.string().min(1, "Slug is required"),
  stock: z.string().min(1).refine(val => !isNaN(parseInt(val)), "Stock must be a number"),
  brand: z.string().optional(),
})


