import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (role !== "SUPER_ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const orgs = await db.organization.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { events: true, members: true } } },
  });
  return NextResponse.json({ orgs });
}
