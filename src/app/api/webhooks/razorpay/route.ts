import { NextRequest, NextResponse } from "next/server";
import { verifyRazorpayWebhook } from "@/lib/razorpay";
import { db } from "@/lib/db";
import { generateBarcodeValue } from "@/lib/barcode";
import { notify, NotificationType } from "@/services/notification";
import { renderTicketPurchaseEmail } from "@/lib/email-templates/ticket-purchase";
import { renderOrderReceiptEmail } from "@/lib/email-templates/order-receipt";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature") || "";

    if (!verifyRazorpayWebhook(body, signature, process.env.RAZORPAY_WEBHOOK_SECRET!)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(body);

    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;
      const orderId = payment.notes?.orderId;

      if (!orderId) {
        return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
      }

      // Update order
      const order = await db.order.update({
        where: { id: orderId },
        data: {
          status: "PAID",
          razorpayPaymentId: payment.id,
        },
        include: {
          items: { include: { ticketType: true } },
          user: true,
          event: true,
        },
      });

      // Generate tickets for each order item
      for (const item of order.items) {
        for (let i = 0; i < item.quantity; i++) {
          const barcode = generateBarcodeValue(`ticket_${Date.now()}_${i}`);

          await db.ticket.create({
            data: {
              orderId: order.id,
              eventId: order.eventId,
              ticketTypeId: item.ticketTypeId,
              userId: order.userId,
              attendeeName:
                order.user.firstName && order.user.lastName
                  ? `${order.user.firstName} ${order.user.lastName}`
                  : order.user.email,
              attendeeEmail: order.user.email,
              barcode,
            },
          });

          // Update sold count
          await db.ticketType.update({
            where: { id: item.ticketTypeId },
            data: {
              quantitySold: { increment: 1 },
              quantityReserved: { decrement: 1 },
            },
          });
        }
      }

      // Send ticket confirmation notification
      const ticketHtml = renderTicketPurchaseEmail({
        firstName: order.user.firstName || "Valued Customer",
        orderId: order.id,
        eventName: order.event.title,
        eventDate: order.event.startDate
          ? new Date(order.event.startDate).toLocaleDateString()
          : "TBA",
        eventVenue: (order.event as any).venue?.name || "TBA",
        tickets: order.items.map((i) => ({
          name: i.ticketType?.name || "Ticket",
          quantity: i.quantity,
          price: Number(i.unitPrice),
        })),
        total: Number(order.total),
      });

      await notify(
        NotificationType.TICKET_CONFIRMATION,
        { email: order.user.email, phone: order.user.phone || undefined },
        `Your tickets for ${order.event.title}`,
        ticketHtml
      );

      // Send order receipt notification
      const receiptHtml = renderOrderReceiptEmail({
        firstName: order.user.firstName || "Valued Customer",
        orderId: order.id,
        eventName: order.event.title,
        paymentMethod: "Razorpay",
        paidAt: new Date().toLocaleString(),
        items: order.items.map((i) => ({
          description: `${i.ticketType?.name || "Ticket"} x ${i.quantity}`,
          amount: Number(i.totalPrice),
        })),
        subtotal: Number(order.subtotal),
        tax: Number(order.tax),
        total: Number(order.total),
      });

      await notify(
        NotificationType.ORDER_RECEIPT,
        { email: order.user.email, phone: order.user.phone || undefined },
        `Receipt for ${order.event.title}`,
        receiptHtml
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Razorpay webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
