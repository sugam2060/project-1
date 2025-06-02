import { fetchCategories } from '@/actions/productActions/LoadCategories'
import Container from '@/components/main/Container'
import ProductGrid from '@/components/main/ProductGrid'
import ProductLoadingSkeleton from '@/components/main/ProductLoadingSkeleton'
import React, { Suspense } from 'react'

const MainProductPage = async () => {
  const categories = await fetchCategories()
  return (
    <Container className=''>
      <div className="pt-6 pb-1 px-4 bg-gray-100">
        <h2 className='text-center font-semibold text-lg md:text-xl lg:text-2xl mb-6'>Products</h2>
        <Suspense
          fallback={
            <ProductLoadingSkeleton
              length={8}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 min-h-[600px]" // Reserve vertical space
            />
          }
        >
          <ProductGrid number={8} categories={categories as Array<{ category: string }>} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center gap-3" />
        </Suspense>
      </div>
    </Container>
  )
}

export default MainProductPage