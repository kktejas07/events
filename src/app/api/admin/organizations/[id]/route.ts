import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (role !== "SUPER_ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const org = await db.organization.update({ where: { id }, data: body });
  return NextResponse.json({ org });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (role !== "SUPER_ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await db.organization.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
