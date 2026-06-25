import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Calendar, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function OrgEventsPage() {
  const session = await auth();
  const user = session?.user as { id?: string; role?: string; organizationId?: string } | undefined;
  if (
    !user ||
    !["ADMIN", "SUPER_ADMIN", "ORGANIZATION_ADMIN"].includes(user.role || "") ||
    !user.organizationId
  )
    redirect("/login");

  const events = await db.event.findMany({
    where: { organizationId: user.organizationId },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { ticketTypes: true, orders: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">My Events</h2>
        <Link href="/org-admin/events/new">
          <Button className="gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700">
            <Plus className="h-4 w-4" />
            New Event
          </Button>
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.02] py-16">
          <Calendar className="mb-3 h-10 w-10 text-gray-600" />
          <p className="text-sm text-gray-500">No events yet. Create your first event!</p>
          <Link href="/org-admin/events/new" className="mt-4">
            <Button className="gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
              <Plus className="h-4 w-4" />
              Create Event
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((e) => (
            <Link key={e.id} href={`/org-admin/events/${e.id}`}>
              <div className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur-xl transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.06] hover:shadow-xl">
                {e.coverImage && (
                  <div className="mb-3 h-32 overflow-hidden rounded-xl">
                    <img
                      src={e.coverImage}
                      alt={e.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{e.title}</h3>
                    <p className="mt-1 line-clamp-2 text-xs text-gray-500">
                      {e.shortDescription || e.description?.slice(0, 80)}
                    </p>
                  </div>
                  <span
                    className={`ml-2 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      e.status === "PUBLISHED"
                        ? "bg-purple-500/10 text-purple-400"
                        : e.status === "DRAFT"
                          ? "bg-orange-500/10 text-orange-400"
                          : "bg-gray-500/10 text-gray-400"
                    }`}
                  >
                    {e.status}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-3 text-[11px] text-gray-500">
                  <span>{e._count.ticketTypes} ticket types</span>
                  <span>&middot;</span>
                  <span>{e._count.orders} orders</span>
                  {e.status === "PUBLISHED" && (
                    <>
                      <span className="ml-auto">
                        <ExternalLink className="h-3 w-3" />
                      </span>
                    </>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
