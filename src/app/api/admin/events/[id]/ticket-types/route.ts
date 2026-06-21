import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { ticketTypes } = body as {
      ticketTypes: Array<{
        id?: string;
        name: string;
        price: number;
        quantityLimit: number;
        perks: string[];
        color: string;
        isActive: boolean;
        sortOrder: number;
      }>;
    };

    if (!Array.isArray(ticketTypes)) {
      return NextResponse.json(
        { success: false, error: "ticketTypes array required" },
        { status: 400 }
      );
    }

    // Get existing ticket type IDs for this event
    const existing = await db.ticketType.findMany({
      where: { eventId: params.id },
      select: { id: true },
    });
    const existingIds = new Set(existing.map((t) => t.id));

    // Track which new IDs are being submitted
    const submittedIds = new Set(ticketTypes.filter((t) => t.id).map((t) => t.id as string));

    // Delete ticket types that were removed
    const toDelete = [...existingIds].filter((id) => !submittedIds.has(id));
    if (toDelete.length > 0) {
      await db.ticketType.deleteMany({
        where: { id: { in: toDelete }, eventId: params.id },
      });
    }

    // Upsert each ticket type
    for (const tt of ticketTypes) {
      const data = {
        eventId: params.id,
        name: tt.name || "Untitled",
        price: tt.price || 0,
        quantityLimit: tt.quantityLimit || 100,
        perks: Array.isArray(tt.perks) ? tt.perks : [],
        color: tt.color || "#6C5CE7",
        isActive: tt.isActive !== false,
        sortOrder: tt.sortOrder || 0,
      };

      if (tt.id && existingIds.has(tt.id)) {
        await db.ticketType.update({
          where: { id: tt.id },
          data,
        });
      } else {
        await db.ticketType.create({ data });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Ticket types update error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update ticket types" },
      { status: 500 }
    );
  }
}
