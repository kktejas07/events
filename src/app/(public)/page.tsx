export const dynamic = "force-dynamic";
export const revalidate = 0;

import { unstable_noStore as noStore } from "next/cache";
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
  noStore();
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

    // Fetch real sponsors from DB
    const dbSponsors = await db.sponsor.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
    if (dbSponsors.length > 0) {
      mergedContent["_dbSponsors"] = dbSponsors.map((s) => ({
        name: s.name,
        tier: s.tier,
        logoUrl: s.logoUrl,
        websiteUrl: s.websiteUrl,
        initials: s.name.slice(0, 2).toUpperCase(),
        color: s.logoUrl ? "#6C5CE7" : ["#7C3AED", "#06B6D4", "#F59E0B"][dbSponsors.indexOf(s) % 3],
      }));
    }

    // Fetch featured event for hero
    const featuredEvent = await db.event.findFirst({
      where: { isFeatured: true, status: "PUBLISHED" },
      include: {
        venue: true,
        ticketTypes: {
          where: { isActive: true },
          orderBy: { sortOrder: "asc" },
        },
      },
    });
    if (featuredEvent) {
      mergedContent["_featuredEvent"] = {
        title: featuredEvent.title,
        slug: featuredEvent.slug,
        startDate: featuredEvent.startDate.toISOString(),
        endDate: featuredEvent.endDate.toISOString(),
        category: featuredEvent.category,
        description: featuredEvent.description,
        shortDescription: featuredEvent.shortDescription,
        venueName: featuredEvent.venue?.name,
        venueCity: featuredEvent.venue?.city,
        venueCountry: featuredEvent.venue?.country,
        venueAddress: featuredEvent.venue?.address,
        ticketTypes: featuredEvent.ticketTypes.map((tt) => ({
          name: tt.name,
          price: Number(tt.price),
          perks: tt.perks,
          color: tt.color,
        })),
      };
    }
  } catch (error) {
    console.error("Home page fetch error:", error);
  }

  return <HomePageClient initialContent={mergedContent} />;
}
