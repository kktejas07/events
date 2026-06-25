import { PrismaClient } from "@prisma/client";
import { resolveThemeImage } from "../src/lib/resolve-theme-image";
import { themeAssets } from "../src/lib/theme-images";

const prisma = new PrismaClient();

function isExternal(url: string | null | undefined) {
  if (!url) return false;
  const lower = url.trim().toLowerCase();
  return lower.startsWith("http") || lower.includes("unsplash.com");
}

async function main() {
  const events = await prisma.event.findMany({ select: { id: true, coverImage: true } });
  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    if (isExternal(event.coverImage)) {
      await prisma.event.update({
        where: { id: event.id },
        data: {
          coverImage: resolveThemeImage(
            event.coverImage,
            themeAssets.eventCovers[i % themeAssets.eventCovers.length]
          ),
        },
      });
    }
  }

  const speakers = await prisma.speaker.findMany({ select: { id: true, photoUrl: true } });
  for (let i = 0; i < speakers.length; i++) {
    const speaker = speakers[i];
    if (isExternal(speaker.photoUrl)) {
      await prisma.speaker.update({
        where: { id: speaker.id },
        data: {
          photoUrl: resolveThemeImage(
            speaker.photoUrl,
            themeAssets.speakers.photos[i % themeAssets.speakers.photos.length]
          ),
        },
      });
    }
  }

  const posts = await prisma.blogPost.findMany({ select: { id: true, coverImage: true } });
  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    if (isExternal(post.coverImage)) {
      await prisma.blogPost.update({
        where: { id: post.id },
        data: {
          coverImage: resolveThemeImage(
            post.coverImage,
            themeAssets.news.items[i % themeAssets.news.items.length]
          ),
        },
      });
    }
  }

  const sponsors = await prisma.sponsor.findMany({ select: { id: true, logoUrl: true } });
  for (let i = 0; i < sponsors.length; i++) {
    const sponsor = sponsors[i];
    if (isExternal(sponsor.logoUrl)) {
      await prisma.sponsor.update({
        where: { id: sponsor.id },
        data: {
          logoUrl: themeAssets.sponsors.qr,
        },
      });
    }
  }

  const aboutRow = await prisma.siteContent.findFirst({ where: { section: "about-page" } });
  if (aboutRow?.data && typeof aboutRow.data === "object") {
    const data = aboutRow.data as Record<string, unknown>;
    const updates: Record<string, unknown> = { ...data };
    let changed = false;

    if (isExternal(data.image as string)) {
      updates.image = themeAssets.about.image;
      changed = true;
    }

    const description = data.description as string;
    if (description?.includes("AI Business") || description?.includes("Startup hub")) {
      updates.description =
        "Welcome to our design conference hub, where creativity meets innovation! We are a community of forward-thinking designers, industry leaders, and creative experts, united by our shared passion for digital excellence.";
      changed = true;
    }

    if (changed) {
      await prisma.siteContent.update({
        where: { id: aboutRow.id },
        data: { data: updates as object },
      });
    }
  }

  for (const section of ["about"]) {
    const row = await prisma.siteContent.findFirst({ where: { section } });
    if (!row?.data || typeof row.data !== "object") continue;
    const data = row.data as Record<string, unknown>;
    const description = data.description as string;
    if (description?.includes("AI Business") || description?.includes("Startup hub")) {
      await prisma.siteContent.update({
        where: { id: row.id },
        data: {
          data: {
            ...data,
            description:
              "Welcome to our design conference hub, where creativity meets innovation! We are a community of forward-thinking designers, industry leaders, and creative experts, united by our shared passion for digital excellence.",
          },
        },
      });
    }
  }

  console.log("Sanitized external image URLs in database.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
