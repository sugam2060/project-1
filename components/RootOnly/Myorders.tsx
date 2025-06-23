"use client";

import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import {
  fetchOrdersByUser,
  updateOrderStatus,
} from "@/actions/productActions/fetchData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Loading from "@/components/main/Loading";
import Container from "../main/Container";
import clsx from "clsx";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { orderStatusType } from "@/schemas/OrderStatusType";

const statusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "shipped":
      return "bg-blue-100 text-blue-800";
    case "delivered":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function MyOrders() {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const {
    data: ordersRaw,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["my-orders", userId],
    queryFn: () => fetchOrdersByUser(userId!),
    enabled: !!userId,
  });

  const orders = (ordersRaw || []).map((order) => ({
    ...order,
    status: order.status as orderStatusType,
    createdAt:
      typeof order.createdAt === "string"
        ? order.createdAt
        : order.createdAt.toISOString(),
  }));

  let stickyMessage = null;
  if (orders.length > 0) {
    const hasProcessing = orders.some((o) => o.status === "processing");
    const hasPending = orders.some((o) => o.status === "pending");
    const hasShipped = orders.some((o) => o.status === "shipped");
    const hasDelivered = orders.some((o) => o.status === "delivered");

    if (hasProcessing) {
      stickyMessage =
        "Your order is being processed. Payment details have been sent to your email. Once payment is confirmed, your items will be prepared for shipping.";
    } else if (hasPending) {
      stickyMessage =
        "We have received your order! We will contact you soon for order confirmation.";
    } else if (hasShipped) {
      stickyMessage =
        "Great news! Your payment has been received and your order has been shipped. It will be with you soon.";
    } else if (hasDelivered) {
      stickyMessage =
        "Your order has been delivered! We hope you enjoy your purchase. Thank you for shopping with us.";
    } else {
      stickyMessage =
        "This order has been cancelled. If you have questions, please contact our support team.";
    }
  }

  if (status === "loading" || isLoading) return <Loading />;
  if (!userId)
    return (
      <div className="p-6 text-center">Please log in to view your orders.</div>
    );
  if (isError)
    return (
      <div className="p-6 text-center text-red-500">Failed to load orders.</div>
    );

  const handleCancellation = async (orderId: string) => {
    setCancellingId(orderId);
    try {
      await updateOrderStatus(orderId, "cancelled");
      toast.success("Order cancelled successfully.");
      refetch();
    } catch {
      toast.error("Failed to cancel order.");
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <Container className="min-h-[500px] px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl sm:text-3xl font-bold my-6 text-center">
        My Orders
      </h1>

      {stickyMessage && (
        <div className="sticky top-2 z-10 mb-6 mx-auto max-w-2xl bg-yellow-50 border-l-4 border-yellow-400 text-yellow-900 px-6 py-4 rounded shadow-sm text-center font-medium">
          {stickyMessage}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="text-center text-gray-500">
          You have no orders yet.
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card
              key={order.id}
              className="shadow-md border border-gray-200 overflow-hidden"
            >
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <CardTitle className="text-lg font-semibold">
                    Order #{order.orderNumber}
                  </CardTitle>
                  <div className="text-sm text-gray-500">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <Badge
                  className={clsx(
                    statusColor(order.status),
                    "px-3 py-1 rounded-full text-xs font-semibold"
                  )}
                >
                  {order.status.charAt(0).toUpperCase() +
                    order.status.slice(1)}
                </Badge>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex flex-col md:flex-row md:justify-between gap-6">
                  {/* Order details */}
                  <div className="flex-1 space-y-2 text-sm text-gray-700">
                    <div>
                      <span className="font-medium">Shipping Address:</span>{" "}
                      {order.address?.addressLine}, {order.address?.city}
                      {order.address?.postalCode
                        ? `, ${order.address.postalCode}`
                        : ""}
                    </div>
                    <div>
                      <span className="font-medium">Total:</span> $
                      {order.total.toFixed(2)}
                    </div>
                    <div>
                      <span className="font-medium">Items:</span>{" "}
                      {order.itemsCount}
                    </div>
                  </div>

                  {/* Product images */}
                  <div className="flex flex-wrap gap-4 justify-start">
                    {order.items.slice(0, 3).map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col items-center min-w-[100px] max-w-[120px] flex-1"
                      >
                        <div className="relative w-full aspect-square border rounded-md overflow-hidden bg-gray-100">
                          <Image
                            src={
                              item.product.images[0]?.imageUrl || "/logo.png"
                            }
                            alt={item?.product?.name || "Product image"}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover"
                            priority
                          />
                        </div>
                        <div className="text-xs text-center mt-2 font-medium line-clamp-2">
                          {item.product.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          x{item.quantity}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="my-2" />

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 text-xs text-gray-500">
                  <span>Order ID: {order.id}</span>
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => refetch()}
                      className="w-full sm:w-auto"
                    >
                      Refresh
                    </Button>
                    {order.status === "pending" && (
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={cancellingId === order.id}
                        onClick={() => handleCancellation(order.id)}
                        className="w-full sm:w-auto"
                      >
                        {cancellingId === order.id
                          ? "Cancelling..."
                          : "Cancel Order"}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
}
