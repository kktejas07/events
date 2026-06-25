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
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
      </div>
    );
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
          <h2 className="text-2xl font-bold text-white">Edit Event</h2>
          <p className="text-gray-400">Editing: {form.title || "Untitled"}</p>
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
                onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
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
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
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
              onClick={() => setTicketTypes((prev) => [...prev, emptyTicket()])}
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
                        onChange={(e) => updateTicket(i, "name", e.target.value)}
                        className="border-white/10 bg-white/[0.03] text-sm text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-500">Price (₹)</Label>
                      <Input
                        type="number"
                        placeholder="699"
                        value={tt.price}
                        onChange={(e) => updateTicket(i, "price", e.target.value)}
                        className="border-white/10 bg-white/[0.03] text-sm text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-500">Quantity</Label>
                      <Input
                        type="number"
                        placeholder="100"
                        value={tt.quantityLimit}
                        onChange={(e) => updateTicket(i, "quantityLimit", e.target.value)}
                        className="border-white/10 bg-white/[0.03] text-sm text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-500">Color</Label>
                      <Input
                        type="color"
                        value={tt.color}
                        onChange={(e) => updateTicket(i, "color", e.target.value)}
                        className="h-9 w-full cursor-pointer rounded-md border border-white/10 bg-white/[0.03]"
                      />
                    </div>
                    <div className="col-span-full space-y-1">
                      <Label className="text-xs text-gray-500">Perks (comma-separated)</Label>
                      <Input
                        placeholder="Keynote access, Exhibition entry, Networking..."
                        value={tt.perks}
                        onChange={(e) => updateTicket(i, "perks", e.target.value)}
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
