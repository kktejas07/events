import Link from "next/link";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminSponsorsPage() {
  const sponsors = await db.sponsor.findMany({ include: { events: { include: { event: { select: { title: true } } } } }, orderBy: { sortOrder: "asc" } });

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="gt-admin-section-title">Sponsors</h2>
          <p className="gt-admin-section-subtitle">Manage event sponsors</p>
        </div>
        <Link href="/admin/sponsors/new" className="gt-admin-btn gt-admin-btn-primary">
          <i className="fa-regular fa-plus"></i> Add Sponsor
        </Link>
      </div>

      <div className="gt-admin-card">
        {sponsors.length === 0 ? (
          <div className="gt-admin-empty">
            <i className="fa-regular fa-chart-simple"></i>
            <h3>No sponsors yet</h3>
            <Link href="/admin/sponsors/new" className="gt-admin-btn gt-admin-btn-primary"><i className="fa-regular fa-plus"></i> Add First Sponsor</Link>
          </div>
        ) : (
          <table className="gt-admin-table">
            <thead>
              <tr><th>Sponsor</th><th>Tier</th><th>Events</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {sponsors.map((s) => (
                <tr key={s.id}>
                  <td>
                    <div className="d-flex align-items-center gap-3">
                      <img src={s.logoUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=60&q=80"} alt="" style={{ width: "36px", height: "36px", borderRadius: "8px", objectFit: "cover" }} />
                      <strong>{s.name}</strong>
                    </div>
                  </td>
                  <td><span className={`gt-admin-badge ${s.tier === "PLATINUM" ? "info" : s.tier === "GOLD" ? "warning" : s.tier === "SILVER" ? "neutral" : "neutral"}`}>{s.tier}</span></td>
                  <td>{s.events?.length || 0}</td>
                  <td><span className={`gt-admin-badge ${s.isActive ? "success" : "danger"}`}>{s.isActive ? "Active" : "Inactive"}</span></td>
                  <td>
                    <Link href={`/admin/sponsors/${s.id}`} className="gt-admin-btn gt-admin-btn-outline gt-admin-btn-sm"><i className="fa-regular fa-pen-to-square"></i></Link>
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
