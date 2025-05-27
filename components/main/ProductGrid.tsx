import React, { Suspense } from 'react'
import { cn } from '@/lib/utils'
import ProductLoadingSkeleton from './ProductLoadingSkeleton'
import ProductsCard from './ProductsCard'
import { fetchProducts } from '@/actions/productActions/fetchData'

const ProductGrid = async ({className}: {className?: string}) => {
  const products = await fetchProducts({number:6,page:1})

  const formattedProducts = products.map(product => ({
    ...product,
    price:product.price.toString(),
    stock: product.stock.toString(),
    discount: product.discount != null ? product.discount.toString() : '0',
  }))

  return (
    <div className={cn("mx-2", className)}>
        <Suspense fallback={<ProductLoadingSkeleton length={6}/>}>
            {formattedProducts.map((product) => (
                <ProductsCard key={product.id} products={product}/>
            ))}
        </Suspense>
    </div>
  )
}

export default ProductGrid