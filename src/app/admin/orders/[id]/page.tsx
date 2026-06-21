"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarcodeBars } from "@/components/ui/barcode-bars";
import { toast } from "sonner";
import {
  ArrowLeft,
  Edit,
  Loader2,
  Ticket,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  CreditCard,
  Receipt,
} from "lucide-react";

interface OrderDetail {
  id: string;
  status: string;
  subtotal: number;
  total: number;
  currency: string;
  notes: string | null;
  razorpayPaymentId: string | null;
  razorpayOrderId: string | null;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
  };
  event: { id: string; title: string; startDate: string; endDate: string };
  items: {
    id: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    ticketType: { name: string };
  }[];
  tickets: {
    id: string;
    barcode: string;
    status: string;
    attendeeName: string;
    attendeeEmail: string;
    checkedIn: boolean;
    scanned: boolean;
    scannedAt: string | null;
    ticketType: { name: string };
  }[];
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
            <p className="text-sm text-gray-400">{new Date(order.createdAt).toLocaleString()}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${statusColor[order.status] || "bg-gray-500/10 text-gray-400"}`}
          >
            {order.status}
          </span>
          <Link href={`/admin/orders/${order.id}/edit`}>
            <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white">
              <Edit className="mr-2 h-4 w-4" /> Edit
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="border-white/10 bg-white/[0.03] lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Receipt className="h-4 w-4 text-purple-400" />
              Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left">
                  <th className="pb-3 font-medium text-gray-400">Item</th>
                  <th className="pb-3 font-medium text-gray-400">Qty</th>
                  <th className="pb-3 font-medium text-gray-400">Price</th>
                  <th className="pb-3 text-right font-medium text-gray-400">Subtotal</th>
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
                    <td className="py-3 text-right text-white">
                      {order.currency} {(item.quantity * Number(item.unitPrice)).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} className="pt-4 text-right font-semibold text-gray-300">
                    Total
                  </td>
                  <td className="pt-4 text-right text-lg font-bold text-white">
                    {order.currency} {Number(order.total).toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>

            {order.razorpayPaymentId && (
              <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.02] p-4">
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Payment Info
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">Payment ID:</span>
                    <p className="mt-0.5 font-mono text-xs text-green-400">
                      {order.razorpayPaymentId}
                    </p>
                  </div>
                  {order.razorpayOrderId && (
                    <div>
                      <span className="text-gray-500">Order ID:</span>
                      <p className="mt-0.5 font-mono text-xs text-gray-400">
                        {order.razorpayOrderId}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-white/10 bg-white/[0.03]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <User className="h-4 w-4 text-purple-400" />
                Customer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/20 text-xs font-bold text-purple-300">
                  {order.user.firstName?.[0]}
                  {order.user.lastName?.[0]}
                </div>
                <div>
                  <p className="font-medium text-white">
                    {order.user.firstName} {order.user.lastName}
                  </p>
                </div>
              </div>
              <div className="space-y-1.5 border-t border-white/5 pt-3">
                <p className="flex items-center gap-2 text-gray-400">
                  <Mail className="h-3.5 w-3.5" /> {order.user.email}
                </p>
                <p className="flex items-center gap-2 text-gray-400">
                  <Phone className="h-3.5 w-3.5" /> {order.user.phone || "—"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/[0.03]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Calendar className="h-4 w-4 text-purple-400" />
                Event
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="font-medium text-white">{order.event.title}</p>
              <p className="text-gray-400">
                {new Date(order.event.startDate).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {order.tickets.length > 0 && (
        <Card className="border-white/10 bg-white/[0.03]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Ticket className="h-4 w-4 text-purple-400" />
              Tickets ({order.tickets.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {order.tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]"
                >
                  {/* Barcode area */}
                  <div className="flex items-center justify-between bg-gradient-to-r from-purple-900/20 to-transparent px-4 pt-4">
                    <div>
                      <p className="text-xs font-semibold text-purple-400">
                        {ticket.ticketType.name}
                      </p>
                      <p className="text-[10px] uppercase tracking-wider text-gray-500">
                        {order.event.title.slice(0, 20)}
                      </p>
                    </div>
                    <BarcodeBars value={ticket.barcode} className="h-10" />
                  </div>

                  {/* Ticket details */}
                  <div className="space-y-2.5 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Attendee</span>
                      <span className="text-sm font-medium text-white">{ticket.attendeeName}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Barcode</span>
                      <span className="font-mono text-xs text-gray-400">{ticket.barcode}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Status</span>
                      <span
                        className={`rounded-full border px-2 py-0.5 text-xs font-medium ${
                          ticket.status === "ACTIVE"
                            ? "border-green-500/30 bg-green-500/10 text-green-400"
                            : "border-red-500/30 bg-red-500/10 text-red-400"
                        }`}
                      >
                        {ticket.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Scanned</span>
                      <span
                        className={`text-xs font-medium ${ticket.scanned ? "text-green-400" : "text-gray-500"}`}
                      >
                        {ticket.scanned ? "Yes" : "No"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
