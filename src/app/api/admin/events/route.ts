import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { eventSchema } from "@/lib/validations";
import { auth } from "@/lib/auth";
import { generateSlug } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const [events, total] = await Promise.all([
      db.event.findMany({
        include: {
          ticketTypes: { where: { isActive: true } },
          venue: true,
          _count: { select: { orders: true } },
        },
        orderBy: { startDate: "desc" },
        skip,
        take: limit,
      }),
      db.event.count(),
    ]);

    return NextResponse.json({
      success: true,
      data: events,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Admin events fetch error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch events" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = eventSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const slug = parsed.data.slug || generateSlug(parsed.data.title);

    const existing = await db.event.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: `An event with slug "${slug}" already exists` },
        { status: 409 }
      );
    }

    const event = await db.event.create({
      data: {
        ...parsed.data,
        slug,
        startDate: new Date(parsed.data.startDate),
        endDate: new Date(parsed.data.endDate),
      },
      include: { venue: true, ticketTypes: true },
    });

    return NextResponse.json({ success: true, data: event }, { status: 201 });
  } catch (error) {
    console.error("Admin event create error:", error);
    return NextResponse.json({ success: false, error: "Failed to create event" }, { status: 500 });
  }
}
