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
import AddToCartButton from '../RootOnly/AddToCartButton'

interface productsCardProps {
  product: z.infer<typeof ProductFieldFetchsSchema>
}

const ProductsCard = ({ product }: productsCardProps) => {
  const pathname = usePathname();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="overflow-hidden group min-h-[250px] text-sm border border-zinc-200 rounded-lg bg-white shadow-sm"
    >
      <div className="bg-gradient-to-r from-zinc-200 via-zinc-300 to-zinc-200 overflow-hidden relative">
        {product.images && (
          <Link
            href={
              pathname.startsWith("/admin")
                ? `/admin/product/${product.slug}`
                : `/product/${product.slug}`
            }
            className="block w-full h-full"
          >
            <Image
              priority
              src={
                new URL(product.images[0].imageUrl).href
              }
              width={500}
              height={500}
              alt="product"
              className={`w-full aspect-square object-cover transition-transform duration-300 ${product.stock !== 0 && "group-hover:scale-105"
                }`}
            />
          </Link>
        )}

        {product.stock === 0 && (
          <div className="absolute top-0 left-0 w-full h-full bg-[#151515]/40 flex items-center justify-center">
            <p className="text-sm sm:text-base text-white font-semibold text-center">
              Out of stock
            </p>
          </div>
        )}
      </div>

      <div className="py-3 px-3 flex flex-col gap-1.5 bg-zinc-50">
        <h2 className="font-semibold text-sm sm:text-base line-clamp-1">{product.name}</h2>
        <p className="text-xs sm:text-sm line-clamp-1">{product.description}</p>
        <PriceView
          price={product.price}
          discount={product.discount}
          className="text-sm sm:text-lg"
        />
        {pathname.startsWith("/admin") ? (
          <DeleteProductsButton product={product} />
        ) : (
          <AddToCartButton product={product}/>
        )}
      </div>
    </motion.div>
  );
};

export default ProductsCard