"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScanLine, Info, TicketCheck, ShieldCheck } from "lucide-react";

export default function ScanPage() {
  const [barcode, setBarcode] = useState("");
  const [scanResult, setScanResult] = useState<{ valid: boolean; message: string } | null>(null);

  async function handleVerify() {
    if (!barcode.trim()) return;
    try {
      const res = await fetch("/api/admin/tickets/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ barcode: barcode.trim() }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setScanResult({
          valid: true,
          message: `${json.data.attendeeName} — ${json.data.ticketTypeName}`,
        });
      } else {
        setScanResult({ valid: false, message: json.error || "Invalid ticket" });
      }
    } catch {
      setScanResult({ valid: false, message: "Network error" });
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Scan Tickets</h2>
        <p className="text-gray-400">Verify tickets at the event entrance</p>
      </div>

      <Card className="border-white/10 bg-white/[0.03]">
        <CardContent className="flex items-start gap-4 pt-6">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-purple-400" />
          <div className="text-sm text-gray-300">
            <p className="font-medium text-white">How scanning works</p>
            <p className="mt-1">
              Digital tickets include a unique barcode for each attendee. At the venue entrance,
              scan or enter the barcode to validate the ticket and mark the attendee as checked in.
              This prevents duplicate entries and ensures only valid ticket holders gain access.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-white/10 bg-white/[0.03]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <ScanLine className="h-5 w-5 text-purple-400" />
              Camera Scanner
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4 py-8">
            <div className="flex h-48 w-full items-center justify-center rounded-lg border-2 border-dashed border-white/10 bg-black/20">
              <p className="text-center text-sm text-gray-500">
                Camera access not yet implemented.
                <br />
                Use manual entry below.
              </p>
            </div>
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
                onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                className="border-white/10 bg-white/[0.03] font-mono text-white placeholder:text-gray-600"
              />
              <Button
                onClick={handleVerify}
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
          <p className="py-8 text-center text-sm text-gray-500">
            No scans yet today. Verified tickets will appear here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
