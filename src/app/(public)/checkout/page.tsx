"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Ticket, ArrowLeft, Calendar, MapPin } from "lucide-react";
import Link from "next/link";
import Script from "next/script";

interface TicketType {
  id: string;
  name: string;
  price: number;
  currency: string;
  description: string | null;
  perks: string[];
  color: string | null;
  maxPerOrder: number;
  quantityLimit: number;
  quantitySold: number;
}

interface EventData {
  id: string;
  title: string;
  slug: string;
  startDate: string;
  venue: { name: string; city: string } | null;
  ticketTypes: TicketType[];
}

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();

  const [event, setEvent] = useState<EventData | null>(null);
  const [ticketType, setTicketType] = useState<TicketType | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [paying, setPaying] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const eventSlug = searchParams.get("event");
  const ticketId = searchParams.get("ticket");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status !== "authenticated" || !eventSlug || !ticketId) return;

    fetch(`/api/events/${eventSlug}`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.success) throw new Error(data.error);
        const ev = data.data as EventData;
        setEvent(ev);
        const tt = ev.ticketTypes.find((t) => t.id === ticketId);
        if (tt) setTicketType(tt);
        else toast.error("Ticket type not found");
      })
      .catch(() => toast.error("Failed to load event"))
      .finally(() => setLoading(false));
  }, [status, eventSlug, ticketId, router]);

  useEffect(() => {
    if (session?.user) {
      const u = session.user as { name?: string; email?: string };
      const parts = (u.name || "").split(" ");
      setForm((prev) => ({
        ...prev,
        firstName: prev.firstName || parts[0] || "",
        lastName: prev.lastName || parts.slice(1).join(" ") || "",
        email: prev.email || u.email || "",
      }));
    }
  }, [session]);

  async function handlePayment() {
    if (!event || !ticketType) return;
    setPaying(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: event.id,
          items: [{ ticketTypeId: ticketType.id, quantity }],
          attendeeDetails: {
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            phone: form.phone || undefined,
          },
        }),
      });
      const data = await res.json();
      if (!data.success) {
        toast.error(data.error || "Failed to create order");
        setPaying(false);
        return;
      }

      const options = {
        key: data.data.keyId,
        amount: data.data.amount,
        currency: data.data.currency,
        name: "Events Platform",
        description: `${ticketType.name} x ${quantity}`,
        order_id: data.data.razorpayOrderId,
        prefill: {
          name: `${form.firstName} ${form.lastName}`,
          email: form.email,
          contact: form.phone,
        },
        handler: () => {
          toast.success("Payment successful!");
          router.push("/my-tickets");
        },
        modal: {
          ondismiss: () => {
            setPaying(false);
            toast.error("Payment cancelled");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch {
      toast.error("Something went wrong");
      setPaying(false);
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a1a]">
        <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
      </div>
    );
  }

  const total = ticketType ? Number(ticketType.price) * quantity : 0;

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <div className="min-h-screen bg-[#0a0a1a]">
        <div className="container max-w-3xl py-8">
          <Link
            href={`/events/${eventSlug}`}
            className="mb-6 flex items-center gap-2 text-sm text-gray-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Event
          </Link>

          {event && (
            <div className="mb-6 rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">
              <h1 className="text-xl font-bold text-white">{event.title}</h1>
              <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-400">
                {event.startDate && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-purple-400" />
                    {new Date(event.startDate).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                )}
                {event.venue && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-purple-400" />
                    {event.venue.name}, {event.venue.city}
                  </span>
                )}
              </div>
            </div>
          )}

          {ticketType && (
            <div className="mb-6 rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-cyan-600">
                  <Ticket className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="font-semibold text-white">{ticketType.name}</h2>
                  <p className="text-sm text-gray-400">
                    ₹{Number(ticketType.price).toLocaleString()} each
                  </p>
                </div>
              </div>
              {ticketType.description && (
                <p className="mt-3 text-sm text-gray-500">{ticketType.description}</p>
              )}
              {ticketType.perks.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {ticketType.perks.map((perk) => (
                    <span
                      key={perk}
                      className="rounded-full border border-purple-500/20 bg-purple-500/10 px-2.5 py-0.5 text-xs text-purple-300"
                    >
                      {perk}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="mb-6 rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
              Attendee Details
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="text-xs text-gray-300">First Name</Label>
                <Input
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  className="border-white/10 bg-white/[0.03] text-white"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-300">Last Name</Label>
                <Input
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  className="border-white/10 bg-white/[0.03] text-white"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-300">Email</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="border-white/10 bg-white/[0.03] text-white"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-300">Phone (optional)</Label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="border-white/10 bg-white/[0.03] text-white"
                />
              </div>
            </div>
          </div>

          {ticketType && (
            <div className="mb-6 rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-xs text-gray-300">Quantity</Label>
                  <div className="mt-1 flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="h-8 w-8 border-white/10 p-0 text-white"
                    >
                      −
                    </Button>
                    <span className="w-8 text-center text-white">{quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(Math.min(ticketType.maxPerOrder, quantity + 1))}
                      className="h-8 w-8 border-white/10 p-0 text-white"
                    >
                      +
                    </Button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Total</p>
                  <p className="text-2xl font-bold text-white">₹{total.toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}

          <Button
            className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 py-6 text-lg text-white shadow-lg shadow-purple-600/30"
            disabled={paying || !ticketType || !form.firstName || !form.lastName || !form.email}
            onClick={handlePayment}
          >
            {paying ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
            Pay ₹{total.toLocaleString()}
          </Button>
        </div>
      </div>
    </>
  );
}
