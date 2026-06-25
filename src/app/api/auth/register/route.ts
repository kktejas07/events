import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { registerSchema } from "@/lib/validations";
import { createOTP } from "@/lib/otp";
import { renderOTPEmail } from "@/lib/email-templates/otp";
import { notify, NotificationType } from "@/services/notification";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      college,
      graduationYear,
      gender,
      organizationId,
    } = parsed.data;

    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "An account with this email already exists" },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await db.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        phone: phone || null,
        college: college || null,
        graduationYear: graduationYear || null,
        gender: gender || null,
        organizationId: organizationId || null,
        emailVerified: null, // unverified until OTP is confirmed
      },
    });

    // If user joined an organization, auto-create organization membership
    if (organizationId) {
      await db.organizationMember.create({
        data: {
          organizationId,
          userId: user.id,
          role: "USER",
        },
      });
    }

    // Send OTP
    const otp = await createOTP(email);
    const html = renderOTPEmail({ firstName: firstName || "User", otp });
    await notify(
      NotificationType.OTP,
      { email: user.email, phone: user.phone || undefined },
      "Your Verification Code",
      html
    );

    return NextResponse.json({
      success: true,
      requiresOTP: true,
      data: { id: user.id, email: user.email },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
  }
}
