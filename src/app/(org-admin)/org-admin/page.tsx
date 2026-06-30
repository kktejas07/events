import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function OrgAdminPage() {
  const session = await auth();
  const user = session?.user as { id?: string; role?: string; organizationId?: string } | undefined;
  if (!user || !["ADMIN", "SUPER_ADMIN", "ORGANIZATION_ADMIN"].includes(user.role || ""))
    redirect("/login");
  if (!user.organizationId) redirect("/login");

  const [org, eventCount, ticketCount, orderCount, recentOrders] = await Promise.all([
    db.organization.findUnique({ where: { id: user.organizationId } }),
    db.event.count({ where: { organizationId: user.organizationId } }),
    db.ticket.count({ where: { event: { organizationId: user.organizationId } } }),
    db.order.count({ where: { event: { organizationId: user.organizationId } } }),
    db.order.findMany({
      where: { event: { organizationId: user.organizationId } },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        event: { select: { title: true } },
      },
    }),
  ]);

  if (!org) redirect("/login");

  const statusColors: Record<string, string> = {
    PAID: "success",
    PENDING: "warning",
    PROCESSING: "info",
    FAILED: "danger",
    CANCELLED: "danger",
    REFUNDED: "neutral",
  };

  const stats = [
    { label: "Total Events", value: eventCount.toLocaleString(), icon: "fa-calendar-days", color: "blue" },
    { label: "Tickets Sold", value: ticketCount.toLocaleString(), icon: "fa-ticket-simple", color: "green" },
    { label: "Orders", value: orderCount.toLocaleString(), icon: "fa-cart-shopping", color: "orange" },
  ];

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="gt-admin-section-title">{org.name}</h2>
          <p className="gt-admin-section-subtitle">{org.description || "Organization Dashboard"}</p>
        </div>
        <Link href="/org-admin/events" className="gt-admin-btn gt-admin-btn-primary">
          <i className="fa-regular fa-plus"></i> Create Event
        </Link>
      </div>

      <div className="gt-admin-stats-grid">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.label === "Total Events" ? "/org-admin/events" : "/org-admin/orders"} style={{ textDecoration: "none" }}>
            <div className="gt-admin-stat-card">
              <div className={`gt-admin-stat-icon ${stat.color}`}>
                <i className={`fa-regular ${stat.icon}`}></i>
              </div>
              <div>
                <div className="gt-admin-stat-label">{stat.label}</div>
                <div className="gt-admin-stat-value">{stat.value}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {recentOrders.length > 0 ? (
        <div className="gt-admin-card">
          <div className="gt-admin-card-header">
            <h3 className="gt-admin-card-title">Recent Orders</h3>
            <Link href="/org-admin/orders" className="gt-admin-btn gt-admin-btn-outline gt-admin-btn-sm">
              View All
            </Link>
          </div>
          <table className="gt-admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Event</th>
                <th>Status</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o.id}>
                  <td>
                    <strong>{o.user.firstName || o.user.email}</strong>
                    <br />
                    <small style={{ color: "#888" }}>{o.user.email}</small>
                  </td>
                  <td>{o.event?.title || "Unknown"}</td>
                  <td>
                    <span className={`gt-admin-badge ${statusColors[o.status] || "neutral"}`}>
                      {o.status}
                    </span>
                  </td>
                  <td><strong>₹{Number(o.total).toLocaleString("en-IN")}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="gt-admin-card">
          <div className="gt-admin-empty">
            <i className="fa-regular fa-calendar-plus"></i>
            <h3>Getting Started</h3>
            <p>No data yet. Create your first event to get started.</p>
            <Link href="/org-admin/events" className="gt-admin-btn gt-admin-btn-primary">
              <i className="fa-regular fa-plus"></i> Create Event
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
