import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (!["ADMIN", "SUPER_ADMIN"].includes(role || "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const sponsor = await db.sponsor.create({
      data: {
        name: body.name,
        websiteUrl: body.websiteUrl || null,
        logoUrl: body.logoUrl || "",
        tier: body.tier || "SILVER",
        sortOrder: parseInt(body.sortOrder || "0"),
        isActive: true,
      },
    });

    if (body.eventId) {
      await db.eventSponsor.create({
        data: {
          eventId: body.eventId,
          sponsorId: sponsor.id,
        },
      });
    }

    return NextResponse.json({ success: true, sponsor });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create sponsor",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  const sponsors = await db.sponsor.findMany({
    include: { events: { include: { event: { select: { id: true, title: true } } } } },
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json({ sponsors });
}
