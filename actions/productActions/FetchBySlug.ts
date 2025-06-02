'use server'
import {db} from '@/lib/db'
import { redirect } from 'next/navigation'


export const fetchBySlug = async (slug:string) => {
    try {
        const Product = await db.product.findUnique({
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

        if(!Product) {
            redirect('/admin/product')
        }

        return Product
    } catch (error) {
        console.log('Error fetching by slug')
        redirect('/admin/product')
    }
}