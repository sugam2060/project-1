'use server'
import { db } from "@/lib/db";

export const fetchProducts = async ({number,page}:{number:number,page:number}) => {
    const skip = (page - 1) * number;
    try {
        const totalCountPromise = db.product.count() 
        const productsPromise = db.product.findMany({
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
        const [products,totalCount] =await Promise.all([productsPromise,totalCountPromise])
        return {products,totalPage:Math.ceil(totalCount/number)}
    } catch (error) {
        console.error("Error fetching products:", error);
        throw new Error("Failed to fetch products");
    }
}
