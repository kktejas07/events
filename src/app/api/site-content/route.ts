import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { defaultContent } from "@/lib/landing-defaults";

export async function GET() {
  try {
    const rows = await db.siteContent.findMany();
    const result: Record<string, unknown> = { ...defaultContent };

    for (const row of rows) {
      result[row.section] = row.data;
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Site content fetch error:", error);
    return NextResponse.json(defaultContent);
  }
}
