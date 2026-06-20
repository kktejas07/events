import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { eventSchema } from "@/lib/validations";
import { auth } from "@/lib/auth";
import { generateSlug } from "@/lib/utils";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const event = await db.event.findUnique({
      where: { id: params.id },
      include: {
        ticketTypes: { orderBy: { sortOrder: "asc" } },
        venue: true,
        sessions: { include: { speaker: true }, orderBy: [{ day: "asc" }, { startTime: "asc" }] },
        sponsors: { include: { sponsor: true } },
        faqs: { orderBy: { sortOrder: "asc" } },
      },
    });

    if (!event) {
      return NextResponse.json({ success: false, error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: event });
  } catch (error) {
    console.error("Admin event fetch error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch event" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const existing = await db.event.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: "Event not found" }, { status: 404 });
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
    const slugExists = await db.event.findFirst({
      where: { slug, id: { not: params.id } },
    });
    if (slugExists) {
      return NextResponse.json(
        { success: false, error: `Another event with slug "${slug}" already exists` },
        { status: 409 }
      );
    }

    const event = await db.event.update({
      where: { id: params.id },
      data: {
        ...parsed.data,
        slug,
        startDate: new Date(parsed.data.startDate),
        endDate: new Date(parsed.data.endDate),
      },
      include: { venue: true, ticketTypes: true },
    });

    return NextResponse.json({ success: true, data: event });
  } catch (error) {
    console.error("Admin event update error:", error);
    return NextResponse.json({ success: false, error: "Failed to update event" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const existing = await db.event.findUnique({
      where: { id: params.id },
      include: { orders: { take: 1 } },
    });
    if (!existing) {
      return NextResponse.json({ success: false, error: "Event not found" }, { status: 404 });
    }
    if (existing.orders.length > 0) {
      return NextResponse.json(
        { success: false, error: "Cannot delete event with existing orders" },
        { status: 400 }
      );
    }

    await db.event.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true, message: "Event deleted" });
  } catch (error) {
    console.error("Admin event delete error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete event" }, { status: 500 });
  }
}
