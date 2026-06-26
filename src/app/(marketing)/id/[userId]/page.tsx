import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Calendar, Ticket, CreditCard, Mail, Phone } from "lucide-react";
import Link from "next/link";

interface Props {
  params: { userId: string };
}

export default async function UserIdPage({ params }: Props) {
  const user = await db.user.findUnique({
    where: { id: params.userId },
    include: {
      tickets: {
        include: {
          event: { select: { title: true, startDate: true } },
          ticketType: { select: { name: true } },
          order: { select: { status: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 20,
      },
    },
  });

  if (!user) notFound();

  const name = [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email;
  const initials = name
    .split(" ")
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const memberSince = user.emailVerified
    ? new Date(user.emailVerified).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      })
    : new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
      <div className="mx-auto max-w-2xl px-4">
        {/* Card */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-gray-200">
          {/* Top brand bar */}
          <div className="bg-gradient-to-r from-blue-700 to-indigo-700 px-8 py-6">
            <h1 className="text-2xl font-bold text-white">Echo</h1>
            <p className="text-sm text-blue-200">Voices Across Generations</p>
          </div>

          {/* Profile section */}
          <div className="px-8 pb-6 pt-0">
            <div className="-mt-10 flex items-end gap-5">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-2xl font-bold text-white shadow-lg ring-4 ring-white">
                {initials}
              </div>
              <div className="pb-1">
                <h2 className="text-xl font-bold text-gray-900">{name}</h2>
                <p className="text-sm text-gray-500">{memberSince}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-4 py-3 text-sm">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-gray-700">{user.email}</span>
              </div>
              {user.phone && (
                <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-4 py-3 text-sm">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-700">{user.phone}</span>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-2 gap-4 rounded-xl border bg-gray-50/50 p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-700">{user.tickets.length}</p>
                <p className="text-xs text-gray-500">Total Tickets</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-700">
                  {user.tickets.filter((t) => t.order?.status === "PAID").length}
                </p>
                <p className="text-xs text-gray-500">Active</p>
              </div>
            </div>
          </div>

          {/* Tickets section */}
          {user.tickets.length > 0 && (
            <div className="border-t border-gray-100 px-8 py-6">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Ticket className="h-4 w-4" />
                Recent Tickets
              </h3>
              <div className="mt-3 space-y-2">
                {user.tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3 text-sm transition hover:border-blue-100 hover:bg-blue-50/30"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-gray-900">
                        {ticket.event?.title || "Unknown Event"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {ticket.ticketType?.name} &middot;{" "}
                        {ticket.event?.startDate
                          ? new Date(ticket.event.startDate).toLocaleDateString()
                          : "TBA"}
                      </p>
                    </div>
                    <span
                      className={`ml-3 shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        ticket.order?.status === "PAID"
                          ? "bg-green-50 text-green-700"
                          : "bg-yellow-50 text-yellow-700"
                      }`}
                    >
                      {ticket.order?.status || "PENDING"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="border-t border-gray-100 px-8 py-4 text-center text-xs text-gray-400">
            Echo &mdash; Voices Across Generations
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-gray-400">
          <Link href="/" className="underline hover:text-gray-600">
            events.forgetechno.com
          </Link>
        </p>
      </div>
    </div>
  );
}
