import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Ticket } from "lucide-react";

export default async function OrgTicketsPage() {
  const session = await auth();
  const user = session?.user as { id?: string; role?: string; organizationId?: string } | undefined;
  if (!user?.organizationId) redirect("/login");

  const tickets = await db.ticket.findMany({
    where: { event: { organizationId: user.organizationId } },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      event: { select: { title: true } },
      ticketType: { select: { name: true } },
      user: { select: { firstName: true, lastName: true, email: true } },
    },
  });

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">Tickets</h2>
      {tickets.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.02] py-16">
          <Ticket className="mb-3 h-10 w-10 text-gray-600" />
          <p className="text-sm text-gray-500">No tickets sold yet</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] text-xs text-gray-500">
                <th className="px-4 py-3 font-medium">Attendee</th>
                <th className="px-4 py-3 font-medium">Event</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Barcode</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t) => (
                <tr
                  key={t.id}
                  className="border-b border-white/[0.04] text-white last:border-0 hover:bg-white/[0.02]"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium">{t.attendeeName}</p>
                    <p className="text-xs text-gray-500">{t.attendeeEmail}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-400">{t.event.title}</td>
                  <td className="px-4 py-3 text-gray-400">{t.ticketType.name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{t.barcode}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        t.status === "ACTIVE"
                          ? "bg-purple-500/10 text-purple-400"
                          : t.scanned
                            ? "bg-blue-500/10 text-blue-400"
                            : "bg-gray-500/10 text-gray-400"
                      }`}
                    >
                      {t.scanned ? "Scanned" : t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
