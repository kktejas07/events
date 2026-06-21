import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { defaultContent } from "@/lib/landing-defaults";

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const rows = await db.siteContent.findMany();
    const result: Record<string, unknown> = { ...defaultContent };

    for (const row of rows) {
      result[row.section] = row.data;
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Admin site content fetch error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { section, data } = body;

    if (!section || !data) {
      return NextResponse.json(
        { success: false, error: "section and data required" },
        { status: 400 }
      );
    }

    await db.siteContent.upsert({
      where: { section },
      update: { data },
      create: { section, data },
    });

    revalidatePath("/");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin site content update error:", error);
    return NextResponse.json({ success: false, error: "Failed to update" }, { status: 500 });
  }
}
