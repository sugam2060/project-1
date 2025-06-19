"use server";
import { db } from "@/lib/db";
import { Metadata } from "@/schemas/cartSchema";
import { CartItem } from "@/store/store";

interface CartItems {
  products: CartItem["product"];
  quantity: number;
}

export async function createCheckoutSession(
  items: CartItem[],
  metadata: Metadata
) {
  try {
    console.log(metadata,items);
    
    // Calculate total
    const total = items.reduce((sum, item) => {
      const price = item.product.price;
      const discount = item.product.discount || 0;
      const discountedPrice = price - (discount * price) / 100;
      return Math.ceil(sum + discountedPrice * item.quantity);
    }, 0);

    // Create the order
    const order = await db.order.create({
      data: {
        orderNumber: metadata.orderNumber,
        userId: metadata.userId,
        addressId: metadata.addressId,
        total,
        status: "pending",
        items: {
          create: items.map((item) => ({
            quantity: item.quantity,
            price: item.product.price,
            name: item.product.name,
            description: item.product.description,
            category: item.product.category,
            brand: item.product.brand || "",
            discount: item.product.discount,
            imageUrl: item.product.images?.[0]?.imageUrl || "",
            product: { connect: { id: item.product.id } },
          })),
        },
      },
    });

    // Optionally, redirect to a confirmation page or return order id
    return `/products`;
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw error;
  }
}