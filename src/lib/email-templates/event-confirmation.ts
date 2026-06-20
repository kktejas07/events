import { baseEmailLayout, wrapContent, textBlock, button, infoTable } from "./base";

interface EventConfirmationData {
  firstName: string;
  eventName: string;
  eventDate: string;
  eventTime: string;
  eventVenue: string;
  ticketType: string;
}

export function renderEventConfirmationEmail(data: EventConfirmationData) {
  const body = wrapContent(
    "You're Registered!",
    textBlock(`Hey ${data.firstName}, you're all set for <strong>${data.eventName}</strong>.`) +
      infoTable([
        { label: "Date", value: data.eventDate },
        { label: "Time", value: data.eventTime },
        { label: "Venue", value: data.eventVenue },
        { label: "Ticket", value: data.ticketType },
      ]) +
      button("http://localhost:3001/my-tickets", "View My Tickets")
  );
  return baseEmailLayout(body, {
    title: "Event Registration Confirmed",
    previewText: `Registered for ${data.eventName}`,
  });
}
