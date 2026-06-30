"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      if (res.ok) setSent(true);
    } catch { /* ignore */ }
    setLoading(false);
  }

  return (
    <div className="gt-auth-wrapper">
      <div className="gt-auth-card">
        <div className="gt-auth-logo">
          <Link href="/"><Logo height={40} /></Link>
        </div>
        <h1 className="gt-auth-title">Forgot Password</h1>
        <p className="gt-auth-subtitle">
          {sent ? "Check your email for a reset link" : "Enter your email to receive a reset link"}
        </p>

        {!sent && (
          <form onSubmit={handleSubmit}>
            <div className="gt-admin-form-group">
              <label className="gt-admin-label">Email</label>
              <input type="email" className="gt-admin-input" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <button type="submit" className="gt-admin-btn gt-admin-btn-primary w-100" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}

        <p className="gt-auth-footer">
          <Link href="/login">Back to Sign In</Link>
        </p>
      </div>
    </div>
  );
}
