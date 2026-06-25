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
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/org-admin/events">
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-white">Create New Event</h2>
          <p className="text-gray-400">Fill in event details and add ticket types</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-xl">
          <h3 className="mb-4 text-sm font-semibold text-white">Event Details</h3>
          <div className="space-y-4">
            <div className="space-y-1">
              <Label className="text-gray-300">Event Title</Label>
              <Input
                placeholder="Enter event title"
                value={form.title}
                onChange={(e) => {
                  const v = e.target.value;
                  setForm((prev) => ({
                    ...prev,
                    title: v,
                    slug: generateSlug(v),
                  }));
                }}
                className="border-white/10 bg-white/[0.03] text-white placeholder:text-gray-600"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-gray-300">Slug</Label>
                <Input
                  value={form.slug}
                  onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
                  className="border-white/10 bg-white/[0.03] font-mono text-xs text-white"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-gray-300">Category</Label>
                <Input
                  placeholder="Technology, Business..."
                  value={form.category}
                  onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                  className="border-white/10 bg-white/[0.03] text-white placeholder:text-gray-600"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-gray-300">Start Date</Label>
                <Input
                  type="datetime-local"
                  value={form.startDate}
                  onChange={(e) => setForm((prev) => ({ ...prev, startDate: e.target.value }))}
                  className="border-white/10 bg-white/[0.03] text-white"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-gray-300">End Date</Label>
                <Input
                  type="datetime-local"
                  value={form.endDate}
                  onChange={(e) => setForm((prev) => ({ ...prev, endDate: e.target.value }))}
                  className="border-white/10 bg-white/[0.03] text-white"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-gray-300">Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) => setForm((prev) => ({ ...prev, status: v }))}
                >
                  <SelectTrigger className="border-white/10 bg-white/[0.03] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="PUBLISHED">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-gray-300">Timezone</Label>
                <Input
                  value={form.timezone}
                  onChange={(e) => setForm((prev) => ({ ...prev, timezone: e.target.value }))}
                  className="border-white/10 bg-white/[0.03] text-white"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-gray-300">Short Description</Label>
              <Input
                placeholder="Brief description for cards"
                value={form.shortDescription}
                onChange={(e) => setForm((prev) => ({ ...prev, shortDescription: e.target.value }))}
                className="border-white/10 bg-white/[0.03] text-white placeholder:text-gray-600"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-gray-300">Full Description</Label>
              <textarea
                placeholder="Detailed event description..."
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                className="min-h-[100px] w-full resize-y rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-gray-600"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-xl">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">Ticket Types / Passes</h3>
              <p className="mt-1 text-xs text-gray-500">
                Define pass categories with name, price, perks, and quantity
              </p>
            </div>
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
              className="border-white/10 text-gray-300 hover:bg-white/10"
            >
              <Plus className="mr-1 h-4 w-4" /> Add Pass
            </Button>
          </div>
          {ticketTypes.length === 0 ? (
            <p className="py-4 text-center text-sm text-gray-500">No ticket types yet.</p>
          ) : (
            <div className="space-y-4">
              {ticketTypes.map((tt, i) => (
                <div key={i} className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-400">Pass #{i + 1}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-red-400 hover:text-red-300"
                      onClick={() => setTicketTypes((prev) => prev.filter((_, j) => j !== i))}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-500">Name</Label>
                      <Input
                        placeholder="VIP, Standard..."
                        value={tt.name}
                        onChange={(e) => {
                          const updated = [...ticketTypes];
                          updated[i] = { ...tt, name: e.target.value };
                          setTicketTypes(updated);
                        }}
                        className="border-white/10 bg-white/[0.03] text-sm text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-500">Price (₹)</Label>
                      <Input
                        type="number"
                        placeholder="699"
                        value={tt.price}
                        onChange={(e) => {
                          const updated = [...ticketTypes];
                          updated[i] = { ...tt, price: e.target.value };
                          setTicketTypes(updated);
                        }}
                        className="border-white/10 bg-white/[0.03] text-sm text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-500">Quantity</Label>
                      <Input
                        type="number"
                        placeholder="100"
                        value={tt.quantityLimit}
                        onChange={(e) => {
                          const updated = [...ticketTypes];
                          updated[i] = { ...tt, quantityLimit: e.target.value };
                          setTicketTypes(updated);
                        }}
                        className="border-white/10 bg-white/[0.03] text-sm text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-500">Color</Label>
                      <Input
                        type="color"
                        value={tt.color}
                        onChange={(e) => {
                          const updated = [...ticketTypes];
                          updated[i] = { ...tt, color: e.target.value };
                          setTicketTypes(updated);
                        }}
                        className="h-9 w-full cursor-pointer rounded-md border border-white/10 bg-white/[0.03]"
                      />
                    </div>
                    <div className="col-span-full space-y-1">
                      <Label className="text-xs text-gray-500">Perks (comma-separated)</Label>
                      <Input
                        placeholder="Keynote access, Exhibition entry, Networking..."
                        value={tt.perks}
                        onChange={(e) => {
                          const updated = [...ticketTypes];
                          updated[i] = { ...tt, perks: e.target.value };
                          setTicketTypes(updated);
                        }}
                        className="border-white/10 bg-white/[0.03] text-sm text-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            className="border-white/10 text-gray-300 hover:bg-white/10 hover:text-white"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={saving}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30"
          >
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
