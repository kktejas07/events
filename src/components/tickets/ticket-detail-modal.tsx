"use client";

import { QRCode } from "react-qr-code";
import { Calendar, Clock, MapPin, User, X, CheckCircle2, XCircle, Clock4, ScanLine } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface TicketDetail {
  id: string;
  barcode: string;
  status: string;
  scanned: boolean;
  scannedAt?: string | null;
  attendeeName: string;
  attendeeEmail?: string;
  event: { title: string; startDate: Date | string; endDate?: Date | string | null; venue?: string | null };
  ticketType: { name: string; price: number; color?: string | null };
  order?: { status: string } | null;
}

interface Props {
  ticket: TicketDetail;
  onClose: () => void;
}

function getTicketStatus(ticket: TicketDetail): { label: string; color: string; icon: React.ReactNode } {
  if (ticket.status === "CANCELLED" || ticket.status === "REFUNDED") {
    return { label: "Cancelled", color: "#DC2626", icon: <XCircle className="h-4 w-4" /> };
  }
  if (ticket.scanned) {
    return { label: "Used · Scanned", color: "#F59E0B", icon: <ScanLine className="h-4 w-4" /> };
  }
  const now = new Date();
  const endDate = ticket.event.endDate ? new Date(ticket.event.endDate) : null;
  if (endDate && endDate < now) {
    return { label: "Expired", color: "#6B7280", icon: <Clock4 className="h-4 w-4" /> };
  }
  if (ticket.order?.status !== "PAID") {
    return { label: ticket.order?.status || "Pending", color: "#F59E0B", icon: <Clock4 className="h-4 w-4" /> };
  }
  return { label: "Valid", color: "#10B981", icon: <CheckCircle2 className="h-4 w-4" /> };
}

export default function TicketDetailModal({ ticket, onClose }: Props) {
  const tierColor = ticket.ticketType.color || "#6C5CE7";
  const status = getTicketStatus(ticket);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(2px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 rounded-full p-1.5 bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <X className="h-4 w-4 text-gray-600" />
        </button>

        {/* Status bar */}
        <div
          className="flex items-center gap-2 px-5 py-3 text-sm font-semibold"
          style={{ backgroundColor: `${status.color}15`, color: status.color, borderBottom: `1px solid ${status.color}30` }}
        >
          {status.icon}
          {status.label}
          {ticket.scanned && ticket.scannedAt && (
            <span className="font-normal text-xs ml-auto">
              {formatDate(new Date(ticket.scannedAt))}
            </span>
          )}
        </div>

        {/* Header */}
        <div className="px-5 pt-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg shrink-0"
                style={{ backgroundColor: tierColor }}
              >
                <span className="text-lg font-bold text-white">E</span>
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-gray-900 text-sm truncate">{ticket.event.title}</h3>
                <p className="text-sm text-gray-500">{ticket.ticketType.name}</p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-xl font-bold" style={{ color: tierColor }}>
                ₹{Number(ticket.ticketType.price).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Event details */}
          <div className="mt-3 space-y-1.5 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 shrink-0" />
              {formatDate(new Date(ticket.event.startDate))}
            </div>
            <div className="flex items-center gap-2">
              <User className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{ticket.attendeeName}</span>
            </div>
          </div>
        </div>

        {/* QR Code pass */}
        <div className="px-5 py-4 flex flex-col items-center border-t mt-4">
          <div className="rounded-xl bg-white p-4 shadow-inner border">
            <QRCode
              value={ticket.barcode}
              size={180}
              style={{ height: "auto", maxWidth: "100%" }}
            />
          </div>
          <p className="mt-2 font-mono text-xs text-gray-400 break-all text-center">{ticket.barcode}</p>
          <p className="text-[11px] text-gray-400 mt-1">
            {ticket.scanned
              ? "This pass has already been used"
              : "Show this QR code at the venue entrance"}
          </p>
        </div>

        {/* Footer info */}
        <div className="px-5 py-3 bg-gray-50 border-t text-xs text-gray-400 text-center">
          Ticket ID: {ticket.id.slice(-8).toUpperCase()} · Echo — Voices Across Generations
        </div>
      </div>
    </div>
  );
}
