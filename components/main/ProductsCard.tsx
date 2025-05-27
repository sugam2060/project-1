'use client'
import { ProductFieldFetchsSchema } from '@/schemas/ProductUploadSchema'
import Link from 'next/link'
import React from 'react'
import { z } from 'zod'
import Image from 'next/image'
import PriceView from './PriceView'
import { usePathname } from 'next/navigation'
import DeleteProductsButton from './DeleteProductsButton'
import { motion } from 'motion/react'

interface productsCardProps {
    products: z.infer<typeof ProductFieldFetchsSchema>
}

const ProductsCard = ({ products }: productsCardProps) => {
    const pathname = usePathname()
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className='overflow-hidden group text-sm border border-zinc-200 rounded-lg'
        >
            <div className='bg-gradient-to-r from-zinc-200 via-zinc-300 to-zinc-200 overflow-hidden relative'>
                {products.images && <Link href={pathname.startsWith('/admin') ? `/admin/product/${products.slug}` : `/product/${products.slug}`} className='w-full h-full flex items-center justify-center'>
                    <Image src={new URL(products.images[0].imageUrl).href} width={500} height={500} alt='product' className={`w-full h-72 object-cover overflow-hidden  hoverEffect ${parseInt(products.stock) !== 0 && 'group-hover:scale-105'}`} />
                </Link>}
                {parseInt(products?.stock) === 0 && (
                    <div className='absolute top-0 left-0 w-full h-full bg-[#151515]/40 flex items-center justify-center'>
                        <p className='text-base text-white font-semibold text-center'>Out of stock</p>
                    </div>
                )}
                <div className='py-3 px-2 flex flex-col gap-1.5 bg-zinc-50 border border-t-0 rounded-lg rounded-tr-none rounded-tl-none'>
                    <h2 className='font-semibold line-clamp-1'>{products.name}</h2>
                    <p className='text-sm line-clamp-1'>{products.description}</p>
                    <PriceView price={parseInt(products.price)} discount={parseInt(products.discount)} className='text-lg' />
                    {pathname.startsWith('/admin') ? <DeleteProductsButton /> : <div>Add to cart</div>}
                </div>
            </div>
        </motion.div>
    )
}

export default ProductsCard