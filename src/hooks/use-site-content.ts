"use client";

import { useEffect, useState } from "react";
import { defaultContent } from "@/lib/landing-defaults";

export function useSiteContent() {
  const [content, setContent] = useState<Record<string, unknown>>(defaultContent);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/site-content")
      .then((r) => r.json())
      .then((data) => {
        console.log("[useSiteContent] API response hero.title:", data?.hero?.title);
        setContent(data);
      })
      .catch((err) => {
        console.error("[useSiteContent] fetch error:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  return { content, loading };
}
