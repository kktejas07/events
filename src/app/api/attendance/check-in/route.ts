import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session)
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const sessionUserId = (session.user as unknown as { id: string }).id;

    const body = await req.json();
    const { userId, eventId } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "userId is required" },
        { status: 400 }
      );
    }

    const attendance = await db.attendance.create({
      data: {
        userId,
        eventId: eventId || null,
        checkIn: new Date(),
        method: "QR_SCAN",
        scannedBy: sessionUserId,
      },
    });

    if (eventId) {
      await db.ticket.updateMany({
        where: { userId, eventId, checkedIn: false },
        data: { checkedIn: true },
      });
    }

    await db.auditLog.create({
      data: {
        userId: sessionUserId,
        action: "CHECK_IN",
        entityType: "Attendance",
        entityId: attendance.id,
        details: { checkedInUserId: userId, eventId: eventId || null },
      },
    });

    return NextResponse.json({ success: true, data: attendance }, { status: 201 });
  } catch (error) {
    console.error("Check-in error:", error);
    return NextResponse.json({ success: false, error: "Failed to check in" }, { status: 500 });
  }
}
