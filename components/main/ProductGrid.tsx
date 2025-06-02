import { cn } from '@/lib/utils'
import ProductsCard from './ProductsCard'
import { fetchProducts } from '@/actions/productActions/fetchData'
import LoadMore from './LoadMore'
import { Suspense } from 'react'
import ProductLoadingSkeleton from './ProductLoadingSkeleton'

const ProductGrid = async ({ className, number }: { className?: string, number?: number }) => {
  const {products,totalPage} = await fetchProducts({ number: number as number, page: 1 })

  const safeProducts = products.map((product) => ({
    ...product,
    discount: product.discount ? product.discount : 0
  }))


  return (
    <div className='mb-3'>
      <div className={cn("mx-2 mb-3", className)}>
        {safeProducts.map((product) => (
          <ProductsCard key={product.id} product={product} />
        ))}
      </div>
      <div>
        <Suspense fallback={<ProductLoadingSkeleton length={number as number} className={className}/>}>
        <LoadMore totalPage={totalPage} number={number as number} className={className}/>
      </Suspense>
      </div>
    </div>
  )
}

export default ProductGrid
