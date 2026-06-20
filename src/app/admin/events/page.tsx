"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Eye } from "lucide-react";

interface Event {
  id: string;
  title: string;
  slug: string;
  startDate: string;
  endDate: string;
  status: string;
  category: string | null;
  _count: { orders: number };
  venue?: { name: string; city: string; country: string } | null;
}

export default function AdminEventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchEvents() {
    try {
      const res = await fetch("/api/admin/events");
      const json = await res.json();
      if (json.success) {
        setEvents(json.data);
      } else {
        toast.error(json.error || "Failed to load events");
      }
    } catch {
      toast.error("Network error loading events");
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchEvents();
  }, []);

  async function handleDelete(id: string, title: string) {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        toast.success("Event deleted");
        fetchEvents();
      } else {
        toast.error(json.error || "Failed to delete");
      }
    } catch {
      toast.error("Network error deleting event");
    }
  }

  function formatDate(d: string) {
    return new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function statusColor(status: string) {
    switch (status) {
      case "PUBLISHED":
        return "bg-green-900/30 text-green-400 border-green-500/30";
      case "DRAFT":
        return "bg-yellow-900/30 text-yellow-400 border-yellow-500/30";
      case "CANCELLED":
        return "bg-red-900/30 text-red-400 border-red-500/30";
      case "COMPLETED":
        return "bg-blue-900/30 text-blue-400 border-blue-500/30";
      default:
        return "bg-gray-800 text-gray-400 border-gray-600";
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Events</h2>
            <p className="text-gray-400">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Events</h2>
          <p className="text-gray-400">Manage your events and schedules</p>
        </div>
        <Link href="/admin/events/new">
          <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg shadow-purple-600/30">
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </Button>
        </Link>
      </div>

      {events.length === 0 ? (
        <Card className="border-white/10 bg-white/[0.03]">
          <CardContent className="py-12 text-center">
            <p className="text-gray-400">No events yet. Create your first event!</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-white/10 bg-white/[0.03]">
          <CardHeader>
            <CardTitle className="text-white">All Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-left">
                    <th className="pb-3 font-medium text-gray-400">Event</th>
                    <th className="pb-3 font-medium text-gray-400">Date</th>
                    <th className="pb-3 font-medium text-gray-400">Venue</th>
                    <th className="pb-3 font-medium text-gray-400">Orders</th>
                    <th className="pb-3 font-medium text-gray-400">Status</th>
                    <th className="pb-3 font-medium text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => {
                    const dateStr =
                      formatDate(event.startDate) +
                      (event.startDate !== event.endDate ? ` - ${formatDate(event.endDate)}` : "");
                    const venueStr = event.venue ? `${event.venue.name}, ${event.venue.city}` : "—";

                    return (
                      <tr key={event.id} className="border-b border-white/5 last:border-0">
                        <td className="py-3 font-medium text-white">{event.title}</td>
                        <td className="py-3 text-gray-400">{dateStr}</td>
                        <td className="py-3 text-gray-400">{venueStr}</td>
                        <td className="py-3 text-gray-400">{event._count.orders}</td>
                        <td className="py-3">
                          <span
                            className={`inline-block rounded-full border px-2 py-0.5 text-xs font-medium ${statusColor(event.status)}`}
                          >
                            {event.status}
                          </span>
                        </td>
                        <td className="py-3">
                          <div className="flex gap-1.5">
                            <Link href={`/admin/events/${event.id}`}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-white/10 text-gray-300 hover:bg-white/10 hover:text-white"
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-white/10 text-red-400 hover:bg-red-900/20 hover:text-red-300"
                              onClick={() => handleDelete(event.id, event.title)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
