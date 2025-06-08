import { fetchSingleProduct } from '@/actions/productActions/FetchBySlug'
import React from 'react'
import ImageView from './ImageView'

const SingleProduct = async ({ slug }: { slug: string }) => {
    const product = await fetchSingleProduct(slug)

    return (
        <div className='min-h-screen px-4 py-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {/* Center ImageView */}
                <div>
                    <ImageView images={product?.images} />
                </div>

                {/* Product Info */}
                <div className='w-full overflow-hidden'>
                    <h1 className='text-2xl font-semibold mb-4'>Product Title</h1>
                    <p className='text-gray-700'>Description or other product info goes here.</p>
                </div>
            </div>
        </div>
    )
}

export default SingleProduct
