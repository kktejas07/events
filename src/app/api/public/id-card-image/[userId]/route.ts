import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateIdCardImage } from "@/lib/image/id-card-image";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: { userId: string } }) {
  const user = await db.user.findUnique({
    where: { id: params.userId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      employeeId: true,
      createdAt: true,
    },
  });

  if (!user) {
    return new NextResponse("Not found", { status: 404 });
  }

  const name = [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email;
  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", {
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
    employeeId: user.employeeId,
  });

  return new Response(pngBuffer as unknown as BodyInit, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
