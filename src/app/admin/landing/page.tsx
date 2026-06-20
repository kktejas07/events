"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Save, RotateCcw } from "lucide-react";

type SectionKey =
  | "hero"
  | "stats"
  | "marquee"
  | "about"
  | "whyAttend"
  | "testimonials"
  | "speakers"
  | "schedule"
  | "tickets"
  | "sponsors"
  | "faq"
  | "newsletter"
  | "cta"
  | "quoteMarquee";

const sections: { key: SectionKey; label: string; type: "form" | "json" }[] = [
  { key: "hero", label: "Hero Section", type: "form" },
  { key: "about", label: "About Section", type: "form" },
  { key: "newsletter", label: "Newsletter", type: "form" },
  { key: "cta", label: "CTA Section", type: "form" },
  { key: "stats", label: "Stats", type: "json" },
  { key: "marquee", label: "Marquee Text", type: "json" },
  { key: "quoteMarquee", label: "Quote Marquee", type: "json" },
  { key: "whyAttend", label: "Benefits", type: "json" },
  { key: "testimonials", label: "Testimonials", type: "json" },
  { key: "speakers", label: "Speakers", type: "json" },
  { key: "schedule", label: "Schedule", type: "json" },
  { key: "tickets", label: "Tickets", type: "json" },
  { key: "sponsors", label: "Sponsors", type: "json" },
  { key: "faq", label: "FAQ", type: "json" },
];

type ContentData = Record<string, unknown>;

export default function AdminLandingPage() {
  const [content, setContent] = useState<ContentData>({});
  const [activeSection, setActiveSection] = useState<SectionKey>("hero");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/site-content")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setContent(json.data);
      })
      .catch(() => toast.error("Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  function updateSection(key: string, value: unknown) {
    setContent((prev) => ({ ...prev, [key]: value }));
  }

  async function saveSection(key: SectionKey) {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/site-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: key, data: content[key] }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(`"${sections.find((s) => s.key === key)?.label}" saved`);
      } else {
        toast.error(json.error || "Save failed");
      }
    } catch {
      toast.error("Network error");
    }
    setSaving(false);
  }

  function saveAll() {
    setSaving(true);
    const promises = Object.entries(content).map(([key, value]) =>
      fetch("/api/admin/site-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: key, data: value }),
      }).then((r) => r.json())
    );
    Promise.all(promises)
      .then((results) => {
        const failed = results.filter((r) => !r.success);
        if (failed.length === 0) toast.success("All sections saved");
        else toast.error(`${failed.length} sections failed to save`);
      })
      .catch(() => toast.error("Save failed"));
    setSaving(false);
  }

  function getJsonString(key: SectionKey): string {
    try {
      return JSON.stringify(content[key], null, 2);
    } catch {
      return "{}";
    }
  }

  function setJsonString(key: SectionKey, text: string) {
    try {
      const parsed = JSON.parse(text);
      updateSection(key, parsed);
    } catch {
      // Invalid JSON — don't update
    }
  }

  const active = sections.find((s) => s.key === activeSection);
  const sectionData = content[activeSection] as Record<string, string> | undefined;

  if (loading) {
    return <div className="p-6 text-muted-foreground">Loading landing page content...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Landing Page Content</h2>
          <p className="text-gray-400">Manage all sections of the landing page</p>
        </div>
        <Button
          onClick={saveAll}
          disabled={saving}
          className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white"
        >
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Saving..." : "Save All"}
        </Button>
      </div>

      <div className="flex flex-wrap gap-1 border-b border-white/10 pb-1">
        {sections.map((sec) => (
          <button
            key={sec.key}
            onClick={() => setActiveSection(sec.key)}
            className={`rounded-t-md px-3 py-2 text-xs font-medium transition-colors ${
              activeSection === sec.key
                ? "border-x border-t border-white/10 bg-white/10 text-white"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            {sec.label}
          </button>
        ))}
      </div>

      <Card className="border-white/10 bg-white/[0.03]">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-white">{active?.label}</CardTitle>
            <p className="mt-1 text-xs text-gray-500">
              {active?.type === "json" ? "Edit as JSON" : "Form editor"}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => saveSection(activeSection)}
            disabled={saving}
            className="border-white/10 text-gray-300 hover:bg-white/10"
          >
            <Save className="mr-1 h-3.5 w-3.5" /> Save Section
          </Button>
        </CardHeader>
        <CardContent>
          {active?.type === "json" ? (
            <div className="space-y-2">
              <textarea
                className="min-h-[400px] w-full rounded-md border border-white/10 bg-white/[0.05] px-3 py-2 font-mono text-xs text-green-400 placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                value={getJsonString(activeSection)}
                onChange={(e) => setJsonString(activeSection, e.target.value)}
                spellCheck={false}
              />
              <p className="text-xs text-gray-500">
                Invalid JSON will be ignored until fixed. Format must be valid JSON.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeSection === "hero" && sectionData && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-gray-300">Badge Text</Label>
                      <Input
                        value={sectionData.badge || ""}
                        onChange={(e) =>
                          updateSection("hero", { ...sectionData, badge: e.target.value })
                        }
                        className="border-white/10 bg-white/[0.03] text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-gray-300">Title</Label>
                      <Input
                        value={sectionData.title || ""}
                        onChange={(e) =>
                          updateSection("hero", { ...sectionData, title: e.target.value })
                        }
                        className="border-white/10 bg-white/[0.03] text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-gray-300">Year</Label>
                      <Input
                        value={sectionData.year || ""}
                        onChange={(e) =>
                          updateSection("hero", { ...sectionData, year: e.target.value })
                        }
                        className="border-white/10 bg-white/[0.03] text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-gray-300">Date</Label>
                      <Input
                        value={sectionData.date || ""}
                        onChange={(e) =>
                          updateSection("hero", { ...sectionData, date: e.target.value })
                        }
                        className="border-white/10 bg-white/[0.03] text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-gray-300">Location</Label>
                      <Input
                        value={sectionData.location || ""}
                        onChange={(e) =>
                          updateSection("hero", { ...sectionData, location: e.target.value })
                        }
                        className="border-white/10 bg-white/[0.03] text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-gray-300">CTA Button Text</Label>
                      <Input
                        value={sectionData.ctaText || ""}
                        onChange={(e) =>
                          updateSection("hero", { ...sectionData, ctaText: e.target.value })
                        }
                        className="border-white/10 bg-white/[0.03] text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-gray-300">CTA Button Link</Label>
                      <Input
                        value={sectionData.ctaLink || ""}
                        onChange={(e) =>
                          updateSection("hero", { ...sectionData, ctaLink: e.target.value })
                        }
                        className="border-white/10 bg-white/[0.03] text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-gray-300">Secondary CTA Text</Label>
                      <Input
                        value={sectionData.secondaryCtaText || ""}
                        onChange={(e) =>
                          updateSection("hero", {
                            ...sectionData,
                            secondaryCtaText: e.target.value,
                          })
                        }
                        className="border-white/10 bg-white/[0.03] text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-gray-300">Countdown Target (ISO date)</Label>
                      <Input
                        value={sectionData.countdownTarget || ""}
                        onChange={(e) =>
                          updateSection("hero", { ...sectionData, countdownTarget: e.target.value })
                        }
                        className="border-white/10 bg-white/[0.03] text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-gray-300">Hurry Text</Label>
                      <Input
                        value={sectionData.hurryText || ""}
                        onChange={(e) =>
                          updateSection("hero", { ...sectionData, hurryText: e.target.value })
                        }
                        className="border-white/10 bg-white/[0.03] text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-gray-300">Hurry Subtext</Label>
                      <Input
                        value={sectionData.hurrySubtext || ""}
                        onChange={(e) =>
                          updateSection("hero", { ...sectionData, hurrySubtext: e.target.value })
                        }
                        className="border-white/10 bg-white/[0.03] text-white"
                      />
                    </div>
                    <div className="col-span-2 space-y-1">
                      <Label className="text-gray-300">Description</Label>
                      <textarea
                        value={sectionData.description || ""}
                        onChange={(e) =>
                          updateSection("hero", { ...sectionData, description: e.target.value })
                        }
                        className="min-h-[80px] w-full resize-y rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white"
                      />
                    </div>
                  </div>
                </>
              )}
              {activeSection === "about" && sectionData && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-gray-300">Badge</Label>
                    <Input
                      value={sectionData.badge || ""}
                      onChange={(e) =>
                        updateSection("about", { ...sectionData, badge: e.target.value })
                      }
                      className="border-white/10 bg-white/[0.03] text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-gray-300">Title</Label>
                    <Input
                      value={sectionData.title || ""}
                      onChange={(e) =>
                        updateSection("about", { ...sectionData, title: e.target.value })
                      }
                      className="border-white/10 bg-white/[0.03] text-white"
                    />
                  </div>
                  <div className="col-span-2 space-y-1">
                    <Label className="text-gray-300">Description</Label>
                    <textarea
                      value={sectionData.description || ""}
                      onChange={(e) =>
                        updateSection("about", { ...sectionData, description: e.target.value })
                      }
                      className="min-h-[80px] w-full resize-y rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white"
                    />
                  </div>
                </div>
              )}
              {activeSection === "newsletter" && sectionData && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-gray-300">Title</Label>
                    <Input
                      value={sectionData.title || ""}
                      onChange={(e) =>
                        updateSection("newsletter", { ...sectionData, title: e.target.value })
                      }
                      className="border-white/10 bg-white/[0.03] text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-gray-300">Button Text</Label>
                    <Input
                      value={sectionData.buttonText || ""}
                      onChange={(e) =>
                        updateSection("newsletter", { ...sectionData, buttonText: e.target.value })
                      }
                      className="border-white/10 bg-white/[0.03] text-white"
                    />
                  </div>
                  <div className="col-span-2 space-y-1">
                    <Label className="text-gray-300">Description</Label>
                    <textarea
                      value={sectionData.description || ""}
                      onChange={(e) =>
                        updateSection("newsletter", { ...sectionData, description: e.target.value })
                      }
                      className="min-h-[60px] w-full resize-y rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white"
                    />
                  </div>
                  <div className="col-span-2 space-y-1">
                    <Label className="text-gray-300">Consent Label</Label>
                    <Input
                      value={sectionData.consentLabel || ""}
                      onChange={(e) =>
                        updateSection("newsletter", {
                          ...sectionData,
                          consentLabel: e.target.value,
                        })
                      }
                      className="border-white/10 bg-white/[0.03] text-white"
                    />
                  </div>
                </div>
              )}
              {activeSection === "cta" && sectionData && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-gray-300">Title</Label>
                    <Input
                      value={sectionData.title || ""}
                      onChange={(e) =>
                        updateSection("cta", { ...sectionData, title: e.target.value })
                      }
                      className="border-white/10 bg-white/[0.03] text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-gray-300">Button Text</Label>
                    <Input
                      value={sectionData.buttonText || ""}
                      onChange={(e) =>
                        updateSection("cta", { ...sectionData, buttonText: e.target.value })
                      }
                      className="border-white/10 bg-white/[0.03] text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-gray-300">Button Link</Label>
                    <Input
                      value={sectionData.buttonLink || ""}
                      onChange={(e) =>
                        updateSection("cta", { ...sectionData, buttonLink: e.target.value })
                      }
                      className="border-white/10 bg-white/[0.03] text-white"
                    />
                  </div>
                  <div className="col-span-2 space-y-1">
                    <Label className="text-gray-300">Description</Label>
                    <textarea
                      value={sectionData.description || ""}
                      onChange={(e) =>
                        updateSection("cta", { ...sectionData, description: e.target.value })
                      }
                      className="min-h-[60px] w-full resize-y rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
