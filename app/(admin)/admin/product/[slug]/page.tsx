
import React from 'react'

const ProductDetailPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = await params


    return (
        <div>{JSON.stringify(slug)}</div>
    )
}

export default ProductDetailPage