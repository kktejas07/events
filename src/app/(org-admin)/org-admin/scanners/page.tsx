import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

async function addScanner(formData: FormData) {
  "use server";
  const session = await auth();
  const user = session?.user as { id?: string; role?: string; organizationId?: string } | undefined;
  if (!user?.organizationId) throw new Error("Unauthorized");

  const userId = formData.get("userId") as string;
  const designation = formData.get("designation") as string;
  const phone = formData.get("phone") as string;
  if (!userId) throw new Error("User is required");

  await db.organizationMember.create({
    data: {
      organizationId: user.organizationId,
      userId,
      role: "ORGANIZATION_SCANNER",
      designation: designation || null,
      phone: phone || null,
    },
  });
  revalidatePath("/org-admin/scanners");
}

async function removeScanner(formData: FormData) {
  "use server";
  const session = await auth();
  const user = session?.user as { id?: string; role?: string; organizationId?: string } | undefined;
  if (!user?.organizationId) throw new Error("Unauthorized");

  const memberId = formData.get("memberId") as string;
  if (!memberId) throw new Error("Member ID is required");

  await db.organizationMember.deleteMany({
    where: { id: memberId, organizationId: user.organizationId },
  });
  revalidatePath("/org-admin/scanners");
}

export default async function OrgAdminScannersPage() {
  const session = await auth();
  const user = session?.user as { id?: string; role?: string; organizationId?: string } | undefined;
  if (!user?.organizationId) redirect("/login");

  const [scanners, potentialScanners] = await Promise.all([
    db.organizationMember.findMany({
      where: { organizationId: user.organizationId, role: "ORGANIZATION_SCANNER" },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true, avatarUrl: true } },
      },
      orderBy: { userId: "asc" },
    }),
    db.user.findMany({
      where: {
        role: { in: ["SCANNER", "USER"] },
        organizationMembers: { none: { organizationId: user.organizationId } },
      },
      select: { id: true, firstName: true, lastName: true, email: true },
      orderBy: { firstName: "asc" },
    }),
  ]);

  return (
    <div>
      <div className="mb-4">
        <h2 className="gt-admin-section-title">Scanner Users</h2>
        <p className="gt-admin-section-subtitle">Manage who can scan tickets at your events</p>
      </div>

      <div className="gt-admin-stats-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
        <div className="gt-admin-stat-card">
          <div className="gt-admin-stat-icon purple">
            <i className="fa-regular fa-qrcode"></i>
          </div>
          <div>
            <div className="gt-admin-stat-label">Total Scanners</div>
            <div className="gt-admin-stat-value">{scanners.length}</div>
          </div>
        </div>
      </div>

      <div className="gt-admin-card mt-4">
        <div className="gt-admin-card-header">
          <h3 className="gt-admin-card-title">
            <i className="fa-regular fa-user-plus" style={{ marginRight: 8 }}></i>
            Add Scanner
          </h3>
        </div>
        <div style={{ padding: 24 }}>
          <form action={addScanner} className="row g-3 align-items-end">
            <div className="col-md-4">
              <label className="gt-admin-field-label">User</label>
              <select name="userId" required className="gt-admin-input-field w-100">
                <option value="">Select a user...</option>
                {potentialScanners.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.firstName} {u.lastName} ({u.email})
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <label className="gt-admin-field-label">Designation</label>
              <input type="text" name="designation" placeholder="e.g. Event Coordinator" className="gt-admin-input-field w-100" />
            </div>
            <div className="col-md-3">
              <label className="gt-admin-field-label">Phone</label>
              <input type="text" name="phone" placeholder="e.g. +1 234 567 890" className="gt-admin-input-field w-100" />
            </div>
            <div className="col-md-2">
              <button type="submit" className="gt-admin-btn gt-admin-btn-primary w-100">
                <i className="fa-regular fa-plus"></i> Add
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="gt-admin-card mt-4">
        {scanners.length === 0 ? (
          <div className="gt-admin-empty">
            <i className="fa-regular fa-qrcode"></i>
            <h3>No scanner users added yet</h3>
            <p>Add users above to grant them ticket scanning privileges.</p>
          </div>
        ) : (
          <table className="gt-admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Designation</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {scanners.map((m) => (
                <tr key={m.id}>
                  <td>
                    <strong>{m.user.firstName} {m.user.lastName}</strong>
                    <br />
                    <small style={{ color: "#888" }}>{m.user.email}</small>
                  </td>
                  <td>{m.designation || "-"}</td>
                  <td>{m.phone || "-"}</td>
                  <td>
                    <span className="gt-admin-badge info">Scanner</span>
                  </td>
                  <td>
                    <form action={removeScanner}>
                      <input type="hidden" name="memberId" value={m.id} />
                      <button type="submit" className="gt-admin-btn gt-admin-btn-outline gt-admin-btn-sm" style={{ borderColor: "#EF4444", color: "#EF4444" }}>
                        <i className="fa-regular fa-trash"></i>
                      </button>
                    </form>
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
