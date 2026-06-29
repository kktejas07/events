export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import DigitalIdCard from "@/components/ui/digital-id-card";

export default async function ProfilePage() {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) return null;

  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) return null;

  return (
    <div className="gt-admin-content">
      <h2 className="gt-admin-section-title">Profile</h2>
      <p className="gt-admin-section-subtitle">Manage your account information</p>

      <div className="row g-4">
        <div className="col-lg-7">
          <div className="gt-admin-card">
            <h3 className="gt-admin-card-title">Personal Information</h3>
            <div className="row">
              <div className="col-md-6">
                <div className="gt-admin-form-group">
                  <label className="gt-admin-label">First Name</label>
                  <input className="gt-admin-input" defaultValue={user.firstName || ""} readOnly />
                </div>
              </div>
              <div className="col-md-6">
                <div className="gt-admin-form-group">
                  <label className="gt-admin-label">Last Name</label>
                  <input className="gt-admin-input" defaultValue={user.lastName || ""} readOnly />
                </div>
              </div>
              <div className="col-md-6">
                <div className="gt-admin-form-group">
                  <label className="gt-admin-label">Email</label>
                  <input className="gt-admin-input" defaultValue={user.email || ""} readOnly />
                </div>
              </div>
              <div className="col-md-6">
                <div className="gt-admin-form-group">
                  <label className="gt-admin-label">Phone</label>
                  <input className="gt-admin-input" defaultValue={user.phone || ""} readOnly />
                </div>
              </div>
              <div className="col-md-6">
                <div className="gt-admin-form-group">
                  <label className="gt-admin-label">College</label>
                  <input className="gt-admin-input" defaultValue={user.college || ""} readOnly />
                </div>
              </div>
              <div className="col-md-6">
                <div className="gt-admin-form-group">
                  <label className="gt-admin-label">Role</label>
                  <input className="gt-admin-input" defaultValue={user.role || "USER"} readOnly />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-5">
          <DigitalIdCard user={user} />
        </div>
      </div>
    </div>
  );
}
