import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { generateQrToken } from "@/lib/qr-token";
import { z } from "zod";

const createIdCardSchema = z.object({
  userId: z.string().min(1, "userId is required"),
  type: z.enum(["EMPLOYEE", "VISITOR", "VOLUNTEER", "CONTRACTOR"]),
  designation: z.string().optional(),
  department: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session)
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const role = (session.user as { role?: string })?.role;
    if (!["ADMIN", "SUPER_ADMIN"].includes(role || "")) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;
    const type = searchParams.get("type");
    const isActive = searchParams.get("isActive");
    const q = searchParams.get("q");

    const where: Record<string, unknown> = {};

    if (type) {
      where.type = type;
    }

    if (isActive === "true") {
      where.isActive = true;
    } else if (isActive === "false") {
      where.isActive = false;
    }

    if (q) {
      where.OR = [
        { idNumber: { contains: q, mode: "insensitive" } },
        {
          user: {
            OR: [
              { firstName: { contains: q, mode: "insensitive" } },
              { lastName: { contains: q, mode: "insensitive" } },
              { email: { contains: q, mode: "insensitive" } },
            ],
          },
        },
      ];
    }

    const [idCards, total] = await Promise.all([
      db.idCard.findMany({
        where,
        include: {
          user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true, avatarUrl: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      db.idCard.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: idCards,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Admin id-cards fetch error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch ID cards" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session)
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const role = (session.user as { role?: string })?.role;
    if (!["ADMIN", "SUPER_ADMIN", "ORGANIZATION_ADMIN"].includes(role || "")) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = createIdCardSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { userId, type, designation, department } = parsed.data;

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const year = new Date().getFullYear();
    const existingCount = await db.idCard.count({
      where: {
        type,
        issuedAt: {
          gte: new Date(year, 0, 1),
          lt: new Date(year + 1, 0, 1),
        },
      },
    });

    const sequence = String(existingCount + 1).padStart(4, "0");
    const idNumber = `${type}-${year}-${sequence}`;

    const qrToken = generateQrToken("ID_CARD", userId);

    const idCard = await db.idCard.create({
      data: {
        userId,
        type,
        idNumber,
        designation,
        department,
        qrToken,
      },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true, avatarUrl: true } },
      },
    });

    return NextResponse.json({ success: true, data: idCard }, { status: 201 });
  } catch (error) {
    console.error("Admin id-card create error:", error);
    return NextResponse.json({ success: false, error: "Failed to create ID card" }, { status: 500 });
  }
}
