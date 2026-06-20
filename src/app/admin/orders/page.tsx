import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const statusColor: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  PROCESSING: "bg-blue-100 text-blue-700",
  PAID: "bg-green-100 text-green-700",
  FAILED: "bg-red-100 text-red-700",
  REFUNDED: "bg-orange-100 text-orange-700",
  CANCELLED: "bg-gray-100 text-gray-700",
};

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await db.order.findMany({
    include: {
      user: { select: { firstName: true, lastName: true, email: true } },
      event: { select: { title: true } },
      items: { include: { ticketType: { select: { name: true, currency: true } } } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Orders</h2>
          <p className="text-muted-foreground">All orders ({orders.length} total)</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <p className="text-muted-foreground">No orders yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 font-medium">Order ID</th>
                    <th className="pb-3 font-medium">Customer</th>
                    <th className="pb-3 font-medium">Event</th>
                    <th className="pb-3 font-medium">Items</th>
                    <th className="pb-3 font-medium">Total</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b last:border-0">
                      <td className="py-3 pr-4 font-mono text-xs">{order.id.slice(0, 8)}...</td>
                      <td className="py-3 pr-4">
                        {order.user.firstName} {order.user.lastName}
                        <div className="text-xs text-muted-foreground">{order.user.email}</div>
                      </td>
                      <td className="py-3 pr-4">{order.event.title}</td>
                      <td className="py-3 pr-4">
                        {order.items.map((item) => (
                          <div key={item.id}>
                            {item.ticketType.name} x{item.quantity}
                          </div>
                        ))}
                      </td>
                      <td className="py-3 pr-4">
                        {order.currency} {Number(order.total).toLocaleString()}
                      </td>
                      <td className="py-3 pr-4">
                        <Badge className={statusColor[order.status]}>{order.status}</Badge>
                      </td>
                      <td className="py-3 text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
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
