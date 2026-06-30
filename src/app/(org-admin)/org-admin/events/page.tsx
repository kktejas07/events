import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function OrgEventsPage() {
  const session = await auth();
  const user = session?.user as { id?: string; role?: string; organizationId?: string } | undefined;
  if (!user?.organizationId) redirect("/login");

  const events = await db.event.findMany({
    where: { organizationId: user.organizationId },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { ticketTypes: true, orders: true } } },
  });

  const statusBadge = (s: string) =>
    ({ PUBLISHED: "success", DRAFT: "warning", CANCELLED: "danger", COMPLETED: "info" }[s] || "neutral");

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="gt-admin-section-title">My Events</h2>
          <p className="gt-admin-section-subtitle">Manage your organization events</p>
        </div>
        <Link href="/org-admin/events/new" className="gt-admin-btn gt-admin-btn-primary">
          <i className="fa-regular fa-plus"></i> New Event
        </Link>
      </div>

      <div className="gt-admin-card">
        {events.length === 0 ? (
          <div className="gt-admin-empty">
            <i className="fa-regular fa-calendar-plus"></i>
            <h3>No events found</h3>
            <p>Create your first event to get started.</p>
            <Link href="/org-admin/events/new" className="gt-admin-btn gt-admin-btn-primary">
              <i className="fa-regular fa-plus"></i> Create Event
            </Link>
          </div>
        ) : (
          <table className="gt-admin-table">
            <thead>
              <tr>
                <th>Event</th>
                <th>Status</th>
                <th>Tickets</th>
                <th>Orders</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e) => (
                <tr key={e.id}>
                  <td>
                    <strong>{e.title}</strong>
                    {e.shortDescription && <br />}
                    {e.shortDescription && <small style={{ color: "#888" }}>{e.shortDescription}</small>}
                  </td>
                  <td><span className={`gt-admin-badge ${statusBadge(e.status)}`}>{e.status}</span></td>
                  <td>{e._count.ticketTypes}</td>
                  <td>{e._count.orders}</td>
                  <td>
                    <Link href={`/org-admin/events/${e.id}`} className="gt-admin-btn gt-admin-btn-outline gt-admin-btn-sm">
                      <i className="fa-regular fa-pen-to-square"></i> Edit
                    </Link>
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
