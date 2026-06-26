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
    let attendance;

    if (body.attendanceId) {
      attendance = await db.attendance.findUnique({
        where: { id: body.attendanceId },
      });

      if (!attendance) {
        return NextResponse.json(
          { success: false, error: "Attendance record not found" },
          { status: 404 }
        );
      }

      if (attendance.checkOut) {
        return NextResponse.json(
          { success: false, error: "Already checked out" },
          { status: 400 }
        );
      }

      attendance = await db.attendance.update({
        where: { id: body.attendanceId },
        data: { checkOut: new Date() },
      });
    } else if (body.userId) {
      attendance = await db.attendance.findFirst({
        where: {
          userId: body.userId,
          eventId: body.eventId || null,
          checkOut: null,
        },
        orderBy: { checkIn: "desc" },
      });

      if (!attendance) {
        return NextResponse.json(
          { success: false, error: "No open attendance record found" },
          { status: 404 }
        );
      }

      attendance = await db.attendance.update({
        where: { id: attendance.id },
        data: { checkOut: new Date() },
      });
    } else {
      return NextResponse.json(
        { success: false, error: "attendanceId or userId is required" },
        { status: 400 }
      );
    }

    await db.auditLog.create({
      data: {
        userId: sessionUserId,
        action: "CHECK_OUT",
        entityType: "Attendance",
        entityId: attendance.id,
        details: { checkedOutUserId: attendance.userId, eventId: attendance.eventId },
      },
    });

    return NextResponse.json({ success: true, data: attendance });
  } catch (error) {
    console.error("Check-out error:", error);
    return NextResponse.json({ success: false, error: "Failed to check out" }, { status: 500 });
  }
}
