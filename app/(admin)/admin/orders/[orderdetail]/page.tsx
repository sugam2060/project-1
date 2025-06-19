"use client";
import React, { useEffect, useState, type FC } from "react";
import { fetchOrderDetail } from "@/actions/productActions/fetchData";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import clsx from "clsx";
import Head from "next/head";
import Container from "@/components/main/Container";

type OrderDetail = {
  id: string;
  orderNumber: string;
  user: { name: string; email: string } | null;
  address: {
    addressLine: string;
    postalCode?: string;
    phone?: string;
    city?: string;
  } | null;
  total: number;
  status: string;
  createdAt: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    product?: {
      name: string;
      images: { imageUrl: string }[];
    };
  }>;
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  processing: "bg-blue-100 text-blue-800 border-blue-300",
  shipped: "bg-purple-100 text-purple-800 border-purple-300",
  delivered: "bg-green-100 text-green-800 border-green-300",
  cancelled: "bg-red-100 text-red-800 border-red-300",
};

const OrderDetailPage: FC = () => {
  const params = useParams();
  const orderNumber = Array.isArray(params?.orderdetail) ? params.orderdetail[0] : params?.orderdetail;
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderNumber) {
      fetchOrderDetail(orderNumber as string)
        .then((data) => setOrder(data as OrderDetail | null))
        .finally(() => setLoading(false));
    }
  }, [orderNumber]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-500 font-sans">
        Order not found.
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Order #{order.orderNumber} | Admin</title>
        <meta name="description" content={`Details for order ${order.orderNumber}`} />
      </Head>

      <Container className="my-5 space-y-5">
        <div className="flex justify-between items-center">
          <Link href="/admin/orders" className="text-blue-600 underline text-sm">
            &larr; Back to Orders
          </Link>
          {/* <button
            onClick={() => window.print()}
            className="text-sm px-3 py-1 border rounded bg-white hover:bg-gray-100"
          >
            Print Invoice
          </button> */}
        </div>

        {/* Order Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xl font-semibold">
              <span>Order #{order.orderNumber}</span>
              <span
                className={clsx(
                  "inline-block px-3 py-1 rounded-full text-xs font-semibold border",
                  statusColors[order.status] || "bg-gray-100 text-gray-800 border-gray-300"
                )}
              >
                {order.status}
              </span>
            </CardTitle>
            <CardDescription className="text-sm text-gray-500">
              Placed on {new Date(order.createdAt).toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="font-medium text-base mb-1">Customer</div>
              <div className="text-lg">{order.user?.name ?? "Unknown User"}</div>
              <div className="text-sm text-gray-500">{order.user?.email ?? "No email"}</div>
            </div>
            <div>
              <div className="font-medium text-base mb-1">Shipping Address</div>
              <div className="bg-gray-50 border rounded p-3 text-sm space-y-1">
                <p>Address: {order.address?.addressLine ?? "N/A"}</p>
                <p>City: {order.address?.city ?? "N/A"}</p>
                {order.address?.postalCode && <p>Postal Code: {order.address.postalCode}</p>}
                {order.address?.phone && (
                  <p>Phone: <span className="font-medium">{order.address.phone}</span></p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Items */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Items</h2>
          <div className="space-y-6">
            {order.items.length === 0 ? (
              <div className="text-center text-gray-500 py-8">No items in this order.</div>
            ) : (
              order.items.map((item) => (
                <Card key={item.id}>
                  <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-6">
                    {/* Product Image */}
                    <div className="w-full h-auto">
                      {item.product?.images?.[0]?.imageUrl ? (
                        <Image
                          src={item.product.images[0].imageUrl}
                          alt={item.product.name || "Product image"}
                          width={800}
                          height={800}
                          className="rounded-xl border shadow-md object-contain w-full max-h-[400px] bg-white"
                        />
                      ) : (
                        <Avatar className="w-full h-64">
                          <AvatarFallback>No Image</AvatarFallback>
                        </Avatar>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col justify-center space-y-3 text-base">
                      <p><b>Name:</b> {item.name}</p>
                      <p><b>Quantity:</b> {item.quantity}</p>
                      <p><b>Price:</b> NPR {item.price.toFixed(2)}</p>
                      <p><b>Subtotal:</b> NPR {(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Order Total */}
        <Card className="mt-6">
          <CardContent className="flex justify-end items-center py-6">
            <div className="text-right text-lg font-bold">
              Total: NPR {order.total.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

export default OrderDetailPage;
