import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session)
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const userId = (session.user as unknown as { id: string }).id;
    const body = await req.json();
    const { barcode } = body;
    if (!barcode)
      return NextResponse.json({ success: false, error: "Barcode is required" }, { status: 400 });

    // Capture scanner metadata
    const ipAddress =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";
    const deviceInfo = parseDeviceInfo(userAgent);

    const ticket = await db.ticket.findUnique({
      where: { barcode },
      include: {
        ticketType: { select: { name: true } },
        user: { select: { firstName: true, lastName: true, email: true } },
        event: { select: { id: true, title: true } },
      },
    });

    // Log the scan attempt
    if (ticket) {
      await db.scanLog.create({
        data: {
          ticketId: ticket.id,
          eventId: ticket.event.id,
          scannedBy: userId,
          success: ticket.status === "ACTIVE" && !ticket.scanned,
          result: ticket.status !== "ACTIVE"
            ? `Ticket is ${ticket.status.toLowerCase()}`
            : ticket.scanned
              ? "Already scanned"
              : "Valid — checked in",
          deviceInfo,
          ipAddress,
          userAgent,
        },
      });
    }

    if (!ticket) {
      return NextResponse.json({ success: false, error: "Ticket not found" }, { status: 404 });
    }

    if (ticket.status !== "ACTIVE") {
      return NextResponse.json(
        { success: false, error: `Ticket is ${ticket.status.toLowerCase()}` },
        { status: 400 }
      );
    }

    if (ticket.scanned) {
      return NextResponse.json(
        { success: false, error: "Ticket already scanned" },
        { status: 400 }
      );
    }

    await db.ticket.update({
      where: { id: ticket.id },
      data: {
        scanned: true,
        scannedAt: new Date(),
        scannedBy: userId,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        attendeeName: `${ticket.user.firstName} ${ticket.user.lastName}`,
        attendeeEmail: ticket.user.email,
        ticketTypeName: ticket.ticketType.name,
        eventName: ticket.event.title,
        scanned: true,
        scannedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Ticket verify error:", error);
    return NextResponse.json({ success: false, error: "Failed to verify ticket" }, { status: 500 });
  }
}

function parseDeviceInfo(ua: string): string {
  if (!ua || ua === "unknown") return "Unknown";
  const parts: string[] = [];

  if (ua.includes("iPhone") || ua.includes("iPad")) parts.push("Apple");
  else if (ua.includes("Android")) parts.push("Android");
  else if (ua.includes("Windows")) parts.push("Windows");
  else if (ua.includes("Mac")) parts.push("macOS");
  else if (ua.includes("Linux")) parts.push("Linux");

  if (ua.includes("Chrome") && !ua.includes("Edg")) parts.push("Chrome");
  else if (ua.includes("Firefox")) parts.push("Firefox");
  else if (ua.includes("Safari") && !ua.includes("Chrome")) parts.push("Safari");
  else if (ua.includes("Edg")) parts.push("Edge");

  if (ua.includes("Mobile")) parts.push("Mobile");

  return parts.join(" / ") || "Unknown";
}
