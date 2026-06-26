import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session)
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const role = (session.user as { role?: string })?.role;
    if (!["ADMIN", "SUPER_ADMIN", "ORGANIZATION_ADMIN"].includes(role || "")) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const idCard = await db.idCard.findUnique({
      where: { id: params.id },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true, avatarUrl: true, company: true, jobTitle: true } },
      },
    });

    if (!idCard) {
      return NextResponse.json({ success: false, error: "ID card not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: idCard });
  } catch (error) {
    console.error("Admin id-card fetch error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch ID card" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session)
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const role = (session.user as { role?: string })?.role;
    if (!["ADMIN", "SUPER_ADMIN", "ORGANIZATION_ADMIN"].includes(role || "")) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const existing = await db.idCard.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: "ID card not found" }, { status: 404 });
    }

    const body = await req.json();

    const data: Record<string, unknown> = {};
    if (body.type !== undefined) data.type = body.type;
    if (body.designation !== undefined) data.designation = body.designation;
    if (body.department !== undefined) data.department = body.department;
    if (body.isActive !== undefined) data.isActive = body.isActive;

    const idCard = await db.idCard.update({
      where: { id: params.id },
      data,
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true, avatarUrl: true, company: true, jobTitle: true } },
      },
    });

    return NextResponse.json({ success: true, data: idCard });
  } catch (error) {
    console.error("Admin id-card update error:", error);
    return NextResponse.json({ success: false, error: "Failed to update ID card" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session)
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const role = (session.user as { role?: string })?.role;
    if (!["ADMIN", "SUPER_ADMIN"].includes(role || "")) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const existing = await db.idCard.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: "ID card not found" }, { status: 404 });
    }

    await db.idCard.update({
      where: { id: params.id },
      data: { isActive: false },
    });

    return NextResponse.json({ success: true, message: "ID card deactivated" });
  } catch (error) {
    console.error("Admin id-card delete error:", error);
    return NextResponse.json({ success: false, error: "Failed to deactivate ID card" }, { status: 500 });
  }
}
