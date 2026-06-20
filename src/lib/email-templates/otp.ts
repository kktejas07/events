import { baseEmailLayout, wrapContent, textBlock } from "./base";

interface OTPData {
  firstName: string;
  otp: string;
  expiresInMinutes?: number;
}

export function renderOTPEmail(data: OTPData) {
  const expiry = data.expiresInMinutes ?? 10;
  const body = wrapContent(
    "Your Verification Code",
    textBlock(
      `Hi ${data.firstName}, use the code below to verify your email address. It expires in ${expiry} minutes.`
    ) +
      `<div style="margin:24px 0;text-align:center;">
      <span style="display:inline-block;padding:16px 40px;background:rgba(124,58,237,0.15);border:1px solid rgba(124,58,237,0.3);border-radius:12px;font-size:36px;font-weight:800;color:#a78bfa;letter-spacing:8px;font-family:monospace;">${data.otp}</span>
    </div>` +
      textBlock("If you didn't request this code, you can safely ignore this email.")
  );
  return baseEmailLayout(body, {
    title: "Verify Your Email",
    previewText: `Your verification code: ${data.otp}`,
  });
}
