import Container from '@/components/main/Container'
import ProductGrid from '@/components/main/ProductGrid'
import ProductLoadingSkeleton from '@/components/main/ProductLoadingSkeleton'
import React, { Suspense } from 'react'

const MainProductPage = async () => {
  return (
    <Container className=''>
      <div className="pt-6 pb-1 px-4 bg-gray-50">
        <div className='space-y-0 flex flex-col items-center justify-center mb-6'>
          <h2 className='text-center font-bold text-xg md:text-2xl lg:text-3xl'>Crafted Comfort, Styled for Every Space</h2>
          <p className='text-center w-[80%] md:w-full capitalize font-semibold text-sm md:text-base lg:text-lg'>From cozy corners to open layouts—furnish with purpose.</p>
        </div>
        <Suspense
          fallback={
            <ProductLoadingSkeleton
              length={8}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 min-h-[600px]" // Reserve vertical space
            />
          }
        >
          <ProductGrid number={8} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center gap-3" />
        </Suspense>
      </div>
    </Container>
  )
}

export default MainProductPage