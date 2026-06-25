import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  const user = session?.user as { role?: string } | undefined;
  if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const post = await db.blogPost.findUnique({ where: { id: params.id } });
    if (!post) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: post });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch post" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  const user = session?.user as { role?: string } | undefined;
  if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const data: Record<string, unknown> = {};
    if (body.title !== undefined) data.title = body.title;
    if (body.slug !== undefined) data.slug = body.slug;
    if (body.excerpt !== undefined) data.excerpt = body.excerpt;
    if (body.content !== undefined) data.content = body.content;
    if (body.author !== undefined) data.author = body.author;
    if (body.category !== undefined) data.category = body.category;
    if (body.tags !== undefined) data.tags = body.tags;
    if (body.coverImage !== undefined) data.coverImage = body.coverImage;
    if (body.published !== undefined) {
      data.published = body.published;
      if (body.published) data.publishedAt = new Date();
    }
    if (body.featured !== undefined) data.featured = body.featured;
    const post = await db.blogPost.update({ where: { id: params.id }, data });
    return NextResponse.json({ success: true, data: post });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  const user = session?.user as { role?: string } | undefined;
  if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    await db.blogPost.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete post" }, { status: 500 });
  }
}
