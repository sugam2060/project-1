import { fetchSingleProduct } from '@/actions/productActions/FetchBySlug'
import React from 'react'
import ImageView from './ImageView'
import PriceView from '../main/PriceView'

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
                <div className='w-full overflow-hidden space-y-4'>
                    <h1 className='text-2xl font-semibold mb-4'>{product?.name}</h1>
                    <PriceView price={product?.price} discount={product?.discount}/>
                    {product?.stock as number > 0 ?(
                        <div className='bg-green-300/50 w-22 text-center font-semibold text-sm text-green-600 px-4 py-2 rounded-md mb-4'>
                            In Stock
                        </div>
                    ) :
                    (
                        <div className='bg-red-300/50 w-22 text-center font-semibold text-sm text-red-600 px-4 py-2 rounded-md mb-4'>
                            Out of Stock
                        </div>
                    )
                    }
                    <p className='text-gray-700'>{product?.description}</p>
                </div>
            </div>
        </div>
    )
}

export default SingleProduct
