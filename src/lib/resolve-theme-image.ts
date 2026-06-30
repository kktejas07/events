/** Reject external/placeholder URLs and fall back to local ECHO theme assets. */
export function resolveThemeImage(url: string | null | undefined, fallback: string): string {
  if (!url) return fallback;
  const trimmed = url.trim();
  if (!trimmed) return fallback;
  if (trimmed.startsWith("/assets/")) return trimmed;

  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith("http") ||
    lower.includes("unsplash.com") ||
    lower.includes("placeholder") ||
    lower.includes("picsum") ||
    lower.includes("via.placeholder")
  ) {
    return fallback;
  }

  return trimmed.startsWith("/") ? trimmed : fallback;
}
