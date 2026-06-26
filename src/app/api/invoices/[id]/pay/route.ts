import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const role = (session.user as { role?: string })?.role || "USER";
    const isAdmin = ["ADMIN", "SUPER_ADMIN", "ORGANIZATION_ADMIN"].includes(role);

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

    const body = await req.json();
    const { amount, method, transactionId, notes } = body;

    if (amount == null) {
      return NextResponse.json(
        { success: false, error: "amount is required" },
        { status: 400 }
      );
    }

    await db.payment.create({
      data: {
        invoiceId: params.id,
        amount,
        method,
        transactionId,
        notes,
      },
    });

    const totalPaid = (
      await db.payment.aggregate({
        where: { invoiceId: params.id },
        _sum: { amount: true },
      })
    )._sum.amount || 0;

    let updated = await db.invoice.findUnique({
      where: { id: params.id },
      include: { payments: true },
    });

    if (Number(totalPaid) >= Number(invoice.amount)) {
      updated = await db.invoice.update({
        where: { id: params.id },
        data: { status: "PAID", paidAt: new Date() },
        include: { payments: true },
      });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Invoice payment error:", error);
    return NextResponse.json({ success: false, error: "Failed to record payment" }, { status: 500 });
  }
}
