import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2 } from "lucide-react";
import Link from "next/link";

const statusColor: Record<string, string> = {
  PENDING: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  PROCESSING: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  PAID: "bg-green-500/10 text-green-400 border-green-500/30",
  FAILED: "bg-red-500/10 text-red-400 border-red-500/30",
  REFUNDED: "bg-orange-500/10 text-orange-400 border-orange-500/30",
  CANCELLED: "bg-gray-500/10 text-gray-400 border-gray-500/30",
};

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await db.order.findMany({
    include: {
      user: { select: { firstName: true, lastName: true, email: true } },
      event: { select: { title: true } },
      items: {
        include: { ticketType: { select: { name: true, currency: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Orders</h2>
          <p className="text-gray-400">All orders ({orders.length} total)</p>
        </div>
      </div>

      <Card className="border-white/10 bg-white/[0.03] backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <p className="text-gray-400">No orders yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-left">
                    <th className="pb-3 font-medium text-gray-300">Order ID</th>
                    <th className="pb-3 font-medium text-gray-300">Customer</th>
                    <th className="pb-3 font-medium text-gray-300">Event</th>
                    <th className="pb-3 font-medium text-gray-300">Items</th>
                    <th className="pb-3 font-medium text-gray-300">Total</th>
                    <th className="pb-3 font-medium text-gray-300">Status</th>
                    <th className="pb-3 font-medium text-gray-300">Date</th>
                    <th className="pb-3 font-medium text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-white/5 last:border-0">
                      <td className="py-3 pr-4 font-mono text-xs text-gray-400">
                        {order.id.slice(0, 8)}...
                      </td>
                      <td className="py-3 pr-4">
                        <span className="text-white">
                          {order.user.firstName} {order.user.lastName}
                        </span>
                        <div className="text-xs text-gray-500">{order.user.email}</div>
                      </td>
                      <td className="py-3 pr-4 text-gray-300">{order.event.title}</td>
                      <td className="py-3 pr-4">
                        {order.items.map((item) => (
                          <div key={item.id} className="text-gray-300">
                            {item.ticketType.name} x{item.quantity}
                          </div>
                        ))}
                      </td>
                      <td className="py-3 pr-4 text-gray-300">
                        {order.currency} {Number(order.total).toLocaleString()}
                      </td>
                      <td className="py-3 pr-4">
                        <span
                          className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusColor[order.status] || "bg-gray-500/10 text-gray-400"}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-1">
                          <Link href={`/admin/orders/${order.id}`}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-400 hover:bg-white/10 hover:text-white"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                          </Link>
                          <Link href={`/admin/orders/${order.id}/edit`}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-400 hover:bg-purple-500/10 hover:text-purple-400"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-400 hover:bg-red-500/10 hover:text-red-400"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
