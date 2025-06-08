'use server'
import { db } from "@/lib/db";
import { TrendingProduct } from "@/schemas/TypeSchemas/TrendingSchema";
import { unstable_cache } from "next/cache";

interface Props {
    limit: number;
    cursor?: string | null;
    sortBy?: 'name' | 'price' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
}

// Return type for the function
export type FetchTrendingProductsResult = {
    items: TrendingProduct[];
    hasNextPage: boolean;
    nextCursor: string | null;
}

export const fetchTrendingProducts = unstable_cache(
    async ({
    limit = 8,
    cursor,
    sortBy = 'name',
    sortOrder = 'asc'
}: Props): Promise<FetchTrendingProductsResult> => {
    try {
        // Build orderBy based on sortBy parameter
        const orderBy = (() => {
            switch (sortBy) {
                case 'name':
                    return { product: { name: sortOrder } };
                case 'price':
                    return { product: { price: sortOrder } };
                case 'createdAt':
                    return { addedAt: sortOrder };
                default:
                    return { product: { name: sortOrder } };
            }
        })();

        const products = await db.trendingProduct.findMany({
            take: limit + 1,
            ...(cursor && {
                cursor: {
                    id: cursor
                },
                skip: 1 // Skip the cursor item itself
            }),
            orderBy,
            select: {
                id: true,
                productId: true,
                addedAt: true,
                product: {
                    select: {
                        id: true,
                        name: true,
                        price: true,
                        description: true,
                        category: true,
                        stock: true,
                        brand: true,
                        discount: true,
                        slug: true,
                        images: {
                            select: {
                                id: true,
                                productId: true,
                                imageUrl: true,
                            }
                        }
                    }
                }
            }
        });

        const hasNextPage = products.length > limit;
        const nextCursor = hasNextPage ? products[products.length - 1].id : null;
        const items = hasNextPage ? products.slice(0, -1) : products;
        
        return {
            items,
            hasNextPage,
            nextCursor
        };

    } catch (error) {
        console.error('Error fetching trending products:', error);
        return {
            items: [],
            nextCursor: null,
            hasNextPage: false
        };
    }
},
['fetchTrendingProducts'],
{
    tags: ['fetchTrendingProducts'],
    revalidate: 60 * 60 // 1 hour
}
)