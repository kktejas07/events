import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Calendar, Ticket, ShoppingCart, Users, Plus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

async function getOrgData(orgId: string) {
  const [org, eventCount, ticketCount, orderCount, recentOrders] = await Promise.all([
    db.organization.findUnique({ where: { id: orgId } }),
    db.event.count({ where: { organizationId: orgId } }),
    db.ticket.count({ where: { event: { organizationId: orgId } } }),
    db.order.count({ where: { event: { organizationId: orgId } } }),
    db.order.findMany({
      where: { event: { organizationId: orgId } },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        event: { select: { title: true } },
      },
    }),
  ]);
  return { org, eventCount, ticketCount, orderCount, recentOrders };
}

export default async function OrgAdminPage() {
  const session = await auth();
  const user = session?.user as { id?: string; role?: string; organizationId?: string } | undefined;
  if (!user || !["ADMIN", "SUPER_ADMIN", "ORGANIZATION_ADMIN"].includes(user.role || ""))
    redirect("/login");
  if (!user.organizationId) redirect("/login");

  const data = await getOrgData(user.organizationId);
  if (!data.org) redirect("/login");

  const stats = [
    {
      label: "Total Events",
      value: data.eventCount,
      icon: Calendar,
      href: "/org-admin/events",
      color: "from-purple-500 to-indigo-500",
    },
    {
      label: "Tickets Sold",
      value: data.ticketCount,
      icon: Ticket,
      href: "/org-admin/tickets",
      color: "from-sky-500 to-blue-500",
    },
    {
      label: "Orders",
      value: data.orderCount,
      icon: ShoppingCart,
      href: "/org-admin/orders",
      color: "from-fuchsia-500 to-purple-500",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">{data.org.name}</h2>
          <p className="text-sm text-gray-400">
            {data.org.description || "Organization Dashboard"}
          </p>
        </div>
        <Link href="/org-admin/events">
          <Button className="gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700">
            <Plus className="h-4 w-4" />
            Create Event
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link key={s.label} href={s.href}>
              <div className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur-xl transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.06] hover:shadow-xl hover:shadow-purple-500/5">
                <div
                  className={`absolute -right-6 -top-6 h-16 w-16 rounded-full bg-gradient-to-br ${s.color} opacity-10 blur-xl`}
                />
                <div className="relative flex items-center gap-4">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${s.color} shadow-lg`}
                  >
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{s.value}</p>
                    <p className="text-xs text-gray-500">{s.label}</p>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Recent Orders</h3>
          <Link
            href="/org-admin/orders"
            className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300"
          >
            View All <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        {data.recentOrders.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-500">No orders yet</p>
        ) : (
          <div className="space-y-2">
            {data.recentOrders.map((o) => (
              <div
                key={o.id}
                className="flex items-center justify-between rounded-xl border border-white/[0.04] bg-white/[0.02] px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-white">{o.event.title}</p>
                  <p className="text-xs text-gray-500">
                    {o.user.firstName} {o.user.lastName} &middot; {o.user.email}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-white">
                    &rsaquo;{Number(o.total).toLocaleString()}
                  </p>
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      o.status === "PAID"
                        ? "bg-purple-500/10 text-purple-400"
                        : o.status === "PENDING"
                          ? "bg-orange-500/10 text-orange-400"
                          : o.status === "FAILED"
                            ? "bg-red-500/10 text-red-400"
                            : "bg-gray-500/10 text-gray-400"
                    }`}
                  >
                    {o.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
