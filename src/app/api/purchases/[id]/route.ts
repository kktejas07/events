import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as unknown as { id: string }).id;
    const role = (session.user as { role?: string })?.role;
    const isAdmin = ["ADMIN", "SUPER_ADMIN", "ORGANIZATION_ADMIN"].includes(role || "");

    const purchase = await db.purchase.findUnique({ where: { id: params.id } });
    if (!purchase) {
      return NextResponse.json({ success: false, error: "Purchase not found" }, { status: 404 });
    }

    if (purchase.userId !== userId && !isAdmin) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ success: true, data: purchase });
  } catch (error) {
    console.error("Purchase fetch error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch purchase" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
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
    const purchase = await db.purchase.findUnique({ where: { id: params.id } });
    if (!purchase) {
      return NextResponse.json({ success: false, error: "Purchase not found" }, { status: 404 });
    }

    await db.purchase.delete({ where: { id: params.id } });

    await db.auditLog.create({
      data: {
        userId: adminId,
        action: "DELETE",
        entityType: "Purchase",
        entityId: params.id,
        details: { product: purchase.product, price: Number(purchase.price) },
      },
    });

    return NextResponse.json({ success: true, message: "Purchase deleted" });
  } catch (error) {
    console.error("Purchase delete error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete purchase" }, { status: 500 });
  }
}
