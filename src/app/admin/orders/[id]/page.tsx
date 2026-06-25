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
  PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
  PROCESSING: "bg-blue-50 text-blue-700 border-blue-200",
  PAID: "bg-green-50 text-green-700 border-green-200",
  FAILED: "bg-red-50 text-red-700 border-red-200",
  REFUNDED: "bg-orange-50 text-orange-700 border-orange-200",
  CANCELLED: "bg-gray-50 text-gray-600 border-gray-200",
};

const adminCard = "border border-gray-200 bg-white shadow-sm";

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
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/orders">
            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-900">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h2 className="gt-admin-page-title text-2xl">Order Not Found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/orders">
            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-900">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h2 className="gt-admin-page-title text-2xl">Order #{order.id.slice(0, 8)}</h2>
            <p className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleString()}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${statusColor[order.status] || "bg-gray-50 text-gray-600 border-gray-200"}`}
          >
            {order.status}
          </span>
          <Link href={`/admin/orders/${order.id}/edit`}>
            <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
              <Edit className="mr-2 h-4 w-4" /> Edit
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className={`${adminCard} lg:col-span-2`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-4 w-4 text-purple-600" />
              Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="pb-3 font-medium text-muted-foreground">Item</th>
                  <th className="pb-3 font-medium text-muted-foreground">Qty</th>
                  <th className="pb-3 font-medium text-muted-foreground">Price</th>
                  <th className="pb-3 text-right font-medium text-muted-foreground">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100">
                    <td className="py-3 font-medium">{item.ticketType.name}</td>
                    <td className="py-3 text-muted-foreground">{item.quantity}</td>
                    <td className="py-3 text-muted-foreground">
                      {order.currency} {Number(item.unitPrice).toLocaleString()}
                    </td>
                    <td className="py-3 text-right font-medium">
                      {order.currency} {(item.quantity * Number(item.unitPrice)).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} className="pt-4 text-right font-semibold text-muted-foreground">
                    Total
                  </td>
                  <td className="pt-4 text-right text-lg font-bold">
                    {order.currency} {Number(order.total).toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>

            {order.razorpayPaymentId && (
              <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Payment Info
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Payment ID:</span>
                    <p className="mt-0.5 font-mono text-xs text-green-700">
                      {order.razorpayPaymentId}
                    </p>
                  </div>
                  {order.razorpayOrderId && (
                    <div>
                      <span className="text-muted-foreground">Order ID:</span>
                      <p className="mt-0.5 font-mono text-xs text-gray-600">
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
          <Card className={adminCard}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-4 w-4 text-purple-600" />
                Customer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-purple-700">
                  {order.user.firstName?.[0]}
                  {order.user.lastName?.[0]}
                </div>
                <div>
                  <p className="font-medium">
                    {order.user.firstName} {order.user.lastName}
                  </p>
                </div>
              </div>
              <div className="space-y-1.5 border-t border-gray-100 pt-3">
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-3.5 w-3.5" /> {order.user.email}
                </p>
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-3.5 w-3.5" /> {order.user.phone || "—"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className={adminCard}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-purple-600" />
                Event
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="font-medium">{order.event.title}</p>
              <p className="text-muted-foreground">
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
        <Card className={adminCard}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ticket className="h-4 w-4 text-purple-600" />
              Tickets ({order.tickets.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {order.tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50"
                >
                  <div className="flex items-center justify-between bg-purple-50 px-4 pt-4">
                    <div>
                      <p className="text-xs font-semibold text-purple-700">
                        {ticket.ticketType.name}
                      </p>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        {order.event.title.slice(0, 20)}
                      </p>
                    </div>
                    <BarcodeBars value={ticket.barcode} className="h-10" />
                  </div>

                  <div className="space-y-2.5 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Attendee</span>
                      <span className="text-sm font-medium">{ticket.attendeeName}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Barcode</span>
                      <span className="font-mono text-xs text-gray-600">{ticket.barcode}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Status</span>
                      <span
                        className={`rounded-full border px-2 py-0.5 text-xs font-medium ${
                          ticket.status === "ACTIVE"
                            ? "border-green-200 bg-green-50 text-green-700"
                            : "border-red-200 bg-red-50 text-red-700"
                        }`}
                      >
                        {ticket.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Scanned</span>
                      <span
                        className={`text-xs font-medium ${ticket.scanned ? "text-green-700" : "text-muted-foreground"}`}
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
