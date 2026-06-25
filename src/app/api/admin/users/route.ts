import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";

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

    const [users, total] = await Promise.all([
      db.user.findMany({
        include: {
          _count: { select: { orders: true, tickets: true } },
          organization: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      db.user.count(),
    ]);

    return NextResponse.json({
      success: true,
      data: users,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Admin users fetch error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session)
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const role = (session.user as { role?: string })?.role;
    if (!["ADMIN", "SUPER_ADMIN"].includes(role || "")) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { email, firstName, lastName, role: userRole, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password required" },
        { status: 400 }
      );
    }
    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "A user with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await db.user.create({
      data: {
        email,
        firstName: firstName || email.split("@")[0],
        lastName: lastName || "",
        role: userRole || "USER",
        passwordHash,
      },
      select: { id: true, email: true, firstName: true, lastName: true, role: true },
    });

    return NextResponse.json({ success: true, data: user }, { status: 201 });
  } catch (error) {
    console.error("Admin user create error:", error);
    return NextResponse.json({ success: false, error: "Failed to create user" }, { status: 500 });
  }
}
