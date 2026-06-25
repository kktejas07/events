"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Save, RotateCcw } from "lucide-react";
import { defaultContent } from "@/lib/landing-defaults";
import { landingSectionKeys, type LandingSectionKey } from "@/lib/site-content";
import { ListEditor } from "@/components/ui/forms/list-editor";

const sections: { key: LandingSectionKey; label: string }[] = [
  { key: "site", label: "Header / Site" },
  { key: "hero", label: "Hero" },
  { key: "about", label: "About" },
  { key: "stats", label: "Stats" },
  { key: "speakers", label: "Speakers" },
  { key: "testimonials", label: "Testimonials" },
  { key: "faq", label: "Why Join (FAQ)" },
  { key: "tickets", label: "Tickets" },
  { key: "sponsors", label: "Sponsors" },
  { key: "newsletter", label: "Newsletter" },
  { key: "about-page", label: "About Page" },
  { key: "pricing-page", label: "Pricing Page" },
  { key: "contact-page", label: "Contact Page" },
];

type SectionKey = LandingSectionKey;
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
    const sectionData = content[key];
    if (!sectionData) {
      toast.error("No data to save");
      return;
    }
    setSaving(true);
    try {
      const body = JSON.stringify({ section: key, data: sectionData });
      const res = await fetch("/api/admin/site-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body,
      });
      const json = await res.json();
      if (json.success) {
        toast.success(`"${sections.find((s) => s.key === key)?.label}" saved`);
      } else {
        toast.error(json.error || "Save failed. Are you logged in as admin?");
      }
    } catch (e) {
      toast.error("Network error: " + (e instanceof Error ? e.message : "unknown"));
    }
    setSaving(false);
  }

  function saveAll() {
    setSaving(true);
    const promises = landingSectionKeys.map(async (key) => {
      const value = content[key] ?? defaultContent[key];
      if (!value) return { success: true };
      try {
        const res = await fetch("/api/admin/site-content", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ section: key, data: value }),
        });
        return await res.json();
      } catch {
        return { success: false };
      }
    });
    Promise.all(promises)
      .then((results) => {
        const failed = results.filter((r) => !r.success);
        if (failed.length === 0) toast.success("All sections saved");
        else toast.error(`${failed.length} sections failed — are you logged in as admin?`);
      })
      .catch(() => toast.error("Save failed"))
      .finally(() => setSaving(false));
  }

  async function resetAndSaveDefaults() {
    setSaving(true);
    setContent(defaultContent as ContentData);
    try {
      const results = await Promise.all(
        landingSectionKeys.map(async (key) => {
          const res = await fetch("/api/admin/site-content", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ section: key, data: defaultContent[key] }),
          });
          return res.json();
        })
      );
      const failed = results.filter((r) => !r.success);
      if (failed.length === 0) toast.success("Theme defaults saved to database");
      else toast.error(`${failed.length} sections failed to save`);
    } catch {
      toast.error("Failed to reset defaults");
    }
    setSaving(false);
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
      case "site":
        return (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field
              label="Header Address"
              value={d.headerAddress}
              onChange={(v) => updateNested("site", "headerAddress", v)}
            />
            <Field
              label="Get Ticket Button Text"
              value={d.ticketButtonText}
              onChange={(v) => updateNested("site", "ticketButtonText", v)}
            />
            <Field
              label="Get Ticket Button Link"
              value={d.ticketButtonLink}
              onChange={(v) => updateNested("site", "ticketButtonLink", v)}
            />
          </div>
        );

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
            <Field
              label="Background Image URL"
              value={d.backgroundImage}
              onChange={(v) => updateNested("hero", "backgroundImage", v)}
            />
            <Field
              label="Shape Image URL"
              value={d.heroImage}
              onChange={(v) => updateNested("hero", "heroImage", v)}
            />
            <div className="col-span-full space-y-1">
              <Label className="gt-admin-field-label text-xs">Description</Label>
              <textarea
                value={String(d.description || "")}
                onChange={(e) => updateNested("hero", "description", e.target.value)}
                className="gt-admin-textarea min-h-[80px] text-sm"
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
              <Label className="gt-admin-field-label text-xs">Description</Label>
              <textarea
                value={String(d.description || "")}
                onChange={(e) => updateNested("about", "description", e.target.value)}
                className="gt-admin-textarea min-h-[80px] text-sm"
              />
            </div>
            <Field
              label="Image URL"
              value={d.image}
              onChange={(v) => updateNested("about", "image", v)}
            />
          </div>
        );

      case "stats":
        return (
          <ListEditor
            items={getList("stats") as Record<string, unknown>[]}
            fields={[
              { key: "value", label: "Value" },
              { key: "label", label: "Label" },
              { key: "suffix", label: "Suffix (e.g. +)" },
            ]}
            onChange={(items) => update("stats", items)}
          />
        );

      case "testimonials":
        return (
          <ListEditor
            items={getList("testimonials") as Record<string, unknown>[]}
            fields={[
              { key: "quote", label: "Quote", type: "textarea" },
              { key: "name", label: "Name" },
              { key: "role", label: "Role" },
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
                <Label className="gt-admin-field-label text-xs">Description</Label>
                <textarea
                  value={String(d.description || "")}
                  onChange={(e) => updateNested("speakers", "description", e.target.value)}
                  className="gt-admin-textarea min-h-[60px] text-sm"
                />
              </div>
            </div>
            <ListEditor
              items={(d.items as Record<string, unknown>[]) || []}
              fields={[
                { key: "name", label: "Name" },
                { key: "role", label: "Role" },
                { key: "photoUrl", label: "Photo URL" },
              ]}
              onChange={(items) => updateNested("speakers", "items", items)}
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
                <Label className="gt-admin-field-label text-xs">Description</Label>
                <textarea
                  value={String(d.description || "")}
                  onChange={(e) => updateNested("tickets", "description", e.target.value)}
                  className="gt-admin-textarea min-h-[60px] text-sm"
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
                { key: "price", label: "Price (e.g. 09$)" },
                { key: "highlighted", label: "Featured", type: "checkbox" },
              ]}
              onChange={(items) => updateNested("tickets", "tiers", items)}
            />
          </div>
        );

      case "sponsors":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                label="Title"
                value={d.title}
                onChange={(v) => updateNested("sponsors", "title", v)}
              />
              <div className="col-span-full space-y-1">
                <Label className="gt-admin-field-label text-xs">Description</Label>
                <textarea
                  value={String(d.description || "")}
                  onChange={(e) => updateNested("sponsors", "description", e.target.value)}
                  className="gt-admin-textarea min-h-[60px] text-sm"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Sponsor logos are managed under Admin → Sponsors (Hyderabad colleges).
            </p>
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
              <Field
                label="Side Image URL"
                value={d.image}
                onChange={(v) => updateNested("faq", "image", v)}
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
              <Label className="gt-admin-field-label text-xs">Description</Label>
              <textarea
                value={String(d.description || "")}
                onChange={(e) => updateNested("newsletter", "description", e.target.value)}
                className="gt-admin-textarea min-h-[60px] text-sm"
              />
            </div>
            <div className="col-span-full space-y-1">
              <Label className="gt-admin-field-label text-xs">Consent Label</Label>
              <textarea
                value={String(d.consentLabel || "")}
                onChange={(e) => updateNested("newsletter", "consentLabel", e.target.value)}
                className="gt-admin-textarea min-h-[40px] text-sm"
              />
            </div>
          </div>
        );

      case "about-page":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                label="Badge"
                value={d.badge}
                onChange={(v) => updateNested("about-page", "badge", v)}
              />
              <Field
                label="Title"
                value={d.title}
                onChange={(v) => updateNested("about-page", "title", v)}
              />
              <Field
                label="Phone Number"
                value={d.phoneNumber}
                onChange={(v) => updateNested("about-page", "phoneNumber", v)}
              />
              <Field
                label="Image URL"
                value={d.image}
                onChange={(v) => updateNested("about-page", "image", v)}
              />
              <div className="col-span-full space-y-1">
                <Label className="gt-admin-field-label text-xs">Description</Label>
                <textarea
                  value={String(d.description || "")}
                  onChange={(e) => updateNested("about-page", "description", e.target.value)}
                  className="gt-admin-textarea min-h-[80px] text-sm"
                />
              </div>
            </div>
            <ListEditor
              items={(d.stats as Record<string, unknown>[]) || []}
              fields={[
                { key: "value", label: "Value" },
                { key: "label", label: "Label" },
                { key: "suffix", label: "Suffix (e.g. +)" },
              ]}
              onChange={(items) => updateNested("about-page", "stats", items)}
            />
            <ListEditor
              items={(d.ticketPackages as Record<string, unknown>[]) || []}
              fields={[
                { key: "name", label: "Package Name" },
                { key: "price", label: "Price" },
                { key: "highlighted", label: "Featured", type: "checkbox" },
                { key: "featuresStr", label: "Features (comma-separated)" },
              ]}
              onChange={(items) => {
                const cleaned = items.map((item) => {
                  const { featuresStr, ...rest } = item as Record<string, unknown>;
                  const features = String(featuresStr || "")
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean);
                  return { ...rest, features };
                });
                updateNested("about-page", "ticketPackages", cleaned);
              }}
            />
          </div>
        );

      case "pricing-page":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                label="Badge"
                value={d.badge}
                onChange={(v) => updateNested("pricing-page", "badge", v)}
              />
              <Field
                label="Title"
                value={d.title}
                onChange={(v) => updateNested("pricing-page", "title", v)}
              />
            </div>
            <ListEditor
              items={(d.packages as Record<string, unknown>[]) || []}
              fields={[
                { key: "name", label: "Package Name" },
                { key: "price", label: "Price" },
                { key: "highlighted", label: "Featured", type: "checkbox" },
                { key: "featuresStr", label: "Features (comma-separated)" },
              ]}
              onChange={(items) => {
                const cleaned = items.map((item) => {
                  const { featuresStr, ...rest } = item as Record<string, unknown>;
                  const features = String(featuresStr || "")
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean);
                  return { ...rest, features };
                });
                updateNested("pricing-page", "packages", cleaned);
              }}
            />
          </div>
        );

      case "contact-page":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                label="Address"
                value={d.address}
                onChange={(v) => updateNested("contact-page", "address", v)}
              />
              <Field
                label="Google Maps Embed URL"
                value={d.mapUrl}
                onChange={(v) => updateNested("contact-page", "mapUrl", v)}
              />
            </div>
            <ListEditor
              items={(d.phones as Record<string, unknown>[]) || []}
              fields={[{ key: "label", label: "Phone Number" }]}
              onChange={(items) => updateNested("contact-page", "phones", items)}
            />
            <ListEditor
              items={(d.emails as Record<string, unknown>[]) || []}
              fields={[{ key: "label", label: "Email Address" }]}
              onChange={(items) => updateNested("contact-page", "emails", items)}
            />
          </div>
        );

      default:
        return <p className="text-sm text-gray-500">Select a section to edit.</p>;
    }
  }

  if (loading) {
    return <div className="p-6 text-muted-foreground">Loading landing page content...</div>;
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="gt-admin-page-title text-2xl">Landing Page Content</h2>
          <p className="gt-admin-page-subtitle text-sm">
            Countdown is configured in the Hero section (Countdown Target field). Set an ISO date
            like <code className="text-purple-600">2026-10-01T09:00:00</code>.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={resetAndSaveDefaults}
            disabled={saving}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset & Save Defaults
          </Button>
          <Button
            onClick={saveAll}
            disabled={saving}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
          >
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Saving..." : "Save All"}
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 border-b border-gray-200 pb-1">
        {sections.map((sec) => (
          <button
            key={sec.key}
            onClick={() => setActiveSection(sec.key)}
            className={`rounded-t-md px-3 py-2 text-xs font-medium transition-colors ${
              activeSection === sec.key
                ? "gt-admin-tab-active border-x border-t border-gray-200 bg-white"
                : "gt-admin-tab text-muted-foreground hover:text-foreground"
            }`}
          >
            {sec.label}
          </button>
        ))}
      </div>

      <Card className="border border-gray-200 bg-white shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between py-3">
          <CardTitle className="text-base">
            {sections.find((s) => s.key === activeSection)?.label} Section
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => saveSection(activeSection)}
            disabled={saving}
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
      <Label className="gt-admin-field-label text-xs">{label}</Label>
      <Input
        value={String(value || "")}
        onChange={(e) => onChange(e.target.value)}
        className="gt-admin-input-field text-sm"
      />
    </div>
  );
}
