import {
  baseEmailLayout,
  wrapContent,
  textBlock,
  button,
  divider,
  tableHeader,
  tableRow,
  tableFooter,
} from "./base";

interface TicketItem {
  name: string;
  quantity: number;
  price: number;
}

interface TicketPurchaseData {
  firstName: string;
  orderId: string;
  eventName: string;
  eventDate: string;
  eventVenue: string;
  tickets: TicketItem[];
  total: number;
}

export function renderTicketPurchaseEmail(data: TicketPurchaseData) {
  const ticketsHtml = data.tickets
    .map((t) => tableRow([t.name, t.quantity, `\u20B9${t.price}`]))
    .join("");

  const body = wrapContent(
    "Purchase Confirmed!",
    textBlock(
      `Thanks ${data.firstName}! Your tickets for <strong>${data.eventName}</strong> are confirmed.`
    ) +
      textBlock(
        `<strong>Order ID:</strong> ${data.orderId}<br/><strong>Date:</strong> ${data.eventDate}<br/><strong>Venue:</strong> ${data.eventVenue}`
      ) +
      divider() +
      `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <thead><tr>${tableHeader("Ticket", "Qty", "Price")}</tr></thead>
      <tbody>${ticketsHtml}</tbody>
      <tfoot>${tableFooter("Total", `\u20B9${data.total}`)}</tfoot>
    </table>` +
      divider() +
      textBlock(
        "Your tickets and barcodes will be available in your dashboard. Present the QR code at the venue for entry."
      ) +
      button("http://localhost:3001/my-tickets", "View My Tickets")
  );
  return baseEmailLayout(body, {
    title: "Tickets Confirmed",
    previewText: `Your ${data.eventName} tickets are confirmed!`,
  });
}
