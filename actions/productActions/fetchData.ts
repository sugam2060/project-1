import { db } from "@/lib/db";
import { ProductFieldsSchema } from "@/schemas/ProductUploadSchema";


export const fetchProducts = async ({number,page}:{number:number,page:number}) => {
    const skip = (page - 1) * number;
    try {
        const products = await db.product.findMany({
            skip:skip,
            take:number,
            orderBy:{
                name:'asc'
            },
            include:{
                images:{
                    select:{
                        id:true,
                        imageUrl:true
                    }
                }
            }
        })
        return products
    } catch (error) {
        console.error("Error fetching products:", error);
        throw new Error("Failed to fetch products");
    }
}