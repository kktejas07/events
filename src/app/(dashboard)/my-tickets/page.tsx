export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { headers } from "next/headers";

export default async function MyTicketsPage() {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) return null;

  const tickets = await db.ticket.findMany({
    where: { userId },
    include: { event: true, ticketType: true, order: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="gt-admin-content">
      <h2 className="gt-admin-section-title">My Tickets</h2>
      <p className="gt-admin-section-subtitle">Your booked tickets and event passes</p>

      {tickets.length === 0 ? (
        <div className="gt-admin-card">
          <div className="gt-admin-empty">
            <i className="fa-regular fa-ticket-simple"></i>
            <h3>No tickets yet</h3>
            <p>Browse events and book your first ticket.</p>
            <Link href="/events" className="gt-admin-btn gt-admin-btn-primary">
              <i className="fa-regular fa-calendar-days"></i> Browse Events
            </Link>
          </div>
        </div>
      ) : (
        <div className="gt-admin-grid">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="gt-admin-card">
              <div className="d-flex align-items-start justify-content-between mb-3">
                <div>
                  <h4 style={{ fontSize: "16px", fontWeight: 600, color: "#1a1a2e", margin: 0 }}>{ticket.event?.title || "Event"}</h4>
                  <p style={{ fontSize: "13px", color: "#888", margin: "4px 0 0" }}>{ticket.ticketType?.name || "Ticket"}</p>
                </div>
                <span className={`gt-admin-badge ${ticket.status === "ACTIVE" ? "success" : ticket.status === "CANCELLED" ? "danger" : "neutral"}`}>
                  {ticket.status}
                </span>
              </div>
              <div style={{ fontSize: "13px", color: "#666", lineHeight: 1.6 }}>
                <div><i className="fa-regular fa-user me-2" style={{ width: "16px" }}></i> {ticket.attendeeName}</div>
                <div><i className="fa-regular fa-envelope me-2" style={{ width: "16px" }}></i> {ticket.attendeeEmail}</div>
                <div><i className="fa-regular fa-barcode me-2" style={{ width: "16px" }}></i> {ticket.barcode}</div>
                <div><i className="fa-regular fa-indian-rupee-sign me-2" style={{ width: "16px" }}></i> ₹{Number(ticket.order?.total || 0).toLocaleString("en-IN")}</div>
              </div>
              {ticket.pdfUrl && (
                <div className="mt-3">
                  <a href={ticket.pdfUrl} target="_blank" className="gt-admin-btn gt-admin-btn-outline gt-admin-btn-sm">
                    <i className="fa-regular fa-download"></i> Download PDF
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
