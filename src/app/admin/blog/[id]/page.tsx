"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function AdminBlogEditPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: "", slug: "", excerpt: "", content: "", category: "", author: "", coverImage: "", published: false, tags: "" });

  useEffect(() => {
    if (params.id === "new") return;
    fetch(`/api/admin/blog/${params.id}`).then((r) => r.json()).then((d) => {
      if (d.post) setForm({ ...d.post, tags: (d.post.tags || []).join(", ") });
    });
  }, [params.id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const method = params.id === "new" ? "POST" : "PUT";
    const url = params.id === "new" ? "/api/admin/blog" : `/api/admin/blog/${params.id}`;
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, tags: form.tags.split(",").map((t: string) => t.trim()).filter(Boolean) }) });
    router.push("/admin/blog");
    router.refresh();
  }

  const isNew = params.id === "new";

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="gt-admin-section-title">{isNew ? "New Post" : "Edit Post"}</h2>
          <p className="gt-admin-section-subtitle">
            <Link href="/admin/blog" style={{ color: "#8B5CF6", textDecoration: "none" }}>Blog</Link> / {isNew ? "New" : "Edit"}
          </p>
        </div>
      </div>

      <div className="gt-admin-card">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-8">
              <div className="gt-admin-form-group">
                <label className="gt-admin-label">Title</label>
                <input className="gt-admin-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className="gt-admin-form-group">
                <label className="gt-admin-label">Slug</label>
                <input className="gt-admin-input" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
              </div>
              <div className="gt-admin-form-group">
                <label className="gt-admin-label">Excerpt</label>
                <textarea className="gt-admin-textarea" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={3} />
              </div>
              <div className="gt-admin-form-group">
                <label className="gt-admin-label">Content (HTML)</label>
                <textarea className="gt-admin-textarea" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={12} required />
              </div>
            </div>
            <div className="col-md-4">
              <div className="gt-admin-form-group">
                <label className="gt-admin-label">Category</label>
                <input className="gt-admin-input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
              </div>
              <div className="gt-admin-form-group">
                <label className="gt-admin-label">Author</label>
                <input className="gt-admin-input" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
              </div>
              <div className="gt-admin-form-group">
                <label className="gt-admin-label">Cover Image URL</label>
                <input className="gt-admin-input" value={form.coverImage} onChange={(e) => setForm({ ...form, coverImage: e.target.value })} placeholder="https://images.unsplash.com/photo-..." />
              </div>
              <div className="gt-admin-form-group">
                <label className="gt-admin-label">Tags (comma separated)</label>
                <input className="gt-admin-input" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
              </div>
              <div className="gt-admin-form-group">
                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                  <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
                  <span className="gt-admin-label" style={{ margin: 0 }}>Published</span>
                </label>
              </div>
              <button type="submit" className="gt-admin-btn gt-admin-btn-primary w-100" disabled={loading}>
                {loading ? "Saving..." : isNew ? "Create Post" : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
