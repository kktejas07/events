"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";

const STATUSES = ["PENDING", "PROCESSING", "PAID", "FAILED", "REFUNDED", "CANCELLED"];
const adminCard = "border border-gray-200 bg-white shadow-sm";

export default function EditOrderPage() {
  const params = useParams();
  const router = useRouter();
  const [status, setStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/orders/${params.id}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success) {
          setStatus(json.data.status);
          setNotes(json.data.notes || "");
        } else {
          toast.error(json.error || "Failed to load order");
        }
      })
      .catch(() => toast.error("Network error"))
      .finally(() => setLoading(false));
  }, [params.id]);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/orders/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, notes }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Order updated");
        router.push(`/admin/orders/${params.id}`);
        router.refresh();
      } else {
        toast.error(json.error || "Failed to update");
      }
    } catch {
      toast.error("Network error");
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/admin/orders/${params.id}`}>
          <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h2 className="gt-admin-page-title text-2xl">Edit Order</h2>
          <p className="gt-admin-page-subtitle">Order #{String(params.id).slice(0, 8)}</p>
        </div>
      </div>

      <Card className={adminCard}>
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label className="gt-admin-field-label">Status</Label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="gt-admin-input-field flex h-10 w-full rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <Label className="gt-admin-field-label">Notes</Label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="gt-admin-textarea min-h-[100px] text-sm"
              placeholder="Internal notes..."
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
