import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

interface InvoiceItem {
  description: string;
  amount: number;
}

interface InvoiceData {
  orderId: string;
  eventName: string;
  paymentMethod: string;
  paidAt: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  customerName: string;
}

export async function generateInvoicePdf(data: InvoiceData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const page = pdfDoc.addPage([400, 580]);
  const { width, height } = page.getSize();
  let y = height - 40;

  function drawText(t: string, size = 11, opts?: { color?: number[]; font?: typeof font; x?: number }) {
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
  drawText("echo — Voices Across Generations", 16, { font: bold, color: [0.08, 0.22, 0.93] });
  y -= 4;
  drawText("INVOICE", 16, { font: bold });
  y -= 8;

  // Separator
  page.drawLine({ start: { x: 40, y }, end: { x: width - 40, y }, thickness: 1.5, color: rgb(0.08, 0.22, 0.93) });
  y -= 20;

  // Order info
  drawText(`Order: ${data.orderId}`, 11, { font: bold });
  drawText(`Event: ${data.eventName}`, 10);
  drawText(`Payment: ${data.paymentMethod}`, 10);
  drawText(`Date: ${data.paidAt}`, 10);
  drawText(`Customer: ${data.customerName}`, 10);
  y -= 12;

  // Items header
  page.drawRectangle({
    x: 40, y: y - 22, width: width - 80, height: 24,
    color: rgb(0.08, 0.22, 0.93),
  });

  page.drawText("Item", { x: 50, y: y - 16, size: 10, font: bold, color: rgb(1, 1, 1) });
  page.drawText("Amount", { x: width - 120, y: y - 16, size: 10, font: bold, color: rgb(1, 1, 1) });
  y -= 30;

  // Items
  for (const item of data.items) {
    page.drawText(item.description, { x: 50, y, size: 10, font, color: rgb(0.1, 0.1, 0.1) });
    page.drawText(`Rs.${item.amount}`, { x: width - 130, y, size: 10, font, color: rgb(0.1, 0.1, 0.1) });
    y -= 20;
  }

  y -= 8;
  page.drawLine({ start: { x: 40, y }, end: { x: width - 40, y }, thickness: 0.5, color: rgb(0.85, 0.85, 0.85) });
  y -= 16;

  // Totals
  const labelX = width - 180;
  const valueX = width - 120;

  function totalLine(label: string, value: string, isBold = false) {
    const f = isBold ? bold : font;
    const sz = isBold ? 12 : 10;
    page.drawText(label, { x: labelX, y, size: sz, font: f, color: rgb(0.3, 0.3, 0.3) });
    page.drawText(value, { x: valueX, y, size: sz, font: f, color: rgb(0.1, 0.1, 0.1) });
    y -= sz + 6;
  }

  totalLine("Subtotal", `Rs.${data.subtotal}`);
  totalLine("Tax", `Rs.${data.tax}`);
  page.drawLine({ start: { x: labelX, y: y - 2 }, end: { x: width - 40, y: y - 2 }, thickness: 0.5, color: rgb(0.85, 0.85, 0.85) });
  y -= 10;
  totalLine("Total", `Rs.${data.total}`, true);

  // Footer
  y = 60;
  page.drawLine({ start: { x: 40, y }, end: { x: width - 40, y }, thickness: 1, color: rgb(0.85, 0.85, 0.85) });
  y -= 16;
  drawText("Thank you for your purchase!", 10, { color: [0.5, 0.5, 0.5] });
  drawText("echo — Voices Across Generations", 9, { color: [0.5, 0.5, 0.5] });

  return pdfDoc.save();
}
