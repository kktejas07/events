import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateInvoicePdf } from "@/lib/pdf/invoice-pdf";

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
      include: {
        user: { select: { firstName: true, lastName: true } },
        payments: { orderBy: { createdAt: "desc" }, take: 1 },
      },
    });

    if (!invoice) {
      return NextResponse.json({ success: false, error: "Invoice not found" }, { status: 404 });
    }

    if (!isAdmin && invoice.userId !== userId) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const latestPayment = invoice.payments[0];
    const itemDescriptions: { description: string; amount: number }[] = [];

    if (invoice.orderId) {
      const order = await db.order.findUnique({
        where: { id: invoice.orderId },
        include: {
          event: { select: { title: true } },
          items: { include: { ticketType: { select: { name: true } } } },
        },
      });

      if (order) {
        for (const item of order.items) {
          itemDescriptions.push({
            description: item.ticketType.name,
            amount: Number(item.totalPrice),
          });
        }
      }
    }

    if (itemDescriptions.length === 0) {
      itemDescriptions.push({
        description: "Invoice amount",
        amount: Number(invoice.amount),
      });
    }

    const pdfBytes = await generateInvoicePdf({
      orderId: invoice.invoiceNo,
      eventName: "Event",
      paymentMethod: latestPayment?.method || "N/A",
      paidAt: invoice.paidAt?.toISOString().split("T")[0] || "N/A",
      items: itemDescriptions,
      subtotal: Number(invoice.amount) - Number(invoice.tax) - Number(invoice.gst),
      tax: Number(invoice.tax) + Number(invoice.gst),
      total: Number(invoice.amount),
      customerName: `${invoice.user.firstName || ""} ${invoice.user.lastName || ""}`.trim() || "Customer",
    });

    return new NextResponse(pdfBytes as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${invoice.invoiceNo}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Invoice PDF error:", error);
    return NextResponse.json({ success: false, error: "Failed to generate PDF" }, { status: 500 });
  }
}
