import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ScanLine, UserPlus, Trash2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  if (!user || !["ADMIN", "SUPER_ADMIN", "ORGANIZATION_ADMIN"].includes(user.role || ""))
    redirect("/login");
  if (!user.organizationId) redirect("/login");

  const [scanners, potentialScanners] = await Promise.all([
    db.organizationMember.findMany({
      where: { organizationId: user.organizationId, role: "ORGANIZATION_SCANNER" },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true, avatarUrl: true },
        },
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Scanner Users</h2>
          <p className="text-sm text-gray-500">Manage who can scan tickets at your events</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 shadow-lg">
              <ScanLine className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{scanners.length}</p>
              <p className="text-xs text-gray-500">Total Scanners</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-xl">
        <div className="mb-4 flex items-center gap-2">
          <UserPlus className="h-4 w-4 text-purple-400" />
          <h3 className="text-sm font-semibold text-white">Add Scanner</h3>
        </div>
        <form action={addScanner} className="flex flex-wrap items-end gap-3">
          <div className="min-w-[200px] flex-1">
            <label className="mb-1.5 block text-xs text-gray-500">User</label>
            <select
              name="userId"
              required
              className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
            >
              <option value="" className="bg-[#050508] text-gray-500">
                Select a user...
              </option>
              {potentialScanners.map((u) => (
                <option key={u.id} value={u.id} className="bg-[#050508]">
                  {u.firstName} {u.lastName} ({u.email})
                </option>
              ))}
            </select>
          </div>
          <div className="min-w-[150px] flex-1">
            <label className="mb-1.5 block text-xs text-gray-500">Designation</label>
            <input
              type="text"
              name="designation"
              placeholder="e.g. Event Coordinator"
              className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>
          <div className="min-w-[150px] flex-1">
            <label className="mb-1.5 block text-xs text-gray-500">Phone</label>
            <input
              type="text"
              name="phone"
              placeholder="e.g. +1 234 567 890"
              className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>
          <Button
            type="submit"
            className="gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700"
          >
            <UserPlus className="h-4 w-4" />
            Add Scanner
          </Button>
        </form>
      </div>

      {scanners.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.02] py-16">
          <ScanLine className="mb-3 h-10 w-10 text-gray-600" />
          <p className="text-sm text-gray-500">No scanner users added yet</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {scanners.map((m) => {
            const initials = (
              m.user.firstName?.[0] ?? ""
            ) + (
              m.user.lastName?.[0] ?? ""
            );
            return (
              <div
                key={m.id}
                className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur-xl transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.06]"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-sm font-bold text-white shadow-lg">
                      {initials || "?"}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">
                        {m.user.firstName} {m.user.lastName}
                      </p>
                      <p className="truncate text-xs text-gray-500">{m.user.email}</p>
                    </div>
                  </div>
                  <form action={removeScanner}>
                    <input type="hidden" name="memberId" value={m.id} />
                    <button
                      type="submit"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-gray-500 opacity-0 transition-all hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </form>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <Shield className="h-3 w-3 text-purple-400" />
                  <span className="rounded-full bg-purple-500/10 px-2 py-0.5 text-[10px] font-semibold text-purple-400">
                    Scanner
                  </span>
                </div>
                {(m.designation || m.phone) && (
                  <div className="mt-2 space-y-1 text-xs">
                    {m.designation && (
                      <p className="text-gray-400">
                        <span className="text-gray-600">Designation:</span> {m.designation}
                      </p>
                    )}
                    {m.phone && (
                      <p className="text-gray-400">
                        <span className="text-gray-600">Phone:</span> {m.phone}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
