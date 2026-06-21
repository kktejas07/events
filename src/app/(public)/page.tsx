export const dynamic = "force-dynamic";
export const revalidate = 0;

import { db } from "@/lib/db";
import { defaultContent } from "@/lib/landing-defaults";
import HomePageClient from "./_HomePageClient";

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

export default async function HomePage() {
  let mergedContent: Record<string, unknown> = { ...defaultContent };

  try {
    const rows = await db.siteContent.findMany();
    for (const row of rows) {
      const sectionData = row.data as Record<string, unknown>;
      const defaultSection = defaultContent[row.section] as Record<string, unknown> | undefined;
      if (defaultSection && typeof defaultSection === "object" && !Array.isArray(defaultSection)) {
        mergedContent[row.section] = deepMerge(defaultSection, sectionData);
      } else {
        mergedContent[row.section] = sectionData;
      }
    }
  } catch (error) {
    console.error("Home page fetch error:", error);
  }

  return <HomePageClient initialContent={mergedContent} />;
}
