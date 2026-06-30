"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

interface TicketTypeData {
  id?: string;
  name: string;
  price: string;
  quantityLimit: string;
  perks: string;
  color: string;
  isActive: boolean;
  sortOrder: number;
}

interface FormData {
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  startDate: string;
  endDate: string;
  timezone: string;
  category: string;
  status: string;
}

const emptyForm: FormData = {
  title: "",
  slug: "",
  description: "",
  shortDescription: "",
  startDate: "",
  endDate: "",
  timezone: "Asia/Kolkata",
  category: "",
  status: "DRAFT",
};

const emptyTicket = (): TicketTypeData => ({
  name: "",
  price: "",
  quantityLimit: "100",
  perks: "",
  color: "#9333EA",
  isActive: true,
  sortOrder: 0,
});

export default function OrgEventEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [form, setForm] = useState<FormData>(emptyForm);
  const [ticketTypes, setTicketTypes] = useState<TicketTypeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      fetch(`/api/admin/events/${id}`)
        .then((r) => r.json())
        .then((json) => {
          if (json.success) {
            const e = json.data;
            setForm({
              title: e.title || "",
              slug: e.slug || "",
              description: e.description || "",
              shortDescription: e.shortDescription || "",
              startDate: e.startDate ? new Date(e.startDate).toISOString().slice(0, 16) : "",
              endDate: e.endDate ? new Date(e.endDate).toISOString().slice(0, 16) : "",
              timezone: e.timezone || "Asia/Kolkata",
              category: e.category || "",
              status: e.status || "DRAFT",
            });
            if (e.ticketTypes?.length > 0) {
              setTicketTypes(
                e.ticketTypes.map((tt: Record<string, unknown>) => ({
                  id: tt.id as string,
                  name: (tt.name as string) || "",
                  price: String(tt.price || ""),
                  quantityLimit: String(tt.quantityLimit || "100"),
                  perks: Array.isArray(tt.perks) ? (tt.perks as string[]).join(", ") : "",
                  color: (tt.color as string) || "#9333EA",
                  isActive: tt.isActive !== false,
                  sortOrder: (tt.sortOrder as number) || 0,
                }))
              );
            }
          } else {
            toast.error(json.error || "Failed to load event");
          }
        })
        .catch(() => toast.error("Network error loading event"))
        .finally(() => setLoading(false));
    }
  }, [id]);

  function generateSlug(title: string) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, slug: form.slug || generateSlug(form.title) };
      const res = await fetch(`/api/admin/events/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.success) {
        const ticketTypesToSave = ticketTypes.map((tt, i) => ({
          ...(tt.id ? { id: tt.id } : {}),
          name: tt.name || `Ticket ${i + 1}`,
          price: parseFloat(tt.price) || 0,
          quantityLimit: parseInt(tt.quantityLimit) || 100,
          perks: tt.perks
            ? tt.perks
                .split(",")
                .map((s: string) => s.trim())
                .filter(Boolean)
            : [],
          color: tt.color,
          isActive: tt.isActive,
          sortOrder: i,
        }));
        await fetch(`/api/admin/events/${id}/ticket-types`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ticketTypes: ticketTypesToSave }),
        });
        toast.success("Event updated");
        router.push("/org-admin/events");
        router.refresh();
      } else {
        toast.error(json.error || "Failed to save event");
      }
    } catch {
      toast.error("Network error saving event");
    }
    setSaving(false);
  }

  function updateTicket(index: number, field: keyof TicketTypeData, value: string | boolean) {
    setTicketTypes((prev) => prev.map((tt, i) => (i === index ? { ...tt, [field]: value } : tt)));
  }

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ padding: "80px 0" }}>
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: "#8B5CF6" }} />
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex align-items-center gap-3 mb-4">
        <Link href="/org-admin/events" className="gt-admin-btn gt-admin-btn-outline gt-admin-btn-sm">
          <i className="fa-regular fa-arrow-left"></i> Back
        </Link>
        <div>
          <h2 className="gt-admin-section-title">Edit Event</h2>
          <p className="gt-admin-section-subtitle">Editing: {form.title || "Untitled"}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="gt-admin-card">
          <div className="gt-admin-card-header">
            <h3 className="gt-admin-card-title">Event Details</h3>
          </div>
          <div style={{ padding: 24 }}>
            <div className="mb-4">
              <Label>Event Title</Label>
              <Input
                placeholder="Enter event title"
                value={form.title}
                onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div className="row mb-4">
              <div className="col-md-6 mb-3 mb-md-0">
                <Label>Slug</Label>
                <Input
                  value={form.slug}
                  onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
                  className="font-monospace"
                />
              </div>
              <div className="col-md-6">
                <Label>Category</Label>
                <Input
                  placeholder="Technology, Business..."
                  value={form.category}
                  onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                />
              </div>
            </div>
            <div className="row mb-4">
              <div className="col-md-3 mb-3 mb-md-0">
                <Label>Start Date</Label>
                <Input
                  type="datetime-local"
                  value={form.startDate}
                  onChange={(e) => setForm((prev) => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              <div className="col-md-3 mb-3 mb-md-0">
                <Label>End Date</Label>
                <Input
                  type="datetime-local"
                  value={form.endDate}
                  onChange={(e) => setForm((prev) => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
              <div className="col-md-3 mb-3 mb-md-0">
                <Label>Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) => setForm((prev) => ({ ...prev, status: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="PUBLISHED">Published</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-md-3">
                <Label>Timezone</Label>
                <Input
                  value={form.timezone}
                  onChange={(e) => setForm((prev) => ({ ...prev, timezone: e.target.value }))}
                />
              </div>
            </div>
            <div className="mb-3">
              <Label>Short Description</Label>
              <Input
                placeholder="Brief description for cards"
                value={form.shortDescription}
                onChange={(e) => setForm((prev) => ({ ...prev, shortDescription: e.target.value }))}
              />
            </div>
            <div className="mb-3">
              <Label>Full Description</Label>
              <textarea
                placeholder="Detailed event description..."
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                className="gt-admin-input-field w-100"
                style={{ minHeight: 100, resize: "vertical" }}
              />
            </div>
          </div>
        </div>

        <div className="gt-admin-card">
          <div className="gt-admin-card-header">
            <h3 className="gt-admin-card-title">Ticket Types / Passes</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setTicketTypes((prev) => [...prev, emptyTicket()])}
            >
              <Plus className="mr-1 h-4 w-4" /> Add Pass
            </Button>
          </div>
          <div style={{ padding: 24 }}>
            {ticketTypes.length === 0 ? (
              <p style={{ color: "#888", textAlign: "center", padding: "16px 0" }}>No ticket types yet.</p>
            ) : (
              <div className="space-y-4">
                {ticketTypes.map((tt, i) => (
                  <div key={i} style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: 16 }}>
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <span style={{ fontWeight: 500, color: "#555" }}>Pass #{i + 1}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        style={{ color: "#EF4444" }}
                        onClick={() => setTicketTypes((prev) => prev.filter((_, j) => j !== i))}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <div className="row g-3">
                      <div className="col-md-3">
                        <Label className="text-xs">Name</Label>
                        <Input
                          placeholder="VIP, Standard..."
                          value={tt.name}
                          onChange={(e) => updateTicket(i, "name", e.target.value)}
                        />
                      </div>
                      <div className="col-md-3">
                        <Label className="text-xs">Price (₹)</Label>
                        <Input
                          type="number"
                          placeholder="699"
                          value={tt.price}
                          onChange={(e) => updateTicket(i, "price", e.target.value)}
                        />
                      </div>
                      <div className="col-md-3">
                        <Label className="text-xs">Quantity</Label>
                        <Input
                          type="number"
                          placeholder="100"
                          value={tt.quantityLimit}
                          onChange={(e) => updateTicket(i, "quantityLimit", e.target.value)}
                        />
                      </div>
                      <div className="col-md-3">
                        <Label className="text-xs">Color</Label>
                        <Input
                          type="color"
                          value={tt.color}
                          onChange={(e) => updateTicket(i, "color", e.target.value)}
                          style={{ height: 36, cursor: "pointer", padding: 2 }}
                        />
                      </div>
                      <div className="col-12">
                        <Label className="text-xs">Perks (comma-separated)</Label>
                        <Input
                          placeholder="Keynote access, Exhibition entry, Networking..."
                          value={tt.perks}
                          onChange={(e) => updateTicket(i, "perks", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="d-flex justify-content-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              "Update Event"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
