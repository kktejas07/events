"use client";

import { useState, FormEvent } from "react";
import { toast } from "sonner";

type Props = {
  placeholder?: string;
  buttonText?: string;
  className?: string;
};

export function NewsletterForm({
  placeholder = "Your Email Address",
  buttonText = "subscribe now",
  className = "",
}: Props) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim();
    if (!email) return;

    setLoading(true);
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(json.message || "Subscribed successfully!");
        form.reset();
      } else {
        toast.error(json.error || "Subscription failed");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="form-clt">
        <input type="email" name="email" placeholder={placeholder} required disabled={loading} />
        <button type="submit" className="gt-theme-btn" disabled={loading}>
          {loading ? "..." : buttonText}
        </button>
      </div>
    </form>
  );
}
