import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateInvoicePdf } from "@/lib/pdf/invoice-pdf";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const order = await db.order.findUnique({
      where: { id: params.id },
      include: {
        event: true,
        items: { include: { ticketType: true } },
        user: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    let customerName = order.user.email;
    if (order.notes) {
      try {
        const parsed = JSON.parse(order.notes);
        if (parsed.attendee) {
          customerName = `${parsed.attendee.firstName || ""} ${parsed.attendee.lastName || ""}`.trim() || order.user.email;
        }
      } catch {}
    }

    const pdfBytes = await generateInvoicePdf({
      orderId: order.id,
      eventName: order.event.title,
      paymentMethod: "Razorpay",
      paidAt: order.updatedAt.toLocaleString(),
      items: order.items.map((i) => ({
        description: `${i.ticketType?.name || "Ticket"} x ${i.quantity}`,
        amount: Number(i.totalPrice),
      })),
      subtotal: Number(order.subtotal),
      tax: Number(order.tax),
      total: Number(order.total),
      customerName,
    });

    return new NextResponse(pdfBytes as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="invoice-${order.id}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Invoice PDF error:", error);
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
  }
}
