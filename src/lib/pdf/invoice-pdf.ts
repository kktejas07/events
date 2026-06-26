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

  const page = pdfDoc.addPage([420, 620]);
  const { width } = page.getSize();
  const ml = 35;
  const mr = width - 35;
  const brand = rgb(0.08, 0.22, 0.93);
  const gray = rgb(0.45, 0.45, 0.45);
  const dark = rgb(0.08, 0.08, 0.08);

  let y = 0;

  function resetY(val: number) { y = val; }
  function txt(t: string, size: number, opts?: { color?: typeof dark; font?: typeof font; x?: number }) {
    page.drawText(t, { x: opts?.x ?? ml, y, size, font: opts?.font || font, color: opts?.color ?? dark });
    return size + 4;
  }
  function lineY() {
    page.drawLine({ start: { x: ml, y }, end: { x: mr, y }, thickness: 0.5, color: rgb(0.88, 0.88, 0.88) });
  }

  // ── Header ──
  resetY(585);
  page.drawRectangle({ x: 0, y: y - 10, width, height: 40, color: brand });
  page.drawText("Echo", { x: ml, y: y - 2, size: 18, font: bold, color: rgb(1, 1, 1) });
  page.drawText("Voices Across Generations", { x: ml + 62, y: y - 1, size: 10, font, color: rgb(0.85, 0.88, 1) });

  resetY(555);
  page.drawText("INVOICE", { x: mr - 70, y, size: 16, font: bold, color: brand });
  resetY(565);
  page.drawText(`#${data.orderId}`, { x: ml, y, size: 10, font, color: gray });

  // ── Bill To ──
  resetY(535);
  page.drawText("BILL TO", { x: ml, y, size: 9, font: bold, color: gray });
  resetY(520);
  page.drawText(data.customerName, { x: ml, y, size: 12, font: bold, color: dark });

  // ── Order Info ──
  resetY(535);
  page.drawText("EVENT", { x: mr - 140, y, size: 9, font: bold, color: gray });
  resetY(520);
  page.drawText(data.eventName, { x: mr - 140, y, size: 12, font: bold, color: dark });
  resetY(503);
  page.drawText(`Payment: ${data.paymentMethod}`, { x: mr - 140, y, size: 10, font, color: dark });
  resetY(488);
  page.drawText(`Date: ${data.paidAt}`, { x: mr - 140, y, size: 10, font, color: dark });

  // ── Items Table Header ──
  resetY(455);
  page.drawRectangle({ x: ml, y: y - 22, width: width - 70, height: 24, color: brand });
  resetY(442);
  page.drawText("#", { x: ml + 10, y, size: 10, font: bold, color: rgb(1, 1, 1) });
  page.drawText("DESCRIPTION", { x: ml + 30, y, size: 10, font: bold, color: rgb(1, 1, 1) });
  page.drawText("AMOUNT", { x: mr - 65, y, size: 10, font: bold, color: rgb(1, 1, 1) });

  // ── Items ──
  resetY(414);
  let idx = 1;
  for (const item of data.items) {
    page.drawText(`${idx}`, { x: ml + 12, y, size: 10, font, color: dark });
    page.drawText(item.description, { x: ml + 32, y, size: 10, font, color: dark });
    page.drawText(`Rs.${item.amount}`, { x: mr - 80, y, size: 10, font, color: dark });
    y -= 22;
    idx++;
  }

  // ── Totals ──
  const totY = y + 4;
  lineY();
  resetY(totY - 18);

  function totalLine(label: string, value: string, isBold = false) {
    const f = isBold ? bold : font;
    const sz = isBold ? 12 : 10;
    page.drawText(label, { x: mr - 140, y, size: sz, font: f, color: gray });
    page.drawText(value, { x: mr - 60, y, size: sz, font: f, color: dark });
    y -= sz + 6;
  }

  totalLine("Subtotal", `Rs.${data.subtotal}`);
  totalLine("Tax (0%)", `Rs.${data.tax}`);
  page.drawLine({ start: { x: mr - 145, y: y - 2 }, end: { x: mr, y: y - 2 }, thickness: 0.5, color: rgb(0.88, 0.88, 0.88) });
  y -= 10;
  totalLine("Total", `Rs.${data.total}`, true);

  // ── Payment Status ──
  resetY(totY - 140);
  page.drawRectangle({ x: ml, y: y - 22, width: 120, height: 24, color: rgb(0.12, 0.68, 0.28) });
  resetY(y - 15);
  page.drawText("PAID", { x: ml + 45, y, size: 11, font: bold, color: rgb(1, 1, 1) });

  // ── Footer ──
  resetY(60);
  lineY();
  resetY(44);
  page.drawText("Thank you for your business.", { x: ml, y, size: 9, font, color: gray });
  resetY(32);
  page.drawText("This is a computer-generated invoice.", { x: ml, y, size: 8, font, color: gray });
  resetY(18);
  page.drawText("Echo — Voices Across Generations", { x: ml, y, size: 8, font, color: gray });

  return pdfDoc.save();
}
