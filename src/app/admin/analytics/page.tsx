import { db } from "@/lib/db";
import type { OrderStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

const statusColors: Record<string, string> = {
  PAID: "success",
  PENDING: "warning",
  PROCESSING: "info",
  FAILED: "danger",
  CANCELLED: "danger",
  REFUNDED: "neutral",
};

export default async function AdminAnalyticsPage() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const [
    ordersThisMonth,
    ordersLastMonth,
    revenueThisMonth,
    revenueLastMonth,
    totalTickets,
    ticketsToday,
    scannedTickets,
    activeEvents,
    revenueByEvent,
    ordersByStatus,
    recentOrders,
  ] = await Promise.all([
    db.order.count({ where: { createdAt: { gte: startOfMonth } } }),
    db.order.count({ where: { createdAt: { gte: startOfLastMonth, lt: startOfMonth } } }),
    db.order.aggregate({
      where: { status: "PAID", createdAt: { gte: startOfMonth } },
      _sum: { total: true },
    }),
    db.order.aggregate({
      where: { status: "PAID", createdAt: { gte: startOfLastMonth, lt: startOfMonth } },
      _sum: { total: true },
    }),
    db.ticket.count(),
    db.ticket.count({ where: { createdAt: { gte: startOfToday } } }),
    db.ticket.count({ where: { scanned: true } }),
    db.event.count({ where: { status: "PUBLISHED" } }),
    db.order.groupBy({
      by: ["eventId"],
      where: { status: "PAID" },
      _sum: { total: true },
      orderBy: { _sum: { total: "desc" } },
      take: 5,
    }),
    db.order.groupBy({
      by: ["status"],
      _count: { id: true },
    }),
    db.order.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        event: { select: { title: true } },
      },
    }),
  ]);

  const eventIds = revenueByEvent.map((r) => r.eventId);
  const events = eventIds.length > 0
    ? await db.event.findMany({ where: { id: { in: eventIds } }, select: { id: true, title: true } })
    : [];
  const eventMap = new Map(events.map((e) => [e.id, e.title]));

  const revenueThisMonthVal = Number(revenueThisMonth._sum.total || 0);
  const revenueLastMonthVal = Number(revenueLastMonth._sum.total || 0);
  const revenueGrowth = revenueLastMonthVal > 0
    ? ((revenueThisMonthVal - revenueLastMonthVal) / revenueLastMonthVal * 100).toFixed(1)
    : revenueThisMonthVal > 0 ? "100" : "0";

  const orderGrowth = ordersLastMonth > 0
    ? ((ordersThisMonth - ordersLastMonth) / ordersLastMonth * 100).toFixed(1)
    : ordersThisMonth > 0 ? "100" : "0";

  const checkInRate = totalTickets > 0 ? ((scannedTickets / totalTickets) * 100).toFixed(1) : "0";
  const maxRevenue = Math.max(...revenueByEvent.map((r) => Number(r._sum.total || 0)), 1);

  const statusOrder: OrderStatus[] = ["PAID", "PENDING", "PROCESSING", "FAILED", "CANCELLED", "REFUNDED"];
  const statusCounts = new Map(ordersByStatus.map((s) => [s.status, s._count.id]));

  const kpis = [
    {
      label: "Revenue (This Month)",
      value: `₹${revenueThisMonthVal.toLocaleString("en-IN")}`,
      sub: `${revenueGrowth}% vs last month`,
      icon: "fa-indian-rupee-sign",
      color: "purple",
    },
    {
      label: "Tickets Sold",
      value: totalTickets.toLocaleString(),
      sub: `${ticketsToday} today`,
      icon: "fa-ticket-simple",
      color: "green",
    },
    {
      label: "Active Events",
      value: activeEvents.toLocaleString(),
      sub: `${ordersThisMonth} orders this month`,
      icon: "fa-calendar-days",
      color: "blue",
    },
    {
      label: "Check-in Rate",
      value: `${checkInRate}%`,
      sub: `${scannedTickets} of ${totalTickets} scanned`,
      icon: "fa-qrcode",
      color: "orange",
    },
  ];

  return (
    <div>
      <h2 className="gt-admin-section-title">Analytics</h2>
      <p className="gt-admin-section-subtitle">Platform performance and revenue insights</p>

      <div className="gt-admin-stats-grid">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="gt-admin-stat-card">
            <div className={`gt-admin-stat-icon ${kpi.color}`}>
              <i className={`fa-regular ${kpi.icon}`}></i>
            </div>
            <div>
              <div className="gt-admin-stat-label">{kpi.label}</div>
              <div className="gt-admin-stat-value">{kpi.value}</div>
              <div style={{ fontSize: "12px", color: "#888", marginTop: "2px" }}>{kpi.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
        <div className="gt-admin-card">
          <div className="gt-admin-card-header">
            <h3 className="gt-admin-card-title">Revenue by Event</h3>
          </div>
          {revenueByEvent.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {revenueByEvent.map((r) => {
                const val = Number(r._sum.total || 0);
                const pct = (val / maxRevenue) * 100;
                return (
                  <div key={r.eventId}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "4px" }}>
                      <span style={{ fontWeight: 600, color: "#333" }}>{eventMap.get(r.eventId) || "Unknown"}</span>
                      <span style={{ fontWeight: 700, color: "#1a1a2e" }}>₹{val.toLocaleString("en-IN")}</span>
                    </div>
                    <div style={{ height: "8px", background: "#f0f0f0", borderRadius: "4px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg, #1539EE, #818CF8)", borderRadius: "4px", transition: "width 0.3s ease" }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="gt-admin-empty">
              <i className="fa-regular fa-chart-simple"></i>
              <h3>No revenue data</h3>
              <p>Revenue data will appear when orders are completed.</p>
            </div>
          )}
        </div>

        <div className="gt-admin-card">
          <div className="gt-admin-card-header">
            <h3 className="gt-admin-card-title">Orders by Status</h3>
          </div>
          {ordersByStatus.length > 0 ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
              {statusOrder.map((status) => {
                const count = statusCounts.get(status) || 0;
                return (
                  <div
                    key={status}
                    style={{
                      flex: "1 1 calc(50% - 12px)",
                      minWidth: "140px",
                      padding: "16px",
                      borderRadius: "12px",
                      background: "#f8f9fe",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span className={`gt-admin-badge ${statusColors[status] || "neutral"}`}>
                      {status}
                    </span>
                    <span style={{ fontSize: "20px", fontWeight: 700, color: "#1a1a2e" }}>
                      {count}
                    </span>
                  </div>
                );
              })}
              {ordersByStatus.filter((s) => !statusOrder.includes(s.status)).map((s) => (
                <div
                  key={s.status}
                  style={{
                    flex: "1 1 calc(50% - 12px)",
                    minWidth: "140px",
                    padding: "16px",
                    borderRadius: "12px",
                    background: "#f8f9fe",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span className={`gt-admin-badge ${statusColors[s.status] || "neutral"}`}>
                    {s.status}
                  </span>
                  <span style={{ fontSize: "20px", fontWeight: 700, color: "#1a1a2e" }}>
                    {s._count.id}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="gt-admin-empty">
              <i className="fa-regular fa-cart-shopping"></i>
              <h3>No orders yet</h3>
              <p>Orders will appear when users make purchases.</p>
            </div>
          )}
        </div>
      </div>

      <div className="gt-admin-card">
        <div className="gt-admin-card-header">
          <h3 className="gt-admin-card-title">Recent Orders</h3>
        </div>
        {recentOrders.length > 0 ? (
          <table className="gt-admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Event</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
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
                    <strong>₹{Number(order.total).toLocaleString("en-IN")}</strong>
                  </td>
                  <td>
                    <span className={`gt-admin-badge ${statusColors[order.status] || "neutral"}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: "13px", color: "#888" }}>
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="gt-admin-empty">
            <i className="fa-regular fa-cart-shopping"></i>
            <h3>No orders yet</h3>
            <p>Orders will appear when users make purchases.</p>
          </div>
        )}
      </div>
    </div>
  );
}
