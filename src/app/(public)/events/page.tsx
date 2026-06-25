export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import EventsPageClient from "./_EventsClient";

interface EventData {
  id: string;
  title: string;
  slug: string;
  startDate: Date;
  shortDescription: string | null;
  category: string | null;
  coverImage: string | null;
  venue: { name: string; city: string; country: string } | null;
  ticketTypes: { price: number; name: string }[];
}

interface ScheduleSession {
  day: number;
  time: string;
  title: string;
  speaker: string;
  type: string;
}

export default async function EventsPage() {
  let events: EventData[] = [];
  let scheduleSessions: ScheduleSession[] = [];

  try {
    events = (await db.event.findMany({
      where: { status: "PUBLISHED" },
      include: {
        ticketTypes: { orderBy: { sortOrder: "asc" }, take: 1 },
        venue: true,
      },
      orderBy: { startDate: "asc" },
    })) as unknown as EventData[];

    // Fetch featured event sessions for schedule
    const featuredEvent = await db.event.findFirst({
      where: { isFeatured: true, status: "PUBLISHED" },
      include: {
        sessions: {
          include: { speaker: true },
          orderBy: [{ day: "asc" }, { startTime: "asc" }],
        },
      },
    });

    if (featuredEvent?.sessions) {
      scheduleSessions = featuredEvent.sessions.map((s) => ({
        day: s.day,
        time: `${new Date(s.startTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })} - ${new Date(s.endTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`,
        title: s.title,
        speaker: s.speaker ? `${s.speaker.firstName} ${s.speaker.lastName}` : "TBA",
        type: "Session",
      }));
    }
  } catch (error) {
    console.error("Events page fetch error:", error);
  }

  return <EventsPageClient events={events} scheduleSessions={scheduleSessions} />;
}
