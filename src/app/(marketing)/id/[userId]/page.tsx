import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Ticket } from "lucide-react";
import Link from "next/link";
import DigitalIdCard from "@/components/ui/digital-id-card";

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

  return (
    <div className="min-h-screen py-12" style={{ backgroundColor: "#faf7f2" }}>
      <div className="mx-auto px-4" style={{ maxWidth: "600px" }}>
        {/* Digital ID Card */}
        <DigitalIdCard user={user} />

        {/* Tickets section */}
        {user.tickets.length > 0 && (
          <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Ticket className="h-4 w-4" />
              Recent Tickets
            </h3>
            <div className="mt-3 space-y-2">
              {user.tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3 text-sm transition hover:border-amber-100 hover:bg-amber-50/30"
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

        <p className="mt-4 text-center text-xs text-gray-400">
          <Link href="/" className="underline hover:text-gray-600">
            events.forgetechno.com
          </Link>
        </p>
      </div>
    </div>
  );
}
