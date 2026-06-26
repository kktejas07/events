import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "20")));
    const status = searchParams.get("status");
    const skip = (page - 1) * limit;

    const userId = (session.user as { id: string }).id;
    const role = (session.user as { role?: string })?.role || "USER";
    const isAdmin = ["ADMIN", "SUPER_ADMIN"].includes(role);

    const where: Record<string, unknown> = {};
    if (!isAdmin) where.userId = userId;
    if (status) where.status = status;

    const [invoices, total] = await Promise.all([
      db.invoice.findMany({
        where,
        include: { payments: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      db.invoice.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: invoices,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Invoices fetch error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch invoices" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as { role?: string })?.role || "USER";
    if (!["ADMIN", "SUPER_ADMIN", "ORGANIZATION_ADMIN"].includes(role)) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { userId, amount, tax, gst, dueDate, notes, orderId } = body;

    if (!userId || amount == null) {
      return NextResponse.json(
        { success: false, error: "userId and amount are required" },
        { status: 400 }
      );
    }

    const counter = await db.$transaction(async (tx) => {
      const c = await tx.invoiceCounter.findUnique({ where: { id: "global" } });
      const year = new Date().getFullYear();
      if (!c || c.year < year) {
        return tx.invoiceCounter.upsert({
          where: { id: "global" },
          create: { id: "global", year, seq: 1 },
          update: { year, seq: 1 },
        });
      }
      return tx.invoiceCounter.update({
        where: { id: "global" },
        data: { seq: { increment: 1 } },
      });
    });

    const invoiceNo = `INV-${counter.year}-${String(counter.seq).padStart(5, "0")}`;

    if (orderId) {
      const order = await db.order.findUnique({ where: { id: orderId } });
      if (!order) {
        return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
      }
    }

    const invoice = await db.invoice.create({
      data: {
        invoiceNo,
        userId,
        orderId,
        amount,
        tax: tax ?? 0,
        gst: gst ?? 0,
        dueDate: dueDate ? new Date(dueDate) : null,
        notes,
      },
    });

    return NextResponse.json({ success: true, data: invoice }, { status: 201 });
  } catch (error) {
    console.error("Invoice create error:", error);
    return NextResponse.json({ success: false, error: "Failed to create invoice" }, { status: 500 });
  }
}
