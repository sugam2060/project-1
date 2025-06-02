'use client'
import React, { useEffect, useState } from 'react'
import { z } from 'zod';
import { ProductFieldFetchsSchema } from '@/schemas/ProductUploadSchema';
import { useInView } from 'react-intersection-observer';
import { Loader2 } from 'lucide-react';
import { fetchProducts } from '@/actions/productActions/fetchData';
import ProductsCard from './ProductsCard';
import { cn } from '@/lib/utils';

type productType = z.infer<typeof ProductFieldFetchsSchema>

interface props {
    totalPage: number, number: number, className?: string
}

const LoadMore = ({ totalPage, number, className }: props) => {
    const [products, setProducts] = useState<productType[]>([]);
    const [pageLoaded, setPageLoaded] = useState(1);

    const { ref, inView } = useInView()

    const loadMorePages = async () => {
        const nextPage = pageLoaded + 1;
        const newProducts = await fetchProducts({ number, page: nextPage }) ?? [];
        setProducts((prev: productType[]) => [...prev, ...newProducts.products]);
        setPageLoaded(nextPage);
    }

    useEffect(() => {
        if (inView) {
            loadMorePages()
        }
    }, [inView])

    return (
        <div>
            <div className={cn("mx-2", className)}>
                {products.map((product) => (
                    <ProductsCard key={product.id} product={product} />
                ))}
            </div>
            {totalPage !== pageLoaded && totalPage > 1 && <div ref={ref} className='flex justify-center items-center p-4 col-span-1 sm:col-span-2 md:col-span-3'>
                <Loader2 className='w-6 h-6 mx-auto mt-10 mb-2 animate-spin' />
            </div>}
        </div>
    )
}

export default LoadMore