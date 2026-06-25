import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  const user = session?.user as { role?: string } | undefined;
  if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const posts = await db.blogPost.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json({ success: true, data: posts });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  const user = session?.user as { role?: string } | undefined;
  if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const slug =
      body.slug ||
      body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    const post = await db.blogPost.create({
      data: {
        title: body.title,
        slug,
        excerpt: body.excerpt || null,
        content: body.content || "",
        author: body.author || null,
        category: body.category || null,
        tags: body.tags || [],
        coverImage: body.coverImage || null,
        published: body.published || false,
        featured: body.featured || false,
        publishedAt: body.published ? new Date() : null,
      },
    });
    return NextResponse.json({ success: true, data: post });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create post" }, { status: 500 });
  }
}
