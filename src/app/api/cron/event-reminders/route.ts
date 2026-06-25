import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { notify, NotificationType } from "@/services/notification";
import { renderEventReminderEmail } from "@/lib/email-templates/event-reminder";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization")?.replace("Bearer ", "");
  if (CRON_SECRET && authHeader !== CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const in48Hours = new Date(now.getTime() + 48 * 60 * 60 * 1000);

  const events = await db.event.findMany({
    where: {
      status: "PUBLISHED",
      startDate: {
        gte: now,
        lte: in48Hours,
      },
    },
    include: {
      venue: true,
    },
  });

  const results: { event: string; sent: number; errors: number }[] = [];

  for (const event of events) {
    const daysAway = Math.ceil(
      (event.startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    const tickets = await db.ticket.findMany({
      where: { eventId: event.id, status: "ACTIVE" },
      include: { user: true },
    });

    const eventDate = event.startDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const eventTime = event.startDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    let sent = 0;
    let errors = 0;

    const notified = new Set<string>();

    for (const ticket of tickets) {
      const email = ticket.attendeeEmail || ticket.user.email;
      const phone = ticket.user.phone;
      const name = ticket.attendeeName || ticket.user.firstName || "Attendee";

      const notifyKey = `${email}-${phone || "nophone"}`;
      if (notified.has(notifyKey)) continue;
      notified.add(notifyKey);

      const html = renderEventReminderEmail({
        firstName: name,
        eventName: event.title,
        eventDate,
        eventTime,
        eventVenue: event.venue?.name || "TBD",
        daysAway,
      });

      try {
        await notify(
          NotificationType.EVENT_REMINDER,
          { email, phone: phone || undefined },
          `Reminder: ${event.title} ${daysAway <= 1 ? "Tomorrow!" : `in ${daysAway} days`}`,
          html
        );
        sent++;
      } catch {
        errors++;
      }
    }

    results.push({ event: event.title, sent, errors });
  }

  return NextResponse.json({ processed: events.length, results });
}
