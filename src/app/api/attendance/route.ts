import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session)
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const sessionUserId = (session.user as unknown as { id: string }).id;
    const role = (session.user as { role?: string })?.role;

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || sessionUserId;
    const eventId = searchParams.get("eventId");
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const isAdmin = ["ADMIN", "SUPER_ADMIN"].includes(role || "");

    if (!isAdmin && userId !== sessionUserId) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const where: Record<string, unknown> = { userId };

    if (eventId) {
      where.eventId = eventId;
    }

    if (from || to) {
      const checkInFilter: Record<string, Date> = {};
      if (from) checkInFilter.gte = new Date(from);
      if (to) checkInFilter.lte = new Date(to);
      where.checkIn = checkInFilter;
    }

    const skip = (page - 1) * limit;

    const [records, total] = await Promise.all([
      db.attendance.findMany({
        where,
        include: {
          event: {
            select: { id: true, title: true, slug: true, startDate: true, endDate: true },
          },
        },
        orderBy: { checkIn: "desc" },
        skip,
        take: limit,
      }),
      db.attendance.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: records,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Attendance fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch attendance" },
      { status: 500 }
    );
  }
}
