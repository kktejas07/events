import { createCanvas, loadImage, GlobalFonts } from "@napi-rs/canvas";
import QRCode from "qrcode";

GlobalFonts.registerFromPath("/System/Library/Fonts/Helvetica.ttc", "Helvetica");
GlobalFonts.registerFromPath("/System/Library/Fonts/HelveticaNeue.ttc", "HelveticaNeue");
GlobalFonts.registerFromPath("/System/Library/Fonts/ArialHB.ttc", "Arial");

interface IdCardImageData {
  userId: string;
  name: string;
  email: string;
  memberSince: string;
  appUrl: string;
  employeeId?: string | null;
}

const CW = 540;
const CH = 340;
const R = 22;

const BRAND = "#1539EE";
const BRAND_END = "#6C5CE7";
const WHITE = "#FFFFFF";
const VERIFIED_GREEN = "#00B894";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export async function generateIdCardImage(data: IdCardImageData): Promise<Buffer> {
  const canvas = createCanvas(CW, CH);
  const ctx = canvas.getContext("2d");

  const f = (size: number, bold = false) =>
    `${bold ? "bold " : ""}${size}px Helvetica, HelveticaNeue, Arial, sans-serif`;

  // ── Gradient background ──
  const grad = ctx.createLinearGradient(0, 0, CW, CH);
  grad.addColorStop(0, BRAND);
  grad.addColorStop(1, BRAND_END);
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(R, 0);
  ctx.lineTo(CW - R, 0);
  ctx.quadraticCurveTo(CW, 0, CW, R);
  ctx.lineTo(CW, CH - R);
  ctx.quadraticCurveTo(CW, CH, CW - R, CH);
  ctx.lineTo(R, CH);
  ctx.quadraticCurveTo(0, CH, 0, CH - R);
  ctx.lineTo(0, R);
  ctx.quadraticCurveTo(0, 0, R, 0);
  ctx.closePath();
  ctx.fill();

  // ── Watermark "E" ──
  ctx.save();
  ctx.fillStyle = "rgba(255,255,255,0.06)";
  ctx.font = `900 ${CH * 0.42}px Helvetica`;
  ctx.textAlign = "right";
  ctx.fillText("E", CW - 12, CH * 0.72);
  ctx.restore();

  // ── Glass card overlay ──
  const ml = 20;
  const mt = 16;
  const gw = CW - ml * 2;
  const gh = CH - mt * 2;
  ctx.fillStyle = "rgba(255,255,255,0.10)";
  ctx.strokeStyle = "rgba(255,255,255,0.18)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  const gr = R - 4;
  ctx.moveTo(ml + gr, mt);
  ctx.lineTo(ml + gw - gr, mt);
  ctx.quadraticCurveTo(ml + gw, mt, ml + gw, mt + gr);
  ctx.lineTo(ml + gw, mt + gh - gr);
  ctx.quadraticCurveTo(ml + gw, mt + gh, ml + gw - gr, mt + gh);
  ctx.lineTo(ml + gr, mt + gh);
  ctx.quadraticCurveTo(ml, mt + gh, ml, mt + gh - gr);
  ctx.lineTo(ml, mt + gr);
  ctx.quadraticCurveTo(ml, mt, ml + gr, mt);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // ── Header: ECHO / OFFICIAL ID ──
  const hx = ml + 20;
  const hy = mt + 28;
  ctx.fillStyle = "rgba(255,255,255,0.75)";
  ctx.font = f(11, true);
  ctx.textAlign = "left";
  ctx.fillText("ECHO", hx, hy - 16);

  ctx.fillStyle = WHITE;
  ctx.font = f(24, true);
  ctx.fillText("OFFICIAL ID", hx, hy + 16);

  // ── Avatar circle ──
  const ax = hx + 38;
  const ay = hy + 58;
  ctx.beginPath();
  ctx.arc(ax, ay, 28, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.20)";
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.45)";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = WHITE;
  ctx.font = f(18, true);
  ctx.textAlign = "center";
  const initials = getInitials(data.name);
  ctx.fillText(initials, ax, ay + 7);

  // ── Name + subtitle ──
  const nx = ax + 48;
  ctx.textAlign = "left";
  ctx.fillStyle = WHITE;
  ctx.font = f(17, true);
  ctx.fillText(data.name.slice(0, 28), nx, ay - 6);

  ctx.fillStyle = "rgba(255,255,255,0.70)";
  ctx.font = f(12);
  ctx.fillText("Platform Member", nx, ay + 14);

  // ── Divider ──
  const dy = ay + 52;
  ctx.strokeStyle = "rgba(255,255,255,0.15)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(hx, dy);
  ctx.lineTo(ml + gw - 20, dy);
  ctx.stroke();

  // ── Info rows (left column) ──
  const ly = dy + 20;
  const infoLeft = [
    { label: "MEMBER ID", value: data.employeeId || data.userId.slice(-8).toUpperCase() },
    { label: "EMAIL", value: data.email.slice(0, 30) },
    { label: "ISSUED", value: data.memberSince },
  ];
  infoLeft.forEach((r, i) => {
    const y = ly + i * 34;
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.font = f(9, true);
    ctx.textAlign = "left";
    ctx.fillText(r.label, hx, y);
    ctx.fillStyle = WHITE;
    ctx.font = f(13, true);
    ctx.fillText(r.value, hx, y + 16);
  });

  // ── QR Code (right side) ──
  const profileUrl = `${data.appUrl}/id/${data.userId}`;
  const qrDataUrl = await QRCode.toDataURL(profileUrl, {
    width: 300,
    margin: 2,
    color: { dark: BRAND, light: "#ffffff" },
  });
  const qrImg = await loadImage(qrDataUrl);

  const qrSize = 90;
  const qrX = ml + gw - qrSize - 24;
  const qrY = ly - 14;

  ctx.fillStyle = "rgba(255,255,255,0.95)";
  ctx.beginPath();
  ctx.moveTo(qrX - 8 + 8, qrY - 8);
  ctx.lineTo(qrX + qrSize + 8 - 8, qrY - 8);
  ctx.quadraticCurveTo(qrX + qrSize + 8, qrY - 8, qrX + qrSize + 8, qrY - 8 + 8);
  ctx.lineTo(qrX + qrSize + 8, qrY + qrSize + 8 - 8);
  ctx.quadraticCurveTo(qrX + qrSize + 8, qrY + qrSize + 8, qrX + qrSize + 8 - 8, qrY + qrSize + 8);
  ctx.lineTo(qrX - 8 + 8, qrY + qrSize + 8);
  ctx.quadraticCurveTo(qrX - 8, qrY + qrSize + 8, qrX - 8, qrY + qrSize + 8 - 8);
  ctx.lineTo(qrX - 8, qrY - 8 + 8);
  ctx.quadraticCurveTo(qrX - 8, qrY - 8, qrX - 8 + 8, qrY - 8);
  ctx.closePath();
  ctx.fill();

  ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

  ctx.fillStyle = "rgba(255,255,255,0.50)";
  ctx.font = f(8);
  ctx.textAlign = "center";
  ctx.fillText("Scan me", qrX + qrSize / 2, qrY + qrSize + 16);

  // ── Footer ──
  const fy = CH - 24;
  ctx.fillStyle = "rgba(255,255,255,0.50)";
  ctx.font = f(10);
  ctx.textAlign = "left";
  ctx.fillText("Tap for verification →", hx, fy);

  ctx.textAlign = "right";
  ctx.fillText("events.forgetechno.com", ml + gw - 20, fy);

  return canvas.toBuffer("image/png");
}
