import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createOTP } from "@/lib/otp";
import { renderOTPEmail } from "@/lib/email-templates/otp";
import { notify, NotificationType } from "@/services/notification";

export async function POST(req: NextRequest) {
  try {
    const { email, firstName } = await req.json();

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 });
    }

    const existing = await db.user.findUnique({ where: { email } });
    if (!existing) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const otp = await createOTP(email);
    const html = renderOTPEmail({ firstName: firstName || existing.firstName || "User", otp });
    const subject = "Your Verification Code";

    await notify(
      NotificationType.OTP,
      { email: existing.email, phone: existing.phone || undefined },
      subject,
      html
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Send OTP error:", error);
    return NextResponse.json({ success: false, error: "Failed to send OTP" }, { status: 500 });
  }
}
