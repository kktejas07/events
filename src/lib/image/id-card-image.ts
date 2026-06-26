import { createCanvas, loadImage, GlobalFonts } from "@napi-rs/canvas";
import QRCode from "qrcode";

// Register system fonts
GlobalFonts.registerFromPath("/System/Library/Fonts/Helvetica.ttc", "Helvetica");
GlobalFonts.registerFromPath("/System/Library/Fonts/HelveticaNeue.ttc", "HelveticaNeue");
GlobalFonts.registerFromPath("/System/Library/Fonts/ArialHB.ttc", "Arial");

interface IdCardImageData {
  userId: string;
  name: string;
  email: string;
  memberSince: string;
  appUrl: string;
}

const W = 400;
const H = 640;
const BRAND = "#1539ee";
const DARK = "#141414";
const GRAY = "#6b7280";
const WHITE = "#ffffff";
const LIGHT_BG = "#f8f9ff";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function drawRoundedRect(
  ctx: any,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export async function generateIdCardImage(data: IdCardImageData): Promise<Buffer> {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext("2d");

  const ml = 28;
  const mr = W - 28;

  // ── Background ──
  ctx.fillStyle = WHITE;
  drawRoundedRect(ctx, 0, 0, W, H, 16);
  ctx.fill();

  // ── Branded top bar ──
  ctx.fillStyle = BRAND;
  drawRoundedRect(ctx, 0, 0, W, 72, 16);
  ctx.fill();
  // Square off bottom corners of top bar
  ctx.fillRect(0, 56, W, 16);

  ctx.fillStyle = WHITE;
  ctx.font = "bold 26px Helvetica, HelveticaNeue, Arial, sans-serif";
  ctx.fillText("Echo", ml, 44);

  ctx.font = "14px Helvetica, HelveticaNeue, Arial, sans-serif";
  ctx.fillStyle = "#b3c5ff";
  ctx.fillText("Voices Across Generations", ml + 90, 44);

  // ── ID Label ──
  ctx.fillStyle = BRAND;
  ctx.font = "bold 18px Helvetica, HelveticaNeue, Arial, sans-serif";
  ctx.fillText("IDENTITY CARD", ml, 108);

  ctx.fillStyle = GRAY;
  ctx.font = "12px Helvetica, HelveticaNeue, Arial, sans-serif";
  ctx.fillText("#" + data.userId.slice(-8).toUpperCase(), mr - 120, 108);

  // ── Divider ──
  ctx.fillStyle = "#e5e7eb";
  ctx.fillRect(ml, 120, mr - ml, 1);

  // ── Avatar circle (initials) ──
  const cx = ml + 34;
  const cy = 176;
  ctx.beginPath();
  ctx.arc(cx, cy, 32, 0, Math.PI * 2);
  ctx.fillStyle = BRAND;
  ctx.fill();

  ctx.fillStyle = WHITE;
  ctx.font = "bold 20px Helvetica, HelveticaNeue, Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(getInitials(data.name), cx, cy + 7);
  ctx.textAlign = "left";

  // ── Name & Email ──
  ctx.fillStyle = DARK;
  ctx.font = "bold 18px Helvetica, HelveticaNeue, Arial, sans-serif";
  ctx.fillText(data.name, ml + 78, 168);

  ctx.fillStyle = GRAY;
  ctx.font = "13px Helvetica, HelveticaNeue, Arial, sans-serif";
  ctx.fillText(data.email, ml + 78, 190);

  // ── Info section ──
  ctx.fillStyle = "#e5e7eb";
  ctx.fillRect(ml, 218, mr - ml, 1);

  // Info card background
  ctx.fillStyle = LIGHT_BG;
  drawRoundedRect(ctx, ml, 232, mr - ml, 80, 8);
  ctx.fill();

  ctx.fillStyle = GRAY;
  ctx.font = "bold 9px Helvetica, HelveticaNeue, Arial, sans-serif";
  ctx.fillText("MEMBER SINCE", ml + 14, 256);
  ctx.fillText("MEMBER ID", ml + 14, 280);
  ctx.fillText("PLATFORM", ml + 14, 304);

  ctx.fillStyle = DARK;
  ctx.font = "12px Helvetica, HelveticaNeue, Arial, sans-serif";
  ctx.fillText(data.memberSince, ml + 120, 256);
  ctx.font = "bold 12px Helvetica, HelveticaNeue, Arial, sans-serif";
  ctx.fillText(data.userId, ml + 120, 280);
  ctx.font = "11px Helvetica, HelveticaNeue, Arial, sans-serif";
  ctx.fillStyle = BRAND;
  ctx.fillText(data.appUrl.replace(/^https?:\/\//, ""), ml + 120, 304);

  // ── Divider ──
  ctx.fillStyle = "#e5e7eb";
  ctx.fillRect(ml, 330, mr - ml, 1);

  // ── QR Code ──
  const profileUrl = `${data.appUrl}/id/${data.userId}`;
  const qrDataUrl = await QRCode.toDataURL(profileUrl, {
    width: 300,
    margin: 1,
    color: { dark: BRAND, light: "#ffffff" },
  });
  const qrImg = await loadImage(qrDataUrl);
  const qrSize = 130;
  const qrX = (W - qrSize) / 2;
  const qrY = 352;
  ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

  ctx.fillStyle = GRAY;
  ctx.font = "11px Helvetica, HelveticaNeue, Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Scan to view profile & tickets", W / 2, qrY + qrSize + 22);
  ctx.textAlign = "left";

  // ── Footer ──
  ctx.fillStyle = "#e5e7eb";
  ctx.fillRect(ml, H - 44, mr - ml, 1);

  ctx.fillStyle = GRAY;
  ctx.font = "10px Helvetica, HelveticaNeue, Arial, sans-serif";
  ctx.fillText("Echo — Voices Across Generations", ml, H - 22);

  ctx.fillStyle = BRAND;
  ctx.font = "10px Helvetica, HelveticaNeue, Arial, sans-serif";
  ctx.textAlign = "right";
  ctx.fillText("events.forgetechno.com", mr, H - 22);
  ctx.textAlign = "left";

  return canvas.toBuffer("image/png");
}
