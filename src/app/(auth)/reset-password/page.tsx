"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function ResetForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !password) return;
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, password }) });
      if (res.ok) {
        alert("Password reset successfully");
        router.push("/login");
      } else {
        alert("Failed to reset password");
      }
    } catch { alert("Something went wrong"); }
    setLoading(false);
  }

  if (!token) {
    return <p className="gt-auth-subtitle">Invalid or missing reset token.</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="gt-admin-form-group">
        <label className="gt-admin-label">New Password</label>
        <input type="password" className="gt-admin-input" placeholder="Enter new password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      <button type="submit" className="gt-admin-btn gt-admin-btn-primary w-100" disabled={loading}>
        {loading ? "Resetting..." : "Reset Password"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="gt-auth-wrapper">
      <div className="gt-auth-card">
        <div className="gt-auth-logo">
          <Link href="/"><img src="/assets/img/logo/blue-logo.svg" alt="logo" style={{ height: "40px" }} /></Link>
        </div>
        <h1 className="gt-auth-title">Reset Password</h1>
        <Suspense fallback={<p className="gt-auth-subtitle">Loading...</p>}>
          <ResetForm />
        </Suspense>
        <p className="gt-auth-footer">
          <Link href="/login">Back to Sign In</Link>
        </p>
      </div>
    </div>
  );
}
