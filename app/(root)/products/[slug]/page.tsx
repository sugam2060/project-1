import Container from '@/components/main/Container';
import SingleProduct from '@/components/RootOnly/SingleProduct';
import React from 'react'

const page = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = await params;
    return (
        <Container>
            <SingleProduct slug={slug} />
        </Container>
    )
}

export default page