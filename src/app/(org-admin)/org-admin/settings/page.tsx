import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function OrgAdminSettingsPage() {
  const session = await auth();
  const user = session?.user as { id?: string; role?: string; organizationId?: string } | undefined;
  if (!user?.organizationId) redirect("/login");

  const org = await db.organization.findUnique({ where: { id: user.organizationId } });
  if (!org) {
    return (
      <div className="gt-admin-card">
        <div className="gt-admin-empty">
          <i className="fa-regular fa-building"></i>
          <h3>Organization not found</h3>
          <p>The organization record could not be loaded.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <h2 className="gt-admin-section-title">Settings</h2>
        <p className="gt-admin-section-subtitle">Manage your organization settings</p>
      </div>

      <div className="gt-admin-card">
        <div className="gt-admin-card-header">
          <h3 className="gt-admin-card-title">
            <i className="fa-regular fa-building" style={{ marginRight: 8 }}></i>
            General Settings
          </h3>
        </div>
        <div style={{ padding: 24 }}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="gt-admin-field-label">Organization Name</label>
              <input type="text" defaultValue={org.name} className="gt-admin-input-field w-100" placeholder="Organization name" />
            </div>
            <div className="col-md-6 mb-3">
              <label className="gt-admin-field-label">Slug</label>
              <input type="text" defaultValue={org.slug} readOnly className="gt-admin-input-field w-100" style={{ color: "#999 !important" }} />
            </div>
          </div>
          <div className="mb-3">
            <label className="gt-admin-field-label">Description</label>
            <textarea defaultValue={org.description || ""} rows={3} className="gt-admin-input-field w-100" placeholder="Describe your organization" />
          </div>
          <div className="mb-3">
            <label className="gt-admin-field-label">Brand Color</label>
            <div className="d-flex align-items-center gap-3">
              <input type="color" defaultValue={org.brandColor || "#7c3aed"} style={{ height: 36, width: 48, padding: 2 }} />
              <span style={{ color: "#888", fontSize: 13 }}>{org.brandColor || "#7c3aed"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="gt-admin-card mt-4">
        <div className="gt-admin-card-header">
          <h3 className="gt-admin-card-title">
            <i className="fa-regular fa-envelope" style={{ marginRight: 8 }}></i>
            Contact Information
          </h3>
        </div>
        <div style={{ padding: 24 }}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="gt-admin-field-label">Email</label>
              <input type="email" defaultValue={org.email || ""} className="gt-admin-input-field w-100" placeholder="org@example.com" />
            </div>
            <div className="col-md-6 mb-3">
              <label className="gt-admin-field-label">Phone</label>
              <input type="tel" defaultValue={org.phone || ""} className="gt-admin-input-field w-100" placeholder="+1 (555) 000-0000" />
            </div>
          </div>
          <div className="mb-3">
            <label className="gt-admin-field-label">Website</label>
            <input type="url" defaultValue={org.website || ""} className="gt-admin-input-field w-100" placeholder="https://example.com" />
          </div>
          <div className="mb-3">
            <label className="gt-admin-field-label">Address</label>
            <input type="text" defaultValue={org.address || ""} className="gt-admin-input-field w-100" placeholder="Street address" />
          </div>
          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="gt-admin-field-label">City</label>
              <input type="text" defaultValue={org.city || ""} className="gt-admin-input-field w-100" placeholder="City" />
            </div>
            <div className="col-md-4 mb-3">
              <label className="gt-admin-field-label">State</label>
              <input type="text" defaultValue={org.state || ""} className="gt-admin-input-field w-100" placeholder="State" />
            </div>
            <div className="col-md-4 mb-3">
              <label className="gt-admin-field-label">Country</label>
              <input type="text" defaultValue={org.country || ""} className="gt-admin-input-field w-100" placeholder="Country" />
            </div>
          </div>
        </div>
      </div>

      <div className="gt-admin-card mt-4">
        <div className="gt-admin-card-header">
          <h3 className="gt-admin-card-title">
            <i className="fa-regular fa-image" style={{ marginRight: 8 }}></i>
            Branding
          </h3>
        </div>
        <div style={{ padding: 24 }}>
          <div className="mb-3">
            <label className="gt-admin-field-label">Logo URL</label>
            {org.logo && (
              <div className="mb-2">
                <img src={org.logo} alt="Current logo" style={{ height: 64, width: 64, borderRadius: 8, objectFit: "cover", border: "1px solid #e5e7eb" }} />
              </div>
            )}
            <input type="text" defaultValue={org.logo || ""} className="gt-admin-input-field w-100" placeholder="https://example.com/logo.png" />
          </div>
          <div className="mb-3">
            <label className="gt-admin-field-label">Cover Image URL</label>
            {org.coverImage && (
              <div className="mb-2">
                <img src={org.coverImage} alt="Current cover" style={{ height: 96, width: "100%", borderRadius: 8, objectFit: "cover", border: "1px solid #e5e7eb" }} />
              </div>
            )}
            <input type="text" defaultValue={org.coverImage || ""} className="gt-admin-input-field w-100" placeholder="https://example.com/cover.jpg" />
          </div>
        </div>
      </div>

      <div className="gt-admin-card mt-4">
        <div className="gt-admin-card-header">
          <h3 className="gt-admin-card-title">
            <i className="fa-regular fa-gear" style={{ marginRight: 8 }}></i>
            Commission
          </h3>
        </div>
        <div style={{ padding: 24 }}>
          <div className="d-flex align-items-center gap-3 p-3" style={{ background: "#f9fafb", borderRadius: 12, border: "1px solid #e5e7eb" }}>
            <div className="d-flex align-items-center justify-content-center" style={{ height: 40, width: 40, borderRadius: 8, background: "rgba(139, 92, 246, 0.1)", color: "#8B5CF6", fontWeight: 700, fontSize: 16 }}>
              %
            </div>
            <div>
              <div style={{ fontWeight: 600, color: "#1a1a2e" }}>
                {org.commissionRate != null ? `${Number(org.commissionRate)}%` : "Not set"}
              </div>
              <div style={{ fontSize: 12, color: "#888" }}>Commission rate applied to all orders</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
