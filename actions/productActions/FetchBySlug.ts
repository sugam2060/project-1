import { db } from "@/lib/db";

export const fetchSingleProduct = async (slug: string) => {
    try {
        const product = await db.product.findUnique({
            where:{
                slug:slug
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
        return product;
    } catch (error) {
        console.log("Error fetching product:", error);
        return null;
    }
}