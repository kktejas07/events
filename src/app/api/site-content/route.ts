export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { defaultContent } from "@/lib/landing-defaults";

function deepMerge(target: Record<string, unknown>, source: Record<string, unknown>) {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (
      source[key] !== null &&
      typeof source[key] === "object" &&
      !Array.isArray(source[key]) &&
      target[key] !== null &&
      typeof target[key] === "object" &&
      !Array.isArray(target[key])
    ) {
      result[key] = deepMerge(
        target[key] as Record<string, unknown>,
        source[key] as Record<string, unknown>
      );
    } else {
      result[key] = source[key];
    }
  }
  return result;
}

export async function GET() {
  try {
    const rows = await db.siteContent.findMany();
    let result: Record<string, unknown> = { ...defaultContent };

    for (const row of rows) {
      const sectionData = row.data as Record<string, unknown>;
      const defaultSection = defaultContent[row.section] as Record<string, unknown> | undefined;
      if (defaultSection && typeof defaultSection === "object" && !Array.isArray(defaultSection)) {
        result[row.section] = deepMerge(defaultSection, sectionData);
      } else {
        result[row.section] = sectionData;
      }
    }

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Site content fetch error:", error);
    return NextResponse.json(defaultContent);
  }
}
