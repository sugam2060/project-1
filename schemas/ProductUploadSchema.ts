import { z } from "zod"

export const ProductFieldsSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Product description is required"),
  price: z.string().min(1).refine(val => !isNaN(parseFloat(val)), "Price must be a number"),
  category: z.string().min(1, "Category is required"),
  discount: z.string().min(0).refine(val => !isNaN(parseFloat(val)), "discount must be a number"),
  image: z.array(z.instanceof(File)).optional(),
  slug: z.string().min(1, "Slug is required"),
  stock: z.string().min(1).refine(val => !isNaN(parseInt(val)), "Stock must be a number"),
  brand: z.string().optional(),
});

export const ProductFieldFetchsSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Product description is required"),
  price: z.string().min(1).refine(val => !isNaN(parseFloat(val)), "Price must be a number"),
  discount: z.string().min(1).refine(val => !isNaN(parseFloat(val)), "discount must be a number"),
  category: z.string().min(1, "Category is required"),
  images: z.array(z.object({
    id:z.string(),
    imageUrl: z.string(),
  })),
  slug: z.string().min(1, "Slug is required"),
  stock: z.string().min(1).refine(val => !isNaN(parseInt(val)), "Stock must be a number"),
  brand: z.string().optional(),
});

