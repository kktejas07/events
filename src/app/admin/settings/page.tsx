"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/forms/password-input";
import { toast } from "sonner";
import { CreditCard, Shield, Link2, Settings2, Mail, Bell, ChevronRight, Upload, QrCode, Users } from "lucide-react";

interface Settings {
  NEXT_PUBLIC_APP_NAME: string;
  LOGO_URL: string;
  FAVICON_URL: string;
  RAZORPAY_KEY_ID: string;
  RAZORPAY_KEY_SECRET: string;
  RAZORPAY_WEBHOOK_SECRET: string;
  NEXT_PUBLIC_RAZORPAY_KEY_ID: string;
  NEXT_PUBLIC_FIREBASE_API_KEY: string;
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: string;
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: string;
  FIREBASE_SERVICE_ACCOUNT_KEY: string;
  AUTH_SECRET: string;
  AUTH_LINKEDIN_ID: string;
  AUTH_LINKEDIN_SECRET: string;
  STUDENTALUMNI_API_URL: string;
  STUDENTALUMNI_API_KEY: string;
  STUDENTALUMNI_WEBHOOK_SECRET: string;
  UPSTASH_REDIS_REST_URL: string;
  UPSTASH_REDIS_REST_TOKEN: string;
  WHATSAPP_API_URL: string;
  WHATSAPP_API_KEY: string;
  SOCIAL_TWITTER_URL: string;
  SOCIAL_FACEBOOK_URL: string;
  SOCIAL_INSTAGRAM_URL: string;
  SOCIAL_YOUTUBE_URL: string;
  SOCIAL_LINKEDIN_URL: string;
}

const NOTIFICATION_TYPES = [
  { id: "otp", label: "OTP Verification" },
  { id: "welcome", label: "Welcome Message" },
  { id: "id_card", label: "Digital ID Card" },
  { id: "ticket", label: "Ticket Confirmation" },
  { id: "receipt", label: "Order Receipt" },
  { id: "reminder", label: "Event Reminder" },
  { id: "password_reset", label: "Password Reset" },
];

const CHANNELS = [
  { id: "email", label: "Email" },
  { id: "whatsapp", label: "WhatsApp" },
];

function notifyKey(type: string, channel: string) {
  return `notify_${type}_${channel}`;
}

const defaults: Settings = {
  NEXT_PUBLIC_APP_NAME: "Echo",
  LOGO_URL: "",
  FAVICON_URL: "",
  RAZORPAY_KEY_ID: "",
  RAZORPAY_KEY_SECRET: "",
  RAZORPAY_WEBHOOK_SECRET: "",
  NEXT_PUBLIC_RAZORPAY_KEY_ID: "",
  NEXT_PUBLIC_FIREBASE_API_KEY: "",
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: "",
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: "",
  FIREBASE_SERVICE_ACCOUNT_KEY: "",
  AUTH_SECRET: "",
  AUTH_LINKEDIN_ID: "",
  AUTH_LINKEDIN_SECRET: "",
  STUDENTALUMNI_API_URL: "",
  STUDENTALUMNI_API_KEY: "",
  STUDENTALUMNI_WEBHOOK_SECRET: "",
  UPSTASH_REDIS_REST_URL: "",
  UPSTASH_REDIS_REST_TOKEN: "",
  WHATSAPP_API_URL: "",
  WHATSAPP_API_KEY: "",
  SOCIAL_TWITTER_URL: "",
  SOCIAL_FACEBOOK_URL: "",
  SOCIAL_INSTAGRAM_URL: "",
  SOCIAL_YOUTUBE_URL: "",
  SOCIAL_LINKEDIN_URL: "",
};

type TabId = "general" | "payments" | "auth" | "integrations" | "notifications" | "id-cards";

const tabs: { id: TabId; label: string; icon: typeof Settings2 }[] = [
  { id: "general", label: "General", icon: Settings2 },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "auth", label: "Authentication", icon: Shield },
  { id: "integrations", label: "Integrations", icon: Link2 },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "id-cards", label: "ID Cards", icon: QrCode },
];

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      style={{
        width: "40px",
        height: "22px",
        borderRadius: "11px",
        border: "none",
        cursor: "pointer",
        background: checked ? "#7c3aed" : "#374151",
        position: "relative",
        transition: "background 0.2s",
        padding: 0,
      }}
    >
      <span
        style={{
          display: "block",
          width: "18px",
          height: "18px",
          borderRadius: "50%",
          background: "#fff",
          position: "absolute",
          top: "2px",
          left: checked ? "20px" : "2px",
          transition: "left 0.2s",
        }}
      />
    </button>
  );
}

export default function AdminSettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<Settings>(defaults);
  const [notifyConfig, setNotifyConfig] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("general");
  const [empPrefix, setEmpPrefix] = useState("SA");
  const [empNext, setEmpNext] = useState("1");
  const [assigningIds, setAssigningIds] = useState(false);
  const [idStats, setIdStats] = useState<{ usersWithoutEmployeeId: number } | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.settings) {
          const s = data.settings;
          const notify: Record<string, boolean> = {};
          for (const type of NOTIFICATION_TYPES) {
            for (const ch of CHANNELS) {
              const key = notifyKey(type.id, ch.id);
              notify[key] = s[key] === "true";
            }
          }
          setNotifyConfig(notify);
          setSettings({ ...defaults, ...s });
        }
      })
      .catch(() => toast.error("Failed to load settings"))
      .finally(() => setLoading(false));

    fetch("/api/admin/settings/assign-emp-ids")
      .then((r) => r.json())
      .then((data) => {
        if (data.prefix) setEmpPrefix(data.prefix);
        if (data.nextSequence !== undefined) setEmpNext(String(data.nextSequence));
        if (data.usersWithoutEmployeeId !== undefined) setIdStats({ usersWithoutEmployeeId: data.usersWithoutEmployeeId });
      })
      .catch(() => {});
  }, []);

  function update(key: keyof Settings, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  function toggleNotify(type: string, channel: string) {
    const key = notifyKey(type, channel);
    setNotifyConfig((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  const hasValue = (key: keyof Settings) => settings[key]?.length > 0;

  async function handleAssignEmpIds() {
    setAssigningIds(true);
    try {
      const res = await fetch("/api/admin/settings/assign-emp-ids", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        toast.success(`Assigned ${data.assigned} employee IDs`);
        setEmpNext(String(data.nextSequence));
        setIdStats({ usersWithoutEmployeeId: 0 });
        router.refresh();
      } else {
        toast.error(data.error || "Failed");
      }
    } catch {
      toast.error("Failed to assign IDs");
    }
    setAssigningIds(false);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const payload = { ...settings };
      payload["EMP_ID_PREFIX" as keyof Settings] = empPrefix as any;
      for (const type of NOTIFICATION_TYPES) {
        for (const ch of CHANNELS) {
          const key = notifyKey(type.id, ch.id);
          payload[key as keyof Settings] = notifyConfig[key] ? "true" : "false" as any;
        }
      }
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: payload }),
      });
      if (res.ok) {
        toast.success("Settings saved");
        router.refresh();
      } else {
        toast.error("Failed to save");
      }
    } catch {
      toast.error("Failed to save settings");
    }
    setSaving(false);
  }

  if (loading) {
    return <div className="p-6 text-muted-foreground">Loading settings...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Settings</h2>
          <p className="text-muted-foreground">Platform configuration</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* General */}
      {activeTab === "general" && (
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-1">
              <Label>Platform Name</Label>
              <Input
                value={settings.NEXT_PUBLIC_APP_NAME}
                onChange={(e) => update("NEXT_PUBLIC_APP_NAME", e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <Label>Logo</Label>
              <div className="flex items-center gap-4">
                <Input
                  placeholder="Paste logo URL or upload below"
                  value={settings.LOGO_URL}
                  onChange={(e) => update("LOGO_URL", e.target.value)}
                  className="flex-1"
                />
                <label className="inline-flex h-10 cursor-pointer items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        const dataUrl = ev.target?.result as string;
                        update("LOGO_URL", dataUrl);
                      };
                      reader.readAsDataURL(file);
                    }}
                  />
                </label>
              </div>
              {settings.LOGO_URL && (
                <div className="mt-2 inline-block rounded-md border bg-card p-2">
                  <Image
                    src={settings.LOGO_URL}
                    alt="Logo preview"
                    width={160}
                    height={40}
                    className="h-10 w-auto object-contain"
                    unoptimized
                  />
                </div>
              )}
            </div>

            <div className="space-y-1">
              <Label>Favicon</Label>
              <div className="flex items-center gap-4">
                <Input
                  placeholder="Paste favicon URL or upload below"
                  value={settings.FAVICON_URL}
                  onChange={(e) => update("FAVICON_URL", e.target.value)}
                  className="flex-1"
                />
                <label className="inline-flex h-10 cursor-pointer items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        const dataUrl = ev.target?.result as string;
                        update("FAVICON_URL", dataUrl);
                      };
                      reader.readAsDataURL(file);
                    }}
                  />
                </label>
              </div>
              {settings.FAVICON_URL && (
                <div className="mt-2 inline-block rounded-md border bg-card p-2">
                  <Image
                    src={settings.FAVICON_URL}
                    alt="Favicon preview"
                    width={32}
                    height={32}
                    className="h-8 w-8 object-contain"
                    unoptimized
                  />
                </div>
              )}
            </div>

            <div className="border-t pt-6">
              <h4 className="mb-4 text-sm font-semibold">Social Media Links</h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label>Twitter / X URL</Label>
                  <Input
                    placeholder="https://twitter.com/yourhandle"
                    value={settings.SOCIAL_TWITTER_URL}
                    onChange={(e) => update("SOCIAL_TWITTER_URL", e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Facebook URL</Label>
                  <Input
                    placeholder="https://facebook.com/yourpage"
                    value={settings.SOCIAL_FACEBOOK_URL}
                    onChange={(e) => update("SOCIAL_FACEBOOK_URL", e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Instagram URL</Label>
                  <Input
                    placeholder="https://instagram.com/yourhandle"
                    value={settings.SOCIAL_INSTAGRAM_URL}
                    onChange={(e) => update("SOCIAL_INSTAGRAM_URL", e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label>YouTube URL</Label>
                  <Input
                    placeholder="https://youtube.com/@yourchannel"
                    value={settings.SOCIAL_YOUTUBE_URL}
                    onChange={(e) => update("SOCIAL_YOUTUBE_URL", e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label>LinkedIn URL</Label>
                  <Input
                    placeholder="https://linkedin.com/company/yourcompany"
                    value={settings.SOCIAL_LINKEDIN_URL}
                    onChange={(e) => update("SOCIAL_LINKEDIN_URL", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payments */}
      {activeTab === "payments" && (
        <Card>
          <CardHeader>
            <CardTitle>Razorpay</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label>Key ID</Label>
              <Input
                value={settings.RAZORPAY_KEY_ID}
                onChange={(e) => update("RAZORPAY_KEY_ID", e.target.value)}
              />
            </div>
            <PasswordInput
              label="Key Secret"
              value={settings.RAZORPAY_KEY_SECRET}
              onChange={(v) => update("RAZORPAY_KEY_SECRET", v)}
            />
            <PasswordInput
              label="Webhook Secret"
              value={settings.RAZORPAY_WEBHOOK_SECRET}
              onChange={(v) => update("RAZORPAY_WEBHOOK_SECRET", v)}
            />
            <div className="space-y-1">
              <Label>Public Key ID</Label>
              <Input
                value={settings.NEXT_PUBLIC_RAZORPAY_KEY_ID}
                onChange={(e) => update("NEXT_PUBLIC_RAZORPAY_KEY_ID", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Auth */}
      {activeTab === "auth" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Firebase (Google & GitHub Auth)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label>Web API Key</Label>
                <Input
                  value={settings.NEXT_PUBLIC_FIREBASE_API_KEY}
                  onChange={(e) => update("NEXT_PUBLIC_FIREBASE_API_KEY", e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label>Auth Domain</Label>
                <Input
                  value={settings.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}
                  onChange={(e) => update("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN", e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label>Project ID</Label>
                <Input
                  value={settings.NEXT_PUBLIC_FIREBASE_PROJECT_ID}
                  onChange={(e) => update("NEXT_PUBLIC_FIREBASE_PROJECT_ID", e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label>Service Account Key (JSON)</Label>
                <textarea
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={settings.FIREBASE_SERVICE_ACCOUNT_KEY}
                  onChange={(e) => update("FIREBASE_SERVICE_ACCOUNT_KEY", e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>NextAuth</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <PasswordInput
                label="Auth Secret"
                value={settings.AUTH_SECRET}
                onChange={(v) => update("AUTH_SECRET", v)}
              />
              <div className="space-y-1">
                <Label>LinkedIn Client ID</Label>
                <Input
                  value={settings.AUTH_LINKEDIN_ID}
                  onChange={(e) => update("AUTH_LINKEDIN_ID", e.target.value)}
                />
              </div>
              <PasswordInput
                label="LinkedIn Client Secret"
                value={settings.AUTH_LINKEDIN_SECRET}
                onChange={(v) => update("AUTH_LINKEDIN_SECRET", v)}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Integrations */}
      {activeTab === "integrations" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>StudentAlumni.ai</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label>API URL</Label>
                <Input
                  value={settings.STUDENTALUMNI_API_URL}
                  onChange={(e) => update("STUDENTALUMNI_API_URL", e.target.value)}
                />
              </div>
              <PasswordInput
                label="API Key"
                value={settings.STUDENTALUMNI_API_KEY}
                onChange={(v) => update("STUDENTALUMNI_API_KEY", v)}
              />
              <PasswordInput
                label="Webhook Secret"
                value={settings.STUDENTALUMNI_WEBHOOK_SECRET}
                onChange={(v) => update("STUDENTALUMNI_WEBHOOK_SECRET", v)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upstash Redis (Rate Limiting)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label>Redis REST URL</Label>
                <Input
                  value={settings.UPSTASH_REDIS_REST_URL}
                  onChange={(e) => update("UPSTASH_REDIS_REST_URL", e.target.value)}
                />
              </div>
              <PasswordInput
                label="Redis REST Token"
                value={settings.UPSTASH_REDIS_REST_TOKEN}
                onChange={(v) => update("UPSTASH_REDIS_REST_TOKEN", v)}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Notifications */}
      {activeTab === "notifications" && (
        <div className="space-y-6">
          {/* WhatsApp Config */}
          <Card>
            <CardHeader>
              <CardTitle>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  WhatsApp Configuration
                </div>
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Enter your WhatsApp service provider details. Supports any HTTP-based WhatsApp API.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label>WhatsApp API URL</Label>
                <Input
                  placeholder="https://your-whatsapp-service.com/api/send"
                  value={settings.WHATSAPP_API_URL}
                  onChange={(e) => update("WHATSAPP_API_URL", e.target.value)}
                />
              </div>
              <PasswordInput
                label="WhatsApp API Key"
                value={settings.WHATSAPP_API_KEY}
                onChange={(v) => update("WHATSAPP_API_KEY", v)}
              />
            </CardContent>
          </Card>

          {/* Channel Toggles */}
          <Card>
            <CardHeader>
              <CardTitle>
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Notification Channels
                </div>
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Toggle which channels each notification type is delivered through. At least one channel
                must be enabled per type for delivery to work.
              </p>
            </CardHeader>
            <CardContent>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #2d3748" }}>
                      <th style={{ textAlign: "left", padding: "12px 16px", color: "#9ca3af", fontWeight: 600, fontSize: "13px" }}>Notification Type</th>
                      {CHANNELS.map((ch) => (
                        <th key={ch.id} style={{ textAlign: "center", padding: "12px 16px", color: "#9ca3af", fontWeight: 600, fontSize: "13px" }}>{ch.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {NOTIFICATION_TYPES.map((type) => (
                      <tr key={type.id} style={{ borderBottom: "1px solid #1f2937" }}>
                        <td style={{ padding: "14px 16px", color: "#d1d5db", fontSize: "14px" }}>{type.label}</td>
                        {CHANNELS.map((ch) => {
                          const key = notifyKey(type.id, ch.id);
                          return (
                            <td key={ch.id} style={{ textAlign: "center", padding: "14px 16px" }}>
                              <ToggleSwitch
                                checked={notifyConfig[key] ?? false}
                                onChange={() => toggleNotify(type.id, ch.id)}
                              />
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>When a notification is triggered, the system checks which channels are enabled for that type and delivers through all enabled channels simultaneously.</p>
              <ul className="list-disc pl-4 space-y-1">
                <li><strong>Email</strong> — uses your configured email provider (SMTP/Postal/Brevo). Works with any valid email address.</li>
                <li><strong>WhatsApp</strong> — uses the configured WhatsApp API. Requires a valid phone number with country code (e.g., +919876543210).</li>
              </ul>
              <p className="mt-2">Email templates are automatically converted to plain text for WhatsApp delivery. Both channels receive the same content.</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ID Cards */}
      {activeTab === "id-cards" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-4 w-4" />
                Employee ID Format
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Configure how employee IDs are generated. Format: <code className="bg-muted px-1 rounded">{empPrefix || "SA"}-YYYY-000001</code>
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-1">
                <Label>ID Prefix</Label>
                <Input
                  value={empPrefix}
                  onChange={(e) => setEmpPrefix(e.target.value)}
                  placeholder="SA"
                />
                <p className="text-xs text-muted-foreground">
                  Prefix for all employee IDs (e.g., SA, EMP, ECHO)
                </p>
              </div>

              <div className="space-y-1">
                <Label>Next Sequence Number</Label>
                <Input
                  value={empNext}
                  onChange={(e) => setEmpNext(e.target.value)}
                  placeholder="1"
                  type="number"
                />
                <p className="text-xs text-muted-foreground">
                  The next number in the sequence. IDs are padded to 6 digits.
                </p>
              </div>

              <div className="rounded-lg bg-muted/50 p-4 space-y-1">
                <p className="text-sm font-medium">Preview</p>
                <code className="text-lg font-bold text-primary">
                  {`${empPrefix || "SA"}-${new Date().getFullYear()}-${String(parseInt(empNext || "1")).padStart(6, "0")}`}
                </code>
                <p className="text-xs text-muted-foreground">
                  This is what the next assigned ID will look like.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Assign Employee IDs
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Generate employee IDs for all users who don&apos;t have one yet. Existing IDs will not be overwritten.
              </p>
            </CardHeader>
            <CardContent>
              {idStats && (
                <p className="text-sm mb-4">
                  <strong>{idStats.usersWithoutEmployeeId}</strong> user(s) without an employee ID.
                </p>
              )}
              <Button
                onClick={handleAssignEmpIds}
                disabled={assigningIds || (idStats?.usersWithoutEmployeeId ?? 0) === 0}
              >
                {assigningIds ? "Assigning..." : "Generate IDs for All Users"}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
