export const dynamic = "force-dynamic";
export const revalidate = 0;

import { redirect } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import { db } from "@/lib/db";

export default async function EventDetailsRedirect() {
  noStore();

  try {
    const event = await db.event.findFirst({
      where: { status: "PUBLISHED" },
      orderBy: { startDate: "asc" },
    });
    if (event) redirect(`/events/${event.slug}`);
  } catch {
    /* fall through */
  }

  redirect("/events");
}
