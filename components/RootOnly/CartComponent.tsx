"use client";
import Container from "@/components/main/Container";
import EmptyCart from "@/components/RootOnly/EmptyCart";
import Loading from "@/components/main/Loading";
import PriceFormatter from "@/components/main/PriceFormater";
import QuantityButtons from "@/components/RootOnly/QuantityButtons";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useCartStore from "@/store";
import { Heart, ShoppingBag, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { createCheckoutSession } from "@/actions/productActions/createCheckoutSession";

const CartComponent = () => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { status: isSignedIn, data } = useSession();

  const {
    deleteCartProduct,
    getTotalPrice,
    getItemCount,
    getSubtotalPrice,
    resetCart,
    getGroupedItems,
  } = useCartStore();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <Loading />;
  }

  const cartProducts = getGroupedItems();

  const handleResetCart = () => {
    const confirmed = window.confirm("Are you sure to reset your Cart?");
    if (confirmed) {
      resetCart();
      toast.success("Your cart reset successfully!");
    }
  };

  const handleDeleteProduct = (id: string) => {
    deleteCartProduct(id);
    toast.success("Product deleted successfully!");
  };

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const metadata = {
        orderNumber: crypto.randomUUID(),
        customerName: data?.user.name ?? "Unknown",
        customerEmail: data?.user?.email ?? "Unknown",
        userId: data!.user.id,
      };

      const checkoutUrl = await createCheckoutSession(cartProducts, metadata);
      if (checkoutUrl) {
        router.replace(checkoutUrl);
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-4 sm:pb-8 md:pb-12 lg:pb-16">
      {isSignedIn && (
        <Container>
          {cartProducts?.length ? (
            <>
              {/* Header */}
              <div className="flex items-center gap-2 py-4 sm:py-5 px-2 sm:px-0">
                <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
                <h1 className="text-xl sm:text-2xl font-semibold">Shopping Cart</h1>
              </div>

              {/* Main Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 px-2 sm:px-0">
                {/* Products Section */}
                <div className="lg:col-span-2 rounded-lg">
                  <div className="border bg-white rounded-md overflow-hidden">
                    {cartProducts?.map(({ product }) => {
                      const itemCount = getItemCount(product.id);
                      return (
                        <div
                          key={product.id}
                          className="border-b p-3 sm:p-4 md:p-5 last:border-b-0"
                        >
                          {/* Mobile Layout (Stacked) */}
                          <div className="flex flex-col sm:hidden gap-3">
                            {/* Product Image and Basic Info */}
                            <div className="flex gap-3">
                              {product?.images && (
                                <Link
                                  href={`/product/${product.slug}`}
                                  className="border p-1 rounded-md overflow-hidden group flex-shrink-0"
                                >
                                  <Image
                                    src={product.images[0].imageUrl}
                                    alt="productImage"
                                    width={80}
                                    height={80}
                                    loading="lazy"
                                    className="w-16 h-16 object-cover group-hover:scale-105 hoverEffect rounded"
                                  />
                                </Link>
                              )}
                              <div className="flex-1 min-w-0">
                                <h2 className="font-semibold text-sm line-clamp-2 mb-1">
                                  {product?.name}
                                </h2>
                                <p className="text-xs text-gray-600 mb-1 line-clamp-2">
                                  {product.description}
                                </p>
                                <p className="text-xs text-gray-500 capitalize">
                                  Category: <span className="font-medium">{product.category}</span>
                                </p>
                              </div>
                            </div>

                            {/* Price, Quantity, and Actions */}
                            <div className="flex items-center justify-between">
                              <div className="flex flex-col gap-2">
                                <PriceFormatter
                                  amount={(product?.price as number) * itemCount}
                                  className="font-bold text-base"
                                />
                                <QuantityButtons product={product} />
                              </div>
                              <div className="flex items-center gap-3">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Heart className="w-4 h-4 hover:text-green-600 hoverEffect" />
                                    </TooltipTrigger>
                                    <TooltipContent className="font-bold">
                                      Add to Favorite
                                    </TooltipContent>
                                  </Tooltip>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Trash
                                        onClick={() => handleDeleteProduct(product.id)}
                                        className="w-4 h-4 hover:text-red-600 hoverEffect cursor-pointer"
                                      />
                                    </TooltipTrigger>
                                    <TooltipContent className="font-bold bg-red-600">
                                      Delete product
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </div>
                          </div>

                          {/* Desktop/Tablet Layout (Horizontal) */}
                          <div className="hidden sm:flex items-center justify-between gap-4 md:gap-6">
                            <div className="flex flex-1 items-center gap-3 md:gap-4">
                              {product?.images && (
                                <Link
                                  href={`/product/${product.slug}`}
                                  className="border p-1 md:p-2 rounded-md overflow-hidden group flex-shrink-0"
                                >
                                  <Image
                                    src={product.images[0].imageUrl}
                                    alt="productImage"
                                    width={500}
                                    height={500}
                                    loading="lazy"
                                    className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-36 lg:h-36 object-cover group-hover:scale-105 overflow-hidden hoverEffect rounded"
                                  />
                                </Link>
                              )}
                              
                              <div className="flex-1 min-w-0 space-y-1 md:space-y-2">
                                <h2 className="font-semibold text-sm md:text-base line-clamp-1 lg:line-clamp-2">
                                  {product?.name}
                                </h2>
                                <p className="text-xs md:text-sm text-gray-600 line-clamp-1 md:line-clamp-2">
                                  {product.description}
                                </p>
                                <div className="flex flex-col sm:flex-row sm:gap-4 text-xs md:text-sm text-gray-500">
                                  <p className="capitalize">
                                    Category: <span className="font-medium">{product.category}</span>
                                  </p>
                                  <p className="capitalize">
                                    Status:{" "}
                                    <span className={`font-medium ${product.stock === 0 ? 'text-red-500' : 'text-green-600'}`}>
                                      {product.stock === 0 ? "Out of Stock" : "In Stock"}
                                    </span>
                                  </p>
                                </div>
                                
                                {/* Actions for tablet/desktop */}
                                <div className="flex items-center gap-3 pt-1">
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger>
                                        <Heart className="w-4 h-4 md:w-5 md:h-5 hover:text-green-600 hoverEffect" />
                                      </TooltipTrigger>
                                      <TooltipContent className="font-bold">
                                        Add to Favorite
                                      </TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                      <TooltipTrigger>
                                        <Trash
                                          onClick={() => handleDeleteProduct(product.id)}
                                          className="w-4 h-4 md:w-5 md:h-5 hover:text-red-600 hoverEffect cursor-pointer"
                                        />
                                      </TooltipTrigger>
                                      <TooltipContent className="font-bold bg-red-600">
                                        Delete product
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </div>
                              </div>
                            </div>

                            {/* Price and Quantity */}
                            <div className="flex flex-col items-end justify-center gap-3 md:gap-4 flex-shrink-0">
                              <PriceFormatter
                                amount={(product?.price as number) * itemCount}
                                className="font-bold text-sm md:text-lg"
                              />
                              <QuantityButtons product={product} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    
                    {/* Reset Cart Button */}
                    <div className="p-3 sm:p-4 md:p-5">
                      <Button
                        onClick={handleResetCart}
                        className="w-full sm:w-auto font-semibold text-sm md:text-base"
                        variant="destructive"
                        size="sm"
                      >
                        Reset Cart
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Order Summary - Desktop */}
                <div className="lg:col-span-1 hidden lg:block">
                  <div className="bg-white p-4 xl:p-6 rounded-lg border sticky top-4">
                    <h2 className="text-lg xl:text-xl font-semibold mb-4">
                      Order Summary
                    </h2>
                    <div className="space-y-3 xl:space-y-4">
                      <div className="flex justify-between text-sm xl:text-base">
                        <span>Subtotal</span>
                        <PriceFormatter amount={getSubtotalPrice()} />
                      </div>
                      <div className="flex justify-between text-sm xl:text-base">
                        <span>Discount</span>
                        <PriceFormatter
                          amount={getSubtotalPrice() - getTotalPrice()}
                          className="text-green-600"
                        />
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="font-medium">Total</span>
                        <PriceFormatter
                          amount={getTotalPrice()}
                          className="text-lg xl:text-xl font-bold text-black"
                        />
                      </div>
                      <Button
                        disabled={loading}
                        onClick={handleCheckout}
                        className="w-full rounded-full font-semibold tracking-wide"
                        size="lg"
                      >
                        {loading ? "Processing..." : "Proceed to Checkout"}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Order Summary - Tablet */}
                <div className="hidden md:block lg:hidden col-span-1">
                  <div className="bg-white p-4 rounded-lg border">
                    <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <PriceFormatter amount={getSubtotalPrice()} />
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Discount</span>
                        <PriceFormatter
                          amount={getSubtotalPrice() - getTotalPrice()}
                          className="text-green-600"
                        />
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="font-medium">Total</span>
                        <PriceFormatter
                          amount={getTotalPrice()}
                          className="text-lg font-bold text-black"
                        />
                      </div>
                      <Button
                        disabled={loading}
                        onClick={handleCheckout}
                        className="w-full rounded-full font-semibold tracking-wide"
                        size="lg"
                      >
                        {loading ? "Processing..." : "Proceed to Checkout"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Full Order Summary - Mobile */}
              <div className="md:hidden mt-6 mb-20">
                <div className="bg-white p-4 rounded-lg border mx-2">
                  <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <PriceFormatter amount={getSubtotalPrice()} />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Discount</span>
                      <PriceFormatter
                        amount={getSubtotalPrice() - getTotalPrice()}
                        className="text-green-600"
                      />
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="font-semibold">Total</span>
                      <PriceFormatter
                        amount={getTotalPrice()}
                        className="text-lg font-bold text-black"
                      />
                    </div>
                    <Button
                      disabled={loading}
                      onClick={handleCheckout}
                      className="w-full rounded-full font-semibold tracking-wide mt-4"
                      size="lg"
                    >
                      {loading ? "Processing..." : "Proceed to Checkout"}
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <EmptyCart />
          )}
        </Container>
      )}
    </div>
  );
};

export default CartComponent;