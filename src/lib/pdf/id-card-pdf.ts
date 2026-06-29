import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import QRCode from "qrcode";

interface IdCardData {
  userId: string;
  name: string;
  email: string;
  memberSince: string;
  appUrl: string;
  employeeId?: string;
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

  const pw = 510;
  const ph = 340;
  const ml = 24;
  const mr = pw - 24;
  const dark = rgb(0.1, 0.1, 0.1);
  const gray = rgb(0.4, 0.4, 0.4);
  const brand = rgb(0.08, 0.22, 0.93);
  const white = rgb(1, 1, 1);
  const border = rgb(0.9, 0.9, 0.9);

  function initials(name: string): string {
    return name
      .split(" ")
      .map((s) => s[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }

  // ════════════════════════ FRONT ════════════════════════
  const p1 = pdfDoc.addPage([pw, ph]);

  // Brand bar
  p1.drawRectangle({ x: 0, y: ph - 55, width: pw, height: 55, color: brand });
  p1.drawText("Echo", { x: ml, y: ph - 32, size: 20, font: bold, color: white });
  p1.drawText("Voices Across Generations", {
    x: ml + 76, y: ph - 30, size: 10, font, color: rgb(0.85, 0.88, 1),
  });
  p1.drawText("MEMBER ID", {
    x: mr - 110, y: ph - 28, size: 7, font: bold, color: white,
  });
  p1.drawText("#" + (data.employeeId || data.userId.slice(-8).toUpperCase()), {
    x: mr - 110, y: ph - 42, size: 11, font: bold, color: white,
  });

  // Avatar
  const cx = ml + 38;
  const cy = ph - 105;
  p1.drawCircle({ x: cx, y: cy, size: 36, color: brand });
  const init = initials(data.name);
  p1.drawText(init, {
    x: cx - init.length * 5, y: cy - 9, size: 20, font: bold, color: white,
  });

  // Name & email
  p1.drawText(data.name, { x: ml + 90, y: ph - 108, size: 16, font: bold, color: dark });
  p1.drawText(data.email, { x: ml + 90, y: ph - 126, size: 10, font, color: gray });
  p1.drawText("Member", { x: ml + 90, y: ph - 142, size: 9, font: bold, color: brand });

  // Divider
  p1.drawLine({
    start: { x: ml, y: ph - 165 }, end: { x: mr, y: ph - 165 },
    thickness: 0.5, color: border,
  });

  // Info rows
  const infoRows = [
    { label: "Member Since", value: data.memberSince },
    { label: "Member ID", value: data.employeeId || data.userId },
    { label: "Website", value: data.appUrl.replace(/^https?:\/\//, "") },
  ];
  infoRows.forEach((r, i) => {
    const y = ph - 182 - i * 20;
    p1.drawText(r.label, { x: ml, y, size: 7, font: bold, color: gray });
    p1.drawText(r.value, { x: ml + 90, y, size: 10, font: bold, color: dark });
  });

  // Footer
  p1.drawLine({
    start: { x: ml, y: 36 }, end: { x: mr, y: 36 },
    thickness: 0.5, color: border,
  });
  p1.drawText("Echo — Voices Across Generations", {
    x: ml, y: 20, size: 8, font, color: gray,
  });
  p1.drawText("events.forgetechno.com", {
    x: mr - 100, y: 20, size: 8, font: bold, color: brand,
  });

  // ════════════════════════ BACK ════════════════════════
  const p2 = pdfDoc.addPage([pw, ph]);

  // Brand bar
  p2.drawRectangle({ x: 0, y: ph - 55, width: pw, height: 55, color: brand });
  p2.drawText("Scan to Access", { x: ml, y: ph - 32, size: 16, font: bold, color: white });
  p2.drawText("Your digital profile & tickets", {
    x: ml + 122, y: ph - 30, size: 10, font, color: rgb(0.85, 0.88, 1),
  });

  // QR Code
  const profileUrl = `${data.appUrl}/id/${data.userId}`;
  const qrDataUrl = await QRCode.toDataURL(profileUrl, {
    width: 400, margin: 2, color: { dark: "#1539ee", light: "#ffffff" },
  });
  const qrImage = await pdfDoc.embedPng(toBuffer(qrDataUrl));
  const qrSize = 140;
  const qrX = (pw - qrSize) / 2;

  p2.drawImage(qrImage, { x: qrX, y: ph - 190, width: qrSize, height: qrSize });

  p2.drawText("Scan with your phone camera", {
    x: ml, y: ph - 210, size: 11, font, color: dark,
  });
  p2.drawText(profileUrl, {
    x: ml, y: ph - 228, size: 8, font, color: brand,
  });

  // Footer
  p2.drawLine({
    start: { x: ml, y: 36 }, end: { x: mr, y: 36 },
    thickness: 0.5, color: border,
  });
  p2.drawText("This is a digital identity card issued by Echo.", {
    x: ml, y: 20, size: 8, font, color: gray,
  });
  p2.drawText("Scan the QR code to verify.", {
    x: mr - 100, y: 20, size: 8, font, color: gray,
  });

  return pdfDoc.save();
}
