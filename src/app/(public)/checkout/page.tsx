"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Script from "next/script";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, cb: (r: unknown) => void) => void;
    };
  }
}

export default function CheckoutPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = searchParams.get("eventId");
  const selectedParam = searchParams.get("selected");

  const [event, setEvent] = useState<{ id: string; title: string } | null>(null);
  const [ticketTypes, setTicketTypes] = useState<{ id: string; name: string; price: number }[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [attendee, setAttendee] = useState({ firstName: "", lastName: "", email: "", phone: "" });

  useEffect(() => {
    if (!eventId) return;
    fetch(`/api/events/${eventId}`).then((r) => r.json()).then((d) => {
      const ev = d.event || d.data || d;
      setEvent(ev);
      if (ev.ticketTypes) {
        setTicketTypes(ev.ticketTypes);
        if (selectedParam) {
          try {
            const parsed = JSON.parse(decodeURIComponent(selectedParam)) as Record<string, number>;
            setQuantities(parsed);
          } catch {
            const first = ev.ticketTypes[0];
            if (first) setQuantities({ [first.id]: 1 });
          }
        } else {
          const first = ev.ticketTypes[0];
          if (first) setQuantities({ [first.id]: 1 });
        }
      }
    });
  }, [eventId, selectedParam]);

  useEffect(() => {
    if (session?.user) {
      const u = session.user as { name?: string; email?: string };
      setAttendee((prev) => ({
        ...prev,
        firstName: u.name?.split(" ")[0] || prev.firstName,
        lastName: u.name?.split(" ").slice(1).join(" ") || prev.lastName,
        email: u.email || prev.email,
      }));
    }
  }, [session]);

  const items = ticketTypes
    .filter((t) => (quantities[t.id] || 0) > 0)
    .map((t) => ({ ticketTypeId: t.id, quantity: quantities[t.id] || 0 }));

  const total = ticketTypes.reduce(
    (sum, t) => sum + (quantities[t.id] || 0) * Number(t.price),
    0
  );

  async function handleCheckout() {
    if (!session) { router.push("/login"); return; }
    if (!attendee.firstName || !attendee.lastName || !attendee.email) {
      setError("Please fill in your name and email.");
      return;
    }
    if (items.length === 0) {
      setError("No tickets selected.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          items,
          attendeeDetails: {
            firstName: attendee.firstName,
            lastName: attendee.lastName,
            email: attendee.email,
            phone: attendee.phone || undefined,
          },
        }),
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.error || "Something went wrong.");
        setLoading(false);
        return;
      }
      const d = json.data;
      if (d.razorpayOrderId) {
        if (typeof window.Razorpay === "undefined") {
          setError("Payment gateway failed to load. Please refresh and try again.");
          setLoading(false);
          return;
        }
        const rzp = new window.Razorpay({
          key: d.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
          amount: d.amount,
          currency: d.currency || "INR",
          order_id: d.razorpayOrderId,
          name: event?.title || "Event",
          prefill: { email: attendee.email },
          handler: () => { router.push("/my-tickets"); },
        });
        rzp.open();
      } else {
        setError("Payment could not be initiated. Check Razorpay configuration in admin settings.");
      }
    } catch (e) {
      console.error(e);
      setError("Network error. Please try again.");
    }
    setLoading(false);
  }

  if (!event) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <div className="text-center">
          <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: "32px", color: "#8B5CF6" }}></i>
        </div>
      </div>
    );
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
      <div className="container py-5" style={{ maxWidth: "800px" }}>
      <div style={{ background: "#fff", borderRadius: "20px", padding: "40px", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
        <Link href={`/events/${eventId}`} className="d-inline-flex align-items-center gap-2 mb-4" style={{ color: "#8B5CF6", textDecoration: "none", fontSize: "14px" }}>
          <i className="fa-regular fa-arrow-left"></i> Back to Event
        </Link>

        <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#1a1a2e", marginBottom: "24px" }}>Checkout</h2>

        {error && (
          <div className="alert alert-danger py-2" role="alert" style={{ fontSize: "14px" }}>{error}</div>
        )}

        <div style={{ background: "#f8f9fe", borderRadius: "12px", padding: "20px", marginBottom: "24px" }}>
          <h5 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "12px" }}>{event.title}</h5>
          {items.length === 0 && <p style={{ color: "#888", fontSize: "14px" }}>No tickets selected</p>}
          {items.map((item) => {
            const tt = ticketTypes.find((t) => t.id === item.ticketTypeId);
            if (!tt) return null;
            return (
              <div key={item.ticketTypeId} className="d-flex justify-content-between align-items-center py-2 border-bottom border-light">
                <div>
                  <p style={{ margin: 0, fontWeight: 500 }}>{tt.name} Ticket</p>
                  <p style={{ margin: "4px 0 0", color: "#888", fontSize: "13px" }}>₹{Number(tt.price).toLocaleString()} each</p>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <button onClick={() => setQuantities((prev) => ({ ...prev, [item.ticketTypeId]: Math.max(1, (prev[item.ticketTypeId] || 1) - 1) }))} className="gt-admin-btn gt-admin-btn-outline gt-admin-btn-sm" style={{ width: "32px", height: "32px", padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>-</button>
                  <span style={{ fontWeight: 600, fontSize: "16px", minWidth: "24px", textAlign: "center" }}>{item.quantity}</span>
                  <button onClick={() => setQuantities((prev) => ({ ...prev, [item.ticketTypeId]: (prev[item.ticketTypeId] || 1) + 1 }))} className="gt-admin-btn gt-admin-btn-outline gt-admin-btn-sm" style={{ width: "32px", height: "32px", padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ background: "#f8f9fe", borderRadius: "12px", padding: "20px", marginBottom: "24px" }}>
          <h5 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "16px" }}>Attendee Details</h5>
          <div className="row g-3">
            <div className="col-6">
              <input type="text" className="form-control" placeholder="First Name *" value={attendee.firstName} onChange={(e) => setAttendee({ ...attendee, firstName: e.target.value })} />
            </div>
            <div className="col-6">
              <input type="text" className="form-control" placeholder="Last Name *" value={attendee.lastName} onChange={(e) => setAttendee({ ...attendee, lastName: e.target.value })} />
            </div>
            <div className="col-6">
              <input type="email" className="form-control" placeholder="Email *" value={attendee.email} onChange={(e) => setAttendee({ ...attendee, email: e.target.value })} />
            </div>
            <div className="col-6">
              <input type="tel" className="form-control" placeholder="Phone (optional)" value={attendee.phone} onChange={(e) => setAttendee({ ...attendee, phone: e.target.value })} />
            </div>
          </div>
        </div>

        {items.map((item) => {
          const tt = ticketTypes.find((t) => t.id === item.ticketTypeId);
          if (!tt) return null;
          return (
            <div key={item.ticketTypeId} className="d-flex justify-content-between align-items-center mb-1">
              <span style={{ fontSize: "14px", color: "#888" }}>{tt.name} x{item.quantity}</span>
              <span style={{ fontWeight: 500 }}>₹{(item.quantity * Number(tt.price)).toLocaleString("en-IN")}</span>
            </div>
          );
        })}
        <hr />
        <div className="d-flex justify-content-between align-items-center mb-4">
          <span style={{ fontSize: "18px", fontWeight: 700 }}>Total</span>
          <span style={{ fontSize: "24px", fontWeight: 700, color: "#8B5CF6" }}>₹{total.toLocaleString("en-IN")}</span>
        </div>

        <button onClick={handleCheckout} disabled={loading || items.length === 0} className="gt-admin-btn gt-admin-btn-primary w-100" style={{ fontSize: "16px", padding: "14px" }}>
          {loading ? <><i className="fa-solid fa-spinner fa-spin me-2"></i> Processing...</> : <><i className="fa-regular fa-credit-card me-2"></i> Pay ₹{total.toLocaleString("en-IN")}</>}
        </button>
      </div>
    </div>
    </>
  );
}