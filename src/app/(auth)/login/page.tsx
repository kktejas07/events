"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Logo } from "@/components/ui/logo";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  function fillCredentials(email: string, password: string) {
    setForm({ email, password });
  }

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signIn("credentials", { email: form.email, password: form.password, redirect: false });
      if (result?.error) {
        alert("Invalid email or password");
      } else {
        window.location.href = "/my-tickets";
      }
    } catch {
      alert("Something went wrong");
    }
    setLoading(false);
  }

  return (
    <div className="gt-auth-wrapper">
      <div className="gt-auth-card">
        <div className="gt-auth-logo">
          <Link href="/">
            <Logo height={40} />
          </Link>
        </div>
        <h1 className="gt-auth-title">Welcome Back</h1>
        <p className="gt-auth-subtitle">Sign in to access your tickets and events</p>

        <div className="gt-auth-quick-login">
          <button className="gt-auth-quick-btn" onClick={() => fillCredentials("events@forgetechno.com", "Omsairam@4522!!")}>
            <i className="fa-solid fa-shield-halved"></i> Super Admin
          </button>
          <button className="gt-auth-quick-btn" onClick={() => fillCredentials("mit-admin@example.com", "orgadmin123")}>
            <i className="fa-solid fa-building"></i> Organizer
          </button>
        </div>

        <form onSubmit={handleEmailLogin}>
          <div className="gt-admin-form-group">
            <label className="gt-admin-label" htmlFor="email">Email</label>
            <input id="email" type="email" className="gt-admin-input" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="gt-admin-form-group">
            <label className="gt-admin-label" htmlFor="password">
              Password
              <Link href="/forgot-password" style={{ float: "right", fontSize: "12px", fontWeight: 400, color: "#8B5CF6" }}>Forgot?</Link>
            </label>
            <div style={{ position: "relative" }}>
              <input id="password" type={showPassword ? "text" : "password"} className="gt-admin-input" placeholder="••••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} style={{ paddingRight: "40px" }} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#888", cursor: "pointer" }}>
                <i className={`fa-regular fa-${showPassword ? "eye-slash" : "eye"}`}></i>
              </button>
            </div>
          </div>
          <button type="submit" className="gt-admin-btn gt-admin-btn-primary w-100" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"} <i className="fa-regular fa-arrow-right ms-2"></i>
          </button>
        </form>

        <p className="gt-auth-footer">
          Don&apos;t have an account? <Link href="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
