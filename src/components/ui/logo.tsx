"use client";

import { useEffect, useState } from "react";

let cachedLogoUrl: string | null = null;
let pendingPromise: Promise<void> | null = null;

function fetchLogoUrl(): Promise<void> {
  if (cachedLogoUrl !== null) return Promise.resolve();
  if (pendingPromise) return pendingPromise;
  pendingPromise = fetch("/api/site-content")
    .then((r) => r.json())
    .then((data) => {
      cachedLogoUrl = (data as Record<string, string>)._logoUrl || null;
    })
    .catch(() => {
      cachedLogoUrl = "";
    });
  return pendingPromise;
}

export function Logo({ height = 40, className }: { height?: number; className?: string }) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    if (cachedLogoUrl !== null) {
      setSrc(cachedLogoUrl || null);
      return;
    }
    fetchLogoUrl().then(() => setSrc(cachedLogoUrl || null));
  }, []);

  if (src) {
    return (
      <img
        src={src}
        alt="logo"
        height={height}
        className={className}
        style={{ objectFit: "contain" }}
      />
    );
  }

  return <span className={className} style={{ fontWeight: 700, fontSize: Math.round(height * 0.6) }}>ECHO</span>;
}
