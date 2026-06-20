"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, CheckCircle, XCircle, ScanLine } from "lucide-react";

export default function ScanTicketPage() {
  const [scanResult, setScanResult] = useState<"valid" | "invalid" | null>(null);
  const [manualCode, setManualCode] = useState("");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Scan Tickets</h2>
        <p className="text-muted-foreground">Verify tickets at event entrance</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" /> Camera Scanner
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex aspect-video items-center justify-center rounded-lg border-2 border-dashed bg-muted/30">
              <div className="text-center">
                <ScanLine className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Camera access required for barcode scanning
                </p>
                <Button className="mt-4">Enable Camera</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Manual Entry</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Enter ticket barcode manually</p>
              <div className="flex gap-2">
                <Input
                  placeholder="TKT-XXXXXXXX"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                />
                <Button>Verify</Button>
              </div>
            </div>

            {scanResult && (
              <div
                className={`flex items-center gap-3 rounded-lg p-4 ${
                  scanResult === "valid" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                }`}
              >
                {scanResult === "valid" ? (
                  <CheckCircle className="h-6 w-6" />
                ) : (
                  <XCircle className="h-6 w-6" />
                )}
                <div>
                  <p className="font-semibold">
                    {scanResult === "valid" ? "Valid Ticket" : "Invalid Ticket"}
                  </p>
                  <p className="text-sm">
                    {scanResult === "valid"
                      ? "John Doe — Standard Pass"
                      : "Ticket not found or already used"}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Scans</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No scans yet today.</p>
        </CardContent>
      </Card>
    </div>
  );
}
