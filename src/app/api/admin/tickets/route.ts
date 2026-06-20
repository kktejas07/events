import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session)
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const tickets = await db.ticket.findMany({
      include: {
        event: { select: { title: true } },
        ticketType: { select: { name: true } },
        user: { select: { firstName: true, lastName: true, email: true } },
        order: { select: { id: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return NextResponse.json({ success: true, data: tickets });
  } catch (error) {
    console.error("Admin tickets fetch error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch tickets" }, { status: 500 });
  }
}
