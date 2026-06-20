import { baseEmailLayout, wrapContent, textBlock, infoTable } from "./base";

interface EventReminderData {
  firstName: string;
  eventName: string;
  eventDate: string;
  eventTime: string;
  eventVenue: string;
  daysAway: number;
}

export function renderEventReminderEmail(data: EventReminderData) {
  const urgency = data.daysAway <= 1 ? "tomorrow" : `in ${data.daysAway} days`;

  const body = wrapContent(
    `Event ${data.daysAway <= 1 ? "Tomorrow!" : "Coming Soon"}`,
    textBlock(
      `Hey ${data.firstName}, just a heads up that <strong>${data.eventName}</strong> is ${urgency}!`
    ) +
      infoTable([
        { label: "Date", value: data.eventDate },
        { label: "Time", value: data.eventTime },
        { label: "Venue", value: data.eventVenue },
      ]) +
      textBlock(
        "Don't forget to bring your ticket with the QR code for a smooth check-in. See you there!"
      )
  );
  return baseEmailLayout(body, {
    title: "Event Reminder",
    previewText: `${data.eventName} is ${urgency}!`,
  });
}
