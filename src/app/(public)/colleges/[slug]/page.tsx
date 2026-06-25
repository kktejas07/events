import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { themeAssets } from "@/lib/theme-images";
import { resolveThemeImage } from "@/lib/resolve-theme-image";
import { ArrowLeft, Calendar, MapPin, Users, Globe, Ticket } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CollegeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const org = await db.organization.findUnique({
    where: { slug },
    include: {
      events: {
        where: { status: "PUBLISHED" },
        include: {
          ticketTypes: { select: { price: true, name: true } },
          venue: { select: { city: true, country: true } },
          _count: { select: { tickets: true } },
        },
        orderBy: { startDate: "asc" },
      },
      _count: { select: { members: true } },
    },
  });

  if (!org) notFound();

  return (
    <div className="min-h-screen bg-[#050508] py-24">
      <div className="container">
        <Link
          href="/colleges"
          className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> All Colleges
        </Link>

        <div className="mt-6">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 overflow-hidden rounded-xl">
              <img
                src={resolveThemeImage(org.logo, themeAssets.collegeLogo)}
                alt={org.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">{org.name}</h1>
              {(org.city || org.state) && (
                <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                  <MapPin className="h-4 w-4" />
                  {[org.city, org.state].filter(Boolean).join(", ")}
                  {org.country ? `, ${org.country}` : ""}
                </p>
              )}
            </div>
          </div>

          {org.description && (
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-gray-400">
              {org.description}
            </p>
          )}

          <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {org.events.length} event{org.events.length !== 1 ? "s" : ""}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {org._count.members} member{org._count.members !== 1 ? "s" : ""}
            </span>
            {org.website && (
              <a
                href={org.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-purple-400 hover:text-purple-300"
              >
                <Globe className="h-4 w-4" /> Website
              </a>
            )}
          </div>
        </div>

        {org.events.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-12 text-center backdrop-blur-xl">
            <Calendar className="mx-auto h-8 w-8 text-gray-500" />
            <p className="mt-3 text-gray-400">No upcoming events from this college.</p>
          </div>
        ) : (
          <div className="mt-12 space-y-4">
            <h2 className="text-lg font-semibold text-white">Upcoming Events</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {org.events.map((event) => (
                <Link
                  key={event.id}
                  href={`/events/${event.slug}`}
                  className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.12] hover:shadow-xl hover:shadow-purple-500/5"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-white group-hover:text-purple-400">
                        {event.title}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-xs text-gray-500">
                        {event.shortDescription}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(event.startDate).toLocaleDateString()}
                    </span>
                    {event.venue && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {event.venue.city}
                      </span>
                    )}
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-white/[0.04] pt-3">
                    <span className="text-xs text-gray-500">
                      <Ticket className="mr-1 inline h-3 w-3" />
                      {event._count.tickets} booked
                    </span>
                    <span className="text-xs font-medium text-purple-400">
                      {event.ticketTypes.length > 0
                        ? `From ₹${Math.min(...event.ticketTypes.map((t) => Number(t.price)))}`
                        : "Free"}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
