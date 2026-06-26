import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Settings as SettingsIcon, Save, Building2, Mail, Phone, Globe, MapPin, Palette, Image } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function OrgAdminSettingsPage() {
  const session = await auth();
  const user = session?.user as { id?: string; role?: string; organizationId?: string } | undefined;
  if (!user || !["ADMIN", "SUPER_ADMIN", "ORGANIZATION_ADMIN"].includes(user.role || ""))
    redirect("/login");
  if (!user.organizationId) redirect("/login");

  const org = await db.organization.findUnique({ where: { id: user.organizationId } });
  if (!org) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Building2 className="mb-4 h-12 w-12 text-gray-500" />
        <h2 className="text-xl font-semibold text-white">Organization not found</h2>
        <p className="mt-1 text-sm text-gray-400">The organization record could not be loaded.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Settings</h2>
          <p className="text-sm text-gray-400">Manage your organization settings</p>
        </div>
        <Button className="gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <div className="space-y-6">
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-xl">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600">
              <Building2 className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">General Settings</h3>
              <p className="text-xs text-gray-500">Basic organization information</p>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Organization Name</label>
              <input
                type="text"
                defaultValue={org.name}
                className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-gray-600"
                placeholder="Organization name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Slug</label>
              <input
                type="text"
                defaultValue={org.slug}
                readOnly
                className="w-full cursor-not-allowed rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-gray-500 placeholder:text-gray-600"
              />
            </div>
          </div>
          <div className="mt-5 space-y-2">
            <label className="text-sm font-medium text-gray-400">Description</label>
            <textarea
              defaultValue={org.description || ""}
              rows={3}
              className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-gray-600"
              placeholder="Describe your organization"
            />
          </div>
          <div className="mt-5 space-y-2">
            <label className="text-sm font-medium text-gray-400">
              <Palette className="mr-1.5 inline-block h-3.5 w-3.5 text-gray-500" />
              Brand Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                defaultValue={org.brandColor || "#7c3aed"}
                className="h-9 w-12 cursor-pointer rounded-lg border border-white/10 bg-white/[0.03] p-0.5"
              />
              <span className="text-xs text-gray-500">{org.brandColor || "#7c3aed"}</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-xl">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600">
              <Mail className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Contact Information</h3>
              <p className="text-xs text-gray-500">How people can reach you</p>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">
                <Mail className="mr-1.5 inline-block h-3.5 w-3.5 text-gray-500" />
                Email
              </label>
              <input
                type="email"
                defaultValue={org.email || ""}
                className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-gray-600"
                placeholder="org@example.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">
                <Phone className="mr-1.5 inline-block h-3.5 w-3.5 text-gray-500" />
                Phone
              </label>
              <input
                type="tel"
                defaultValue={org.phone || ""}
                className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-gray-600"
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>
          <div className="mt-5 space-y-2">
            <label className="text-sm font-medium text-gray-400">
              <Globe className="mr-1.5 inline-block h-3.5 w-3.5 text-gray-500" />
              Website
            </label>
            <input
              type="url"
              defaultValue={org.website || ""}
              className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-gray-600"
              placeholder="https://example.com"
            />
          </div>
          <div className="mt-5 space-y-2">
            <label className="text-sm font-medium text-gray-400">
              <MapPin className="mr-1.5 inline-block h-3.5 w-3.5 text-gray-500" />
              Address
            </label>
            <input
              type="text"
              defaultValue={org.address || ""}
              className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-gray-600"
              placeholder="Street address"
            />
          </div>
          <div className="mt-5 grid gap-5 sm:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">City</label>
              <input
                type="text"
                defaultValue={org.city || ""}
                className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-gray-600"
                placeholder="City"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">State</label>
              <input
                type="text"
                defaultValue={org.state || ""}
                className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-gray-600"
                placeholder="State"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Country</label>
              <input
                type="text"
                defaultValue={org.country || ""}
                className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-gray-600"
                placeholder="Country"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-xl">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600">
              <Image className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Branding</h3>
              <p className="text-xs text-gray-500">Logo and cover image</p>
            </div>
          </div>
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Logo URL</label>
              {org.logo && (
                <div className="mb-3">
                  <img
                    src={org.logo}
                    alt="Current logo"
                    className="h-16 w-16 rounded-xl border border-white/10 object-cover"
                  />
                </div>
              )}
              <input
                type="text"
                defaultValue={org.logo || ""}
                className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-gray-600"
                placeholder="https://example.com/logo.png"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Cover Image URL</label>
              {org.coverImage && (
                <div className="mb-3">
                  <img
                    src={org.coverImage}
                    alt="Current cover"
                    className="h-24 w-full rounded-xl border border-white/10 object-cover"
                  />
                </div>
              )}
              <input
                type="text"
                defaultValue={org.coverImage || ""}
                className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-gray-600"
                placeholder="https://example.com/cover.jpg"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-xl">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600">
              <SettingsIcon className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Commission</h3>
              <p className="text-xs text-gray-500">Platform commission rate</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-xl border border-white/[0.04] bg-white/[0.02] px-4 py-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600/30">
              <span className="text-sm font-bold text-purple-400">%</span>
            </div>
            <div>
              <p className="text-sm font-medium text-white">
                {org.commissionRate != null ? `${Number(org.commissionRate)}%` : "Not set"}
              </p>
              <p className="text-xs text-gray-500">Commission rate applied to all orders</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
