import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session)
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const ticket = await db.ticket.findUnique({ where: { id: params.id } });
    if (!ticket)
      return NextResponse.json({ success: false, error: "Ticket not found" }, { status: 404 });

    await db.ticket.update({
      where: { id: params.id },
      data: { status: "CANCELLED" },
    });

    return NextResponse.json({ success: true, message: "Ticket revoked" });
  } catch (error) {
    console.error("Admin ticket revoke error:", error);
    return NextResponse.json({ success: false, error: "Failed to revoke ticket" }, { status: 500 });
  }
}
