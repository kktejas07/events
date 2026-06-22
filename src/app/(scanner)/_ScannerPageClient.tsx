"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ScanLine,
  TicketCheck,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Calendar,
} from "lucide-react";
import CameraScanner from "@/components/scanner/camera-scanner";

interface Event {
  id: string;
  title: string;
  startDate: string;
}

interface ScanLogEntry {
  barcode: string;
  timestamp: number;
  valid: boolean;
  attendeeName?: string;
  ticketType?: string;
  eventName?: string;
  message: string;
}

export default function ScannerPageClient({
  user,
}: {
  user: { name?: string | null; email?: string | null };
}) {
  const [barcode, setBarcode] = useState("");
  const [scanResult, setScanResult] = useState<{ valid: boolean; message: string } | null>(null);
  const [scanLog, setScanLog] = useState<ScanLogEntry[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>("all");

  useEffect(() => {
    fetch("/api/events?status=PUBLISHED&limit=50")
      .then((r) => r.json())
      .then((data) => {
        if (data.data) setEvents(data.data);
      })
      .catch(() => {});
  }, []);

  const verifyBarcode = useCallback(async (code: string): Promise<boolean> => {
    try {
      const body: Record<string, string> = { barcode: code };
      if (selectedEventId !== "all") body.eventId = selectedEventId;

      const res = await fetch("/api/admin/tickets/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();

      const entry: ScanLogEntry = {
        barcode: code,
        timestamp: Date.now(),
        valid: !!json.success,
        attendeeName: json.data?.attendeeName,
        ticketType: json.data?.ticketTypeName,
        eventName: json.data?.eventName,
        message: json.success
          ? `${json.data.attendeeName} — ${json.data.ticketTypeName}`
          : json.error || "Invalid ticket",
      };
      setScanLog((prev) => [entry, ...prev].slice(0, 50));
      return !!json.success;
    } catch {
      setScanLog((prev) => [
        { barcode: code, timestamp: Date.now(), valid: false, message: "Network error" },
        ...prev,
      ].slice(0, 50));
      return false;
    }
  }, [selectedEventId]);

  async function handleManualVerify() {
    if (!barcode.trim()) return;
    const ok = await verifyBarcode(barcode.trim());
    setScanResult({ valid: ok, message: ok ? "Ticket checked in" : "Invalid ticket" });
    if (ok) setBarcode("");
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-white">Ticket Scanner</h2>
        <p className="text-sm text-gray-400">
          Logged in as {user.name || user.email}
        </p>
      </div>

      {events.length > 0 && (
        <Card className="border-white/10 bg-white/[0.03]">
          <CardContent className="flex items-center gap-3 pt-4">
            <Calendar className="h-4 w-4 shrink-0 text-purple-400" />
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="flex-1 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white"
            >
              <option value="all" className="bg-[#0a0a1a]">All Events</option>
              {events.map((ev) => (
                <option key={ev.id} value={ev.id} className="bg-[#0a0a1a]">
                  {ev.title}
                </option>
              ))}
            </select>
          </CardContent>
        </Card>
      )}

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
                <span className={`font-medium ${scanResult.valid ? "text-green-400" : "text-red-400"}`}>
                  {scanResult.valid ? "Valid Ticket" : "Invalid"}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-300">{scanResult.message}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/[0.03]">
        <CardHeader>
          <CardTitle className="text-white">Recent Scans</CardTitle>
        </CardHeader>
        <CardContent>
          {scanLog.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-500">
              Point camera at a ticket barcode to begin scanning
            </p>
          ) : (
            <div className="max-h-80 space-y-2 overflow-y-auto">
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
                      {entry.eventName && ` — ${entry.eventName}`}
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
