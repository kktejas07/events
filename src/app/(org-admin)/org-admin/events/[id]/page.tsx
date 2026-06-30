import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import OrgEventCreatePage from "./OrgEventCreate";

export const dynamic = "force-dynamic";

export default async function OrgEventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  const user = session?.user as { id?: string; role?: string; organizationId?: string } | undefined;
  if (!user?.organizationId) redirect("/login");

  if (id === "new") {
    return <OrgEventCreatePage />;
  }

  const event = await db.event.findFirst({
    where: { id, organizationId: user.organizationId },
    include: {
      ticketTypes: true,
      venue: true,
      _count: { select: { orders: true, tickets: true } },
    },
  });
  if (!event) redirect("/org-admin/events");

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center gap-3">
          <Link href="/org-admin/events" className="gt-admin-btn gt-admin-btn-outline gt-admin-btn-sm">
            <i className="fa-regular fa-arrow-left"></i> Back
          </Link>
          <div>
            <h2 className="gt-admin-section-title">{event.title}</h2>
            {event.shortDescription && (
              <p className="gt-admin-section-subtitle">{event.shortDescription}</p>
            )}
          </div>
        </div>
        <div className="d-flex align-items-center gap-2">
          <Link
            href={`/org-admin/events/${id}/edit`}
            className="gt-admin-btn gt-admin-btn-outline gt-admin-btn-sm"
          >
            <i className="fa-regular fa-pen-to-square"></i> Edit
          </Link>
          <span className={`gt-admin-badge ${event.status === "PUBLISHED" ? "success" : "warning"}`}>
            {event.status}
          </span>
        </div>
      </div>

      <div className="gt-admin-stats-grid">
        <div className="gt-admin-stat-card">
          <div className="gt-admin-stat-icon blue">
            <i className="fa-regular fa-calendar-days"></i>
          </div>
          <div>
            <div className="gt-admin-stat-label">Start</div>
            <div className="gt-admin-stat-value">{new Date(event.startDate).toLocaleDateString()}</div>
          </div>
        </div>
        <div className="gt-admin-stat-card">
          <div className="gt-admin-stat-icon orange">
            <i className="fa-regular fa-clock"></i>
          </div>
          <div>
            <div className="gt-admin-stat-label">End</div>
            <div className="gt-admin-stat-value">{new Date(event.endDate).toLocaleDateString()}</div>
          </div>
        </div>
        <div className="gt-admin-stat-card">
          <div className="gt-admin-stat-icon green">
            <i className="fa-regular fa-ticket-simple"></i>
          </div>
          <div>
            <div className="gt-admin-stat-label">Tickets Sold</div>
            <div className="gt-admin-stat-value">{event._count.tickets}</div>
          </div>
        </div>
        <div className="gt-admin-stat-card">
          <div className="gt-admin-stat-icon purple">
            <i className="fa-regular fa-cart-shopping"></i>
          </div>
          <div>
            <div className="gt-admin-stat-label">Orders</div>
            <div className="gt-admin-stat-value">{event._count.orders}</div>
          </div>
        </div>
      </div>

      {event.ticketTypes.length > 0 && (
        <div className="gt-admin-card mt-4">
          <div className="gt-admin-card-header">
            <h3 className="gt-admin-card-title">Ticket Types</h3>
          </div>
          <table className="gt-admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Sold</th>
                <th>Limit</th>
              </tr>
            </thead>
            <tbody>
              {event.ticketTypes.map((t) => (
                <tr key={t.id}>
                  <td><strong>{t.name}</strong></td>
                  <td>₹{Number(t.price).toLocaleString()}</td>
                  <td>{t.quantitySold}</td>
                  <td>{t.quantityLimit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
