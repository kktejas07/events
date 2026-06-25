import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, MapPin, Clock, DollarSign, Ticket, Pencil } from "lucide-react";
import OrgEventCreatePage from "./OrgEventCreate";

export default async function OrgEventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  const user = session?.user as { id?: string; role?: string; organizationId?: string } | undefined;
  if (!user?.organizationId) redirect("/login");

  // If id === "new", render the create form
  if (id === "new") {
    return <OrgEventCreatePage />;
  }

  const event = await db.event.findFirst({
    where: { id, organizationId: user.organizationId },
    include: {
      ticketTypes: true,
      venue: true,
      _count: { select: { orders: true, tickets: true } },
    },
  });
  if (!event) redirect("/org-admin/events");

  return (
    <div className="space-y-6">
      <Link
        href="/org-admin/events"
        className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Events
      </Link>

      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">{event.title}</h2>
          <p className="mt-1 text-sm text-gray-400">{event.shortDescription}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/org-admin/events/${id}/edit`}
            className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Pencil className="h-3 w-3" /> Edit
          </Link>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              event.status === "PUBLISHED"
                ? "bg-purple-500/10 text-purple-400"
                : "bg-orange-500/10 text-orange-400"
            }`}
          >
            {event.status}
          </span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { icon: Calendar, label: "Start", value: new Date(event.startDate).toLocaleDateString() },
          { icon: Clock, label: "End", value: new Date(event.endDate).toLocaleDateString() },
          {
            icon: DollarSign,
            label: "Revenue",
            value: `₹${(event._count.orders * 500).toLocaleString()}`,
          },
          { icon: Ticket, label: "Tickets Sold", value: event._count.tickets.toString() },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 backdrop-blur-xl"
          >
            <div className="flex items-center gap-2">
              <s.icon className="h-4 w-4 text-purple-400" />
              <span className="text-xs text-gray-500">{s.label}</span>
            </div>
            <p className="mt-1 text-lg font-semibold text-white">{s.value}</p>
          </div>
        ))}
      </div>

      {event.ticketTypes.length > 0 && (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-xl">
          <h3 className="mb-4 text-sm font-semibold text-white">Ticket Types</h3>
          <div className="space-y-2">
            {event.ticketTypes.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between rounded-xl border border-white/[0.04] bg-white/[0.02] px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-white">{t.name}</p>
                  <p className="text-xs text-gray-500">
                    {t.quantitySold} / {t.quantityLimit} sold
                  </p>
                </div>
                <p className="text-sm font-semibold text-purple-400">
                  ₹{Number(t.price).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
