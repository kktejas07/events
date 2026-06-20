import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session)
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const order = await db.order.findUnique({
      where: { id: params.id },
      include: {
        user: true,
        event: true,
        items: { include: { ticketType: true } },
        tickets: { include: { ticketType: true } },
      },
    });

    if (!order)
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    console.error("Admin order fetch error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch order" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session)
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const existing = await db.order.findUnique({ where: { id: params.id } });
    if (!existing)
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });

    const body = await req.json();
    const { status, notes } = body;

    const order = await db.order.update({
      where: { id: params.id },
      data: { status: status || existing.status, notes: notes ?? existing.notes },
    });

    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    console.error("Admin order update error:", error);
    return NextResponse.json({ success: false, error: "Failed to update order" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session)
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const existing = await db.order.findUnique({ where: { id: params.id } });
    if (!existing)
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });

    await db.order.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true, message: "Order deleted" });
  } catch (error) {
    console.error("Admin order delete error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete order" }, { status: 500 });
  }
}
