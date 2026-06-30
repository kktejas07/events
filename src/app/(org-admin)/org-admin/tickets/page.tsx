import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function OrgTicketsPage() {
  const session = await auth();
  const user = session?.user as { id?: string; role?: string; organizationId?: string } | undefined;
  if (!user?.organizationId) redirect("/login");

  const tickets = await db.ticket.findMany({
    where: { event: { organizationId: user.organizationId } },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      event: { select: { title: true } },
      ticketType: { select: { name: true } },
      user: { select: { firstName: true, lastName: true, email: true } },
    },
  });

  const statusBadge = (s: string, scanned: boolean) => {
    if (scanned) return "info";
    return s === "ACTIVE" ? "success" : "neutral";
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="gt-admin-section-title">Tickets</h2>
        <p className="gt-admin-section-subtitle">All tickets sold for your events</p>
      </div>

      <div className="gt-admin-card">
        {tickets.length === 0 ? (
          <div className="gt-admin-empty">
            <i className="fa-regular fa-ticket-simple"></i>
            <h3>No tickets sold yet</h3>
            <p>Tickets will appear here once attendees start purchasing.</p>
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
              </tr>
            </thead>
            <tbody>
              {tickets.map((t) => (
                <tr key={t.id}>
                  <td>
                    <strong>{t.attendeeName}</strong>
                    <br />
                    <small style={{ color: "#888" }}>{t.attendeeEmail}</small>
                  </td>
                  <td>{t.event.title}</td>
                  <td>{t.ticketType.name}</td>
                  <td style={{ fontFamily: "monospace", fontSize: "12px", color: "#888" }}>{t.barcode}</td>
                  <td>
                    <span className={`gt-admin-badge ${statusBadge(t.status, t.scanned)}`}>
                      {t.scanned ? "Scanned" : t.status}
                    </span>
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
