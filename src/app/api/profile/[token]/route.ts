import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyQrToken } from "@/lib/qr-token";

export async function GET(
  _req: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const decoded = verifyQrToken(params.token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired QR code" },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({
      where: { id: decoded.userId },
      include: {
        idCards: {
          select: {
            idNumber: true,
            type: true,
            designation: true,
            department: true,
            isActive: true,
            issuedAt: true,
          },
        },
        tickets: {
          include: {
            event: { select: { title: true, startDate: true, endDate: true } },
            ticketType: { select: { name: true } },
            order: { select: { status: true } },
          },
        },
        invoices: {
          select: {
            invoiceNo: true,
            amount: true,
            status: true,
            paidAt: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        },
        purchases: {
          select: {
            product: true,
            price: true,
            quantity: true,
            category: true,
            date: true,
          },
          orderBy: { date: "desc" },
        },
        attendance: {
          select: {
            checkIn: true,
            checkOut: true,
            method: true,
            event: { select: { title: true } },
          },
          orderBy: { checkIn: "desc" },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const { idCards, tickets, invoices, purchases, attendance, ...userData } = user;

    return NextResponse.json({
      success: true,
      data: {
        user: userData,
        idCards,
        tickets,
        invoices,
        purchases,
        attendance,
      },
    });
  } catch (error) {
    console.error("Profile API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}
