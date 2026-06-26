import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateTicketPdf } from "@/lib/pdf/ticket-pdf";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const ticket = await db.ticket.findUnique({
      where: { id: params.id },
      include: {
        event: { include: { venue: true } },
        ticketType: true,
        order: true,
      },
    });

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    const pdfBytes = await generateTicketPdf({
      orderId: ticket.orderId,
      eventName: ticket.event.title,
      eventDate: ticket.event.startDate
        ? new Date(ticket.event.startDate).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "TBA",
      eventVenue: ticket.event.venue?.name || "TBD",
      attendeeName: ticket.attendeeName || ticket.order.userId,
      ticketType: ticket.ticketType?.name || "Ticket",
      quantity: 1,
      total: Number(ticket.order.total),
      barcode: ticket.barcode,
    });

    return new NextResponse(pdfBytes as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="ticket-${ticket.barcode}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Ticket PDF error:", error);
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
  }
}
