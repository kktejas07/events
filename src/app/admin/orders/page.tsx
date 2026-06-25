"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<{ id: string; status: string; total: number; createdAt: string; user: { firstName: string; lastName: string; email: string }; event: { title: string } | null; items: { ticketType: { name: string } }[] }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/orders").then((r) => r.json()).then((d) => { setOrders(d.data || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const statusBadge = (s: string) => ({ PAID: "success", PENDING: "warning", PROCESSING: "info", FAILED: "danger", CANCELLED: "danger", REFUNDED: "neutral" }[s] || "neutral");

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="gt-admin-section-title">Orders</h2>
          <p className="gt-admin-section-subtitle">Manage all orders and payments</p>
        </div>
      </div>

      <div className="gt-admin-card">
        {loading ? (
          <div className="text-center py-5"><i className="fa-solid fa-spinner fa-spin" style={{ fontSize: "24px", color: "#8B5CF6" }}></i></div>
        ) : orders.length === 0 ? (
          <div className="gt-admin-empty">
            <i className="fa-regular fa-cart-shopping"></i>
            <h3>No orders yet</h3>
            <p>Orders will appear here when users purchase tickets.</p>
          </div>
        ) : (
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
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <strong>{order.user?.firstName || order.user?.email}</strong>
                    <br /><small style={{ color: "#888" }}>{order.user?.email}</small>
                  </td>
                  <td>{order.event?.title || "Unknown"}</td>
                  <td>{order.items?.map((i) => i.ticketType?.name).join(", ") || "-"}</td>
                  <td><span className={`gt-admin-badge ${statusBadge(order.status)}`}>{order.status}</span></td>
                  <td><strong>₹{Number(order.total).toLocaleString("en-IN")}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
