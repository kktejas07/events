import Razorpay from "razorpay";
import crypto from "crypto";

let razorpayInstance: Razorpay | null = null;

export function getRazorpay(): Razorpay {
  if (!razorpayInstance) {
    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    if (!key_id || !key_secret) {
      throw new Error(
        "Razorpay keys not configured (missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET)"
      );
    }
    razorpayInstance = new Razorpay({ key_id, key_secret });
  }
  return razorpayInstance;
}

export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const body = orderId + "|" + paymentId;
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest("hex");
  return expected === signature;
}

export function verifyRazorpayWebhook(payload: string, signature: string, secret: string): boolean {
  const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return expected === signature;
}
