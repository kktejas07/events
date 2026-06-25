export const dynamic = "force-dynamic";
export const revalidate = 0;

import { redirect } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import { db } from "@/lib/db";

export default async function SpeakerDetailsRedirect() {
  noStore();

  try {
    const speaker = await db.speaker.findFirst({ orderBy: { createdAt: "asc" } });
    if (speaker) redirect("/speakers");
  } catch {
    /* fall through */
  }

  redirect("/speakers");
}
