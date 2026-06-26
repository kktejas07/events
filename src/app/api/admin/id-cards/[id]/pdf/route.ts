import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { getProfileUrl } from "@/lib/qr-token";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import QRCode from "qrcode";

function toBuffer(dataUrl: string): Uint8Array {
  const raw = dataUrl.split(",")[1];
  const bytes = atob(raw);
  const arr = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
  return arr;
}

function initials(firstName?: string | null, lastName?: string | null): string {
  const parts = [firstName || "", lastName || ""].filter(Boolean);
  return parts.map((s) => s[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
}

function typeBadgeColor(type: string): [number, number, number] {
  switch (type) {
    case "EMPLOYEE": return [0.08, 0.22, 0.93];
    case "VISITOR": return [0.15, 0.7, 0.3];
    case "VOLUNTEER": return [0.95, 0.6, 0.1];
    case "CONTRACTOR": return [0.6, 0.2, 0.8];
    default: return [0.4, 0.4, 0.4];
  }
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session)
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const role = (session.user as { role?: string })?.role;
    if (!["ADMIN", "SUPER_ADMIN", "ORGANIZATION_ADMIN"].includes(role || "")) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const idCard = await db.idCard.findUnique({
      where: { id: params.id },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true, avatarUrl: true, company: true, jobTitle: true } },
      },
    });

    if (!idCard) {
      return NextResponse.json({ success: false, error: "ID card not found" }, { status: 404 });
    }

    const { user } = idCard;
    const name = `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Unknown";
    const init = initials(user.firstName, user.lastName);

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
    const typeColor = typeBadgeColor(idCard.type);

    const p1 = pdfDoc.addPage([pw, ph]);

    p1.drawRectangle({ x: 0, y: ph - 55, width: pw, height: 55, color: brand });
    p1.drawText("ID CARD", { x: ml, y: ph - 32, size: 20, font: bold, color: white });
    p1.drawText("Verified Credential", {
      x: ml + 100, y: ph - 30, size: 10, font, color: rgb(0.85, 0.88, 1),
    });
    p1.drawText(idCard.idNumber, {
      x: mr - 130, y: ph - 28, size: 7, font: bold, color: white,
    });
    p1.drawText(idCard.idNumber.slice(-8).toUpperCase(), {
      x: mr - 130, y: ph - 42, size: 11, font: bold, color: white,
    });

    const cx = ml + 38;
    const cy = ph - 105;
    p1.drawCircle({ x: cx, y: cy, size: 36, color: brand });
    p1.drawText(init, {
      x: cx - init.length * 5, y: cy - 9, size: 20, font: bold, color: white,
    });

    p1.drawText(name, { x: ml + 90, y: ph - 108, size: 16, font: bold, color: dark });
    if (idCard.designation) {
      p1.drawText(idCard.designation, { x: ml + 90, y: ph - 126, size: 10, font, color: gray });
    }
    if (idCard.department) {
      p1.drawText(idCard.department, { x: ml + 90, y: ph - 140, size: 10, font, color: gray });
    }
    if (user.company) {
      p1.drawText(user.company, { x: ml + 90, y: ph - 154, size: 9, font: bold, color: brand });
    }

    p1.drawRectangle({
      x: mr - 80, y: ph - 140, width: 60, height: 20, color: rgb(...typeColor),
    });
    p1.drawText(idCard.type, {
      x: mr - 72, y: ph - 132, size: 9, font: bold, color: white,
    });

    p1.drawLine({
      start: { x: ml, y: ph - 175 }, end: { x: mr, y: ph - 175 },
      thickness: 0.5, color: border,
    });

    const infoRows = [
      { label: "ID Number", value: idCard.idNumber },
      { label: "Issued", value: idCard.issuedAt.toLocaleDateString() },
      ...(idCard.expiresAt ? [{ label: "Expires", value: idCard.expiresAt.toLocaleDateString() }] : []),
    ];
    infoRows.forEach((r, i) => {
      const y = ph - 192 - i * 20;
      p1.drawText(r.label, { x: ml, y, size: 7, font: bold, color: gray });
      p1.drawText(r.value, { x: ml + 90, y, size: 10, font: bold, color: dark });
    });

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

    const p2 = pdfDoc.addPage([pw, ph]);

    p2.drawRectangle({ x: 0, y: ph - 55, width: pw, height: 55, color: brand });
    p2.drawText("Scan to Verify", { x: ml, y: ph - 32, size: 16, font: bold, color: white });
    p2.drawText("Digital identity verification", {
      x: ml + 130, y: ph - 30, size: 10, font, color: rgb(0.85, 0.88, 1),
    });

    const profileUrl = getProfileUrl(idCard.qrToken);
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

    const pdfBytes = await pdfDoc.save();

    return new NextResponse(new Uint8Array(pdfBytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="id-card-${idCard.idNumber}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Admin id-card PDF error:", error);
    return NextResponse.json({ success: false, error: "Failed to generate PDF" }, { status: 500 });
  }
}
