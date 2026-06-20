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
import { CreditCard, Shield, Link2, Settings2, Mail, ChevronRight, Upload } from "lucide-react";

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
}

const defaults: Settings = {
  NEXT_PUBLIC_APP_NAME: "Events Platform",
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
};

type TabId = "general" | "payments" | "auth" | "integrations";

const tabs: { id: TabId; label: string; icon: typeof Settings2 }[] = [
  { id: "general", label: "General", icon: Settings2 },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "auth", label: "Authentication", icon: Shield },
  { id: "integrations", label: "Integrations", icon: Link2 },
];

export default function AdminSettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<Settings>(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("general");

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.settings) setSettings({ ...defaults, ...data.settings });
      })
      .catch(() => toast.error("Failed to load settings"))
      .finally(() => setLoading(false));
  }, []);

  function update(key: keyof Settings, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  const hasValue = (key: keyof Settings) => settings[key]?.length > 0;

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
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

          {/* Email Provider Card */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Email Provider</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Configure your email delivery service
                    </p>
                  </div>
                </div>
                <Link href="/admin/settings/email">
                  <Button variant="outline" className="gap-2">
                    Configure <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
          </Card>
        </div>
      )}
    </div>
  );
}
