import { db } from "@/lib/db";
import Link from "next/link";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

const actionColors: Record<string, string> = {
  CREATE: "success",
  UPDATE: "info",
  DELETE: "danger",
  LOGIN: "neutral",
  LOGOUT: "neutral",
};

function buildPaginationUrl(base: string, params: Record<string, string | undefined>, page: number): string {
  const sp = new URLSearchParams();
  if (params.action) sp.set("action", params.action);
  if (params.userId) sp.set("userId", params.userId);
  if (params.entityType) sp.set("entityType", params.entityType);
  if (params.from) sp.set("from", params.from);
  if (params.to) sp.set("to", params.to);
  if (page > 1) sp.set("page", String(page));
  const qs = sp.toString();
  return qs ? `${base}?${qs}` : base;
}

export default async function AdminAuditLogPage({
  searchParams,
}: {
  searchParams: { page?: string; action?: string; userId?: string; entityType?: string; from?: string; to?: string };
}) {
  const page = Math.max(1, parseInt(searchParams.page || "1", 10) || 1);

  const where: Record<string, unknown> = {};
  if (searchParams.action) where.action = searchParams.action;
  if (searchParams.userId) where.userId = searchParams.userId;
  if (searchParams.entityType) where.entityType = { contains: searchParams.entityType };
  if (searchParams.from || searchParams.to) {
    const createdAt: Record<string, Date> = {};
    if (searchParams.from) createdAt.gte = new Date(searchParams.from);
    if (searchParams.to) createdAt.lte = new Date(searchParams.to);
    where.createdAt = createdAt;
  }

  const [logs, total, actions] = await Promise.all([
    db.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    db.auditLog.count({ where }),
    db.auditLog.groupBy({
      by: ["action"],
      orderBy: { action: "asc" },
    }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  function formatDate(d: Date) {
    return new Date(d).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="gt-admin-section-title">Audit Log</h2>
          <p className="gt-admin-section-subtitle">Track all administrative actions and changes</p>
        </div>
      </div>

      <div className="gt-admin-card" style={{ marginBottom: "16px" }}>
        <form method="GET" action="/admin/audit-log">
          <div className="gt-admin-inline-form" style={{ flexWrap: "wrap" }}>
            <div className="gt-admin-form-group">
              <label className="gt-admin-label" htmlFor="action">Action</label>
              <select name="action" id="action" className="gt-admin-select" defaultValue={searchParams.action || ""}>
                <option value="">All Actions</option>
                {actions.map((a) => (
                  <option key={a.action} value={a.action}>{a.action}</option>
                ))}
              </select>
            </div>
            <div className="gt-admin-form-group">
              <label className="gt-admin-label" htmlFor="entityType">Entity Type</label>
              <input name="entityType" id="entityType" className="gt-admin-input" placeholder="e.g. Event, Order" defaultValue={searchParams.entityType || ""} />
            </div>
            <div className="gt-admin-form-group">
              <label className="gt-admin-label" htmlFor="userId">User ID</label>
              <input name="userId" id="userId" className="gt-admin-input" placeholder="User ID" defaultValue={searchParams.userId || ""} />
            </div>
            <div className="gt-admin-form-group">
              <label className="gt-admin-label" htmlFor="from">From</label>
              <input name="from" id="from" type="date" className="gt-admin-input" defaultValue={searchParams.from || ""} />
            </div>
            <div className="gt-admin-form-group">
              <label className="gt-admin-label" htmlFor="to">To</label>
              <input name="to" id="to" type="date" className="gt-admin-input" defaultValue={searchParams.to || ""} />
            </div>
            <div className="gt-admin-form-group" style={{ alignSelf: "end" }}>
              <button type="submit" className="gt-admin-btn gt-admin-btn-primary">
                <i className="fa-regular fa-filter"></i> Filter
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="gt-admin-card">
        {logs.length > 0 ? (
          <>
            <div style={{ overflowX: "auto" }}>
              <table className="gt-admin-table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Action</th>
                    <th>Entity</th>
                    <th>Entity ID</th>
                    <th>User ID</th>
                    <th>IP Address</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => {
                    const detailsStr = log.details ? JSON.stringify(log.details).slice(0, 120) + (JSON.stringify(log.details).length > 120 ? "..." : "") : "-";
                    return (
                      <tr key={log.id}>
                        <td style={{ whiteSpace: "nowrap", fontSize: "13px", color: "#888" }}>
                          {formatDate(log.createdAt)}
                        </td>
                        <td>
                          <span className={`gt-admin-badge ${actionColors[log.action] || "neutral"}`}>
                            {log.action}
                          </span>
                        </td>
                        <td style={{ fontSize: "13px" }}>{log.entityType || "-"}</td>
                        <td style={{ fontSize: "12px", maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {log.entityId ? (
                            <code style={{ fontSize: "11px", background: "#f0f0f0", padding: "2px 6px", borderRadius: "4px" }}>
                              {log.entityId.slice(0, 12)}...
                            </code>
                          ) : "-"}
                        </td>
                        <td style={{ fontSize: "12px" }}>
                          {log.userId ? (
                            <code style={{ fontSize: "11px", background: "#f0f0f0", padding: "2px 6px", borderRadius: "4px" }}>
                              {log.userId.slice(0, 12)}...
                            </code>
                          ) : "-"}
                        </td>
                        <td style={{ fontSize: "13px", color: "#888" }}>{log.ipAddress || "-"}</td>
                        <td style={{ fontSize: "12px", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", color: "#888" }}>
                          {detailsStr}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "20px", paddingTop: "16px", borderTop: "1px solid #f0f0f0" }}>
                <span style={{ fontSize: "13px", color: "#888" }}>
                  Page {page} of {totalPages} ({total} total)
                </span>
                <div style={{ display: "flex", gap: "8px" }}>
                  {page > 1 && (
                    <Link href={buildPaginationUrl("/admin/audit-log", searchParams, page - 1)} className="gt-admin-btn gt-admin-btn-outline gt-admin-btn-sm">
                      <i className="fa-regular fa-chevron-left"></i> Previous
                    </Link>
                  )}
                  {page < totalPages && (
                    <Link href={buildPaginationUrl("/admin/audit-log", searchParams, page + 1)} className="gt-admin-btn gt-admin-btn-outline gt-admin-btn-sm">
                      Next <i className="fa-regular fa-chevron-right"></i>
                    </Link>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="gt-admin-empty">
            <i className="fa-regular fa-clock"></i>
            <h3>No audit logs found</h3>
            <p>Try adjusting your filters or check back later.</p>
          </div>
        )}
      </div>
    </div>
  );
}
