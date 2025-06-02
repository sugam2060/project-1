import Container from '@/components/main/Container'
import ProductGrid from '@/components/main/ProductGrid'
import ProductLoadingSkeleton from '@/components/main/ProductLoadingSkeleton'
import ProductUpload from '@/components/main/ProductUpload'
import React, { Suspense } from 'react'

const AdminProductsPage = async () => {
  return (
    <Container className="">
      <div className="min-h-screen grid grid-rows-[auto_auto] md:grid-cols-[1fr_2fr] lg:grid-cols-[1fr_3fr] gap-4">
        {/* Upload Section */}
          <div className="bg-gray-100 pt-6 px-4 max-h-screen overflow-y-auto custom-scroll">
            <h2 className='text-center font-semibold text-lg md:text-xl lg:text-2xl mb-6'>Upload Product</h2>
            <ProductUpload />
          </div>
        {/* Product Grid Section */}
        <div className="pt-6 px-4 bg-gray-100">
          <h2 className='text-center font-semibold text-lg md:text-xl lg:text-2xl mb-6'>Products</h2>
          <Suspense
            fallback={
              <ProductLoadingSkeleton
                length={9}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 min-h-[600px]" // Reserve vertical space
              />
            }
          >
            <ProductGrid number={9} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 justify-center gap-3" />
          </Suspense>
        </div>
      </div>
    </Container>
  )
}

export default AdminProductsPage
