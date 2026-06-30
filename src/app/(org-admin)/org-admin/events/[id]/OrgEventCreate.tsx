"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  name: string;
  price: string;
  quantityLimit: string;
  perks: string;
  color: string;
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

export default function OrgEventCreatePage() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(emptyForm);
  const [ticketTypes, setTicketTypes] = useState<TicketTypeData[]>([]);
  const [saving, setSaving] = useState(false);

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
      const slug = form.slug || generateSlug(form.title);
      const payload = { ...form, slug };

      const res = await fetch("/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (json.success) {
        const eventId = json.data.id;

        if (ticketTypes.length > 0) {
          const ticketTypesToSave = ticketTypes.map((tt, i) => ({
            name: tt.name || `Ticket ${i + 1}`,
            price: parseFloat(tt.price) || 0,
            quantityLimit: parseInt(tt.quantityLimit) || 100,
            perks: tt.perks
              ? tt.perks
                  .split(",")
                  .map((s: string) => s.trim())
                  .filter(Boolean)
              : [],
            color: tt.color || "#9333EA",
            isActive: true,
            sortOrder: i,
          }));
          await fetch(`/api/admin/events/${eventId}/ticket-types`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ticketTypes: ticketTypesToSave }),
          });
        }

        toast.success("Event created!");
        router.push("/org-admin/events");
        router.refresh();
      } else {
        toast.error(json.error || "Failed to create event");
      }
    } catch {
      toast.error("Network error creating event");
    }
    setSaving(false);
  }

  return (
    <div>
      <div className="d-flex align-items-center gap-3 mb-4">
        <Link href="/org-admin/events" className="gt-admin-btn gt-admin-btn-outline gt-admin-btn-sm">
          <i className="fa-regular fa-arrow-left"></i> Back
        </Link>
        <div>
          <h2 className="gt-admin-section-title">Create New Event</h2>
          <p className="gt-admin-section-subtitle">Fill in event details and add ticket types</p>
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
                onChange={(e) => {
                  const v = e.target.value;
                  setForm((prev) => ({ ...prev, title: v, slug: generateSlug(v) }));
                }}
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
              onClick={() =>
                setTicketTypes((prev) => [
                  ...prev,
                  { name: "", price: "", quantityLimit: "100", perks: "", color: "#9333EA" },
                ])
              }
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
                          onChange={(e) => {
                            const updated = [...ticketTypes];
                            updated[i] = { ...tt, name: e.target.value };
                            setTicketTypes(updated);
                          }}
                        />
                      </div>
                      <div className="col-md-3">
                        <Label className="text-xs">Price (₹)</Label>
                        <Input
                          type="number"
                          placeholder="699"
                          value={tt.price}
                          onChange={(e) => {
                            const updated = [...ticketTypes];
                            updated[i] = { ...tt, price: e.target.value };
                            setTicketTypes(updated);
                          }}
                        />
                      </div>
                      <div className="col-md-3">
                        <Label className="text-xs">Quantity</Label>
                        <Input
                          type="number"
                          placeholder="100"
                          value={tt.quantityLimit}
                          onChange={(e) => {
                            const updated = [...ticketTypes];
                            updated[i] = { ...tt, quantityLimit: e.target.value };
                            setTicketTypes(updated);
                          }}
                        />
                      </div>
                      <div className="col-md-3">
                        <Label className="text-xs">Color</Label>
                        <Input
                          type="color"
                          value={tt.color}
                          onChange={(e) => {
                            const updated = [...ticketTypes];
                            updated[i] = { ...tt, color: e.target.value };
                            setTicketTypes(updated);
                          }}
                          style={{ height: 36, cursor: "pointer", padding: 2 }}
                        />
                      </div>
                      <div className="col-12">
                        <Label className="text-xs">Perks (comma-separated)</Label>
                        <Input
                          placeholder="Keynote access, Exhibition entry, Networking..."
                          value={tt.perks}
                          onChange={(e) => {
                            const updated = [...ticketTypes];
                            updated[i] = { ...tt, perks: e.target.value };
                            setTicketTypes(updated);
                          }}
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
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
              </>
            ) : (
              "Create Event"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
