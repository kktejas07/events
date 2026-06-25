export const dynamic = "force-dynamic";
export const revalidate = 0;

import { unstable_noStore as noStore } from "next/cache";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import EventDetailClient from "./_EventDetailClient";

export default async function EventDetailPage({ params }: { params: { slug: string } }) {
  noStore();

  let event;
  try {
    event = await db.event.findUnique({
      where: { slug: params.slug },
      include: {
        ticketTypes: {
          where: { isActive: true },
          orderBy: { sortOrder: "asc" },
        },
        venue: true,
        sessions: {
          include: { speaker: true },
          orderBy: [{ day: "asc" }, { startTime: "asc" }],
        },
        faqs: { orderBy: { sortOrder: "asc" } },
      },
    });
  } catch (error) {
    console.error("Event detail fetch error:", error);
    throw error;
  }

  if (!event) {
    notFound();
  }

  const serialized = JSON.parse(JSON.stringify(event));

  let socialLinks: Record<string, string> = {};
  try {
    const rows = await db.platformSetting.findMany({
      where: { key: { in: ["SOCIAL_TWITTER_URL", "SOCIAL_FACEBOOK_URL", "SOCIAL_INSTAGRAM_URL", "SOCIAL_YOUTUBE_URL", "SOCIAL_LINKEDIN_URL"] } },
    });
    for (const r of rows) {
      socialLinks[r.key] = r.value;
    }
  } catch {}

  return <EventDetailClient event={serialized} socialLinks={socialLinks} />;
}
