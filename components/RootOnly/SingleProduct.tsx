import { fetchSingleProduct } from '@/actions/productActions/FetchBySlug'
import React from 'react'
import ImageView from './ImageView'
import PriceView from '../main/PriceView'
import AddToCartButton from './AddToCartButton'
import { z } from 'zod'
import { ProductFieldFetchsSchema } from '@/schemas/ProductUploadSchema'
import AccordianDropDown from './AccordianDropDown'
import {MailQuestionIcon} from 'lucide-react'
import ShareButton from './ShareButton'
import ReviewDialog from './ReviewDialog'

type Product = z.infer<typeof ProductFieldFetchsSchema>
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
                    <div className='flex items-center gap-5'>
                        <AddToCartButton product={product as Product}/>
                        <ReviewDialog/>
                    </div>
                    <div className='mb-0'>
                        <AccordianDropDown product={product as Product}/>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-3 border-t gap-2'>
                        <div className='flex min-h-[50px]  items-center gap-2 hover:text-red-500 hoverEffect'>
                            <MailQuestionIcon className='w-4 h-4'/>
                            <span className='font-semibold'>Ask a question</span>
                        </div>
                        <ShareButton/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SingleProduct
