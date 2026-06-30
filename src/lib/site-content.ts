import { defaultContent } from "./landing-defaults";

export function deepMerge(
  target: Record<string, unknown>,
  source: Record<string, unknown>
): Record<string, unknown> {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (
      source[key] !== null &&
      typeof source[key] === "object" &&
      !Array.isArray(source[key]) &&
      target[key] !== null &&
      typeof target[key] === "object" &&
      !Array.isArray(target[key])
    ) {
      result[key] = deepMerge(
        target[key] as Record<string, unknown>,
        source[key] as Record<string, unknown>
      );
    } else if (source[key] !== undefined) {
      result[key] = source[key];
    }
  }
  return result;
}

/** Merge DB rows into defaults — same logic used on homepage and admin. */
export function mergeSiteContent(
  rows: { section: string; data: unknown }[]
): Record<string, unknown> {
  const result: Record<string, unknown> = { ...defaultContent };

  for (const row of rows) {
    const sectionData = row.data as Record<string, unknown>;
    const defaultSection = defaultContent[row.section] as Record<string, unknown> | undefined;
    if (defaultSection && typeof defaultSection === "object" && !Array.isArray(defaultSection)) {
      result[row.section] = deepMerge(defaultSection, sectionData);
    } else {
      result[row.section] = sectionData;
    }
  }

  return result;
}

export const landingSectionKeys = [
  "site",
  "hero",
  "stats",
  "about",
  "speakers",
  "testimonials",
  "faq",
  "tickets",
  "sponsors",
  "newsletter",
  "about-page",
  "pricing-page",
  "contact-page",
  "event-intro",
  "schedule",
  "video-gallery",
] as const;

export type LandingSectionKey = (typeof landingSectionKeys)[number];
