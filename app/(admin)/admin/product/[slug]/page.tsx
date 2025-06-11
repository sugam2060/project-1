
import SinglePageGrid from '@/components/adminOnly/SinglepageComponents/SinglePageGrid'
import React from 'react'

const ProductDetailPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = await params


    return (
        <div>
            <SinglePageGrid slug={slug} />
        </div>
    )
}

export default ProductDetailPage