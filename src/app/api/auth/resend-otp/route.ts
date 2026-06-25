import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createOTP } from "@/lib/otp";
import { renderOTPEmail } from "@/lib/email-templates/otp";
import { notify, NotificationType } from "@/services/notification";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 });
    }

    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    // Delete old OTPs
    await db.verificationToken.deleteMany({ where: { identifier: email } });

    const otp = await createOTP(email);
    const html = renderOTPEmail({ firstName: user.firstName || "User", otp });
    const subject = "Your Verification Code";

    await notify(
      NotificationType.OTP,
      { email: user.email, phone: user.phone || undefined },
      subject,
      html,
      { firstName: user.firstName || "User", otp }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Resend OTP error:", error);
    return NextResponse.json({ success: false, error: "Failed to resend OTP" }, { status: 500 });
  }
}
