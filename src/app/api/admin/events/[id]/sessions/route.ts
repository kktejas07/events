import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { sessions } = body as {
      sessions: Array<{
        id?: string;
        title: string;
        startTime: string;
        endTime: string;
        room?: string;
        day: number;
        speakerName?: string;
      }>;
    };

    if (!Array.isArray(sessions)) {
      return NextResponse.json(
        { success: false, error: "sessions array required" },
        { status: 400 }
      );
    }

    const existing = await db.scheduleSession.findMany({
      where: { eventId: params.id },
      select: { id: true },
    });
    const existingIds = new Set(existing.map((s) => s.id));
    const submittedIds = new Set(sessions.filter((s) => s.id).map((s) => s.id as string));
    const toDelete = [...existingIds].filter((id) => !submittedIds.has(id));

    if (toDelete.length > 0) {
      await db.scheduleSession.deleteMany({ where: { id: { in: toDelete }, eventId: params.id } });
    }

    for (const s of sessions) {
      let speakerId: string | null = null;
      if (s.speakerName?.trim()) {
        const [firstName, ...lastParts] = s.speakerName.trim().split(" ");
        const lastName = lastParts.join(" ") || "";
        let speaker = await db.speaker.findFirst({
          where: { firstName, lastName },
        });
        if (!speaker) {
          speaker = await db.speaker.create({
            data: { firstName, lastName },
          });
        }
        speakerId = speaker.id;
      }

      const data = {
        eventId: params.id,
        title: s.title || "Untitled",
        startTime: new Date(s.startTime),
        endTime: new Date(s.endTime),
        room: s.room || null,
        day: s.day || 1,
        speakerId,
      };

      if (s.id && existingIds.has(s.id)) {
        await db.scheduleSession.update({ where: { id: s.id }, data });
      } else {
        await db.scheduleSession.create({ data });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Sessions update error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update sessions" },
      { status: 500 }
    );
  }
}
