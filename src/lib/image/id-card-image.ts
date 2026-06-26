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
}

const CARD_W = 460;
const CARD_H = 300;
const GAP = 30;
const W = CARD_W;
const H = CARD_H * 2 + GAP;
const R = 14;

const BRAND = "#1539ee";
const DARK = "#1a1a2e";
const GRAY = "#64748b";
const LIGHT_GRAY = "#e2e8f0";
const WHITE = "#ffffff";
const BG = "#f1f5f9";
const GOLD = "#f59e0b";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function roundRect(ctx: any, x: number, y: number, w: number, h: number, r: number) {
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

  const font = (s: number, bold = false) =>
    `${bold ? "bold " : ""}${s}px Helvetica, HelveticaNeue, Arial, sans-serif`;

  // ── Background ──
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, W, H);

  function drawCard(yOff: number) {
    // Card shadow
    ctx.fillStyle = "rgba(0,0,0,0.08)";
    roundRect(ctx, 6, yOff + 6, CARD_W - 12, CARD_H - 12, R);
    ctx.fill();

    // Card body
    ctx.fillStyle = WHITE;
    roundRect(ctx, 2, yOff + 2, CARD_W - 4, CARD_H - 4, R);
    ctx.fill();
    roundRect(ctx, 0, yOff, CARD_W, CARD_H, R);
    ctx.fill();
  }

  // ════════════════════════════════════════════
  //  FRONT
  // ════════════════════════════════════════════
  drawCard(0);

  const ml = 24;
  const mr = CARD_W - 24;

  // Branded top strip
  ctx.fillStyle = BRAND;
  ctx.beginPath();
  ctx.moveTo(0, R);
  ctx.quadraticCurveTo(0, 0, R, 0);
  ctx.lineTo(CARD_W - R, 0);
  ctx.quadraticCurveTo(CARD_W, 0, CARD_W, R);
  ctx.lineTo(CARD_W, 80);
  ctx.lineTo(0, 80);
  ctx.closePath();
  ctx.fill();

  // Brand name
  ctx.fillStyle = WHITE;
  ctx.font = font(22, true);
  ctx.fillText("Echo", ml, 36);

  ctx.fillStyle = "#b3c5ff";
  ctx.font = font(11);
  ctx.fillText("Voices Across Generations", ml + 82, 36);

  // Member badge
  ctx.fillStyle = "rgba(255,255,255,0.15)";
  roundRect(ctx, mr - 120, 14, 108, 30, 6);
  ctx.fill();

  ctx.fillStyle = WHITE;
  ctx.font = font(8);
  ctx.fillText("MEMBER ID", mr - 110, 24);
  ctx.font = font(11, true);
  ctx.fillText("#" + data.userId.slice(-8).toUpperCase(), mr - 110, 39);

  // ── Photo / Initials ──
  const cx = ml + 44;
  const cy = 140;
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, 40, 0, Math.PI * 2);
  ctx.clip();
  ctx.fillStyle = BRAND;
  ctx.fillRect(cx - 40, cy - 40, 80, 80);
  ctx.fillStyle = WHITE;
  ctx.font = font(28, true);
  ctx.textAlign = "center";
  ctx.fillText(getInitials(data.name), cx, cy + 10);
  ctx.textAlign = "left";
  ctx.restore();

  // Photo ring
  ctx.strokeStyle = WHITE;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, cy, 40, 0, Math.PI * 2);
  ctx.stroke();

  // ── Name & Role ──
  ctx.fillStyle = DARK;
  ctx.font = font(18, true);
  ctx.fillText(data.name, ml + 100, 130);

  ctx.fillStyle = GRAY;
  ctx.font = font(12);
  ctx.fillText(data.email, ml + 100, 150);

  ctx.fillStyle = BRAND;
  ctx.font = font(10);
  ctx.fillText("Member", ml + 100, 168);

  // ── Divider ──
  ctx.strokeStyle = LIGHT_GRAY;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(ml, 192);
  ctx.lineTo(mr, 192);
  ctx.stroke();

  // ── Info rows ──
  const rows = [
    { label: "Member Since", value: data.memberSince },
    { label: "Member ID", value: data.userId },
    { label: "Website", value: data.appUrl.replace(/^https?:\/\//, "") },
  ];

  rows.forEach((r, i) => {
    const y = 210 + i * 24;
    ctx.fillStyle = GRAY;
    ctx.font = font(8, true);
    ctx.fillText(r.label, ml, y);
    ctx.fillStyle = DARK;
    ctx.font = font(11, true);
    ctx.fillText(r.value, ml + 100, y);
  });

  // ── Footer strip ──
  ctx.fillStyle = "#f8fafc";
  ctx.beginPath();
  ctx.moveTo(0, CARD_H - R);
  ctx.quadraticCurveTo(0, CARD_H, R, CARD_H);
  ctx.lineTo(CARD_W - R, CARD_H);
  ctx.quadraticCurveTo(CARD_W, CARD_H, CARD_W, CARD_H - R);
  ctx.lineTo(CARD_W, CARD_H - 40);
  ctx.lineTo(0, CARD_H - 40);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = GRAY;
  ctx.font = font(9);
  ctx.fillText("Echo — Voices Across Generations", ml, CARD_H - 14);

  ctx.fillStyle = BRAND;
  ctx.font = font(10, true);
  ctx.textAlign = "right";
  ctx.fillText("events.forgetechno.com", mr, CARD_H - 14);
  ctx.textAlign = "left";

  // ════════════════════════════════════════════
  //  BACK
  // ════════════════════════════════════════════
  const backY = CARD_H + GAP;
  drawCard(backY);

  // Brand bar at top of back
  ctx.fillStyle = BRAND;
  ctx.beginPath();
  ctx.moveTo(0, backY + R);
  ctx.quadraticCurveTo(0, backY, R, backY);
  ctx.lineTo(CARD_W - R, backY);
  ctx.quadraticCurveTo(CARD_W, backY, CARD_W, backY + R);
  ctx.lineTo(CARD_W, backY + 50);
  ctx.lineTo(0, backY + 50);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = WHITE;
  ctx.font = font(16, true);
  ctx.fillText("Scan to Access", ml, backY + 32);

  ctx.fillStyle = "#b3c5ff";
  ctx.font = font(10);
  ctx.fillText("Your digital profile & tickets", ml + 130, backY + 32);

  // ── QR Code ──
  const profileUrl = `${data.appUrl}/id/${data.userId}`;
  const qrDataUrl = await QRCode.toDataURL(profileUrl, {
    width: 400,
    margin: 2,
    color: { dark: BRAND, light: "#ffffff" },
  });
  const qrImg = await loadImage(qrDataUrl);
  const qrSize = 160;
  const qrX = (CARD_W - qrSize) / 2;
  const qrY = backY + 70;

  // White background for QR
  ctx.fillStyle = WHITE;
  roundRect(ctx, qrX - 8, qrY - 8, qrSize + 16, qrSize + 16, 8);
  ctx.fill();

  ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

  // Scan text
  ctx.fillStyle = DARK;
  ctx.font = font(11);
  ctx.textAlign = "center";
  ctx.fillText("Scan with your phone camera", CARD_W / 2, qrY + qrSize + 22);
  ctx.fillStyle = GRAY;
  ctx.font = font(9);
  ctx.fillText("or visit link below", CARD_W / 2, qrY + qrSize + 36);
  ctx.textAlign = "left";

  // URL
  ctx.fillStyle = BRAND;
  ctx.font = font(9);
  ctx.textAlign = "center";
  ctx.fillText(profileUrl, CARD_W / 2, qrY + qrSize + 54);
  ctx.textAlign = "left";

  // ── Footer strip on back ──
  ctx.fillStyle = "#f8fafc";
  ctx.beginPath();
  ctx.moveTo(0, backY + CARD_H - R);
  ctx.quadraticCurveTo(0, backY + CARD_H, R, backY + CARD_H);
  ctx.lineTo(CARD_W - R, backY + CARD_H);
  ctx.quadraticCurveTo(CARD_W, backY + CARD_H, CARD_W, backY + CARD_H - R);
  ctx.lineTo(CARD_W, backY + CARD_H - 36);
  ctx.lineTo(0, backY + CARD_H - 36);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = GRAY;
  ctx.font = font(8);
  ctx.textAlign = "center";
  ctx.fillText("This is a digital identity card issued by Echo. Scan QR to verify.", CARD_W / 2, backY + CARD_H - 12);
  ctx.textAlign = "left";

  return canvas.toBuffer("image/png");
}
