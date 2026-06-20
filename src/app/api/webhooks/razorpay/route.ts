import { NextRequest, NextResponse } from "next/server";
import { verifyRazorpayWebhook } from "@/lib/razorpay";
import { db } from "@/lib/db";
import { generateBarcodeValue } from "@/lib/barcode";
import { sendEmail } from "@/lib/email";

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

      // Send confirmation email
      if (order.user.email) {
        await sendEmail({
          to: order.user.email,
          subject: `Your tickets for ${order.event.title}`,
          html: `
            <h1>Order Confirmed!</h1>
            <p>Thank you for your purchase. Your tickets for <strong>${order.event.title}</strong> are confirmed.</p>
            <p>Order ID: ${order.id}</p>
            <p>Total: ₹${Number(order.total).toLocaleString()}</p>
            <p>View your tickets: <a href="${process.env.NEXT_PUBLIC_APP_URL}/my-tickets">My Tickets</a></p>
          `,
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Razorpay webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
