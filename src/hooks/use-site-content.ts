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
        setContent(data);
      })
      .catch(() => {
        // Use defaults on error
      })
      .finally(() => setLoading(false));
  }, []);

  return { content, loading };
}
