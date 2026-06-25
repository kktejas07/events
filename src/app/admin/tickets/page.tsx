"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<{ id: string; status: string; barcode: string; attendeeName: string; attendeeEmail: string; scanned: boolean; event: { title: string } | null; ticketType: { name: string } | null; order: { total: number } | null }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/tickets").then((r) => r.json()).then((d) => { setTickets(d.data || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const statusBadge = (s: string) => ({ ACTIVE: "success", CANCELLED: "danger", TRANSFERRED: "info", REFUNDED: "neutral" }[s] || "neutral");

  async function revokeTicket(id: string) {
    if (!window.confirm("Revoke this ticket?")) return;
    await fetch(`/api/admin/tickets/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "CANCELLED" }) });
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status: "CANCELLED" } : t)));
  }

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="gt-admin-section-title">Tickets</h2>
          <p className="gt-admin-section-subtitle">Manage all issued tickets</p>
        </div>
      </div>

      <div className="gt-admin-card">
        {loading ? (
          <div className="text-center py-5"><i className="fa-solid fa-spinner fa-spin" style={{ fontSize: "24px", color: "#8B5CF6" }}></i></div>
        ) : tickets.length === 0 ? (
          <div className="gt-admin-empty">
            <i className="fa-regular fa-ticket-simple"></i>
            <h3>No tickets issued</h3>
            <p>Tickets will appear here when users make purchases.</p>
          </div>
        ) : (
          <table className="gt-admin-table">
            <thead>
              <tr>
                <th>Attendee</th>
                <th>Event</th>
                <th>Type</th>
                <th>Barcode</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td>
                    <strong>{ticket.attendeeName}</strong>
                    <br /><small style={{ color: "#888" }}>{ticket.attendeeEmail}</small>
                  </td>
                  <td>{ticket.event?.title || "Unknown"}</td>
                  <td>{ticket.ticketType?.name || "-"}</td>
                  <td><code style={{ fontSize: "11px", background: "#f0f0f0", padding: "2px 6px", borderRadius: "4px" }}>{ticket.barcode}</code></td>
                  <td><span className={`gt-admin-badge ${statusBadge(ticket.status)}`}>{ticket.status}</span></td>
                  <td>
                    {ticket.status === "ACTIVE" && (
                      <button onClick={() => revokeTicket(ticket.id)} className="gt-admin-btn gt-admin-btn-outline gt-admin-btn-sm" style={{ borderColor: "#EF4444", color: "#EF4444" }}>
                        <i className="fa-regular fa-ban"></i> Revoke
                      </button>
                    )}
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
