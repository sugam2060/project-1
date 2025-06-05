'use client'
import React, { useCallback, useEffect, useState } from 'react'
import ProductsCard from '../main/ProductsCard';
import { Check } from 'lucide-react'
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import { useInView } from 'react-intersection-observer';
import { fetchTrendingProducts, type FetchTrendingProductsResult } from '@/actions/productActions/fetchTrendingProducts';
import ProductLoadingSkeleton from '../main/ProductLoadingSkeleton';

// Import the types from your types file
import type { TrendingProduct } from '@/schemas/TypeSchemas/TrendingSchema'; // Adjust the import path as needed

interface TrendingGridProps {
    limit: number;
}

const TrendingGrid: React.FC<TrendingGridProps> = ({ limit }) => {
    const [trendingProducts, setTrendingProducts] = useState<TrendingProduct[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [hasNextPage, setHasNextPage] = useState<boolean>(true);
    const [isInitialized, setIsInitialized] = useState<boolean>(false);

    const { ref, inView } = useInView({
        threshold: 1.0,
        triggerOnce: false,
    });

    const fetchMore = useCallback(async (): Promise<void> => {
        if (isLoading || !hasNextPage) {
            return;
        }

        setIsLoading(true);
        try {
            console.log('Fetching trending products with cursor:', nextCursor);
            const response: FetchTrendingProductsResult = await fetchTrendingProducts({
                limit,
                cursor: nextCursor,
                sortBy: 'name',
                sortOrder: 'asc',
            });

            console.log('Response received:', response);

            if (response && response.items) {
                if (nextCursor) {
                    // Subsequent pages - append
                    setTrendingProducts((prev: TrendingProduct[]) => [...prev, ...response.items]);
                } else {
                    // First page - replace
                    setTrendingProducts(response.items);
                }
                setNextCursor(response.nextCursor);
                setHasNextPage(response.hasNextPage);
                setIsInitialized(true);
            }
        } catch (error) {
            console.error('Error fetching trending products:', error);
        } finally {
            setIsLoading(false);
        }
    }, [limit, nextCursor, hasNextPage, isLoading]);

    // Initial fetch
    useEffect(() => {
        if (!isInitialized) {
            fetchMore();
        }
    }, [fetchMore, isInitialized]);

    // Infinite scroll trigger
    useEffect(() => {
        if (inView && isInitialized && !isLoading && hasNextPage) {
            console.log('InView triggered, fetching more...');
            fetchMore();
        }
    }, [inView, fetchMore, isInitialized, isLoading, hasNextPage]);

    // Debug logging
    useEffect(() => {
        console.log('State update:', {
            productsCount: trendingProducts.length,
            nextCursor,
            hasNextPage,
            isLoading,
            isInitialized
        });
    }, [trendingProducts, nextCursor, hasNextPage, isLoading, isInitialized]);

    if (!isInitialized && isLoading) {
        return (
            <div className='w-full overflow-hidden whitespace-nowrap rounded-md border p-4'>
                <ProductLoadingSkeleton
                    length={limit + 1}
                    className='flex gap-4'
                    InnerClass='min-w-[280px] min-h-[250px]'
                />
            </div>
        );
    }

    if (!isInitialized && !isLoading && trendingProducts.length === 0) {
        return (
            <div className="w-full p-4">
                <div className="text-center">No trending products found.</div>
            </div>
        );
    }

    return (
        <ScrollArea className="w-full whitespace-nowrap rounded-md border p-4">
            <div className="flex gap-4">
                {trendingProducts.map((trendingProduct: TrendingProduct, idx: number) => {
                    const isSecondLast = idx === trendingProducts.length - 2;

                    return (
                        <div
                            key={trendingProduct.id}
                            ref={isSecondLast ? ref : undefined}
                            className="min-w-[280px] max-w-[280px]"
                        >
                            <ProductsCard
                                product={trendingProduct.product}
                            />
                        </div>
                    );
                })}

                {/* Loading indicator for infinite scroll */}
                {isLoading && hasNextPage && (
                    <div className="min-w-[280px] max-w-[250px] flex items-center justify-center">
                        <div className="flex flex-col items-center space-y-2 p-4">
                            <div className="h-6 w-6 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
                            <div className="text-sm text-muted-foreground">Loading more…</div>
                        </div>
                    </div>
                )}

                {/* End of list indicator */}
                {!hasNextPage && trendingProducts.length > 0 && (
                    <div className="min-w-[280px] flex items-center justify-center">
                        <div className="flex items-center space-x-2 text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-lg border">
                            <Check className='w-5 h-5' />
                            <span>You&apos;ve seen all trending products</span>
                        </div>
                    </div>
                )}
            </div>

            <ScrollBar orientation="horizontal" />
        </ScrollArea>
    );
};

export default TrendingGrid;