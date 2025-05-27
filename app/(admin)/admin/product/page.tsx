
import Container from '@/components/main/Container'
import ProductGrid from '@/components/main/ProductGrid'
import ProductLoadingSkeleton from '@/components/main/ProductLoadingSkeleton'
import ProductUpload from '@/components/main/ProductUpload'
import React, { Suspense } from 'react'

const AdminProductsPage = () => {
  return (
    <Container className="flex-grow">
      <div className="min-h-screen grid grid-rows-[3fr_5fr] md:grid-rows-none md:grid-cols-[2fr_4fr] lg:grid-cols-[2fr_6fr] gap-1">
        <div className="bg-gray-100 pt-10 max-h-screen overflow-y-auto custom-scroll">
          <h2 className='text-center font-semibold capitalize text-xl md:text-2xl mb-10'>Upload Product</h2>
          <ProductUpload />
        </div>
        <div className="pt-10">
          <h2 className='text-center font-semibold capitalize text-xl md:text-2xl mb-10'>Products</h2>
          <Suspense fallback={<ProductLoadingSkeleton length={6} className='grid grid-cols-2 md:grid-cols-3 gap-4 mx-2' />}>
            <ProductGrid number={6} className='grid grid-cols-2 md:grid-cols-3 gap-4' />
          </Suspense>
        </div>
      </div>
    </Container>

  )
}

export default AdminProductsPage