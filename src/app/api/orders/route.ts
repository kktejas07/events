import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getRazorpay } from "@/lib/razorpay";
import { orderCreateSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = orderCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const userId = (session.user as { id: string }).id;
    const { eventId, items, promoCode } = parsed.data;

    // Calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const ticketType = await db.ticketType.findUnique({
        where: { id: item.ticketTypeId },
      });

      if (!ticketType || !ticketType.isActive) {
        return NextResponse.json({ success: false, error: "Invalid ticket type" }, { status: 400 });
      }

      const available =
        ticketType.quantityLimit - ticketType.quantitySold - ticketType.quantityReserved;
      if (available < item.quantity) {
        return NextResponse.json(
          { success: false, error: `Only ${available} tickets available for ${ticketType.name}` },
          { status: 400 }
        );
      }

      const itemTotal = Number(ticketType.price) * item.quantity;
      subtotal += itemTotal;
      orderItems.push({
        ticketTypeId: ticketType.id,
        quantity: item.quantity,
        unitPrice: Number(ticketType.price),
        totalPrice: itemTotal,
      });
    }

    // Apply discount if promo code
    let discount = 0;
    if (promoCode) {
      const code = await db.discountCode.findUnique({
        where: { code: promoCode, isActive: true },
      });

      if (code) {
        if (code.validFrom && new Date() < code.validFrom) {
          return NextResponse.json(
            { success: false, error: "Promo code not yet valid" },
            { status: 400 }
          );
        }
        if (code.validUntil && new Date() > code.validUntil) {
          return NextResponse.json(
            { success: false, error: "Promo code expired" },
            { status: 400 }
          );
        }
        if (code.maxUses && code.currentUses >= code.maxUses) {
          return NextResponse.json(
            { success: false, error: "Promo code usage limit reached" },
            { status: 400 }
          );
        }

        discount =
          code.discountType === "PERCENTAGE"
            ? (subtotal * Number(code.discountValue)) / 100
            : Number(code.discountValue);

        await db.discountCode.update({
          where: { id: code.id },
          data: { currentUses: { increment: 1 } },
        });
      }
    }

    const tax = (subtotal - discount) * 0.18; // 18% GST
    const total = subtotal - discount + tax;
    const totalInPaise = Math.round(total * 100);

    // Create order
    const order = await db.order.create({
      data: {
        userId,
        eventId,
        subtotal,
        discount,
        tax,
        total,
        promoCode,
        items: {
          create: orderItems.map((item) => ({
            ticketTypeId: item.ticketTypeId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
          })),
        },
      },
    });

    // Reserve inventory
    for (const item of items) {
      await db.ticketType.update({
        where: { id: item.ticketTypeId },
        data: { quantityReserved: { increment: item.quantity } },
      });
    }

    // Create Razorpay order
    const razorpayOrder = await getRazorpay().orders.create({
      amount: totalInPaise,
      currency: "INR",
      receipt: order.id,
      notes: {
        orderId: order.id,
        userId,
      },
    });

    await db.order.update({
      where: { id: order.id },
      data: { razorpayOrderId: razorpayOrder.id },
    });

    return NextResponse.json({
      success: true,
      data: {
        orderId: order.id,
        razorpayOrderId: razorpayOrder.id,
        amount: totalInPaise,
        currency: "INR",
        keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      },
    });
  } catch (error) {
    console.error("Order create error:", error);
    return NextResponse.json({ success: false, error: "Failed to create order" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const orders = await db.order.findMany({
      where: { userId },
      include: {
        event: true,
        items: { include: { ticketType: true } },
        tickets: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    console.error("Orders fetch error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch orders" }, { status: 500 });
  }
}
