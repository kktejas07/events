import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const role = (session.user as { role?: string })?.role || "USER";
    const isAdmin = ["ADMIN", "SUPER_ADMIN"].includes(role);

    const invoice = await db.invoice.findUnique({
      where: { id: params.id },
      include: { payments: true },
    });

    if (!invoice) {
      return NextResponse.json({ success: false, error: "Invoice not found" }, { status: 404 });
    }

    if (!isAdmin && invoice.userId !== userId) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ success: true, data: invoice });
  } catch (error) {
    console.error("Invoice fetch error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch invoice" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const role = (session.user as { role?: string })?.role || "USER";
    const isAdmin = ["ADMIN", "SUPER_ADMIN", "ORGANIZATION_ADMIN"].includes(role);

    const existing = await db.invoice.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: "Invoice not found" }, { status: 404 });
    }

    if (!isAdmin && existing.userId !== userId) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { status, amount, tax, gst, dueDate, notes } = body;

    const data: Record<string, unknown> = {};
    if (status !== undefined) data.status = status;
    if (amount !== undefined) data.amount = amount;
    if (tax !== undefined) data.tax = tax;
    if (gst !== undefined) data.gst = gst;
    if (dueDate !== undefined) data.dueDate = dueDate ? new Date(dueDate) : null;
    if (notes !== undefined) data.notes = notes;
    if (status === "PAID") data.paidAt = new Date();

    const invoice = await db.invoice.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json({ success: true, data: invoice });
  } catch (error) {
    console.error("Invoice update error:", error);
    return NextResponse.json({ success: false, error: "Failed to update invoice" }, { status: 500 });
  }
}
