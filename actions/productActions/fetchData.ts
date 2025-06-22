'use server'
import { db } from "@/lib/db";
import { unstable_cache } from 'next/cache'
import { orderStatusType } from "@/schemas/OrderStatusType";

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

// Fetch all orders with user, address, and item count for admin
export const fetchAllOrders = async () => {
  try {
    const orders = await db.order.findMany({
      include: {
        user: { select: { name: true, email: true } },
        address: true,
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return orders.map(order => ({
      ...order,
      itemsCount: order.items.length,
    }));
  } catch (error) {
    console.error('Error fetching all orders:', error);
    throw new Error('Failed to fetch orders');
  }
};

// Update order status by id
export const updateOrderStatus = async (orderId: string, status: orderStatusType) => {
  try {
    const updated = await db.order.update({
      where: { id: orderId },
      data: { status },
    });
    return updated;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw new Error('Failed to update order status');
  }
};

// Fetch a single order with all details for order detail page
export const fetchOrderDetail = async (orderNumber: string) => {
  try {
    const order = await db.order.findUnique({
      where: { orderNumber },
      include: {
        user: { select: { name: true, email: true } },
        address: {
          include: {
            location: { select: { city: true } },
          },
        },
        items: {
          include: {
            product: {
              select: {
                name: true,
                price: true,
                images: { select: { imageUrl: true }, orderBy: { position: 'asc' } },
              },
            },
          },
        },
      },
    });
    if (!order) return null;
    // Flatten city into address
    const address = order.address
      ? {
          ...order.address,
          city: order.address.location?.city || "",
        }
      : null;
    return { ...order, address };
  } catch (error) {
    console.error('Error fetching order detail:', error);
    throw new Error('Failed to fetch order detail');
  }
};

// Fetch orders for a specific user
export const fetchOrdersByUser = async (userId: string) => {
  try {
    const orders = await db.order.findMany({
      where: { userId },
      include: {
        user: { select: { name: true, email: true } },
        address: {
          include: {
            location: { select: { city: true } },
          },
        },
        items: {
          include: {
            product: {
              select: {
                name: true,
                price: true,
                images: { select: { imageUrl: true }, orderBy: { position: 'asc' } },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return orders.map(order => ({
      ...order,
      address: order.address ? { ...order.address, city: order.address.location?.city || "" } : null,
      itemsCount: order.items.length,
    }));
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw new Error('Failed to fetch user orders');
  }
};

export const fetchOrdersPaginated = async ({
  limit,
  cursor,
  status,
}: {
  limit: number;
  cursor?: { createdAt: string; id: string };
  status?: string;
}) => {
  try {
    const where: any = {};
    if (status && status !== "all") {
      where.status = status;
    }
    if (cursor) {
      where.OR = [
        { createdAt: { lt: new Date(cursor.createdAt) } },
        {
          createdAt: new Date(cursor.createdAt),
          id: { lt: cursor.id },
        },
      ];
    }

    const orders = await db.order.findMany({
      take: limit + 1,
      where,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      include: {
        user: { select: { name: true, email: true } },
        address: true,
        items: true,
      },
    });

    const hasNextPage = orders.length > limit;
    const items = hasNextPage ? orders.slice(0, -1) : orders;
    const nextCursor = hasNextPage
      ? {
          createdAt: items[items.length - 1].createdAt.toISOString(),
          id: items[items.length - 1].id,
        }
      : null;

    return {
      orders: items.map(order => ({
        ...order,
        createdAt: order.createdAt.toISOString(),
        itemsCount: order.items.length,
      })),
      nextCursor,
      hasNextPage,
    };
  } catch (error) {
    console.error('Error fetching paginated orders:', error);
    throw new Error('Failed to fetch orders');
  }
};

// Delete an order and all its order items
export const deleteOrderWithItems = async (orderId: string) => {
  try {
    await db.$transaction([
      db.orderItem.deleteMany({ where: { orderId } }),
      db.order.delete({ where: { id: orderId } })
    ]);
    return { success: true };
  } catch (error) {
    console.error('Error deleting order and items:', error);
    return { error: 'Failed to delete order.' };
  }
};