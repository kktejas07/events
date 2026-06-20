import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session)
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const user = await db.user.findUnique({ where: { id: params.id } });
    if (!user)
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });

    const body = await req.json();
    const updated = await db.user.update({
      where: { id: params.id },
      data: {
        banned: body.banned !== undefined ? body.banned : user.banned,
        role: body.role || user.role,
      },
      select: { id: true, email: true, firstName: true, lastName: true, role: true, banned: true },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Admin user update error:", error);
    return NextResponse.json({ success: false, error: "Failed to update user" }, { status: 500 });
  }
}
