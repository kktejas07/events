"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminSponsorsNewPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", logoUrl: "", websiteUrl: "", tier: "BRONZE", description: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/admin/sponsors", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, isActive: true, sortOrder: 0 }) });
    router.push("/admin/sponsors");
    router.refresh();
  }

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div><h2 className="gt-admin-section-title">Add Sponsor</h2><p className="gt-admin-section-subtitle">Create a new sponsor</p></div>
      </div>
      <div className="gt-admin-card">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6">
              <div className="gt-admin-form-group">
                <label className="gt-admin-label">Name</label>
                <input className="gt-admin-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="gt-admin-form-group">
                <label className="gt-admin-label">Logo URL</label>
                <input className="gt-admin-input" value={form.logoUrl} onChange={(e) => setForm({ ...form, logoUrl: e.target.value })} placeholder="https://images.unsplash.com/photo-..." />
              </div>
              <div className="gt-admin-form-group">
                <label className="gt-admin-label">Website</label>
                <input className="gt-admin-input" value={form.websiteUrl} onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })} />
              </div>
            </div>
            <div className="col-md-6">
              <div className="gt-admin-form-group">
                <label className="gt-admin-label">Tier</label>
                <select className="gt-admin-select" value={form.tier} onChange={(e) => setForm({ ...form, tier: e.target.value })}>
                  <option value="PLATINUM">Platinum</option>
                  <option value="GOLD">Gold</option>
                  <option value="SILVER">Silver</option>
                  <option value="BRONZE">Bronze</option>
                </select>
              </div>
              <div className="gt-admin-form-group">
                <label className="gt-admin-label">Description</label>
                <textarea className="gt-admin-textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} />
              </div>
              <button type="submit" className="gt-admin-btn gt-admin-btn-primary w-100" disabled={loading}>
                {loading ? "Creating..." : "Create Sponsor"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
