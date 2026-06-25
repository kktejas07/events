import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session)
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const role = (session.user as { role?: string })?.role;
    if (!["ADMIN", "SUPER_ADMIN", "SCANNER", "ORGANIZATION_ADMIN"].includes(role || "")) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (role === "ORGANIZATION_ADMIN") {
      const orgId = (session.user as { organizationId?: string })?.organizationId;
      where.event = { organizationId: orgId };
    }

    const [orders, total] = await Promise.all([
      db.order.findMany({
        where,
        include: {
          user: { select: { firstName: true, lastName: true, email: true } },
          event: { select: { title: true } },
          items: { include: { ticketType: { select: { name: true } } } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      db.order.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: orders,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Admin orders fetch error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch orders" }, { status: 500 });
  }
}
