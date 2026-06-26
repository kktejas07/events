import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateIdCardImage } from "@/lib/image/id-card-image";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await db.user.findUnique({
      where: { id: params.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const name = [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email;
    const memberSince = user.emailVerified
      ? new Date(user.emailVerified).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : new Date(user.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://events.forgetechno.com";
    const pngBuffer = await generateIdCardImage({
      userId: user.id,
      name,
      email: user.email,
      memberSince,
      appUrl,
    });

    return new NextResponse(pngBuffer as BodyInit, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("ID card image error:", error);
    return NextResponse.json({ error: "Failed to generate ID card" }, { status: 500 });
  }
}
