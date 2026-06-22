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
import { Github, Linkedin, Sparkles, ArrowRight, Swords, UserRound } from "lucide-react";
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
  toast.success("Account created successfully!");
  return true;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  college: string;
  graduationYear: string;
  gender: string;
  password: string;
  confirmPassword: string;
}

const emptyForm: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  college: "",
  graduationYear: "",
  gender: "",
  password: "",
  confirmPassword: "",
};

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<"google" | "github" | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
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

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          college: form.college,
          graduationYear: form.graduationYear ? parseInt(form.graduationYear) : undefined,
          gender: form.gender,
          password: form.password,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Account created! Signing you in...");
        await signIn("credentials", {
          email: form.email,
          password: form.password,
          redirect: false,
        });
        window.location.href = "/my-tickets";
      } else {
        toast.error(data.error || "Registration failed");
      }
    } catch {
      toast.error("Something went wrong");
    }
    setLoading(false);
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
        className="relative w-full max-w-lg"
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
            <h1 className="text-2xl font-bold text-white">Create Account</h1>
            <p className="mt-1 text-sm text-gray-400">Fill in your details to get started</p>
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
                <Github className="mr-2 h-4 w-4" /> GitHub
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-white/10 bg-white/[0.03] text-white hover:bg-white/10"
                onClick={() => signIn("linkedin", { callbackUrl: "/my-tickets" })}
              >
                <Linkedin className="mr-2 h-4 w-4" /> LinkedIn
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="bg-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#0a0a1a] px-2 text-gray-500">Or register with email</span>
              </div>
            </div>

            <form onSubmit={handleRegister} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="firstName" className="text-sm text-gray-300">
                    First Name *
                  </Label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    value={form.firstName}
                    onChange={(e) => update("firstName", e.target.value)}
                    required
                    className="border-white/10 bg-white/[0.03] text-white placeholder:text-gray-600"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="lastName" className="text-sm text-gray-300">
                    Last Name *
                  </Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    value={form.lastName}
                    onChange={(e) => update("lastName", e.target.value)}
                    required
                    className="border-white/10 bg-white/[0.03] text-white placeholder:text-gray-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="email" className="text-sm text-gray-300">
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    required
                    className="border-white/10 bg-white/[0.03] text-white placeholder:text-gray-600"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="phone" className="text-sm text-gray-300">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    className="border-white/10 bg-white/[0.03] text-white placeholder:text-gray-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="college" className="text-sm text-gray-300">
                    College / Institution
                  </Label>
                  <Input
                    id="college"
                    placeholder="Your college name"
                    value={form.college}
                    onChange={(e) => update("college", e.target.value)}
                    className="border-white/10 bg-white/[0.03] text-white placeholder:text-gray-600"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="graduationYear" className="text-sm text-gray-300">
                    Graduation Year
                  </Label>
                  <Input
                    id="graduationYear"
                    type="number"
                    placeholder="2026"
                    value={form.graduationYear}
                    onChange={(e) => update("graduationYear", e.target.value)}
                    className="border-white/10 bg-white/[0.03] text-white placeholder:text-gray-600"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="gender" className="text-sm text-gray-300">
                  Gender
                </Label>
                <select
                  id="gender"
                  value={form.gender}
                  onChange={(e) => update("gender", e.target.value)}
                  className="flex h-10 w-full rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-0"
                >
                  <option value="" className="bg-[#0a0a1a]">
                    Prefer not to say
                  </option>
                  <option value="male" className="bg-[#0a0a1a]">
                    Male
                  </option>
                  <option value="female" className="bg-[#0a0a1a]">
                    Female
                  </option>
                  <option value="other" className="bg-[#0a0a1a]">
                    Other
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="password" className="text-sm text-gray-300">
                    Password *
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Min 8 characters"
                    value={form.password}
                    onChange={(e) => update("password", e.target.value)}
                    required
                    minLength={8}
                    className="border-white/10 bg-white/[0.03] text-white placeholder:text-gray-600"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="confirmPassword" className="text-sm text-gray-300">
                    Confirm *
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Re-enter password"
                    value={form.confirmPassword}
                    onChange={(e) => update("confirmPassword", e.target.value)}
                    required
                    className="border-white/10 bg-white/[0.03] text-white placeholder:text-gray-600"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg shadow-purple-600/30 hover:shadow-xl hover:shadow-purple-600/40"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Create Account"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  signIn("credentials", { email: "admin@eventsplatform.com", password: "password123", redirect: false }).then(r => {
                    if (!r?.error) { window.location.href = "/admin"; }
                    else toast.error("Quick login failed");
                  });
                }}
                className="flex-1 border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
              >
                <Swords className="mr-1.5 h-3.5 w-3.5" />
                Admin Login
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  signIn("credentials", { email: "john@example.com", password: "password123", redirect: false }).then(r => {
                    if (!r?.error) { window.location.href = "/my-tickets"; }
                    else toast.error("Quick login failed");
                  });
                }}
                className="flex-1 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
              >
                <UserRound className="mr-1.5 h-3.5 w-3.5" />
                Test User
              </Button>
            </div>
          </motion.div>

          <motion.p
            className="mt-6 text-center text-sm text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-purple-400 hover:text-purple-300">
              Sign In
            </Link>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
