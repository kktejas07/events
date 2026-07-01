"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<{ id: string; email: string; firstName: string; lastName: string; role: string; banned: boolean; organization?: { name: string } }[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", role: "SCANNER" });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function fetchUsers() {
    setLoading(true);
    try {
      const r = await fetch("/api/admin/users");
      const d = await r.json();
      setUsers(d.data || []);
    } catch { /* ignore */ }
    setLoading(false);
  }

  useEffect(() => { fetchUsers(); }, []);

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

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.success) {
        setMessage({ type: "error", text: data.error || "Failed to create user" });
      } else {
        setMessage({ type: "success", text: `User ${data.data.email} created successfully` });
        setForm({ firstName: "", lastName: "", email: "", password: "", role: "SCANNER" });
        setShowForm(false);
        fetchUsers();
      }
    } catch {
      setMessage({ type: "error", text: "Network error. Please try again." });
    }
    setSubmitting(false);
  }

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="gt-admin-section-title">Users & Roles</h2>
          <p className="gt-admin-section-subtitle">Manage users, roles, and access</p>
        </div>
        <button className="gt-admin-btn gt-admin-btn-primary" onClick={() => { setShowForm(!showForm); setMessage(null); }}>
          <i className={`fa-regular ${showForm ? "fa-xmark" : "fa-plus"}`}></i> {showForm ? "Cancel" : "Create User"}
        </button>
      </div>

      {message && (
        <div className={`alert ${message.type === "success" ? "alert-success" : "alert-danger"} mb-4`}>
          {message.text}
        </div>
      )}

      {showForm && (
        <div className="gt-admin-card mb-4">
          <form onSubmit={handleCreate}>
            <div className="row">
              <div className="col-md-6">
                <div className="gt-admin-form-group">
                  <label className="gt-admin-label">First Name</label>
                  <input className="gt-admin-input" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required />
                </div>
              </div>
              <div className="col-md-6">
                <div className="gt-admin-form-group">
                  <label className="gt-admin-label">Last Name</label>
                  <input className="gt-admin-input" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
                </div>
              </div>
              <div className="col-md-6">
                <div className="gt-admin-form-group">
                  <label className="gt-admin-label">Email</label>
                  <input className="gt-admin-input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                </div>
              </div>
              <div className="col-md-6">
                <div className="gt-admin-form-group">
                  <label className="gt-admin-label">Password</label>
                  <input className="gt-admin-input" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={8} placeholder="Min 8 characters" />
                </div>
              </div>
              <div className="col-md-6">
                <div className="gt-admin-form-group">
                  <label className="gt-admin-label">Role</label>
                  <select className="gt-admin-select" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                    <option value="SCANNER">Scanner</option>
                    <option value="ORGANIZATION_SCANNER">Organization Scanner</option>
                    <option value="ORGANIZATION_ADMIN">Organization Admin</option>
                    <option value="ADMIN">Admin</option>
                    <option value="SUPER_ADMIN">Super Admin</option>
                    <option value="USER">User</option>
                  </select>
                </div>
              </div>
              <div className="col-12">
                <button type="submit" className="gt-admin-btn gt-admin-btn-primary" disabled={submitting}>
                  {submitting ? "Creating..." : "Create User"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

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
