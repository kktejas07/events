"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ScanLine,
  UserCheck,
  UserX,
  Clock,
  LogIn,
  LogOut,
  History,
  Calendar,
} from "lucide-react";
import CameraScanner from "@/components/scanner/camera-scanner";

interface Event {
  id: string;
  title: string;
}

interface ScanLogEntry {
  userId: string;
  userName?: string;
  action: "check-in" | "check-out";
  timestamp: number;
  success: boolean;
  message?: string;
}

export default function CheckInPage() {
  const [mode, setMode] = useState<"check-in" | "check-out">("check-in");
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [scanLog, setScanLog] = useState<ScanLogEntry[]>([]);
  const [manualUserId, setManualUserId] = useState("");
  const [manualResult, setManualResult] = useState<{ success: boolean; message: string } | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetch("/api/events?status=PUBLISHED&limit=50")
      .then((r) => r.json())
      .then((data) => {
        if (data.data) setEvents(data.data);
      })
      .catch(() => {});
  }, []);

  const processAttendance = useCallback(
    async (barcode: string): Promise<boolean> => {
      setProcessing(true);
      try {
        const profileRes = await fetch(`/api/profile/${encodeURIComponent(barcode)}`);
        if (!profileRes.ok) {
          const entry: ScanLogEntry = {
            userId: barcode,
            action: mode,
            timestamp: Date.now(),
            success: false,
            message: "Profile not found",
          };
          setScanLog((prev) => [entry, ...prev].slice(0, 20));
          return false;
        }
        const profile = await profileRes.json();
        const userId = profile.id || profile.userId;

        const endpoint = mode === "check-in" ? "/api/attendance/check-in" : "/api/attendance/check-out";
        const body: Record<string, string> = { userId };
        if (selectedEventId) body.eventId = selectedEventId;

        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const json = await res.json();
        const ok = res.ok && json.success !== false;

        const entry: ScanLogEntry = {
          userId,
          userName: profile.name || profile.email || barcode,
          action: mode,
          timestamp: Date.now(),
          success: ok,
          message: ok
            ? `${mode === "check-in" ? "Checked in" : "Checked out"} successfully`
            : json.error || "Request failed",
        };
        setScanLog((prev) => [entry, ...prev].slice(0, 20));
        return ok;
      } catch {
        const entry: ScanLogEntry = {
          userId: barcode,
          action: mode,
          timestamp: Date.now(),
          success: false,
          message: "Network error",
        };
        setScanLog((prev) => [entry, ...prev].slice(0, 20));
        return false;
      } finally {
        setProcessing(false);
      }
    },
    [mode, selectedEventId]
  );

  async function handleManualSubmit() {
    if (!manualUserId.trim()) return;
    const ok = await processAttendance(manualUserId.trim());
    setManualResult({
      success: ok,
      message: ok
        ? `${mode === "check-in" ? "Check-in" : "Check-out"} successful`
        : "Failed to process attendance",
    });
    if (ok) setManualUserId("");
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-white">Attendance Scanner</h2>
        <p className="text-sm text-gray-400">Scan ID card QR to check in / check out attendees</p>
      </div>

      <Card className="border-white/10 bg-white/[0.03]">
        <CardContent className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center">
          <div className="flex rounded-lg border border-white/10 bg-white/[0.03] p-1">
            <button
              onClick={() => setMode("check-in")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                mode === "check-in"
                  ? "bg-green-500/20 text-green-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <LogIn className="h-4 w-4" />
              Check In
            </button>
            <button
              onClick={() => setMode("check-out")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                mode === "check-out"
                  ? "bg-orange-500/20 text-orange-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <LogOut className="h-4 w-4" />
              Check Out
            </button>
          </div>
          {events.length > 0 && (
            <div className="flex items-center gap-2 sm:ml-auto">
              <Calendar className="h-4 w-4 shrink-0 text-purple-400" />
              <select
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="flex-1 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white"
              >
                <option value="" className="bg-[#0a0a1a]">
                  All Events
                </option>
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id} className="bg-[#0a0a1a]">
                    {ev.title}
                  </option>
                ))}
              </select>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/[0.03]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <ScanLine className="h-5 w-5 text-purple-400" />
            Scan ID Card
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CameraScanner onScan={processAttendance} />
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/[0.03]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <UserCheck className="h-5 w-5 text-purple-400" />
            Manual Entry
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter user ID or email"
              value={manualUserId}
              onChange={(e) => setManualUserId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleManualSubmit()}
              className="border-white/10 bg-white/[0.03] text-white placeholder:text-gray-600"
            />
            <Button
              onClick={handleManualSubmit}
              disabled={processing}
              className={`bg-gradient-to-r text-white ${
                mode === "check-in"
                  ? "from-green-600 to-emerald-600"
                  : "from-orange-600 to-amber-600"
              }`}
            >
              {mode === "check-in" ? "Check In" : "Check Out"}
            </Button>
          </div>

          {manualResult && (
            <div
              className={`rounded-lg border p-4 ${
                manualResult.success
                  ? "border-green-500/30 bg-green-500/10"
                  : "border-red-500/30 bg-red-500/10"
              }`}
            >
              <div className="flex items-center gap-2">
                {manualResult.success ? (
                  <UserCheck className="h-5 w-5 text-green-400" />
                ) : (
                  <UserX className="h-5 w-5 text-red-400" />
                )}
                <span
                  className={`font-medium ${manualResult.success ? "text-green-400" : "text-red-400"}`}
                >
                  {manualResult.success ? "Success" : "Failed"}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-300">{manualResult.message}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/[0.03]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <History className="h-5 w-5 text-purple-400" />
            Scan History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {scanLog.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-500">
              No scans yet. Scan an ID card to begin.
            </p>
          ) : (
            <div className="max-h-80 space-y-2 overflow-y-auto">
              {scanLog.map((entry, i) => (
                <div
                  key={`${entry.userId}-${entry.timestamp}-${i}`}
                  className={`flex items-center gap-3 rounded-lg border p-3 ${
                    entry.success
                      ? "border-green-500/20 bg-green-500/5"
                      : "border-red-500/20 bg-red-500/5"
                  }`}
                >
                  {entry.success ? (
                    entry.action === "check-in" ? (
                      <LogIn className="h-5 w-5 shrink-0 text-green-400" />
                    ) : (
                      <LogOut className="h-5 w-5 shrink-0 text-orange-400" />
                    )
                  ) : (
                    <UserX className="h-5 w-5 shrink-0 text-red-400" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium text-white">
                        {entry.userName || entry.userId}
                      </p>
                      <Badge
                        variant="outline"
                        className={`shrink-0 border px-1.5 py-0 text-[10px] uppercase ${
                          entry.action === "check-in"
                            ? "border-green-500/40 text-green-400"
                            : "border-orange-500/40 text-orange-400"
                        }`}
                      >
                        {entry.action}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500">
                      {entry.message || entry.userId}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1 text-xs text-gray-600">
                    <Clock className="h-3 w-3" />
                    {new Date(entry.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
