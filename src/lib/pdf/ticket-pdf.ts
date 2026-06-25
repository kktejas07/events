import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

interface TicketData {
  orderId: string;
  eventName: string;
  eventDate: string;
  eventVenue: string;
  attendeeName: string;
  ticketType: string;
  quantity: number;
  total: number;
  barcode: string;
}

export async function generateTicketPdf(data: TicketData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let page = pdfDoc.addPage([400, 580]);
  const { width, height } = page.getSize();
  let y = height - 40;

  function text(t: string, size = 11, opts?: { color?: number[]; font?: typeof font; x?: number }) {
    const f = opts?.font || font;
    page.drawText(t, {
      x: opts?.x ?? 40,
      y,
      size,
      font: f,
      color: opts?.color ? rgb(opts.color[0], opts.color[1], opts.color[2]) : rgb(0.1, 0.1, 0.1),
    });
    y -= size + 6;
  }

  // Header
  text("echo — Voices Across Generations", 16, { font: bold, color: [0.08, 0.22, 0.93] });
  y -= 4;
  text("Event Ticket", 13, { font: bold });
  y -= 8;

  // Separator line
  page.drawLine({ start: { x: 40, y }, end: { x: width - 40, y }, thickness: 1, color: rgb(0.85, 0.85, 0.85) });
  y -= 16;

  // Event details
  text(data.eventName, 14, { font: bold });
  text(`Date: ${data.eventDate}`);
  text(`Venue: ${data.eventVenue}`);
  y -= 8;

  text(`Order: ${data.orderId}`, 10, { color: [0.5, 0.5, 0.5] });
  y -= 12;

  // Ticket details box
  const boxY = y;
  page.drawRectangle({
    x: 40,
    y: y - 80,
    width: width - 80,
    height: 100,
    borderColor: rgb(0.85, 0.85, 0.85),
    borderWidth: 1,
    color: rgb(0.97, 0.97, 0.99),
  });

  y -= 16;
  text("TICKET DETAILS", 10, { font: bold, color: [0.08, 0.22, 0.93] });
  text(`Attendee: ${data.attendeeName}`);
  text(`Ticket: ${data.ticketType} x${data.quantity}`);
  text(`Total Paid: Rs.${data.total}`);
  y = boxY - 100;

  // Barcode
  y -= 16;
  page.drawLine({ start: { x: 40, y }, end: { x: width - 40, y }, thickness: 1, color: rgb(0.85, 0.85, 0.85) });
  y -= 16;
  text("Barcode", 10, { color: [0.5, 0.5, 0.5] });

  // Render barcode as text (since we can't generate actual barcode images easily)
  const barcodeText = data.barcode;
  const bcSize = 8;
  const bcX = 40;
  page.drawText(barcodeText, { x: bcX, y: y - 16, size: bcSize, font, color: rgb(0, 0, 0) });

  // Barcode bars using thin rectangles
  const barWidth = 1.5;
  const barHeight = 30;
  let bx = bcX;
  for (let i = 0; i < Math.min(barcodeText.length * 3, 120); i++) {
    if (i % 2 === 0) {
      page.drawRectangle({
        x: bx,
        y: y - 50,
        width: barWidth,
        height: barHeight,
        color: rgb(0, 0, 0),
      });
    }
    bx += barWidth * 2;
  }

  y = y - 70;

  // Footer
  page.drawLine({ start: { x: 40, y }, end: { x: width - 40, y }, thickness: 1, color: rgb(0.85, 0.85, 0.85) });
  y -= 16;
  text("Present this QR code at the venue for entry.", 9, { color: [0.5, 0.5, 0.5] });
  text("echo — Voices Across Generations", 9, { color: [0.5, 0.5, 0.5] });

  return pdfDoc.save();
}
