"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Github, Linkedin, Sparkles, ArrowRight } from "lucide-react";
import { signInWithGoogle, signInWithGithub } from "@/lib/firebase-auth";

async function firebaseSignIn(provider: "google" | "github") {
  const fn = provider === "google" ? signInWithGoogle : signInWithGithub;
  const idToken = await fn();
  if (!idToken) {
    toast.error("Firebase not configured. Please check your Firebase settings.");
    return false;
  }
  const result = await signIn("credentials", {
    idToken,
    provider: "firebase",
    redirect: false,
  });
  if (result?.error) {
    toast.error("Sign in failed");
    return false;
  }
  toast.success("Logged in successfully!");
  return true;
}

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<"google" | "github" | null>(null);
  const [form, setForm] = useState({ email: "", password: "" });

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });
      if (result?.error) {
        toast.error("Invalid email or password");
      } else {
        window.location.href = "/my-tickets";
      }
    } catch {
      toast.error("Something went wrong");
    }
    setLoading(false);
  }

  async function handleSocialLogin(provider: "google" | "github") {
    setSocialLoading(provider);
    try {
      const ok = await firebaseSignIn(provider);
      if (ok) {
        window.location.href = "/my-tickets";
      }
    } catch {
      toast.error("Something went wrong");
    }
    setSocialLoading(null);
  }

  return (
    <div className="relative flex h-full items-center justify-center overflow-hidden bg-[#0a0a1a] px-4">
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
              <span className="text-2xl font-bold text-white">E</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
            <p className="mt-1 text-sm text-gray-400">Sign in to access your tickets and events</p>
          </motion.div>

          <motion.div
            className="mt-6 space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 border-white/10 bg-white/[0.03] text-white hover:bg-white/10"
                disabled={socialLoading !== null}
                onClick={() => handleSocialLogin("google")}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-white/10 bg-white/[0.03] text-white hover:bg-white/10"
                disabled={socialLoading !== null}
                onClick={() => handleSocialLogin("github")}
              >
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-white/10 bg-white/[0.03] text-white hover:bg-white/10"
                onClick={() => signIn("linkedin", { callbackUrl: "/my-tickets" })}
              >
                <Linkedin className="mr-2 h-4 w-4" />
                LinkedIn
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="bg-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#0a0a1a] px-2 text-gray-500">Or continue with</span>
              </div>
            </div>

            <form onSubmit={handleEmailLogin} className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="email" className="text-sm text-gray-300">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="border-white/10 bg-white/[0.03] text-white placeholder:text-gray-600"
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm text-gray-300">
                    Password
                  </Label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-purple-400 hover:text-purple-300"
                  >
                    Forgot?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  className="border-white/10 bg-white/[0.03] text-white placeholder:text-gray-600"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg shadow-purple-600/30 hover:shadow-xl hover:shadow-purple-600/40"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>

            <div className="flex gap-2">
              
            </div>
          </motion.div>

          <motion.p
            className="mt-6 text-center text-sm text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-medium text-purple-400 hover:text-purple-300">
              Register
            </Link>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
