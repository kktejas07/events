export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import EventsPageClient from "./_EventsClient";
import { eventCoverImage } from "@/lib/theme-images";

interface EventData {
  id: string;
  title: string;
  slug: string;
  startDate: Date;
  shortDescription: string | null;
  category: string | null;
  coverImage: string | null;
  venue: { name: string; city: string; country: string; address: string } | null;
  ticketTypes: { price: number; name: string }[];
}

interface ScheduleSession {
  day: number;
  startTime: string;
  endTime: string;
  title: string;
  speaker: string;
  room: string;
  type: string;
  slug?: string;
  location?: string;
  coverImage?: string | null;
}

function buildSchedFromSessions(sessions: ScheduleSession[]) {
  const dayMap = new Map<
    number,
    {
      id: string;
      label: string;
      sessions: {
        title: string;
        date: string;
        room: string;
        location?: string;
        href?: string;
        image?: string;
      }[];
    }
  >();

  for (const s of sessions) {
    if (!dayMap.has(s.day)) {
      dayMap.set(s.day, {
        id: `day${String(s.day).padStart(2, "0")}`,
        label: `day ${String(s.day).padStart(2, "0")}`,
        sessions: [],
      });
    }
    dayMap.get(s.day)!.sessions.push({
      title: s.title,
      date: new Date(s.startTime).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      room: s.room || "Main Hall",
      location: s.location,
      href: s.slug ? `/events/${s.slug}` : undefined,
      image: s.coverImage || undefined,
    });
  }

  return Array.from(dayMap.values());
}

function buildSchedFromEvents(events: EventData[]) {
  if (events.length === 0) return undefined;

  const perDay = Math.max(1, Math.ceil(events.length / 4));
  const days = [];

  for (let day = 1; day <= 4; day++) {
    const slice = events.slice((day - 1) * perDay, day * perDay);
    if (slice.length === 0) continue;

    days.push({
      id: `day${String(day).padStart(2, "0")}`,
      label: `day ${String(day).padStart(2, "0")}`,
      sessions: slice.map((event, idx) => ({
        title: event.title,
        date: event.startDate.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        room: event.venue?.name || event.category || "Main Hall",
        location: event.venue
          ? `${event.venue.address || event.venue.name}, ${event.venue.city}`
          : undefined,
        href: `/events/${event.slug}`,
        image: eventCoverImage(idx, event.coverImage),
      })),
    });
  }

  return days;
}

export default async function EventsPage() {
  let events: EventData[] = [];
  let scheduleSessions: ScheduleSession[] = [];
  let ticketPackages: { id: string; name: string; price: number; highlighted: boolean; href: string }[] =
    [];
  let blogPosts: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    category: string | null;
    coverImage: string | null;
    publishedAt: Date | null;
  }[] = [];

  try {
    events = (await db.event.findMany({
      where: { status: "PUBLISHED" },
      include: {
        ticketTypes: { where: { isActive: true }, orderBy: { sortOrder: "asc" }, take: 1 },
        venue: true,
      },
      orderBy: { startDate: "asc" },
    })) as unknown as EventData[];

    const featuredEvent = await db.event.findFirst({
      where: { isFeatured: true, status: "PUBLISHED" },
      include: {
        venue: true,
        ticketTypes: { where: { isActive: true }, orderBy: { sortOrder: "asc" } },
        sessions: {
          include: { speaker: true },
          orderBy: [{ day: "asc" }, { startTime: "asc" }],
        },
      },
    });

    if (featuredEvent?.sessions?.length) {
      scheduleSessions = featuredEvent.sessions.map((s, i) => ({
        day: s.day,
        startTime: s.startTime.toISOString(),
        endTime: s.endTime.toISOString(),
        title: s.title,
        speaker: s.speaker ? `${s.speaker.firstName} ${s.speaker.lastName}` : "TBA",
        room: s.room || "Main Hall",
        type: "Session",
        slug: featuredEvent.slug,
        location: featuredEvent.venue
          ? `${featuredEvent.venue.address}, ${featuredEvent.venue.city}`
          : undefined,
        coverImage: eventCoverImage(i, featuredEvent.coverImage),
      }));
    }

    const ticketSource = featuredEvent || events[0];
    if (ticketSource?.ticketTypes?.length) {
      ticketPackages = ticketSource.ticketTypes.slice(0, 3).map((tt, i) => ({
        id: "id" in tt ? tt.id : `${i}`,
        name: tt.name,
        price: Number(tt.price),
        highlighted: i === 1,
        href: `/events/${"slug" in ticketSource ? ticketSource.slug : events[0]?.slug || ""}`,
      }));
    }

    blogPosts = await db.blogPost.findMany({
      where: { published: true },
      take: 3,
      orderBy: { publishedAt: "desc" },
    });
  } catch (error) {
    console.error("Events page fetch error:", error);
  }

  const scheduleDays =
    scheduleSessions.length > 0
      ? buildSchedFromSessions(scheduleSessions)
      : buildSchedFromEvents(events);

  const purchaseHref =
    events.length > 0 ? `/events/${events[0].slug}` : ticketPackages[0]?.href || "/events";

  return (
    <EventsPageClient
      scheduleDays={scheduleDays}
      ticketPackages={ticketPackages}
      blogPosts={blogPosts}
      purchaseHref={purchaseHref}
    />
  );
}
