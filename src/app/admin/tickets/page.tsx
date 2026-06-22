"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { toast } from "sonner";
import { Eye, Ban, Loader2 } from "lucide-react";
import Link from "next/link";

interface Ticket {
  id: string;
  barcode: string;
  status: string;
  scanned: boolean;
  attendeeName: string;
  attendeeEmail: string;
  event: { title: string };
  ticketType: { name: string };
  order: { id: string };
}

const statusColor: Record<string, string> = {
  ACTIVE: "bg-green-500/10 text-green-400 border-green-500/30",
  CANCELLED: "bg-red-500/10 text-red-400 border-red-500/30",
  TRANSFERRED: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  REFUNDED: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
};

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchTickets = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/tickets?page=${page}&limit=20`);
      const json = await res.json();
      if (json.success) {
        setTickets(json.data);
        setTotalPages(json.meta.totalPages);
        setTotal(json.meta.total);
      } else toast.error(json.error || "Failed to load tickets");
    } catch {
      toast.error("Network error");
    }
    setLoading(false);
  }, [page]);

  useEffect(() => {
    setLoading(true);
    fetchTickets();
  }, [fetchTickets]);

  async function handleRevoke(id: string) {
    if (!window.confirm("Revoke this ticket?")) return;
    try {
      const res = await fetch(`/api/admin/tickets/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        toast.success("Ticket revoked");
        fetchTickets();
      } else {
        toast.error(json.error || "Failed to revoke");
      }
    } catch {
      toast.error("Network error");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Tickets</h2>
          <p className="text-gray-400">All issued tickets ({tickets.length} total)</p>
        </div>
      </div>

      <Card className="border-white/10 bg-white/[0.03]">
        <CardHeader>
          <CardTitle className="text-white">All Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          {tickets.length === 0 ? (
            <p className="text-gray-400">No tickets issued yet.</p>
          ) : (
            <>
              <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-left">
                    <th className="pb-3 font-medium text-gray-400">Attendee</th>
                    <th className="pb-3 font-medium text-gray-400">Email</th>
                    <th className="pb-3 font-medium text-gray-400">Event</th>
                    <th className="pb-3 font-medium text-gray-400">Ticket Type</th>
                    <th className="pb-3 font-medium text-gray-400">Barcode</th>
                    <th className="pb-3 font-medium text-gray-400">Status</th>
                    <th className="pb-3 font-medium text-gray-400">Scanned</th>
                    <th className="pb-3 font-medium text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket) => (
                    <tr key={ticket.id} className="border-b border-white/5 last:border-0">
                      <td className="py-3 pr-4 text-white">{ticket.attendeeName}</td>
                      <td className="py-3 pr-4 text-gray-400">{ticket.attendeeEmail}</td>
                      <td className="py-3 pr-4 text-gray-300">{ticket.event.title}</td>
                      <td className="py-3 pr-4 text-gray-300">{ticket.ticketType.name}</td>
                      <td className="py-3 pr-4 font-mono text-xs text-gray-400">
                        {ticket.barcode.slice(0, 16)}...
                      </td>
                      <td className="py-3 pr-4">
                        <span
                          className={`inline-block rounded-full border px-2 py-0.5 text-xs font-medium ${statusColor[ticket.status] || "bg-gray-500/10 text-gray-400"}`}
                        >
                          {ticket.status}
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        {ticket.scanned ? (
                          <span className="inline-block rounded-full border border-green-500/30 bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-400">
                            Yes
                          </span>
                        ) : (
                          <span className="inline-block rounded-full border border-gray-500/30 bg-gray-500/10 px-2 py-0.5 text-xs font-medium text-gray-400">
                            No
                          </span>
                        )}
                      </td>
                      <td className="py-3">
                        <div className="flex gap-1.5">
                          <Link href={`/admin/orders/${ticket.order.id}`}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-400 hover:bg-white/10 hover:text-white"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                          </Link>
                          {ticket.status === "ACTIVE" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                              onClick={() => handleRevoke(ticket.id)}
                            >
                              <Ban className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              page={page}
              totalPages={totalPages}
              total={total}
              onPageChange={setPage}
            />
          </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
