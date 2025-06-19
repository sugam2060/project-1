"use client";
import React, { useEffect, useState, type FC } from "react";
import { fetchAllOrders, updateOrderStatus } from "@/actions/productActions/fetchData";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import clsx from "clsx";

const statusOptions = ["pending", "processing", "shipped", "delivered", "cancelled"];

type OrderListItem = {
  id: string;
  orderNumber: string;
  user: { name: string; email: string } | null;
  address: { addressLine: string } | null;
  total: number;
  status: string;
  itemsCount: number;
};

const OrdersPage: FC = () => {
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState("");

  useEffect(() => {
    fetchAllOrders()
      .then((data: OrderListItem[]) => setOrders(data))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (orderId: string, status: string) => {
    setUpdating(orderId);
    await updateOrderStatus(orderId, status);
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status } : order))
    );
    setUpdating("");
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 font-sans">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">All Orders</h1>

      {loading ? (
        <div className="min-h-[200px] flex items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-t-transparent border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Mobile View */}
          <div className="block md:hidden space-y-4">
            {orders.map((order) => (
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
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      disabled={updating === order.id}
                      className="border rounded px-2 py-1 mt-1"
                    >
                      {statusOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
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
            ))}
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
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50 transition">
                        <td className="p-3 border font-medium">#{order.orderNumber}</td>
                        <td className="p-3 border">
                          {order.user?.name || "N/A"}
                          <div className="text-xs text-gray-500">{order.user?.email}</div>
                        </td>
                        <td className="p-3 border">{order.address?.addressLine || "N/A"}</td>
                        <td className="p-3 border">NPR {order.total.toFixed(2)}</td>
                        <td className="p-3 border">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            disabled={updating === order.id}
                            className={clsx(
                              "border rounded px-2 py-1",
                              updating === order.id && "bg-gray-100 text-gray-500"
                            )}
                          >
                            {statusOptions.map((opt) => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
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
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
