import crypto from "crypto";

const QR_SECRET = process.env.QR_TOKEN_SECRET || process.env.AUTH_SECRET || "qr-secret-change-in-production";

interface QrTokenPayload {
  type: "PROFILE" | "ID_CARD" | "TICKET";
  userId: string;
  exp: number;
  sig: string;
}

export function generateQrToken(
  type: QrTokenPayload["type"],
  userId: string,
  ttlMs = 365 * 24 * 60 * 60 * 1000
): string {
  const exp = Date.now() + ttlMs;
  const data = `${type}:${userId}:${exp}`;
  const sig = crypto.createHmac("sha256", QR_SECRET).update(data).digest("hex").substring(0, 16);
  const payload = { type, userId, exp, sig };
  return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

export function verifyQrToken(token: string): { userId: string; type: string } | null {
  try {
    const payload: QrTokenPayload = JSON.parse(
      Buffer.from(token, "base64url").toString("utf-8")
    );
    if (payload.exp < Date.now()) return null;
    const data = `${payload.type}:${payload.userId}:${payload.exp}`;
    const expected = crypto
      .createHmac("sha256", QR_SECRET)
      .update(data)
      .digest("hex")
      .substring(0, 16);
    if (expected !== payload.sig) return null;
    return { userId: payload.userId, type: payload.type };
  } catch {
    return null;
  }
}

export function getProfileUrl(token: string): string {
  const base = process.env.NEXT_PUBLIC_APP_URL || "https://events.forgetechno.com";
  return `${base}/profile/${token}`;
}
