export const dynamic = "force-dynamic";
export const revalidate = 0;

import { redirect } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import { db } from "@/lib/db";

export default async function NewsDetailsRedirect() {
  noStore();

  try {
    const post = await db.blogPost.findFirst({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
    });
    if (post) redirect(`/blog/${post.slug}`);
  } catch {
    /* fall through */
  }

  redirect("/blog");
}
