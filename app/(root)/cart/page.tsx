import CartComponent from "@/components/RootOnly/CartComponent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review the furniture items you’ve added to your cart at Kalika Kasta Furniture Udyog. Make updates, check prices, and proceed to secure checkout for fast delivery in Dhangadhi and across Nepal."
};


const CartPage = () => {
 return (
  <CartComponent/>
)
};

export default CartPage;