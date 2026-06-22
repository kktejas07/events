"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScanLine, Info, TicketCheck, ShieldCheck, CheckCircle2, XCircle } from "lucide-react";
import CameraScanner from "@/components/scanner/camera-scanner";

interface ScanLogEntry {
  barcode: string;
  timestamp: number;
  valid: boolean;
  attendeeName?: string;
  ticketType?: string;
  message: string;
}

export default function ScanPage() {
  const [barcode, setBarcode] = useState("");
  const [scanResult, setScanResult] = useState<{ valid: boolean; message: string } | null>(null);
  const [scanLog, setScanLog] = useState<ScanLogEntry[]>([]);

  const verifyBarcode = useCallback(async (code: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/admin/tickets/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ barcode: code }),
      });
      const json = await res.json();
      const entry: ScanLogEntry = {
        barcode: code,
        timestamp: Date.now(),
        valid: !!json.success,
        attendeeName: json.data?.attendeeName,
        ticketType: json.data?.ticketTypeName,
        message: json.success
          ? `${json.data.attendeeName} — ${json.data.ticketTypeName}`
          : json.error || "Invalid ticket",
      };
      setScanLog((prev) => [entry, ...prev].slice(0, 50));
      return !!json.success;
    } catch {
      const entry: ScanLogEntry = {
        barcode: code,
        timestamp: Date.now(),
        valid: false,
        message: "Network error",
      };
      setScanLog((prev) => [entry, ...prev].slice(0, 50));
      return false;
    }
  }, []);

  async function handleManualVerify() {
    if (!barcode.trim()) return;
    const ok = await verifyBarcode(barcode.trim());
    setScanResult({
      valid: ok,
      message: ok ? "Ticket verified and checked in" : "Invalid ticket",
    });
    if (ok) setBarcode("");
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Scan Tickets</h2>
        <p className="text-gray-400">Verify tickets at the event entrance using camera or manual entry</p>
      </div>

      <Card className="border-white/10 bg-white/[0.03]">
        <CardContent className="flex items-start gap-4 pt-6">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-purple-400" />
          <div className="text-sm text-gray-300">
            <p className="font-medium text-white">Mobile Scanning</p>
            <p className="mt-1">
              Open this page on any smartphone. Tap &quot;Start Scanner&quot; and point the camera
              at the ticket&apos;s barcode or QR code. The ticket will be verified and checked in automatically.
              Works on both iOS and Android devices — no app install required.
            </p>
            <p className="mt-2 text-purple-400">
              For event staff: share <strong>/scan</strong> with scanner-only accounts (SCANNER role).
              They won&apos;t have access to the admin panel.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-white/10 bg-white/[0.03]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <ScanLine className="h-5 w-5 text-purple-400" />
              Camera Scanner
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CameraScanner onScan={verifyBarcode} />
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/[0.03]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <ShieldCheck className="h-5 w-5 text-purple-400" />
              Manual Entry
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter barcode (TKT-XXXXXXXX)"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleManualVerify()}
                className="border-white/10 bg-white/[0.03] font-mono text-white placeholder:text-gray-600"
              />
              <Button
                onClick={handleManualVerify}
                className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white"
              >
                Verify
              </Button>
            </div>

            {scanResult && (
              <div
                className={`rounded-lg border p-4 ${
                  scanResult.valid
                    ? "border-green-500/30 bg-green-500/10"
                    : "border-red-500/30 bg-red-500/10"
                }`}
              >
                <div className="flex items-center gap-2">
                  <TicketCheck
                    className={`h-5 w-5 ${scanResult.valid ? "text-green-400" : "text-red-400"}`}
                  />
                  <span
                    className={`font-medium ${
                      scanResult.valid ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {scanResult.valid ? "Valid Ticket" : "Invalid Ticket"}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-300">{scanResult.message}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-white/10 bg-white/[0.03]">
        <CardHeader>
          <CardTitle className="text-white">Recent Scans</CardTitle>
        </CardHeader>
        <CardContent>
          {scanLog.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-500">
              No scans yet. Scanned tickets will appear here.
            </p>
          ) : (
            <div className="max-h-96 space-y-2 overflow-y-auto">
              {scanLog.map((entry, i) => (
                <div
                  key={`${entry.barcode}-${entry.timestamp}-${i}`}
                  className={`flex items-center gap-3 rounded-lg border p-3 ${
                    entry.valid
                      ? "border-green-500/20 bg-green-500/5"
                      : "border-red-500/20 bg-red-500/5"
                  }`}
                >
                  {entry.valid ? (
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-green-400" />
                  ) : (
                    <XCircle className="h-5 w-5 shrink-0 text-red-400" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">
                      {entry.valid && entry.attendeeName ? entry.attendeeName : entry.message}
                    </p>
                    <p className="text-xs text-gray-500">
                      {entry.barcode}
                      {entry.ticketType && ` — ${entry.ticketType}`}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-gray-600">
                    {new Date(entry.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
