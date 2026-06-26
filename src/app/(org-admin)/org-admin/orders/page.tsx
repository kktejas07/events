import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { ShoppingCart, Search, Download, Filter } from "lucide-react";
import type { OrderStatus } from "@prisma/client";

const statuses = ["ALL", "PENDING", "PAID", "FAILED", "REFUNDED", "CANCELLED"] as const;

const statusBadge: Record<string, string> = {
  PAID: "bg-purple-500/10 text-purple-400",
  PENDING: "bg-orange-500/10 text-orange-400",
  FAILED: "bg-red-500/10 text-red-400",
  REFUNDED: "bg-gray-500/10 text-gray-400",
  CANCELLED: "bg-gray-500/10 text-gray-400",
};

export default async function OrgOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const session = await auth();
  const user = session?.user as { id?: string; role?: string; organizationId?: string } | undefined;
  if (!user?.organizationId) redirect("/login");

  const { status } = await searchParams;
  const statusFilter = status && status !== "ALL" ? (status.toUpperCase() as OrderStatus) : undefined;

  const orders = await db.order.findMany({
    where: {
      event: { organizationId: user.organizationId },
      ...(statusFilter ? { status: statusFilter } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      user: { select: { firstName: true, lastName: true, email: true } },
      event: { select: { title: true } },
      items: { include: { ticketType: { select: { name: true } } } },
    },
  });

  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  const formatAmount = (n: number) =>
    "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const truncateId = (id: string) => id.slice(0, 8) + "...";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Orders</h2>
        <div className="flex items-center gap-2 text-gray-400">
          <Search className="h-4 w-4" />
          <Download className="h-4 w-4" />
          <Filter className="h-4 w-4" />
        </div>
      </div>

      <div className="flex items-center gap-1 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-1 backdrop-blur-xl">
        {statuses.map((s) => {
          const href = s === "ALL" ? "/org-admin/orders" : `/org-admin/orders?status=${s}`;
          const isActive =
            s === "ALL" ? !status || status === "ALL" : status?.toUpperCase() === s;
          return (
            <a
              key={s}
              href={href}
              className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-colors ${
                isActive
                  ? "bg-white/[0.08] text-white"
                  : "text-gray-500 hover:text-white"
              }`}
            >
              {s.charAt(0) + s.slice(1).toLowerCase()}
            </a>
          );
        })}
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.02] py-16">
          <ShoppingCart className="mb-3 h-10 w-10 text-gray-600" />
          <p className="text-sm text-gray-500">No orders found</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] text-xs text-gray-500">
                <th className="px-4 py-3 font-medium">Order ID</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Event</th>
                <th className="px-4 py-3 font-medium">Items</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr
                  key={o.id}
                  className="border-b border-white/[0.04] text-white last:border-0 hover:bg-white/[0.02]"
                >
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">
                    {truncateId(o.id)}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium">
                      {o.user.firstName} {o.user.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{o.user.email}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-400">{o.event.title}</td>
                  <td className="px-4 py-3 text-gray-400">
                    {o.items.map((i) => i.ticketType.name).join(", ")}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {formatAmount(Number(o.total))}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        statusBadge[o.status] || "bg-gray-500/10 text-gray-400"
                      }`}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {formatDate(new Date(o.createdAt))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
