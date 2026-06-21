export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import EventDetailClient from "./_EventDetailClient";

export default async function EventDetailPage({ params }: { params: { slug: string } }) {
  const event = await db.event.findUnique({
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

  if (!event) {
    notFound();
  }

  return <EventDetailClient event={JSON.parse(JSON.stringify(event))} />;
}
