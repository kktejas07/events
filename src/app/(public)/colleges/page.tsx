import Link from "next/link";
import { db } from "@/lib/db";
import { themeAssets } from "@/lib/theme-images";
import { resolveThemeImage } from "@/lib/resolve-theme-image";
import { ArrowRight, Building2, MapPin, Calendar } from "lucide-react";
import { WaveDivider } from "@/components/ui/section-dividers";

export const dynamic = "force-dynamic";

export default async function CollegesPage() {
  const organizations = await db.organization.findMany({
    where: { verified: true, isActive: true },
    include: { _count: { select: { events: true, members: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="min-h-screen bg-[#050508] py-24">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full border border-purple-500/20 bg-purple-500/[0.08] px-4 py-1.5 text-xs font-medium tracking-wide text-purple-300">
            Colleges & Organizations
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Discover Events by College
          </h1>
          <p className="mt-4 leading-relaxed text-gray-400">
            Browse events, workshops, and conferences organized by colleges and institutions
            worldwide.
          </p>
        </div>

        {organizations.length === 0 ? (
          <p className="mt-16 text-center text-gray-500">No colleges registered yet.</p>
        ) : (
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {organizations.map((org) => (
              <Link
                key={org.id}
                href={`/colleges/${org.slug}`}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.12] hover:shadow-xl hover:shadow-purple-500/5"
              >
                <div className="mb-4 h-16 w-16 overflow-hidden rounded-xl">
                    <img
                      src={resolveThemeImage(org.logo, themeAssets.collegeLogo)}
                      alt={org.name}
                      className="h-full w-full object-cover"
                    />
                </div>
                <h3 className="mt-4 text-base font-semibold text-white group-hover:text-purple-400">
                  {org.name}
                </h3>
                {(org.city || org.state) && (
                  <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                    <MapPin className="h-3 w-3" />
                    {[org.city, org.state].filter(Boolean).join(", ")}
                  </p>
                )}
                <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {org._count.events} event{org._count.events !== 1 ? "s" : ""}
                  </span>
                  <span className="flex items-center gap-1">
                    <Building2 className="h-3 w-3" />
                    {org._count.members} member{org._count.members !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="mt-4 flex items-center gap-1 text-xs font-medium text-purple-400 opacity-0 transition-opacity group-hover:opacity-100">
                  View Events <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
