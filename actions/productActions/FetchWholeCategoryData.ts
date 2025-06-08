import { db } from "@/lib/db";

export const fetchAllCategoryData = async () => {
    try {
        const categories = await db.product.findMany({
            distinct:['category'],
            select:{
                images:{
                    select:{
                        id:true,
                        imageUrl:true
                    }
                },
                category:true,
            }
        })
        return categories
    } catch (error) {
        console.log('error fetching categoryAllData',error)
        return []
    }
}