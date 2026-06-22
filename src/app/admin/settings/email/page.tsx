"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/forms/password-input";
import { toast } from "sonner";
import { CheckCircle2, XCircle } from "lucide-react";

interface EmailSettings {
  EMAIL_PROVIDER: string;
  SMTP_HOST: string;
  SMTP_PORT: string;
  SMTP_SECURE: string;
  SMTP_USER: string;
  SMTP_PASS: string;
  POSTAL_BASE_URL: string;
  POSTAL_API_KEY: string;
  BREVO_API_KEY: string;
  MAIL_FROM_NAME: string;
  MAIL_FROM_EMAIL: string;
  EMAIL_FROM: string;
}

const defaults: EmailSettings = {
  EMAIL_PROVIDER: "smtp",
  SMTP_HOST: "",
  SMTP_PORT: "587",
  SMTP_SECURE: "false",
  SMTP_USER: "",
  SMTP_PASS: "",
  POSTAL_BASE_URL: "https://mail.studentalumni.ai",
  POSTAL_API_KEY: "",
  BREVO_API_KEY: "",
  MAIL_FROM_NAME: "Events Platform",
  MAIL_FROM_EMAIL: "noreply@yourdomain.com",
  EMAIL_FROM: "",
};

export default function EmailSettingsPage() {
  const [settings, setSettings] = useState<EmailSettings>(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [testEmailSent, setTestEmailSent] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings/email")
      .then((r) => r.json())
      .then((data) => {
        if (data.settings) setSettings({ ...defaults, ...data.settings });
      })
      .catch(() => toast.error("Failed to load email settings"))
      .finally(() => setLoading(false));
  }, []);

  function update(key: keyof EmailSettings, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });
      if (res.ok) {
        toast.success("Email settings saved");
      } else {
        toast.error("Failed to save");
      }
    } catch {
      toast.error("Failed to save email settings");
    }
    setSaving(false);
  }

  async function handleTestConnection() {
    setTesting(true);
    setTestResult(null);
    try {
      const isBrevo = settings.EMAIL_PROVIDER === "brevo";
      const isPostal = settings.EMAIL_PROVIDER === "postal";
      const body = isBrevo
        ? {
            provider: "brevo",
            config: { apiKey: settings.BREVO_API_KEY },
          }
        : isPostal
        ? {
            provider: "postal",
            config: { baseUrl: settings.POSTAL_BASE_URL, apiKey: settings.POSTAL_API_KEY },
          }
        : {
            provider: "smtp",
            config: {
              smtp: {
                host: settings.SMTP_HOST,
                port: Number(settings.SMTP_PORT),
                secure: settings.SMTP_SECURE === "true",
                user: settings.SMTP_USER,
                pass: settings.SMTP_PASS,
              },
            },
          };

      const res = await fetch("/api/admin/settings/email/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await res.json();
      setTestResult(result);
    } catch {
      setTestResult({ success: false, message: "Test request failed" });
    }
    setTesting(false);
  }

  async function handleSendTestEmail() {
    setTestEmailSent(false);
    try {
      const res = await fetch("/api/admin/settings/email/test-send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: settings.MAIL_FROM_EMAIL || settings.EMAIL_FROM }),
      });
      const result = await res.json();
      if (result.success) {
        toast.success("Test email sent successfully");
        setTestEmailSent(true);
      } else {
        toast.error(result.error || "Failed to send test email");
      }
    } catch {
      toast.error("Failed to send test email");
    }
  }

  if (loading) return <div className="p-6 text-muted-foreground">Loading email settings...</div>;

  const provider = settings.EMAIL_PROVIDER;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Email Provider</h2>
          <p className="text-muted-foreground">Configure how your platform sends emails</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </Button>
      </div>

      {/* Provider Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Choose Provider</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <button
              type="button"
              onClick={() => update("EMAIL_PROVIDER", "smtp")}
              className={`rounded-xl border-2 p-5 text-left transition-all hover:shadow-md ${
                provider === "smtp"
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border hover:border-muted-foreground"
              }`}
            >
              <p className="text-lg font-semibold">SMTP</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Use any SMTP server — Gmail, SendGrid, etc.
              </p>
            </button>
            <button
              type="button"
              onClick={() => update("EMAIL_PROVIDER", "brevo")}
              className={`rounded-xl border-2 p-5 text-left transition-all hover:shadow-md ${
                provider === "brevo"
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border hover:border-muted-foreground"
              }`}
            >
              <p className="text-lg font-semibold">Brevo</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Brevo (Sendinblue) — REST API with free tier
              </p>
            </button>
            <button
              type="button"
              onClick={() => update("EMAIL_PROVIDER", "postal")}
              className={`rounded-xl border-2 p-5 text-left transition-all hover:shadow-md ${
                provider === "postal"
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border hover:border-muted-foreground"
              }`}
            >
              <p className="text-lg font-semibold">Postal API</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Postal HTTP API with API key authentication
              </p>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Sender Info */}
      <Card>
        <CardHeader>
          <CardTitle>Sender</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <Label>From Name</Label>
            <Input
              value={settings.MAIL_FROM_NAME}
              onChange={(e) => update("MAIL_FROM_NAME", e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label>From Email</Label>
            <Input
              value={settings.MAIL_FROM_EMAIL}
              onChange={(e) => update("MAIL_FROM_EMAIL", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Provider Config */}
      {provider === "brevo" ? (
        <Card>
          <CardHeader>
            <CardTitle>Brevo API</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <PasswordInput
              label="API Key"
              value={settings.BREVO_API_KEY}
              onChange={(v) => update("BREVO_API_KEY", v)}
            />
            <p className="text-xs text-muted-foreground">
              Get your API key from Brevo Dashboard → SMTP &amp; API → API Keys
            </p>
          </CardContent>
        </Card>
      ) : provider === "postal" ? (
        <Card>
          <CardHeader>
            <CardTitle>Postal API</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label>Base URL</Label>
              <Input
                value={settings.POSTAL_BASE_URL}
                onChange={(e) => update("POSTAL_BASE_URL", e.target.value)}
                placeholder="https://mail.yourdomain.com"
              />
              <p className="text-xs text-muted-foreground">Your Postal server URL</p>
            </div>
            <PasswordInput
              label="API Key"
              value={settings.POSTAL_API_KEY}
              onChange={(v) => update("POSTAL_API_KEY", v)}
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>SMTP</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <Label>Host</Label>
                <Input
                  value={settings.SMTP_HOST}
                  onChange={(e) => update("SMTP_HOST", e.target.value)}
                  placeholder="mail.yourdomain.com"
                />
              </div>
              <div className="space-y-1">
                <Label>Port</Label>
                <Input
                  value={settings.SMTP_PORT}
                  onChange={(e) => update("SMTP_PORT", e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="smtp-secure"
                checked={settings.SMTP_SECURE === "true"}
                onChange={(e) => update("SMTP_SECURE", e.target.checked ? "true" : "false")}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="smtp-secure">Use TLS (SSL)</Label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <Label>Username</Label>
                <Input
                  value={settings.SMTP_USER}
                  onChange={(e) => update("SMTP_USER", e.target.value)}
                />
              </div>
              <PasswordInput
                label="Password"
                value={settings.SMTP_PASS}
                onChange={(v) => update("SMTP_PASS", v)}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Test Connection */}
      <Card>
        <CardHeader>
          <CardTitle>Test Connection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Verify your provider configuration is correct.
          </p>

          {testResult && (
            <div
              className={`flex items-center gap-2 rounded-lg border p-3 text-sm ${
                testResult.success
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="h-4 w-4 shrink-0" />
              ) : (
                <XCircle className="h-4 w-4 shrink-0" />
              )}
              <span>{testResult.message}</span>
            </div>
          )}

          <div className="flex gap-3">
            <Button variant="outline" onClick={handleTestConnection} disabled={testing}>
              {testing ? "Testing..." : "Test Connection"}
            </Button>
            <Button variant="secondary" onClick={handleSendTestEmail}>
              Send Test Email
            </Button>
          </div>

          {testEmailSent && (
            <p className="text-sm text-green-600">
              Test email sent! Check {settings.MAIL_FROM_EMAIL || settings.EMAIL_FROM}.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
