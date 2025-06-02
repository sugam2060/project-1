"use server";
import { Metadata } from "@/schemas/cartSchema";
import { CartItem } from "@/store";



interface CartItems {
  products: CartItem["product"];
  quantity: number;
}

export async function createCheckoutSession(
  items: CartItem[],
  metadata: Metadata
) {
  try {
    return '/products'
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw error;
  }
}