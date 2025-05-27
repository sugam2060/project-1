import { z } from "zod"

export const ProductFieldsSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Product description is required"),
  price: z.string().min(1).refine(val => !isNaN(parseFloat(val)), "Price must be a number"),
  category: z.string().min(1, "Category is required"),
  image: z.array(z.instanceof(File)).optional(),
  slug: z.string().min(1, "Slug is required"),
  stock: z.string().min(1).refine(val => !isNaN(parseInt(val)), "Stock must be a number"),
  brand: z.string().optional(),
});
