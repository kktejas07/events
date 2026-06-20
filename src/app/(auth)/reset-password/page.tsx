"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, ArrowLeft, Sparkles } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing reset token");
    }
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        setSuccess(true);
        setTimeout(() => router.push("/login"), 3000);
      }
    } catch {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0a0a1a] px-4">
      <div className="animate-gradient absolute inset-0 bg-gradient-to-br from-purple-900/30 via-[#0a0a1a] to-cyan-900/20" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-cyan-600 shadow-lg shadow-purple-600/30">
              <Lock className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Set New Password</h1>
            <p className="mt-1 text-sm text-gray-400">
              {success ? "Password reset successfully!" : "Enter your new password"}
            </p>
          </motion.div>

          {success ? (
            <motion.div
              className="mt-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="mb-6 rounded-lg border border-green-500/20 bg-green-900/20 p-4">
                <p className="text-sm text-green-300">
                  <Sparkles className="mr-1 inline h-4 w-4" />
                  Your password has been reset. Redirecting to login...
                </p>
              </div>
            </motion.div>
          ) : !token ? (
            <motion.div
              className="mt-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="mb-6 rounded-lg border border-red-500/20 bg-red-900/20 p-4">
                <p className="text-sm text-red-400">Invalid or missing reset token.</p>
              </div>
              <Link
                href="/forgot-password"
                className="inline-flex items-center text-sm text-purple-400 hover:text-purple-300"
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                Request a new reset link
              </Link>
            </motion.div>
          ) : (
            <motion.form
              onSubmit={handleSubmit}
              className="mt-6 space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {error && (
                <div className="rounded-lg border border-red-500/20 bg-red-900/20 p-3">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}
              <div className="space-y-1">
                <Label htmlFor="password" className="text-sm text-gray-300">
                  New Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-white/10 bg-white/[0.03] text-white placeholder:text-gray-600"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="confirm" className="text-sm text-gray-300">
                  Confirm Password
                </Label>
                <Input
                  id="confirm"
                  type="password"
                  placeholder="Re-enter password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  className="border-white/10 bg-white/[0.03] text-white placeholder:text-gray-600"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg shadow-purple-600/30 hover:shadow-xl hover:shadow-purple-600/40"
                disabled={loading}
              >
                {loading ? "Resetting..." : "Reset Password"}
                <Lock className="ml-2 h-4 w-4" />
              </Button>
            </motion.form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
