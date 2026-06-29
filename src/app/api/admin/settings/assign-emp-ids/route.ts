import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

function generateEmpId(prefix: string, year: string, seq: number): string {
  return `${prefix}-${year}-${String(seq).padStart(6, "0")}`;
}

export async function GET() {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (!["ADMIN", "SUPER_ADMIN"].includes(role || "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const prefixRow = await db.platformSetting.findUnique({ where: { key: "EMP_ID_PREFIX" } });
  const nextRow = await db.platformSetting.findUnique({ where: { key: "EMP_ID_NEXT" } });

  const prefix = prefixRow?.value || "SA";
  const next = parseInt(nextRow?.value || "1", 10);

  const usersWithoutId = await db.user.count({ where: { employeeId: null } });

  return NextResponse.json({
    prefix,
    nextSequence: next,
    format: `${prefix}-YYYY-NNNNNN`,
    usersWithoutEmployeeId: usersWithoutId,
  });
}

export async function POST() {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (!["ADMIN", "SUPER_ADMIN"].includes(role || "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const prefixRow = await db.platformSetting.findUnique({ where: { key: "EMP_ID_PREFIX" } });
  const nextRow = await db.platformSetting.findUnique({ where: { key: "EMP_ID_NEXT" } });

  const prefix = prefixRow?.value || "SA";
  let next = parseInt(nextRow?.value || "1", 10);

  const usersWithoutId = await db.user.findMany({
    where: { employeeId: null },
    select: { id: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  let assigned = 0;
  for (const user of usersWithoutId) {
    const year = new Date(user.createdAt).getFullYear().toString();
    const empId = generateEmpId(prefix, year, next);
    try {
      await db.user.update({
        where: { id: user.id },
        data: { employeeId: empId },
      });
      assigned++;
      next++;
    } catch {
      next++;
    }
  }

  await db.platformSetting.upsert({
    where: { key: "EMP_ID_NEXT" },
    update: { value: String(next) },
    create: { key: "EMP_ID_NEXT", value: String(next), category: "id-cards" },
  });

  if (!prefixRow) {
    await db.platformSetting.upsert({
      where: { key: "EMP_ID_PREFIX" },
      update: {},
      create: { key: "EMP_ID_PREFIX", value: prefix, category: "id-cards" },
    });
  }

  return NextResponse.json({ success: true, assigned, nextSequence: next });
}
