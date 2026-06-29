"use client";

import { useState } from "react";
import { Ticket } from "lucide-react";
import TicketDetailModal from "./ticket-detail-modal";

interface TicketItem {
  id: string;
  barcode: string;
  status: string;
  scanned: boolean;
  scannedAt: string | null;
  attendeeName: string;
  attendeeEmail?: string;
  event: { title: string; startDate: Date | string; endDate?: Date | string | null; venue?: string | null };
  ticketType: { name: string; price: number; color?: string | null };
  order?: { status: string } | null;
}

interface Props {
  tickets: TicketItem[];
}

const statusColor: Record<string, string> = {
  PAID: "bg-green-50 text-green-700",
  PENDING: "bg-yellow-50 text-yellow-700",
  UNPAID: "bg-red-50 text-red-700",
};

export default function TicketListClient({ tickets }: Props) {
  const [selected, setSelected] = useState<TicketItem | null>(null);

  return (
    <>
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <Ticket className="h-4 w-4" />
          Tickets
        </h3>
        <div className="mt-3 space-y-2">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => setSelected(ticket)}
              className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3 text-sm transition hover:border-blue-200 hover:bg-blue-50/30 cursor-pointer group"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-gray-900 group-hover:text-blue-700 transition-colors">
                  {ticket.event?.title || "Unknown Event"}
                </p>
                <p className="text-xs text-gray-500">
                  {ticket.ticketType?.name} &middot;{" "}
                  {ticket.event?.startDate
                    ? new Date(ticket.event.startDate).toLocaleDateString()
                    : "TBA"}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {ticket.scanned && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 font-medium">
                    Used
                  </span>
                )}
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    statusColor[ticket.order?.status || ""] || "bg-gray-50 text-gray-600"
                  }`}
                >
                  {ticket.order?.status || "PENDING"}
                </span>
                <span className="text-gray-300 text-xs group-hover:text-blue-400 transition-colors">
                  View →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selected && (
        <TicketDetailModal ticket={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
