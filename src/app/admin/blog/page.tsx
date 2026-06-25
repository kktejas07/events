import Link from "next/link";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const posts = await db.blogPost.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="gt-admin-section-title">Blog</h2>
          <p className="gt-admin-section-subtitle">Manage blog posts</p>
        </div>
        <Link href="/admin/blog/new" className="gt-admin-btn gt-admin-btn-primary">
          <i className="fa-regular fa-plus"></i> New Post
        </Link>
      </div>

      <div className="gt-admin-card">
        {posts.length === 0 ? (
          <div className="gt-admin-empty">
            <i className="fa-regular fa-file-lines"></i>
            <h3>No blog posts yet</h3>
            <Link href="/admin/blog/new" className="gt-admin-btn gt-admin-btn-primary"><i className="fa-regular fa-plus"></i> Write First Post</Link>
          </div>
        ) : (
          <table className="gt-admin-table">
            <thead>
              <tr><th>Title</th><th>Category</th><th>Status</th><th>Date</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <td><strong>{post.title}</strong></td>
                  <td>{post.category || "General"}</td>
                  <td><span className={`gt-admin-badge ${post.published ? "success" : "warning"}`}>{post.published ? "Published" : "Draft"}</span></td>
                  <td>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : new Date(post.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Link href={`/admin/blog/${post.id}`} className="gt-admin-btn gt-admin-btn-outline gt-admin-btn-sm"><i className="fa-regular fa-pen-to-square"></i> Edit</Link>
                      <form action={`/api/admin/blog/${post.id}`} method="POST">
                        <input type="hidden" name="_method" value="DELETE" />
                        <button type="submit" className="gt-admin-btn gt-admin-btn-outline gt-admin-btn-sm" style={{ borderColor: "#EF4444", color: "#EF4444" }}><i className="fa-regular fa-trash"></i></button>
                      </form>
                    </div>
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
