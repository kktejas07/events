import { Card, CardContent } from "@/components/ui/card";
import { QRCode } from "react-qr-code";
import { Calendar, Clock, MapPin, User } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { type Ticket, type Event, type TicketType } from "@prisma/client";

interface TicketCardProps {
  ticket: Ticket & {
    event: Event;
    ticketType: TicketType;
  };
  compact?: boolean;
}

export function TicketCard({ ticket, compact = false }: TicketCardProps) {
  const barcodeValue = ticket.barcode;
  const tierColor = ticket.ticketType.color || "#6C5CE7";

  return (
    <Card
      className="relative overflow-hidden border-t-4 transition-shadow hover:shadow-xl"
      style={{ borderTopColor: tierColor }}
    >
      {/* Watermark Logo */}
      <div className="absolute -right-4 -top-4 select-none text-8xl font-bold text-foreground/5">
        E
      </div>

      <CardContent className="relative p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg"
              style={{ backgroundColor: tierColor }}
            >
              <span className="text-lg font-bold text-white">E</span>
            </div>
            <div>
              <h3 className="font-bold text-foreground">{ticket.event.title}</h3>
              <p className="text-sm text-muted-foreground">{ticket.ticketType.name}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold" style={{ color: tierColor }}>
              ₹{Number(ticket.ticketType.price).toLocaleString()}
            </div>
          </div>
        </div>

        {!compact && (
          <>
            <div className="mt-4 space-y-1.5 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(ticket.event.startDate)}
              </div>
              <div className="flex items-center gap-2">
                <User className="h-3.5 w-3.5" />
                {ticket.attendeeName}
              </div>
            </div>

            <div className="mt-4 space-y-1">
              {ticket.ticketType.perks.slice(0, 4).map((perk: string) => (
                <div key={perk} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {perk}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Barcode */}
        <div className="mt-4 flex flex-col items-center gap-2 border-t pt-4">
          <div className="rounded-lg bg-white p-3">
            <QRCode
              value={barcodeValue}
              size={compact ? 80 : 120}
              style={{ height: "auto", maxWidth: "100%" }}
            />
          </div>
          <div className="text-center">
            <p className="font-mono text-xs text-muted-foreground">{ticket.barcode}</p>
            <p className="text-[10px] text-muted-foreground">Scan QR code at venue entrance</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
