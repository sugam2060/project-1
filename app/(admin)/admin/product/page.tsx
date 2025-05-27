
import  Container from '@/components/main/Container'
import ProductGrid from '@/components/main/ProductGrid'
import ProductUpload from '@/components/main/ProductUpload'
import React from 'react'

const AdminProductsPage = () => {
  return (
    <Container className="flex-grow">
  <div className="min-h-screen grid grid-rows-[3fr_5fr] md:grid-rows-none md:grid-cols-[2fr_4fr] lg:grid-cols-[2fr_6fr] gap-1">
    <div className="bg-gray-100 pt-10 max-h-screen overflow-y-auto custom-scroll">
      <h2 className='text-center font-semibold capitalize text-xl md:text-2xl mb-10'>Upload Product</h2>
      <ProductUpload/>
    </div>
    <div className="pt-10 bg-gray-500">
      <h2 className='text-center font-semibold capitalize text-xl md:text-2xl mb-10'>Products</h2>
      <ProductGrid className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'/>
    </div>
  </div>
</Container>

  )
}

export default AdminProductsPage