"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Save, RotateCcw } from "lucide-react";
import { defaultContent } from "@/lib/landing-defaults";
import { ListEditor } from "@/components/ui/forms/list-editor";

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

const sections: { key: SectionKey; label: string }[] = [
  { key: "hero", label: "Hero" },
  { key: "about", label: "About" },
  { key: "stats", label: "Stats" },
  { key: "marquee", label: "Marquee" },
  { key: "quoteMarquee", label: "Quote Strap" },
  { key: "whyAttend", label: "Benefits" },
  { key: "testimonials", label: "Testimonials" },
  { key: "speakers", label: "Speakers" },
  { key: "schedule", label: "Schedule" },
  { key: "tickets", label: "Tickets" },
  { key: "sponsors", label: "Sponsors" },
  { key: "faq", label: "FAQ" },
  { key: "newsletter", label: "Newsletter" },
  { key: "cta", label: "CTA" },
];

type ContentData = Record<string, unknown>;

export default function AdminLandingPage() {
  const [content, setContent] = useState<ContentData>(defaultContent as ContentData);
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

  function update(key: SectionKey, value: unknown) {
    setContent((prev) => ({ ...prev, [key]: value }));
  }

  function updateNested(key: SectionKey, field: string, value: unknown) {
    setContent((prev) => {
      const current = (prev[key] as Record<string, unknown>) || {};
      return { ...prev, [key]: { ...current, [field]: value } };
    });
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
        else toast.error(`${failed.length} sections failed`);
      })
      .catch(() => toast.error("Save failed"))
      .finally(() => setSaving(false));
  }

  function getList(key: SectionKey) {
    return (content[key] as unknown[]) || [];
  }

  function getObj(key: SectionKey) {
    return (content[key] as Record<string, unknown>) || {};
  }

  function renderSection() {
    const d = getObj(activeSection);

    switch (activeSection) {
      case "hero":
        return (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field
              label="Badge Text"
              value={d.badge}
              onChange={(v) => updateNested("hero", "badge", v)}
            />
            <Field
              label="Title"
              value={d.title}
              onChange={(v) => updateNested("hero", "title", v)}
            />
            <Field label="Year" value={d.year} onChange={(v) => updateNested("hero", "year", v)} />
            <Field label="Date" value={d.date} onChange={(v) => updateNested("hero", "date", v)} />
            <Field
              label="Location"
              value={d.location}
              onChange={(v) => updateNested("hero", "location", v)}
            />
            <Field
              label="CTA Text"
              value={d.ctaText}
              onChange={(v) => updateNested("hero", "ctaText", v)}
            />
            <Field
              label="CTA Link"
              value={d.ctaLink}
              onChange={(v) => updateNested("hero", "ctaLink", v)}
            />
            <Field
              label="Secondary CTA"
              value={d.secondaryCtaText}
              onChange={(v) => updateNested("hero", "secondaryCtaText", v)}
            />
            <Field
              label="Sec CTA Link"
              value={d.secondaryCtaLink}
              onChange={(v) => updateNested("hero", "secondaryCtaLink", v)}
            />
            <Field
              label="Countdown Target (ISO)"
              value={d.countdownTarget}
              onChange={(v) => updateNested("hero", "countdownTarget", v)}
            />
            <Field
              label="Hurry Text"
              value={d.hurryText}
              onChange={(v) => updateNested("hero", "hurryText", v)}
            />
            <Field
              label="Hurry Subtext"
              value={d.hurrySubtext}
              onChange={(v) => updateNested("hero", "hurrySubtext", v)}
            />
            <Field
              label="Venue Address"
              value={d.venueAddress}
              onChange={(v) => updateNested("hero", "venueAddress", v)}
            />
            <div className="col-span-full space-y-1">
              <Label className="text-xs text-gray-400">Description</Label>
              <textarea
                value={String(d.description || "")}
                onChange={(e) => updateNested("hero", "description", e.target.value)}
                className="min-h-[80px] w-full resize-y rounded-md border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white"
              />
            </div>
          </div>
        );

      case "about":
        return (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field
              label="Badge"
              value={d.badge}
              onChange={(v) => updateNested("about", "badge", v)}
            />
            <Field
              label="Title"
              value={d.title}
              onChange={(v) => updateNested("about", "title", v)}
            />
            <div className="col-span-full space-y-1">
              <Label className="text-xs text-gray-400">Description</Label>
              <textarea
                value={String(d.description || "")}
                onChange={(e) => updateNested("about", "description", e.target.value)}
                className="min-h-[80px] w-full resize-y rounded-md border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white"
              />
            </div>
          </div>
        );

      case "stats":
        return (
          <ListEditor
            items={getList("stats") as Record<string, unknown>[]}
            fields={[
              { key: "icon", label: "Icon Name" },
              { key: "value", label: "Value" },
              { key: "label", label: "Label" },
            ]}
            onChange={(items) => update("stats", items)}
          />
        );

      case "marquee":
      case "quoteMarquee": {
        const arr =
          activeSection === "quoteMarquee"
            ? ((content.quoteMarquee as Record<string, unknown>)?.texts as string[]) || []
            : (getList(activeSection) as string[]);
        const onArrChange = (items: string[]) => {
          if (activeSection === "quoteMarquee") {
            update("quoteMarquee", { texts: items });
          } else {
            update("marquee", items);
          }
        };
        return (
          <div className="space-y-3">
            {arr.map((text, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input
                  value={text}
                  onChange={(e) => {
                    const updated = [...arr];
                    updated[i] = e.target.value;
                    onArrChange(updated);
                  }}
                  className="flex-1 border-white/10 bg-white/[0.05] text-sm text-white"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0 text-red-400 hover:text-red-300"
                  onClick={() => onArrChange(arr.filter((_, j) => j !== i))}
                >
                  <RotateCcw className="h-3 w-3" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              onClick={() => onArrChange([...arr, ""])}
              className="w-full border-dashed border-white/20 text-gray-400 hover:border-purple-400/30 hover:text-purple-300"
            >
              + Add Text
            </Button>
          </div>
        );
      }

      case "whyAttend":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                label="Badge"
                value={d.badge}
                onChange={(v) => updateNested("whyAttend", "badge", v)}
              />
              <Field
                label="Title"
                value={d.title}
                onChange={(v) => updateNested("whyAttend", "title", v)}
              />
              <div className="col-span-full space-y-1">
                <Label className="text-xs text-gray-400">Description</Label>
                <textarea
                  value={String(d.description || "")}
                  onChange={(e) => updateNested("whyAttend", "description", e.target.value)}
                  className="min-h-[60px] w-full resize-y rounded-md border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white"
                />
              </div>
            </div>
            <ListEditor
              items={(d.benefits as Record<string, unknown>[]) || []}
              fields={[
                { key: "icon", label: "Icon Name" },
                { key: "title", label: "Title" },
                { key: "description", label: "Description", type: "textarea" },
              ]}
              onChange={(items) => updateNested("whyAttend", "benefits", items)}
            />
          </div>
        );

      case "testimonials":
        return (
          <ListEditor
            items={getList("testimonials") as Record<string, unknown>[]}
            fields={[
              { key: "quote", label: "Quote", type: "textarea" },
              { key: "name", label: "Name" },
              { key: "role", label: "Role" },
              { key: "initials", label: "Initials" },
              { key: "color", label: "Color (eg: from-purple-500 to-pink-500)" },
              { key: "rating", label: "Rating (1-5)", type: "number" },
            ]}
            onChange={(items) => update("testimonials", items)}
          />
        );

      case "speakers":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                label="Badge"
                value={d.badge}
                onChange={(v) => updateNested("speakers", "badge", v)}
              />
              <Field
                label="Title"
                value={d.title}
                onChange={(v) => updateNested("speakers", "title", v)}
              />
              <div className="col-span-full space-y-1">
                <Label className="text-xs text-gray-400">Description</Label>
                <textarea
                  value={String(d.description || "")}
                  onChange={(e) => updateNested("speakers", "description", e.target.value)}
                  className="min-h-[60px] w-full resize-y rounded-md border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white"
                />
              </div>
            </div>
            <ListEditor
              items={(d.items as Record<string, unknown>[]) || []}
              fields={[
                { key: "name", label: "Name" },
                { key: "role", label: "Role" },
                { key: "company", label: "Company" },
                { key: "initials", label: "Initials" },
                { key: "color", label: "Color" },
              ]}
              onChange={(items) => updateNested("speakers", "items", items)}
            />
          </div>
        );

      case "schedule":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                label="Badge"
                value={d.badge}
                onChange={(v) => updateNested("schedule", "badge", v)}
              />
              <Field
                label="Title"
                value={d.title}
                onChange={(v) => updateNested("schedule", "title", v)}
              />
            </div>
            <ListEditor
              items={((d.days as Record<string, unknown>[]) || []).map((day) => ({
                ...day,
                sessionsJson: String(
                  day.sessionsJson || JSON.stringify(day.sessions || [], null, 2)
                ),
              }))}
              fields={[
                { key: "day", label: "Day Label" },
                { key: "date", label: "Date" },
              ]}
              onChange={(items) => updateNested("schedule", "days", items)}
              renderExtra={(item, index, fieldUpdate) => (
                <div className="mt-3">
                  <Label className="text-xs text-gray-400">Sessions (JSON format)</Label>
                  <p className="mb-1 text-[10px] text-gray-600">
                    Array of {`{ time, title, speaker, type }`} objects
                  </p>
                  <textarea
                    value={String(
                      item.sessionsJson ||
                        JSON.stringify((item as Record<string, unknown>).sessions || [], null, 2)
                    )}
                    onChange={(e) => {
                      try {
                        const parsed = JSON.parse(e.target.value);
                        fieldUpdate("sessions", parsed);
                        fieldUpdate("sessionsJson", e.target.value);
                      } catch {
                        fieldUpdate("sessionsJson", e.target.value);
                      }
                    }}
                    className="min-h-[120px] w-full resize-y rounded-md border border-white/10 bg-white/[0.05] px-3 py-2 font-mono text-xs text-green-400"
                  />
                </div>
              )}
            />
          </div>
        );

      case "tickets":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                label="Badge"
                value={d.badge}
                onChange={(v) => updateNested("tickets", "badge", v)}
              />
              <Field
                label="Title"
                value={d.title}
                onChange={(v) => updateNested("tickets", "title", v)}
              />
              <div className="col-span-full space-y-1">
                <Label className="text-xs text-gray-400">Description</Label>
                <textarea
                  value={String(d.description || "")}
                  onChange={(e) => updateNested("tickets", "description", e.target.value)}
                  className="min-h-[60px] w-full resize-y rounded-md border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white"
                />
              </div>
            </div>
            <ListEditor
              items={((d.tiers as Record<string, unknown>[]) || []).map((t) => ({
                ...t,
                featuresStr: Array.isArray(t.features)
                  ? (t.features as string[]).join(", ")
                  : String(t.featuresStr || ""),
              }))}
              fields={[
                { key: "name", label: "Name" },
                { key: "price", label: "Price", type: "number" },
                { key: "color", label: "Color" },
                { key: "highlighted", label: "Featured", type: "checkbox" },
                { key: "featuresStr", label: "Features (comma-separated)" },
              ]}
              onChange={(items) => {
                const cleaned = items.map((item) => {
                  const { featuresStr, ...rest } = item as Record<string, unknown>;
                  const features = String(featuresStr || "")
                    .split(",")
                    .map((s: string) => s.trim())
                    .filter(Boolean);
                  return { ...rest, features };
                });
                updateNested("tickets", "tiers", cleaned);
              }}
              renderExtra={(item, index, fieldUpdate) => {
                const featuresArr = (item.features as string[]) || [];
                return (
                  <div className="mt-2 border-l border-white/5 pl-2">
                    <Label className="text-[10px] text-gray-500">Features Preview:</Label>
                    <ul className="mt-1 space-y-0.5">
                      {featuresArr.map((f, i) => (
                        <li key={i} className="text-xs text-gray-400">
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              }}
            />
          </div>
        );

      case "sponsors":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                label="Badge"
                value={d.badge}
                onChange={(v) => updateNested("sponsors", "badge", v)}
              />
              <Field
                label="Title"
                value={d.title}
                onChange={(v) => updateNested("sponsors", "title", v)}
              />
              <div className="col-span-full space-y-1">
                <Label className="text-xs text-gray-400">Description</Label>
                <textarea
                  value={String(d.description || "")}
                  onChange={(e) => updateNested("sponsors", "description", e.target.value)}
                  className="min-h-[60px] w-full resize-y rounded-md border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white"
                />
              </div>
            </div>
            <ListEditor
              items={(d.items as Record<string, unknown>[]) || []}
              fields={[
                { key: "name", label: "Name" },
                { key: "tier", label: "Tier" },
                { key: "initials", label: "Initials" },
                { key: "color", label: "Color (hex)" },
              ]}
              onChange={(items) => updateNested("sponsors", "items", items)}
            />
          </div>
        );

      case "faq":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                label="Badge"
                value={d.badge}
                onChange={(v) => updateNested("faq", "badge", v)}
              />
              <Field
                label="Title"
                value={d.title}
                onChange={(v) => updateNested("faq", "title", v)}
              />
            </div>
            <ListEditor
              items={(d.items as Record<string, unknown>[]) || []}
              fields={[
                { key: "q", label: "Question" },
                { key: "a", label: "Answer", type: "textarea" },
              ]}
              onChange={(items) => updateNested("faq", "items", items)}
            />
          </div>
        );

      case "newsletter":
        return (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field
              label="Title"
              value={d.title}
              onChange={(v) => updateNested("newsletter", "title", v)}
            />
            <Field
              label="Button Text"
              value={d.buttonText}
              onChange={(v) => updateNested("newsletter", "buttonText", v)}
            />
            <Field
              label="Placeholder"
              value={d.placeholder}
              onChange={(v) => updateNested("newsletter", "placeholder", v)}
            />
            <div className="col-span-full space-y-1">
              <Label className="text-xs text-gray-400">Description</Label>
              <textarea
                value={String(d.description || "")}
                onChange={(e) => updateNested("newsletter", "description", e.target.value)}
                className="min-h-[60px] w-full resize-y rounded-md border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white"
              />
            </div>
            <div className="col-span-full space-y-1">
              <Label className="text-xs text-gray-400">Consent Label</Label>
              <textarea
                value={String(d.consentLabel || "")}
                onChange={(e) => updateNested("newsletter", "consentLabel", e.target.value)}
                className="min-h-[40px] w-full resize-y rounded-md border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white"
              />
            </div>
          </div>
        );

      case "cta":
        return (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field
              label="Title"
              value={d.title}
              onChange={(v) => updateNested("cta", "title", v)}
            />
            <Field
              label="Button Text"
              value={d.buttonText}
              onChange={(v) => updateNested("cta", "buttonText", v)}
            />
            <Field
              label="Button Link"
              value={d.buttonLink}
              onChange={(v) => updateNested("cta", "buttonLink", v)}
            />
            <div className="col-span-full space-y-1">
              <Label className="text-xs text-gray-400">Description</Label>
              <textarea
                value={String(d.description || "")}
                onChange={(e) => updateNested("cta", "description", e.target.value)}
                className="min-h-[60px] w-full resize-y rounded-md border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white"
              />
            </div>
          </div>
        );

      default:
        return <p className="text-sm text-gray-500">Select a section to edit.</p>;
    }
  }

  if (loading) {
    return <div className="p-6 text-gray-400">Loading landing page content...</div>;
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Landing Page Content</h2>
          <p className="text-sm text-gray-500">
            Countdown is configured in the Hero section (Countdown Target field). Set an ISO date
            like <code className="text-purple-400">2026-10-01T09:00:00</code>.
          </p>
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
        <CardHeader className="flex flex-row items-center justify-between py-3">
          <CardTitle className="text-base text-white">
            {sections.find((s) => s.key === activeSection)?.label} Section
          </CardTitle>
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
        <CardContent>{renderSection()}</CardContent>
      </Card>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: unknown;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1">
      <Label className="text-xs text-gray-400">{label}</Label>
      <Input
        value={String(value || "")}
        onChange={(e) => onChange(e.target.value)}
        className="border-white/10 bg-white/[0.05] text-sm text-white placeholder:text-gray-600"
      />
    </div>
  );
}
