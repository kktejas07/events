import crypto from "crypto";

const BARCODE_SECRET = process.env.AUTH_SECRET || "barcode-secret-change-in-production";

export function generateBarcodeValue(ticketId: string): string {
  const payload = {
    ticketId,
    timestamp: Date.now(),
    signature: crypto
      .createHmac("sha256", BARCODE_SECRET)
      .update(ticketId + Date.now().toString())
      .digest("hex"),
  };

  return Buffer.from(JSON.stringify(payload)).toString("base64");
}

export function decodeBarcode(barcode: string): {
  ticketId: string;
  timestamp: number;
  signature: string;
} | null {
  try {
    const decoded = Buffer.from(barcode, "base64").toString("utf-8");
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export function verifyBarcodeSignature(barcode: string): boolean {
  const decoded = decodeBarcode(barcode);
  if (!decoded) return false;

  const expected = crypto
    .createHmac("sha256", BARCODE_SECRET)
    .update(decoded.ticketId + decoded.timestamp.toString())
    .digest("hex");

  return expected === decoded.signature;
}

export function generateBarcodeDisplay(barcode: string): string {
  const short = barcode.substring(0, 16);
  return `TKT-${short.toUpperCase()}`;
}
