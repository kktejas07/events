import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import type { OrderStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

const statuses = ["ALL", "PENDING", "PAID", "FAILED", "REFUNDED", "CANCELLED"] as const;

const statusColors: Record<string, string> = {
  PAID: "success",
  PENDING: "warning",
  FAILED: "danger",
  REFUNDED: "neutral",
  CANCELLED: "danger",
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

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="gt-admin-section-title">Orders</h2>
          <p className="gt-admin-section-subtitle">Manage orders for your events</p>
        </div>
      </div>

      <div className="mb-3 d-flex gap-1 flex-wrap">
        {statuses.map((s) => {
          const href = s === "ALL" ? "/org-admin/orders" : `/org-admin/orders?status=${s}`;
          const isActive = s === "ALL" ? !status || status === "ALL" : status?.toUpperCase() === s;
          return (
            <a
              key={s}
              href={href}
              className={`gt-admin-btn gt-admin-btn-sm ${isActive ? "gt-admin-btn-primary" : "gt-admin-btn-outline"}`}
            >
              {s.charAt(0) + s.slice(1).toLowerCase()}
            </a>
          );
        })}
      </div>

      <div className="gt-admin-card">
        {orders.length === 0 ? (
          <div className="gt-admin-empty">
            <i className="fa-regular fa-cart-shopping"></i>
            <h3>No orders found</h3>
            <p>Orders will appear here once attendees start purchasing tickets.</p>
          </div>
        ) : (
          <table className="gt-admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Event</th>
                <th>Items</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td style={{ fontFamily: "monospace", fontSize: 12, color: "#888" }}>
                    {o.id.slice(0, 8)}...
                  </td>
                  <td>
                    <strong>{o.user.firstName} {o.user.lastName}</strong>
                    <br />
                    <small style={{ color: "#888" }}>{o.user.email}</small>
                  </td>
                  <td>{o.event.title}</td>
                  <td>{o.items.map((i) => i.ticketType.name).join(", ")}</td>
                  <td><strong>₹{Number(o.total).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</strong></td>
                  <td>
                    <span className={`gt-admin-badge ${statusColors[o.status] || "neutral"}`}>
                      {o.status}
                    </span>
                  </td>
                  <td style={{ color: "#888", fontSize: 13 }}>
                    {new Date(o.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
