import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminEventsPage() {
  const events = [
    { id: "1", title: "AI Summit 2026", date: "Oct 1-5, 2026", tickets: 450, status: "Published" },
    {
      id: "2",
      title: "Web Dev Conference",
      date: "Nov 10-12, 2026",
      tickets: 120,
      status: "Draft",
    },
    { id: "3", title: "Startup Summit", date: "Dec 5-7, 2026", tickets: 0, status: "Draft" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Events</h2>
          <p className="text-muted-foreground">Manage your events and schedules</p>
        </div>
        <Link href="/admin/events/new">
          <Button>Create Event</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 font-medium">Event</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Tickets Sold</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id} className="border-b last:border-0">
                    <td className="py-3 font-medium">{event.title}</td>
                    <td className="py-3 text-muted-foreground">{event.date}</td>
                    <td className="py-3">{event.tickets}</td>
                    <td className="py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          event.status === "Published"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {event.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <Link href={`/admin/events/${event.id}`}>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </Link>
                        <Button variant="ghost" size="sm" className="text-danger">
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
