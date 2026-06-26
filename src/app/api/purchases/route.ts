import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as unknown as { id: string }).id;
    const role = (session.user as { role?: string })?.role;
    const isAdmin = ["ADMIN", "SUPER_ADMIN", "ORGANIZATION_ADMIN"].includes(role || "");

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (!isAdmin) where.userId = userId;
    if (category) where.category = category;
    if (from || to) {
      const dateFilter: Record<string, Date> = {};
      if (from) dateFilter.gte = new Date(from);
      if (to) dateFilter.lte = new Date(to);
      where.date = dateFilter;
    }

    const [purchases, total] = await Promise.all([
      db.purchase.findMany({
        where,
        orderBy: { date: "desc" },
        skip,
        take: limit,
      }),
      db.purchase.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: purchases,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Purchases fetch error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch purchases" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as { role?: string })?.role;
    if (!["ADMIN", "SUPER_ADMIN", "ORGANIZATION_ADMIN"].includes(role || "")) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const adminId = (session.user as unknown as { id: string }).id;
    const body = await req.json();
    const { userId, product, price, quantity, currency, category, date } = body;

    if (!userId || !product || price === undefined) {
      return NextResponse.json(
        { success: false, error: "userId, product, and price are required" },
        { status: 400 }
      );
    }

    const purchase = await db.purchase.create({
      data: {
        userId,
        product,
        price,
        quantity: quantity ?? 1,
        currency: currency ?? "INR",
        category: category ?? null,
        date: date ? new Date(date) : undefined,
      },
    });

    await db.auditLog.create({
      data: {
        userId: adminId,
        action: "CREATE",
        entityType: "Purchase",
        entityId: purchase.id,
        details: { userId, product, price: Number(price) },
      },
    });

    return NextResponse.json({ success: true, data: purchase }, { status: 201 });
  } catch (error) {
    console.error("Purchase create error:", error);
    return NextResponse.json({ success: false, error: "Failed to create purchase" }, { status: 500 });
  }
}
