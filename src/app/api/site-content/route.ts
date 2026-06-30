export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { defaultContent } from "@/lib/landing-defaults";
import { mergeSiteContent } from "@/lib/site-content";

export async function GET() {
  try {
    const rows = await db.siteContent.findMany();
    const result = mergeSiteContent(rows);

    const logoSetting = await db.platformSetting.findUnique({ where: { key: "LOGO_URL" } });
    (result as Record<string, string>)._logoUrl = logoSetting?.value || "";

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Site content fetch error:", error);
    return NextResponse.json({ ...defaultContent, _logoUrl: "" });
  }
}
