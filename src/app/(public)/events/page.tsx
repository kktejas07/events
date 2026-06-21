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
  venue: { name: string; city: string; country: string } | null;
  ticketTypes: { price: number; name: string }[];
}

export default async function EventsPage() {
  let events: EventData[] = [];

  try {
    events = (await db.event.findMany({
      where: { status: "PUBLISHED" },
      include: {
        ticketTypes: { orderBy: { sortOrder: "asc" }, take: 1 },
        venue: true,
      },
      orderBy: { startDate: "asc" },
    })) as unknown as EventData[];
  } catch (error) {
    console.error("Events page fetch error:", error);
  }

  return <EventsPageClient events={events} />;
}
