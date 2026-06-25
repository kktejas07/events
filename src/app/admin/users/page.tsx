"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<{ id: string; email: string; firstName: string; lastName: string; role: string; banned: boolean; organization?: { name: string } }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/users").then((r) => r.json()).then((d) => { setUsers(d.data || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const roleBadge = (r: string) => ({ ADMIN: "info", SUPER_ADMIN: "info", ORGANIZATION_ADMIN: "warning", SCANNER: "neutral", ORGANIZATION_SCANNER: "neutral", USER: "neutral" }[r] || "neutral");

  async function updateRole(id: string, role: string) {
    if (!window.confirm(`Change role to ${role}?`)) return;
    await fetch(`/api/admin/users/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ role }) });
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
  }

  async function toggleBan(id: string, banned: boolean) {
    if (!window.confirm(banned ? "Unban this user?" : "Ban this user?")) return;
    await fetch(`/api/admin/users/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ banned: !banned }) });
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, banned: !banned } : u)));
  }

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="gt-admin-section-title">Users & Roles</h2>
          <p className="gt-admin-section-subtitle">Manage users, roles, and access</p>
        </div>
      </div>

      <div className="gt-admin-card">
        {loading ? (
          <div className="text-center py-5"><i className="fa-solid fa-spinner fa-spin" style={{ fontSize: "24px", color: "#8B5CF6" }}></i></div>
        ) : (
          <table className="gt-admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Organization</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <strong>{user.firstName} {user.lastName}</strong>
                    <br /><small style={{ color: "#888" }}>{user.email}</small>
                  </td>
                  <td>{user.organization?.name || "-"}</td>
                  <td>
                    <select className="gt-admin-select" style={{ width: "auto", minWidth: "160px", padding: "6px 30px 6px 10px", fontSize: "12px" }} value={user.role} onChange={(e) => updateRole(user.id, e.target.value)}>
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                      <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                      <option value="SCANNER">SCANNER</option>
                      <option value="ORGANIZATION_ADMIN">ORGANIZATION_ADMIN</option>
                      <option value="ORGANIZATION_SCANNER">ORGANIZATION_SCANNER</option>
                    </select>
                  </td>
                  <td>
                    <span className={`gt-admin-badge ${user.banned ? "danger" : "success"}`}>
                      {user.banned ? "Banned" : "Active"}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => toggleBan(user.id, user.banned)} className={`gt-admin-btn gt-admin-btn-sm ${user.banned ? "gt-admin-btn-primary" : ""}`} style={user.banned ? {} : { border: "2px solid #EF4444", color: "#EF4444", background: "none" }}>
                      {user.banned ? "Unban" : "Ban"}
                    </button>
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
