import { db } from "@/lib/db";
import Link from "next/link";

export const dynamic = "force-dynamic";

const statusColors: Record<string, string> = {
  PAID: "success",
  PENDING: "warning",
  PROCESSING: "info",
  FAILED: "danger",
  CANCELLED: "danger",
  REFUNDED: "neutral",
};

export default async function AdminDashboard() {
  const [userCount, eventCount, ticketCount, orderCount, recentOrders] =
    await Promise.all([
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
          items: { include: { ticketType: { select: { name: true } } } },
        },
      }),
    ]);

  const stats = [
    { label: "Total Users", value: userCount.toLocaleString(), icon: "fa-users", color: "purple" },
    { label: "Active Events", value: eventCount.toLocaleString(), icon: "fa-calendar-days", color: "blue" },
    { label: "Tickets Issued", value: ticketCount.toLocaleString(), icon: "fa-ticket-simple", color: "green" },
    { label: "Total Orders", value: orderCount.toLocaleString(), icon: "fa-cart-shopping", color: "orange" },
  ];

  return (
    <div>
      <h2 className="gt-admin-section-title">Dashboard</h2>
      <p className="gt-admin-section-subtitle">Overview of your events platform</p>

      <div className="gt-admin-stats-grid">
        {stats.map((stat) => (
          <div key={stat.label} className="gt-admin-stat-card">
            <div className={`gt-admin-stat-icon ${stat.color}`}>
              <i className={`fa-regular ${stat.icon}`}></i>
            </div>
            <div>
              <div className="gt-admin-stat-label">{stat.label}</div>
              <div className="gt-admin-stat-value">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {recentOrders.length > 0 ? (
        <div className="gt-admin-card">
          <div className="gt-admin-card-header">
            <h3 className="gt-admin-card-title">Recent Orders</h3>
            <Link href="/admin/orders" className="gt-admin-btn gt-admin-btn-outline gt-admin-btn-sm">
              View All
            </Link>
          </div>
          <table className="gt-admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Event</th>
                <th>Items</th>
                <th>Status</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <strong>{order.user.firstName || order.user.email}</strong>
                    <br />
                    <small style={{ color: "#888" }}>{order.user.email}</small>
                  </td>
                  <td>{order.event?.title || "Unknown"}</td>
                  <td>
                    {order.items.map((item) => item.ticketType.name).join(", ")}
                  </td>
                  <td>
                    <span className={`gt-admin-badge ${statusColors[order.status] || "neutral"}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <strong>₹{Number(order.total).toLocaleString("en-IN")}</strong>
                  </td>
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
            <div className="d-flex justify-content-center gap-3">
              <Link href="/admin/events" className="gt-admin-btn gt-admin-btn-primary">
                <i className="fa-regular fa-plus"></i> Create Event
              </Link>
              <Link href="/admin/landing" className="gt-admin-btn gt-admin-btn-outline">
                <i className="fa-regular fa-globe"></i> Edit Landing Page
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
