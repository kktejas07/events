import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import QRCode from "qrcode";

interface IdCardData {
  userId: string;
  name: string;
  email: string;
  memberSince: string;
  appUrl: string;
}

function toBuffer(dataUrl: string): Uint8Array {
  const raw = dataUrl.split(",")[1];
  const bytes = atob(raw);
  const arr = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
  return arr;
}

export async function generateIdCardPdf(data: IdCardData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const pw = 330;
  const ph = 510;
  const page = pdfDoc.addPage([pw, ph]);
  const { width } = page.getSize();
  const ml = 24;
  const mr = width - 24;
  const brand = rgb(0.08, 0.22, 0.93);
  const gray = rgb(0.5, 0.5, 0.5);
  const dark = rgb(0.08, 0.08, 0.08);
  const white = rgb(1, 1, 1);

  let y = 0;

  // ── Branded top bar ──
  page.drawRectangle({ x: 0, y: ph - 60, width, height: 60, color: brand });
  page.drawText("Echo", { x: ml, y: ph - 34, size: 16, font: bold, color: white });
  page.drawText("Voices Across Generations", { x: ml + 58, y: ph - 32, size: 8, font, color: rgb(0.85, 0.88, 1) });

  // ── ID label ──
  y = ph - 90;
  page.drawText("IDENTITY CARD", { x: ml, y, size: 13, font: bold, color: brand });
  page.drawText(`#${data.userId.slice(-8).toUpperCase()}`, { x: mr - 90, y, size: 9, font, color: gray });

  // ── Divider ──
  y -= 6;
  page.drawLine({ start: { x: ml, y }, end: { x: mr, y }, thickness: 0.5, color: rgb(0.9, 0.9, 0.9) });

  // ── Avatar circle (initials) ──
  y = ph - 130;
  const avatarY = y - 28;
  const cx = ml + 28;
  page.drawCircle({ x: cx, y: avatarY, size: 28, color: brand });
  const initials = data.name
    .split(" ")
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
  page.drawText(initials, { x: cx - 8, y: avatarY - 7, size: 16, font: bold, color: white });

  // ── Name & Email ──
  page.drawText(data.name, { x: ml + 64, y: y - 4, size: 13, font: bold, color: dark });
  page.drawText(data.email, { x: ml + 64, y: y - 24, size: 9, font, color: gray });

  // ── Info rows ──
  y = ph - 180;
  page.drawLine({ start: { x: ml, y }, end: { x: mr, y }, thickness: 0.5, color: rgb(0.9, 0.9, 0.9) });

  y -= 16;
  page.drawText("MEMBER SINCE", { x: ml, y, size: 7, font: bold, color: gray });
  page.drawText(data.memberSince, { x: ml + 100, y, size: 9, font, color: dark });

  y -= 16;
  page.drawText("MEMBER ID", { x: ml, y, size: 7, font: bold, color: gray });
  page.drawText(data.userId, { x: ml + 100, y, size: 9, font: bold, color: dark });

  y -= 16;
  page.drawText("PLATFORM", { x: ml, y, size: 7, font: bold, color: gray });
  const displayUrl = data.appUrl.replace(/^https?:\/\//, "");
  page.drawText(displayUrl, { x: ml + 100, y, size: 8, font, color: brand });

  // ── QR Code ──
  y -= 28;
  page.drawLine({ start: { x: ml, y }, end: { x: mr, y }, thickness: 0.5, color: rgb(0.9, 0.9, 0.9) });

  const profileUrl = `${data.appUrl}/id/${data.userId}`;
  const qrDataUrl = await QRCode.toDataURL(profileUrl, {
    width: 200,
    margin: 1,
    color: { dark: "#1539ee", light: "#ffffff" },
  });
  const qrImage = await pdfDoc.embedPng(toBuffer(qrDataUrl));
  const qrSize = 90;

  y -= 8;
  page.drawImage(qrImage, {
    x: ml + 10,
    y: y - qrSize,
    width: qrSize,
    height: qrSize,
  });

  page.drawText("Scan to view profile & tickets", {
    x: ml + qrSize + 20,
    y: y - 10,
    size: 8,
    font,
    color: gray,
  });
  page.drawText(profileUrl, {
    x: ml + qrSize + 20,
    y: y - 26,
    size: 6,
    font,
    color: brand,
  });

  // ── Footer ──
  y = 32;
  page.drawLine({ start: { x: ml, y: y + 6 }, end: { x: mr, y: y + 6 }, thickness: 0.5, color: rgb(0.9, 0.9, 0.9) });
  page.drawText("Echo — Voices Across Generations", {
    x: ml,
    y,
    size: 7,
    font,
    color: gray,
  });
  page.drawText("events.forgetechno.com", {
    x: mr - 90,
    y,
    size: 7,
    font,
    color: gray,
  });

  return pdfDoc.save();
}
