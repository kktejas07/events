import Link from "next/link";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminOrganizationsPage() {
  const orgs = await db.organization.findMany({ include: { _count: { select: { events: true, users: true } } }, orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="gt-admin-section-title">Organizations</h2>
          <p className="gt-admin-section-subtitle">Manage colleges and event organizations</p>
        </div>
      </div>

      <div className="gt-admin-card">
        {orgs.length === 0 ? (
          <div className="gt-admin-empty">
            <i className="fa-regular fa-building"></i>
            <h3>No organizations</h3>
            <p>Organizations will appear here when colleges register.</p>
          </div>
        ) : (
          <table className="gt-admin-table">
            <thead>
              <tr><th>Organization</th><th>Location</th><th>Events</th><th>Users</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {orgs.map((org) => (
                <tr key={org.id}>
                  <td>
                    <div className="d-flex align-items-center gap-3">
                      {org.logo ? (
                        <img src={org.logo} alt="" style={{ width: "36px", height: "36px", borderRadius: "8px", objectFit: "cover" }} />
                      ) : (
                        <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "linear-gradient(135deg, #8B5CF6, #6366f1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "14px", fontWeight: 600 }}>
                          {org.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <strong>{org.name}</strong>
                        <br /><small style={{ color: "#888" }}>{org.slug}</small>
                      </div>
                    </div>
                  </td>
                  <td>{[org.city, org.state].filter(Boolean).join(", ")}</td>
                  <td>{org._count?.events || 0}</td>
                  <td>{org._count?.users || 0}</td>
                  <td><span className={`gt-admin-badge ${org.verified ? "success" : "warning"}`}>{org.verified ? "Verified" : "Pending"}</span></td>
                  <td>
                    <Link href={`/colleges/${org.slug}`} className="gt-admin-btn gt-admin-btn-outline gt-admin-btn-sm">
                      <i className="fa-regular fa-arrow-up-right-from-square"></i> View
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
