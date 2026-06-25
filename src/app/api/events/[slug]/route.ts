import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const isId = /^[a-z0-9]{20,}$/i.test(params.slug) && !params.slug.includes("-");

    const event = await db.event.findUnique({
      where: isId ? { id: params.slug } : { slug: params.slug },
      include: {
        ticketTypes: { where: { isActive: true }, orderBy: { sortOrder: "asc" } },
        venue: true,
        sessions: {
          include: { speaker: true },
          orderBy: [{ day: "asc" }, { startTime: "asc" }],
        },
        sponsors: { include: { sponsor: true } },
        faqs: { orderBy: { sortOrder: "asc" } },
      },
    });

    if (!event) {
      return NextResponse.json({ success: false, error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: event });
  } catch (error) {
    console.error("Event fetch error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch event" }, { status: 500 });
  }
}
