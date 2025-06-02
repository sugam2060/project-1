'use server'
import {db} from '@/lib/db'
import { redirect } from 'next/navigation'

interface props {
    number:number,
    page:number,
    category:string
}


export const fetchByCategory = async ({number,page,category}:props) => {
    const skip = (page-1) * number
    try {
        const totalCountPromise = db.product.count({
            where:{
                category:category
            }
        })
        
        const ProductsPromise = db.product.findMany({
            skip,
            take:number,
            where:{
                category:category
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
        const [products,totalCount] = await Promise.all([ProductsPromise,totalCountPromise])
        return {products,totalPage:totalCount/number}
    } catch (error) {
        console.log('Error fetching by slug')
        redirect('/admin/product')
    }
}