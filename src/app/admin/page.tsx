import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Ticket, Users, CalendarCheck } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

const statusColor: Record<string, string> = {
  PAID: "bg-green-500/10 text-green-400 border-green-500/30",
  PENDING: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  PROCESSING: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  FAILED: "bg-red-500/10 text-red-400 border-red-500/30",
  CANCELLED: "bg-red-500/10 text-red-400 border-red-500/30",
  REFUNDED: "bg-orange-500/10 text-orange-400 border-orange-500/30",
};

export default async function AdminDashboard() {
  const [userCount, eventCount, ticketCount, orderCount, recentOrders] = await Promise.all([
    db.user.count(),
    db.event.count(),
    db.ticket.count(),
    db.order.count(),
    db.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        event: { select: { title: true } },
        items: {
          include: { ticketType: { select: { name: true } } },
        },
      },
    }),
  ]);

  const stats = [
    { label: "Total Users", value: userCount.toLocaleString(), icon: Users },
    { label: "Active Events", value: eventCount.toLocaleString(), icon: CalendarCheck },
    { label: "Tickets Issued", value: ticketCount.toLocaleString(), icon: Ticket },
    { label: "Total Orders", value: orderCount.toLocaleString(), icon: DollarSign },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Dashboard</h2>
        <p className="text-gray-400">Overview of your events platform</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-white/10 bg-white/[0.03]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                {stat.label}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {recentOrders.length > 0 ? (
        <Card className="border-white/10 bg-white/[0.03]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Recent Orders</CardTitle>
            <Link
              href="/admin/orders"
              className="text-sm text-purple-400 hover:text-purple-300"
            >
              View all
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-white truncate">
                      {order.user.firstName || order.user.email}
                    </p>
                    <p className="text-sm text-gray-400">
                      {order.event?.title || "Unknown Event"} — {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="ml-4 flex items-center gap-3">
                    <p className="font-medium text-white">
                      ₹{Number(order.total).toLocaleString("en-IN")}
                    </p>
                    <Badge className={statusColor[order.status] || "bg-gray-500/10 text-gray-400"}>
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-white/10 bg-white/[0.03]">
          <CardHeader>
            <CardTitle className="text-white">Getting Started</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400">
              No data yet. Create your first event to get started.
            </p>
            <div className="mt-4 flex gap-3">
              <Link
                href="/admin/events"
                className="inline-flex items-center rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 px-4 py-2 text-sm font-medium text-white"
              >
                Create Event
              </Link>
              <Link
                href="/admin/landing"
                className="inline-flex items-center rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white hover:bg-white/10"
              >
                Edit Landing Page
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
