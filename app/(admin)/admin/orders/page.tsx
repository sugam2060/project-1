"use client";
import React, { useCallback } from "react";
import { updateOrderStatus, fetchOrdersPaginated, deleteOrderWithItems } from "@/actions/productActions/fetchData";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Container from "@/components/main/Container";
import { orderStatusType } from "@/schemas/OrderStatusType";
import { useInfiniteQuery, useQueryClient, InfiniteData } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { Loader, Trash } from "lucide-react";

const statusOptions: orderStatusType[] = ["pending", "processing", "shipped", "delivered", "cancelled"];

// Skeleton loader for orders
function OrdersSkeleton({ length = 5 }: { length?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length }).map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader>
            <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="h-3 w-24 bg-gray-200 rounded" />
            <div className="h-3 w-40 bg-gray-200 rounded" />
            <div className="h-3 w-20 bg-gray-200 rounded" />
            <div className="h-3 w-16 bg-gray-200 rounded" />
            <div className="h-3 w-12 bg-gray-200 rounded" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

type OrderListItem = {
  id: string;
  orderNumber: string;
  user: { name: string; email: string } | null;
  address: { addressLine: string } | null;
  total: number;
  status: string;
  itemsCount: number;
  createdAt: string;
};

const LIMIT = 10;

const OrdersPage = () => {
  const [updating, setUpdating] = React.useState("");
  const [deleting, setDeleting] = React.useState<string>("");
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = React.useState<string>("all");

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<
    { orders: OrderListItem[]; nextCursor: { createdAt: string; id: string } | null; hasNextPage: boolean },
    Error,
    { orders: OrderListItem[]; nextCursor: { createdAt: string; id: string } | null; hasNextPage: boolean },
    [string, { status: string }],
    { createdAt: string; id: string } | undefined
  >({
    queryKey: ["admin-orders", { status: statusFilter }],
    queryFn: async ({ pageParam }: { pageParam?: { createdAt: string; id: string } }) => {
      return fetchOrdersPaginated({
        limit: LIMIT,
        cursor: pageParam ? { createdAt: pageParam.createdAt, id: pageParam.id } : undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
      });
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) =>
      lastPage.nextCursor
        ? { createdAt: lastPage.nextCursor.createdAt, id: lastPage.nextCursor.id }
        : undefined,
  });

  const infiniteData = data as InfiniteData<{ orders: OrderListItem[]; nextCursor: { createdAt: string; id: string } | null; hasNextPage: boolean }> | undefined;
  const allOrders: OrderListItem[] =
    infiniteData?.pages?.flatMap((page) => page.orders) ?? [];

  // Infinite scroll sentinel
  const { ref, inView } = useInView({ threshold: 1, rootMargin: "100px" });
  React.useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleStatusChange = useCallback(async (orderId: string, status: string) => {
    setUpdating(orderId);
    await updateOrderStatus(orderId, status as orderStatusType);
    await queryClient.invalidateQueries({queryKey:["admin-orders"]})
    setUpdating("");
  }, [queryClient]);

  const handleDeleteOrder = useCallback(async (orderId: string) => {
    setDeleting(orderId);
    await deleteOrderWithItems(orderId);
    await queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    setDeleting("");
  }, [queryClient]);

  return (
    <Container className="my-2">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">All Orders</h1>
      <div className="mb-4 flex items-center gap-2">
        <label htmlFor="status-filter" className="font-medium">Status:</label>
        <select
          id="status-filter"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="all">All</option>
          {statusOptions.map(opt => (
            <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
          ))}
        </select>
      </div>
      {isLoading ? (
        <OrdersSkeleton length={LIMIT} />
      ) : (
        <div className="space-y-4">
          {/* Mobile View */}
          <div className="block md:hidden space-y-4">
            {allOrders.length === 0 ? (
              <div className="text-center text-gray-500 py-8">No orders found.</div>
            ) : (
              allOrders.map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                      Order #{order.orderNumber}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div>
                      <b>User:</b> {order.user?.name || "N/A"}
                      <div className="text-xs text-gray-500">{order.user?.email}</div>
                    </div>
                    <div><b>Address:</b> {order.address?.addressLine || "N/A"}</div>
                    <div><b>Total:</b> NPR {order.total.toFixed(2)}</div>
                    <div className="flex flex-col">
                      <label className="font-medium text-sm">Status:</label>
                      <div className="flex flex-row items-center gap-2 mt-1">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          disabled={updating === order.id || order.status === 'cancelled'}
                          className={cn(
                            'border rounded px-2 py-1',
                            order.status === 'cancelled' && 'bg-red-500 text-white',
                            updating === order.id && 'bg-gray-100 text-gray-500'
                          )}
                        >
                          {statusOptions.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                        {order.status === 'cancelled' && (
                          <button onClick={() => handleDeleteOrder(order.id)} disabled={deleting === order.id} className="ml-2 text-red-500 hover:text-red-700">
                            {deleting === order.id ? <Loader className="w-4 h-4 animate-spin" /> : <Trash className="w-4 h-4" />}
                          </button>
                        )}
                      </div>
                      {updating === order.id && (
                        <span className="text-xs text-blue-600 mt-1">Updating...</span>
                      )}
                    </div>
                    <div><b>Items:</b> {order.itemsCount}</div>
                    <Button asChild size="sm" variant="outline" className="mt-2">
                      <Link href={`/admin/orders/${order.orderNumber}`}>View Details</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
            {/* Infinite loader for mobile */}
            {hasNextPage && (
              <div ref={ref} className="flex justify-center items-center p-4">
                {isFetchingNextPage && (
                  <Loader className="animate-spin w-5 h-5 text-blue-300 "/>
                )}
              </div>
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block">
            <Card>
              <CardContent className="p-0 overflow-x-auto">
                <table className="min-w-full border text-sm text-left">
                  <thead>
                    <tr className="bg-gray-100 text-xs uppercase">
                      <th className="p-3 border">Order #</th>
                      <th className="p-3 border">User</th>
                      <th className="p-3 border">Address</th>
                      <th className="p-3 border">Total (NPR)</th>
                      <th className="p-3 border">Status</th>
                      <th className="p-3 border">Items</th>
                      <th className="p-3 border text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allOrders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center text-gray-500 py-8">No orders found.</td>
                      </tr>
                    ) : (
                      allOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50 transition">
                          <td className="p-3 border font-medium">#{order.orderNumber}</td>
                          <td className="p-3 border">
                            {order.user?.name || "N/A"}
                            <div className="text-xs text-gray-500">{order.user?.email}</div>
                          </td>
                          <td className="p-3 border">{order.address?.addressLine || "N/A"}</td>
                          <td className="p-3 border">NPR {order.total.toFixed(2)}</td>
                          <td className="p-3 border">
                            <div className="flex flex-row items-center gap-2">
                              <select
                                value={order.status}
                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                disabled={updating === order.id || order.status === 'cancelled'}
                                className={cn(
                                  'border rounded px-2 py-1',
                                  order.status === 'cancelled' && 'bg-red-500 text-white',
                                  updating === order.id && 'bg-gray-100 text-gray-500'
                                )}
                              >
                                {statusOptions.map((opt) => (
                                  <option key={opt} value={opt}>{opt}</option>
                                ))}
                              </select>
                              {order.status === 'cancelled' && (
                                <button onClick={() => handleDeleteOrder(order.id)} disabled={deleting === order.id} className="ml-2 text-red-500 hover:text-red-700">
                                  {deleting === order.id ? <Loader className="w-4 h-4 animate-spin" /> : <Trash className="w-4 h-4" />}
                                </button>
                              )}
                            </div>
                            {updating === order.id && (
                              <div className="text-xs text-blue-500 mt-1">Updating...</div>
                            )}
                          </td>
                          <td className="p-3 border text-center">{order.itemsCount}</td>
                          <td className="p-3 border text-center">
                            <Button asChild size="sm" variant="outline">
                              <Link href={`/admin/orders/${order.orderNumber}`}>View</Link>
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                {/* Infinite loader for desktop */}
                {hasNextPage && (
                  <div ref={ref} className="flex justify-center items-center p-4">
                    {isFetchingNextPage && (
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-t-transparent border-blue-600" />
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </Container>
  );
};

export default OrdersPage;
