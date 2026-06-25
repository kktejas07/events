"use client";

import { useState } from "react";

export default function AdminScanPage() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<{ success?: boolean; message?: string; ticket?: { attendeeName: string; attendeeEmail: string; event: { title: string }; status: string } } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleScan(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/scan", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ barcode: code.trim() }) });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ success: false, message: "Scan failed" });
    }
    setLoading(false);
    setCode("");
  }

  return (
    <div>
      <h2 className="gt-admin-section-title">Scan Tickets</h2>
      <p className="gt-admin-section-subtitle">Scan ticket barcodes for entry</p>

      <div className="gt-admin-card">
        <form onSubmit={handleScan}>
          <div className="gt-admin-inline-form">
            <div className="gt-admin-form-group" style={{ flex: 1 }}>
              <label className="gt-admin-label">Barcode</label>
              <input className="gt-admin-input" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Scan or enter barcode..." autoFocus />
            </div>
            <button type="submit" className="gt-admin-btn gt-admin-btn-primary" disabled={loading} style={{ height: "46px" }}>
              {loading ? <><i className="fa-solid fa-spinner fa-spin"></i> Scanning...</> : <><i className="fa-regular fa-qrcode"></i> Scan</>}
            </button>
          </div>
        </form>

        {result && (
          <div className="mt-4">
            <div className={`gt-admin-badge ${result.success ? "success" : "danger"}`} style={{ padding: "8px 16px", fontSize: "14px" }}>
              {result.success ? "Valid Ticket" : "Invalid"}
            </div>
            {result.ticket && (
              <div className="mt-3" style={{ background: "#f8f9fe", borderRadius: "12px", padding: "16px" }}>
                <p style={{ margin: 0, fontWeight: 600 }}>{result.ticket.attendeeName}</p>
                <p style={{ margin: "4px 0 0", color: "#888", fontSize: "13px" }}>{result.ticket.attendeeEmail}</p>
                <p style={{ margin: "8px 0 0", fontSize: "14px" }}><strong>Event:</strong> {result.ticket.event?.title}</p>
                <p style={{ margin: "4px 0 0", fontSize: "14px" }}><strong>Status:</strong> {result.ticket.status}</p>
              </div>
            )}
            <p className="mt-2" style={{ color: "#666", fontSize: "13px" }}>{result.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
