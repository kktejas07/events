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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

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
  coverImage: string;
  isFeatured: boolean;
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
  coverImage: "",
  isFeatured: false,
};

export default function EventFormPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const isNew = id === "new";

  const [form, setForm] = useState<FormData>(emptyForm);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isNew && id) {
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
              coverImage: e.coverImage || "",
              isFeatured: e.isFeatured || false,
            });
          } else {
            toast.error(json.error || "Failed to load event");
          }
        })
        .catch(() => toast.error("Network error loading event"))
        .finally(() => setLoading(false));
    }
  }, [id, isNew]);

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

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
    if (form.description.length < 10) {
      toast.error("Description must be at least 10 characters");
      return;
    }
    if (!form.startDate || !form.endDate) {
      toast.error("Start and end dates are required");
      return;
    }

    setSaving(true);
    try {
      const slug = form.slug || generateSlug(form.title);
      const payload = { ...form, slug };

      const url = isNew ? "/api/admin/events" : `/api/admin/events/${id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (json.success) {
        toast.success(isNew ? "Event created" : "Event updated");
        router.push("/admin/events");
        router.refresh();
      } else {
        toast.error(json.error || "Failed to save event");
      }
    } catch {
      toast.error("Network error saving event");
    }
    setSaving(false);
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
        <Link href="/admin/events">
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-white">
            {isNew ? "Create New Event" : "Edit Event"}
          </h2>
          <p className="text-gray-400">
            {isNew
              ? "Fill in the details to create a new event"
              : `Editing: ${form.title || "Untitled"}`}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="border-white/10 bg-white/[0.03]">
          <CardHeader>
            <CardTitle className="text-white">Event Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label className="text-gray-300">Event Title</Label>
              <Input
                placeholder="Enter event title"
                value={form.title}
                onChange={(e) => {
                  update("title", e.target.value);
                  if (isNew) update("slug", generateSlug(e.target.value));
                }}
                className="border-white/10 bg-white/[0.03] text-white placeholder:text-gray-600"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-gray-300">Slug</Label>
              <Input
                placeholder="auto-generated-from-title"
                value={form.slug}
                onChange={(e) => update("slug", e.target.value)}
                className="border-white/10 bg-white/[0.03] font-mono text-xs text-white placeholder:text-gray-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-gray-300">Start Date</Label>
                <Input
                  type="datetime-local"
                  value={form.startDate}
                  onChange={(e) => update("startDate", e.target.value)}
                  className="border-white/10 bg-white/[0.03] text-white"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-gray-300">End Date</Label>
                <Input
                  type="datetime-local"
                  value={form.endDate}
                  onChange={(e) => update("endDate", e.target.value)}
                  className="border-white/10 bg-white/[0.03] text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-gray-300">Status</Label>
                <Select value={form.status} onValueChange={(v) => update("status", v)}>
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
                <Label className="text-gray-300">Category</Label>
                <Input
                  placeholder="Technology, Business..."
                  value={form.category}
                  onChange={(e) => update("category", e.target.value)}
                  className="border-white/10 bg-white/[0.03] text-white placeholder:text-gray-600"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-gray-300">Short Description</Label>
              <Input
                placeholder="Brief description for cards"
                value={form.shortDescription}
                onChange={(e) => update("shortDescription", e.target.value)}
                className="border-white/10 bg-white/[0.03] text-white placeholder:text-gray-600"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-gray-300">Full Description</Label>
              <textarea
                placeholder="Detailed event description..."
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                className="min-h-[120px] w-full rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white ring-offset-background placeholder:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
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
                className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg shadow-purple-600/30 hover:shadow-xl hover:shadow-purple-600/40"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : isNew ? (
                  "Create Event"
                ) : (
                  "Update Event"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
