"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { signInWithGoogle, signInWithGithub } from "@/lib/firebase-auth";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "", phone: "", college: "" });
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { alert("Passwords don't match"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!data.success) { alert(data.error); setLoading(false); return; }
      const result = await signIn("credentials", { email: form.email, password: form.password, redirect: false });
      if (result?.ok) { window.location.href = "/my-tickets"; } else { alert("Account created, please log in"); window.location.href = "/login"; }
    } catch {
      alert("Something went wrong");
      setLoading(false);
    }
  }

  async function handleSocialLogin(provider: "google" | "github") {
    setSocialLoading(provider);
    try {
      const fn = provider === "google" ? signInWithGoogle : signInWithGithub;
      const idToken = await fn();
      if (!idToken) { alert("Firebase not configured"); setSocialLoading(null); return; }
      const result = await signIn("firebase", { idToken, provider: "firebase", redirect: false });
      if (result?.error) { alert("Sign in failed"); } else { window.location.href = "/my-tickets"; }
    } catch { alert("Something went wrong"); }
    setSocialLoading(null);
  }

  return (
    <div className="gt-auth-wrapper">
      <div className="gt-auth-card">
        <div className="gt-auth-logo">
          <Link href="/"><img src="/assets/img/logo/blue-logo.svg" alt="logo" style={{ height: "40px" }} /></Link>
        </div>
        <h1 className="gt-auth-title">Create Account</h1>
        <p className="gt-auth-subtitle">Join us and start booking events</p>

        <div className="gt-auth-social-buttons">
          <button className="gt-auth-social-btn" disabled={socialLoading !== null} onClick={() => handleSocialLogin("google")}>
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Google
          </button>
          <button className="gt-auth-social-btn" disabled={socialLoading !== null} onClick={() => handleSocialLogin("github")}>
            <i className="fa-brands fa-github"></i> GitHub
          </button>
        </div>

        <div className="gt-auth-divider"><span>or register with email</span></div>

        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6">
              <div className="gt-admin-form-group">
                <label className="gt-admin-label">First Name</label>
                <input className="gt-admin-input" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required />
              </div>
            </div>
            <div className="col-md-6">
              <div className="gt-admin-form-group">
                <label className="gt-admin-label">Last Name</label>
                <input className="gt-admin-input" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} required />
              </div>
            </div>
          </div>
          <div className="gt-admin-form-group">
            <label className="gt-admin-label">Email</label>
            <input type="email" className="gt-admin-input" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="gt-admin-form-group">
            <label className="gt-admin-label">Password</label>
            <div style={{ position: "relative" }}>
              <input type={showPassword ? "text" : "password"} className="gt-admin-input" placeholder="Min 8 characters" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} style={{ paddingRight: "40px" }} required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#888", cursor: "pointer" }}>
                <i className={`fa-regular fa-${showPassword ? "eye-slash" : "eye"}`}></i>
              </button>
            </div>
          </div>
          <div className="gt-admin-form-group">
            <label className="gt-admin-label">Confirm Password</label>
            <input type="password" className="gt-admin-input" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} required />
          </div>
          <button type="submit" className="gt-admin-btn gt-admin-btn-primary w-100" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="gt-auth-footer">
          Already have an account? <Link href="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
