"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Edit, Loader2 } from "lucide-react";

interface OrderDetail {
  id: string;
  status: string;
  total: number;
  currency: string;
  notes: string | null;
  createdAt: string;
  user: { firstName: string; lastName: string; email: string; phone: string | null };
  event: { id: string; title: string };
  items: { id: string; ticketType: { name: string }; quantity: number; unitPrice: number }[];
  tickets: { id: string; barcode: string; status: string; ticketType: { name: string } }[];
}

const statusColor: Record<string, string> = {
  PENDING: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  PROCESSING: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  PAID: "bg-green-500/10 text-green-400 border-green-500/30",
  FAILED: "bg-red-500/10 text-red-400 border-red-500/30",
  REFUNDED: "bg-orange-500/10 text-orange-400 border-orange-500/30",
  CANCELLED: "bg-gray-500/10 text-gray-400 border-gray-500/30",
};

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/orders/${params.id}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setOrder(json.data);
        else toast.error(json.error || "Failed to load order");
      })
      .catch(() => toast.error("Network error"))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/orders">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h2 className="text-2xl font-bold text-white">Order Not Found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/orders">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-white">Order #{order.id.slice(0, 8)}</h2>
            <p className="text-gray-400">{new Date(order.createdAt).toLocaleString()}</p>
          </div>
        </div>
        <Link href={`/admin/orders/${order.id}/edit`}>
          <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white">
            <Edit className="mr-2 h-4 w-4" /> Edit Order
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-white/10 bg-white/[0.03]">
          <CardHeader>
            <CardTitle className="text-white">Customer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <span className="text-gray-400">Name:</span>{" "}
              <span className="text-white">
                {order.user.firstName} {order.user.lastName}
              </span>
            </p>
            <p>
              <span className="text-gray-400">Email:</span>{" "}
              <span className="text-white">{order.user.email}</span>
            </p>
            <p>
              <span className="text-gray-400">Phone:</span>{" "}
              <span className="text-white">{order.user.phone || "—"}</span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/[0.03]">
          <CardHeader>
            <CardTitle className="text-white">Event</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <span className="text-gray-400">Event:</span>{" "}
              <span className="text-white">{order.event.title}</span>
            </p>
            <p>
              <span className="text-gray-400">Status:</span>{" "}
              <span
                className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusColor[order.status] || "bg-gray-500/10 text-gray-400"}`}
              >
                {order.status}
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-white/10 bg-white/[0.03]">
        <CardHeader>
          <CardTitle className="text-white">Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left">
                <th className="pb-3 font-medium text-gray-400">Item</th>
                <th className="pb-3 font-medium text-gray-400">Qty</th>
                <th className="pb-3 font-medium text-gray-400">Unit Price</th>
                <th className="pb-3 font-medium text-gray-400">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id} className="border-b border-white/5">
                  <td className="py-3 text-white">{item.ticketType.name}</td>
                  <td className="py-3 text-gray-300">{item.quantity}</td>
                  <td className="py-3 text-gray-300">
                    {order.currency} {Number(item.unitPrice).toLocaleString()}
                  </td>
                  <td className="py-3 text-white">
                    {order.currency} {(item.quantity * Number(item.unitPrice)).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} className="pt-3 text-right font-medium text-gray-400">
                  Total:
                </td>
                <td className="pt-3 font-bold text-white">
                  {order.currency} {Number(order.total).toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
        </CardContent>
      </Card>

      {order.tickets.length > 0 && (
        <Card className="border-white/10 bg-white/[0.03]">
          <CardHeader>
            <CardTitle className="text-white">Tickets ({order.tickets.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left">
                  <th className="pb-3 font-medium text-gray-400">Ticket</th>
                  <th className="pb-3 font-medium text-gray-400">Type</th>
                  <th className="pb-3 font-medium text-gray-400">Barcode</th>
                  <th className="pb-3 font-medium text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {order.tickets.map((ticket) => (
                  <tr key={ticket.id} className="border-b border-white/5">
                    <td className="py-3 text-white">{ticket.id.slice(0, 8)}</td>
                    <td className="py-3 text-gray-300">{ticket.ticketType.name}</td>
                    <td className="py-3 font-mono text-xs text-gray-400">{ticket.barcode}</td>
                    <td className="py-3">
                      <span
                        className={`inline-block rounded-full border px-2 py-0.5 text-xs font-medium ${ticket.status === "ACTIVE" ? "border-green-500/30 bg-green-500/10 text-green-400" : "border-red-500/30 bg-red-500/10 text-red-400"}`}
                      >
                        {ticket.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
