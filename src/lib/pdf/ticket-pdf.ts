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

  const page = pdfDoc.addPage([420, 600]);
  const { width } = page.getSize();
  const ml = 35;
  const mr = width - 35;
  const brand = rgb(0.08, 0.22, 0.93);
  const gray = rgb(0.45, 0.45, 0.45);
  const dark = rgb(0.08, 0.08, 0.08);
  const light = rgb(0.95, 0.95, 0.97);
  const border = rgb(0.88, 0.88, 0.88);

  let y = 0;

  function resetY(val: number) { y = val; }
  function txt(t: string, size: number, opts?: { color?: typeof dark; font?: typeof font; x?: number }) {
    page.drawText(t, { x: opts?.x ?? ml, y, size, font: opts?.font || font, color: opts?.color ?? dark });
    return size + 4;
  }
  function lineY() {
    page.drawLine({ start: { x: ml, y }, end: { x: mr, y }, thickness: 0.5, color: border });
  }
  function filledBox(h: number) {
    page.drawRectangle({ x: ml, y: y - h, width: width - 70, height: h, color: light });
  }

  // ── Header ──
  resetY(575);
  page.drawRectangle({ x: 0, y: y - 10, width: width, height: 40, color: brand });
  page.drawText("Echo", { x: ml, y: y - 2, size: 18, font: bold, color: rgb(1, 1, 1) });
  page.drawText("Voices Across Generations", { x: ml + 62, y: y - 1, size: 10, font, color: rgb(0.85, 0.88, 1) });

  resetY(555);
  page.drawText("CONFIRMED TICKET", { x: ml, y, size: 11, font: bold, color: brand });
  page.drawText(data.eventName, { x: mr - 160, y, size: 11, font: bold, color: brand });

  // ── Event Info ──
  resetY(530);
  lineY();
  resetY(510);
  page.drawText("EVENT", { x: ml, y, size: 9, font: bold, color: gray });
  page.drawText("ATTENDEE", { x: mr - 160, y, size: 9, font: bold, color: gray });
  resetY(495);
  page.drawText(data.eventName, { x: ml, y, size: 12, font: bold, color: dark });
  page.drawText(data.attendeeName, { x: mr - 160, y, size: 12, font: bold, color: dark });
  resetY(478);
  page.drawText(data.eventDate, { x: ml, y, size: 10, font, color: dark });
  resetY(463);
  page.drawText(data.eventVenue, { x: ml, y, size: 10, font, color: dark });

  // ── Ticket Details Box ──
  resetY(430);
  filledBox(90);
  resetY(448);
  page.drawText("TICKET DETAILS", { x: ml + 12, y, size: 9, font: bold, color: brand });
  resetY(430);
  page.drawText(`Ticket Type`, { x: ml + 12, y, size: 9, font, color: gray });
  page.drawText(`Qty`, { x: mr - 100, y, size: 9, font, color: gray });
  page.drawText(`Amount`, { x: mr - 55, y, size: 9, font, color: gray });
  resetY(415);
  lineY();
  resetY(400);
  page.drawText(data.ticketType, { x: ml + 12, y, size: 11, font: bold, color: dark });
  page.drawText(`${data.quantity}`, { x: mr - 95, y, size: 11, font: bold, color: dark });
  page.drawText(`Rs.${data.total}`, { x: mr - 70, y, size: 11, font: bold, color: dark });
  resetY(370);
  page.drawText("Order ID", { x: ml + 12, y, size: 8, font, color: gray });
  resetY(360);
  page.drawText(data.orderId, { x: ml + 12, y, size: 9, font, color: dark });

  // ── Barcode Section ──
  resetY(310);
  page.drawText("SCAN FOR ENTRY", { x: ml, y, size: 9, font: bold, color: gray });
  resetY(295);
  const bcY = y;

  // Barcode bars
  const barW = 1.8;
  const barH = 40;
  let bx = ml;
  const barCount = Math.min(data.barcode.length * 3, 130);
  for (let i = 0; i < barCount; i++) {
    if (i % 2 === 0) {
      page.drawRectangle({ x: bx, y: bcY - barH, width: barW, height: barH, color: dark });
    }
    bx += barW * 2;
  }

  resetY(bcY - barH - 18);
  page.drawText(data.barcode, { x: ml, y, size: 8, font, color: gray });
  resetY(bcY - barH - 36);
  page.drawText(`Orders: ${data.orderId}  |  Tickets: ${data.quantity}  |  Total: Rs.${data.total}`, { x: ml, y, size: 7, font, color: gray });

  // ── Footer ──
  resetY(60);
  lineY();
  resetY(44);
  page.drawText("Thank you for choosing Echo.", { x: ml, y, size: 9, font, color: gray });
  resetY(32);
  page.drawText("Present this barcode at the venue for contactless check-in.", { x: ml, y, size: 8, font, color: gray });
  resetY(18);
  page.drawText("Echo — Voices Across Generations", { x: ml, y, size: 8, font, color: gray });

  return pdfDoc.save();
}
