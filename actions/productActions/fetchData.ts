'use server'
import { db } from "@/lib/db";
import { unstable_cache } from 'next/cache'

interface PriceRange {
  min: number;
  max: number;
}

export const fetchProducts = unstable_cache(async ({
  limit,
  cursor,
  selectedCategories = [],
  priceRange,
  sortBy = 'name',
  sortOrder = 'asc'
}: {
  limit: number;
  cursor?: string;
  selectedCategories?: string[];
  priceRange?: PriceRange;
  sortBy?: 'name' | 'price' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}) => {

  try {
    // Build where clause
    const whereClause: any = {};

    // Multiple categories filter
    if (selectedCategories.length > 0) {
      whereClause.category = {
        in: selectedCategories
      };
    }

    // Price range filter
    if (priceRange) {
      whereClause.price = {
        gte: priceRange.min,
        lte: priceRange.max,
      };
    }

    // Build orderBy clause
    const orderBy: any[] = [];

    if (sortBy === 'name') {
      orderBy.push({ name: sortOrder });
      orderBy.push({ id: 'asc' }); // Secondary sort for consistency
    } else if (sortBy === 'price') {
      orderBy.push({ price: sortOrder });
      orderBy.push({ id: 'asc' }); // Secondary sort for consistency
    } else if (sortBy === 'createdAt') {
      orderBy.push({ createdAt: sortOrder });
      orderBy.push({ id: 'asc' }); // Secondary sort for consistency
    }

    const products = await db.product.findMany({
      where: whereClause,
      take: limit + 1,
      skip: cursor ? 1 : 0, // <----- this line fixes duplication
      ...(cursor && {
        cursor: {
          id: cursor
        }
      }),
      orderBy,
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
            imageUrl: true,
          },
          take: 1,
          orderBy: {
            position:'asc'
          }
        },
      },
    });

    const hasNextPage = products.length > limit;
    const items = hasNextPage ? products.slice(0, -1) : products;
    const nextCursor = hasNextPage ? items[items.length - 1]?.id : null;

    return {
      products: items,
      nextCursor,
      hasNextPage,
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }
},
  ['fetch-products'],
  {
    tags: ['products'],
    revalidate: 1, // Revalidate every hour
  }
)

// Helper function to get price range for selected categories
export const getPriceRange = unstable_cache(async (selectedCategories?: string[]) => {
  try {
    const whereClause: any = {};

    if (selectedCategories && selectedCategories.length > 0) {
      whereClause.category = {
        in: selectedCategories  
      };
    }

    const result = await db.product.aggregate({
      where: whereClause,
      _min: {
        price: true,
      },
      _max: {
        price: true,
      },
    });

    return {
      min: result._min.price || 0,
      max: result._max.price || 10000,
    };
  } catch (error) {
    console.error("Error fetching price range:", error);
    return {
      min: 0,
      max: 10000,
    };
  }
},
['get-price-range'],
{
  tags:['price-range'],
  revalidate: 60 * 60, // Revalidate every 30 minutes
}
);