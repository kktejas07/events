import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session)
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { barcode } = await req.json();
    if (!barcode)
      return NextResponse.json({ success: false, error: "Barcode is required" }, { status: 400 });

    const ticket = await db.ticket.findUnique({
      where: { barcode },
      include: {
        ticketType: { select: { name: true } },
        user: { select: { firstName: true, lastName: true } },
        event: { select: { title: true } },
      },
    });

    if (!ticket) {
      return NextResponse.json({ success: false, error: "Ticket not found" }, { status: 404 });
    }

    if (ticket.status !== "ACTIVE") {
      return NextResponse.json(
        { success: false, error: `Ticket is ${ticket.status.toLowerCase()}` },
        { status: 400 }
      );
    }

    await db.ticket.update({
      where: { id: ticket.id },
      data: { scanned: true },
    });

    return NextResponse.json({
      success: true,
      data: {
        attendeeName: `${ticket.user.firstName} ${ticket.user.lastName}`,
        ticketTypeName: ticket.ticketType.name,
        eventName: ticket.event.title,
        scanned: true,
      },
    });
  } catch (error) {
    console.error("Ticket verify error:", error);
    return NextResponse.json({ success: false, error: "Failed to verify ticket" }, { status: 500 });
  }
}
