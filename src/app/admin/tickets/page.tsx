import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const statusColor: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  TRANSFERRED: "bg-blue-100 text-blue-700",
  REFUNDED: "bg-yellow-100 text-yellow-700",
};

export const dynamic = "force-dynamic";

export default async function AdminTicketsPage() {
  const tickets = await db.ticket.findMany({
    include: {
      event: { select: { title: true } },
      ticketType: { select: { name: true } },
      user: { select: { firstName: true, lastName: true, email: true } },
      order: { select: { id: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Tickets</h2>
          <p className="text-muted-foreground">All issued tickets ({tickets.length} total)</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          {tickets.length === 0 ? (
            <p className="text-muted-foreground">No tickets issued yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 font-medium">Attendee</th>
                    <th className="pb-3 font-medium">Email</th>
                    <th className="pb-3 font-medium">Event</th>
                    <th className="pb-3 font-medium">Ticket Type</th>
                    <th className="pb-3 font-medium">Barcode</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Scanned</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket) => (
                    <tr key={ticket.id} className="border-b last:border-0">
                      <td className="py-3 pr-4">{ticket.attendeeName}</td>
                      <td className="py-3 pr-4 text-muted-foreground">{ticket.attendeeEmail}</td>
                      <td className="py-3 pr-4">{ticket.event.title}</td>
                      <td className="py-3 pr-4">{ticket.ticketType.name}</td>
                      <td className="py-3 pr-4 font-mono text-xs">
                        {ticket.barcode.slice(0, 16)}...
                      </td>
                      <td className="py-3 pr-4">
                        <Badge className={statusColor[ticket.status]}>{ticket.status}</Badge>
                      </td>
                      <td className="py-3">
                        {ticket.scanned ? (
                          <Badge className="bg-green-100 text-green-700">Yes</Badge>
                        ) : (
                          <Badge variant="outline">No</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
