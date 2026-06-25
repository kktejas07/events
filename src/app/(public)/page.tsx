export const dynamic = "force-dynamic";
export const revalidate = 0;

import { unstable_noStore as noStore } from "next/cache";
import { db } from "@/lib/db";
import { defaultContent } from "@/lib/landing-defaults";
import { mergeSiteContent } from "@/lib/site-content";
import HomePageClient from "./_HomePageClient";
import { hyderabadColleges } from "@/lib/hyderabad-colleges";

export default async function HomePage() {
  noStore();
  let mergedContent: Record<string, unknown> = { ...defaultContent };

  try {
    const rows = await db.siteContent.findMany();
    mergedContent = mergeSiteContent(rows);

    // Fetch real sponsors from DB
    const dbSponsors = await db.sponsor.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
    if (dbSponsors.length > 0) {
      const hasPlaceholderLogos = dbSponsors.some(
        (s) => !s.logoUrl || s.logoUrl.includes("unsplash.com") || s.logoUrl.includes("placeholder")
      );
      const sponsorSource = hasPlaceholderLogos
        ? hyderabadColleges.map((c) => ({
            name: c.name,
            tier: c.tier || "Gold",
            logoUrl: c.logo,
            websiteUrl: c.website,
            initials: c.name.slice(0, 2).toUpperCase(),
            color: "#6C5CE7",
          }))
        : dbSponsors.map((s) => ({
            name: s.name,
            tier: s.tier,
            logoUrl: s.logoUrl,
            websiteUrl: s.websiteUrl,
            initials: s.name.slice(0, 2).toUpperCase(),
            color: s.logoUrl ? "#6C5CE7" : ["#7C3AED", "#06B6D4", "#F59E0B"][dbSponsors.indexOf(s) % 3],
          }));
      mergedContent["_dbSponsors"] = sponsorSource;
    } else {
      mergedContent["_dbSponsors"] = hyderabadColleges.map((c) => ({
        name: c.name,
        tier: c.tier || "Gold",
        logoUrl: c.logo,
        websiteUrl: c.website,
        initials: c.name.slice(0, 2).toUpperCase(),
        color: "#6C5CE7",
      }));
    }

    // Fetch featured event with ticket types and schedule
    const featuredEvent = await db.event.findFirst({
      where: { isFeatured: true, status: "PUBLISHED" },
      include: {
        venue: true,
        ticketTypes: {
          where: { isActive: true },
          orderBy: { sortOrder: "asc" },
        },
        sessions: {
          include: { speaker: true },
          orderBy: [{ day: "asc" }, { startTime: "asc" }],
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
        sessions: featuredEvent.sessions.map((s) => ({
          day: s.day,
          time: `${new Date(s.startTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })} - ${new Date(s.endTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`,
          title: s.title,
          speaker: s.speaker ? `${s.speaker.firstName} ${s.speaker.lastName}` : "TBA",
          type: "Session",
        })),
      };
    }

    const blogPosts = await db.blogPost.findMany({
      where: { published: true },
      take: 3,
      orderBy: { publishedAt: "desc" },
    });
    if (blogPosts.length > 0) {
      mergedContent["_blogPosts"] = blogPosts.map((p) => ({
        title: p.title,
        slug: p.slug,
        category: p.category || "Corporate",
        date: p.publishedAt
          ? p.publishedAt.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
          : "11 march 2025",
        day: p.publishedAt ? String(p.publishedAt.getDate()) : "20",
        month: p.publishedAt
          ? p.publishedAt.toLocaleString("default", { month: "short" })
          : "april",
        excerpt: p.excerpt || "",
        image: p.coverImage || null,
      }));
    }

    const dbSpeakers = await db.speaker.findMany({ take: 5, orderBy: { createdAt: "asc" } });
    if (dbSpeakers.length > 0) {
      const speakersSection = mergedContent.speakers as Record<string, unknown> | undefined;
      if (speakersSection) {
        speakersSection.items = dbSpeakers.map((s) => ({
          name: `${s.firstName} ${s.lastName}`,
          role: s.title || "Speaker",
          photoUrl: s.photoUrl,
        }));
      }
    }
  } catch (error) {
    console.error("Home page fetch error:", error);
  }

  return <HomePageClient initialContent={mergedContent} />;
}
