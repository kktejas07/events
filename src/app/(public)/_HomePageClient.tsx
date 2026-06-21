"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  MapPin,
  Users,
  Mic,
  Star,
  ArrowRight,
  ChevronRight,
  Clock,
  Check,
  ChevronDown,
  Quote,
  Sparkles,
  Monitor,
  Globe,
  Briefcase,
  HeartHandshake,
  Lightbulb,
  FlaskConical,
  MoveRight,
  Mail,
  Send,
} from "lucide-react";
import { defaultContent } from "@/lib/landing-defaults";
import { toast } from "sonner";
import { BarcodeBars } from "@/components/ui/barcode-bars";

// ──────────────────────────────────────────────
// Animation presets
// ──────────────────────────────────────────────
const fadeIn = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, ease: "easeOut" },
};

// ──────────────────────────────────────────────
// Countdown Timer
// ──────────────────────────────────────────────
function CountdownTimer({ target }: { target?: string }) {
  const [time, setTime] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    const end = target ? new Date(target).getTime() : new Date("2026-10-01T09:00:00").getTime();
    const tick = () => {
      const diff = Math.max(0, end - Date.now());
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins: Math.floor((diff % 3600000) / 60000),
        secs: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  return (
    <div className="flex gap-2 text-center">
      {[
        { l: "Days", v: time.days },
        { l: "Hours", v: String(time.hours).padStart(2, "0") },
        { l: "Mins", v: String(time.mins).padStart(2, "0") },
        { l: "Secs", v: String(time.secs).padStart(2, "0") },
      ].map(({ l, v }) => (
        <div key={l} className="min-w-[52px]">
          <div className="text-lg font-bold tabular-nums text-white sm:text-xl">{v}</div>
          <div className="text-[9px] font-medium uppercase tracking-widest text-gray-500">{l}</div>
        </div>
      ))}
    </div>
  );
}

// ──────────────────────────────────────────────
// FAQ Accordion Item
// ──────────────────────────────────────────────
function FAQItem({
  q,
  a,
  open,
  onToggle,
}: {
  q: string;
  a: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.02] transition-colors hover:border-white/[0.15]">
      <button onClick={onToggle} className="flex w-full items-center justify-between p-5 text-left">
        <span className="pr-4 text-sm font-medium text-white">{q}</span>
        <span
          className={`shrink-0 text-lg text-gray-500 transition-transform duration-300 ${open ? "rotate-45" : ""}`}
        >
          +
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/[0.06] px-5 pb-5 pt-3 text-sm leading-relaxed text-gray-400">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ──────────────────────────────────────────────
// Testimonial Carousel
// ──────────────────────────────────────────────
function TestimonialCarousel({
  items,
}: {
  items: {
    quote: string;
    name: string;
    role: string;
    initials: string;
    color: string;
    rating: number;
  }[];
}) {
  const [active, setActive] = useState(0);
  const [pause, setPause] = useState(false);

  useEffect(() => {
    if (pause || !items.length) return;
    const id = setInterval(() => setActive((p) => (p + 1) % items.length), 5000);
    return () => clearInterval(id);
  }, [pause, items.length]);

  if (!items.length) return null;

  return (
    <div
      className="mx-auto max-w-2xl"
      onMouseEnter={() => setPause(true)}
      onMouseLeave={() => setPause(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <div className="mb-4 flex justify-center gap-0.5">
            {Array.from({ length: items[active].rating }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <p className="text-lg italic leading-relaxed text-gray-300">
            &ldquo;{items[active].quote}&rdquo;
          </p>
          <div className="mt-5 flex items-center justify-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${items[active].color} text-xs font-bold text-white`}
            >
              {items[active].initials}
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-white">{items[active].name}</p>
              <p className="text-xs text-gray-500">{items[active].role}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="mt-5 flex justify-center gap-2">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`h-1.5 rounded-full transition-all ${i === active ? "w-7 bg-purple-500" : "w-1.5 bg-white/20 hover:bg-white/40"}`}
          />
        ))}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Professional Speaker Card with cursor glow
// ──────────────────────────────────────────────
function SpeakerCard({
  name,
  role,
  company,
  initials,
  accent,
}: {
  name: string;
  role: string;
  company: string;
  initials: string;
  accent: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [hover, setHover] = useState(false);

  const handleMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    setPos({
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMove}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        setPos({ x: 50, y: 50 });
      }}
      className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02] p-7 text-center transition-all duration-500 hover:-translate-y-1.5 hover:border-white/[0.12] hover:shadow-xl hover:shadow-purple-500/5"
    >
      {/* Cursor glow */}
      <div
        className="pointer-events-none absolute -inset-1 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle 250px at ${pos.x}% ${pos.y}%, rgba(139,92,246,0.1) 0%, transparent 60%)`,
        }}
      />
      {/* Bottom accent line */}
      <div
        className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r ${accent} transition-all duration-500 ${hover ? "w-full" : "w-0"}`}
      />
      {/* Avatar */}
      <div
        className={`relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br ${accent} text-lg font-bold text-white shadow-lg transition-all duration-500 group-hover:scale-110`}
        style={{
          boxShadow: hover ? "0 0 25px rgba(139,92,246,0.35)" : "0 4px 15px rgba(0,0,0,0.3)",
        }}
      >
        {initials}
      </div>
      <h3 className="relative mt-4 text-base font-semibold text-white">{name}</h3>
      <p className="relative text-sm font-medium text-purple-400">{role}</p>
      <p className="relative text-sm text-gray-500">{company}</p>
    </div>
  );
}

// ──────────────────────────────────────────────
// Animated Benefit Card with cursor glow
// ──────────────────────────────────────────────
function BenefitCard({
  title,
  description,
  icon: Icon,
  accent,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  accent: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [hover, setHover] = useState(false);

  const handleMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    setPos({
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMove}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        setPos({ x: 50, y: 50 });
      }}
      className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 transition-all duration-500 hover:-translate-y-1.5 hover:border-white/[0.12] hover:shadow-xl hover:shadow-purple-500/5"
    >
      {/* Cursor glow */}
      <div
        className="pointer-events-none absolute -inset-1 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle 300px at ${pos.x}% ${pos.y}%, rgba(139,92,246,0.12) 0%, transparent 60%)`,
        }}
      />
      {/* Animated border line */}
      <div
        className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r ${accent} transition-all duration-500 ${hover ? "w-full" : "w-0"}`}
      />
      {/* Icon */}
      <div
        className={`relative mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${accent} bg-opacity-20 transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg`}
        style={{ boxShadow: hover ? `0 0 20px rgba(139,92,246,0.3)` : "none" }}
      >
        <Icon className="h-5 w-5 text-white" />
      </div>
      <h3 className="relative text-base font-semibold text-white">{title}</h3>
      <p className="relative mt-2 text-sm leading-relaxed text-gray-400">{description}</p>
    </div>
  );
}

// ──────────────────────────────────────────────
// Main Page
// ──────────────────────────────────────────────
export default function HomePageClient({
  initialContent,
}: {
  initialContent: Record<string, unknown>;
}) {
  const [content] = useState(initialContent);
  const [activeDay, setActiveDay] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const ticketScrollRef = useRef<HTMLDivElement>(null);

  // ── Content extraction ──
  const hero = content.hero as Record<string, string>;
  const about = content.about as Record<string, string>;
  const why = content.whyAttend as Record<string, string>;
  const stats = (content.stats as { icon: string; value: string; label: string }[]) ?? [];
  const marquee = (content.marquee as string[]) ?? [];
  const qMarquee = ((content.quoteMarquee as { texts?: string[] })?.texts ?? [
    "Next Intelligence",
    "Future Now",
    "Empowering Innovation",
    "Smarter Tomorrow",
  ]) as string[];
  const benefits = ((
    content.whyAttend as { benefits?: { icon: string; title: string; description: string }[] }
  )?.benefits ?? []) as { icon: string; title: string; description: string }[];
  const testimonials = (content.testimonials ?? []) as {
    quote: string;
    name: string;
    role: string;
    initials: string;
    color: string;
    rating: number;
  }[];
  const speakers = ((
    content.speakers as {
      items?: { name: string; role: string; company: string; initials: string; color: string }[];
    }
  )?.items ?? []) as {
    name: string;
    role: string;
    company: string;
    initials: string;
    color: string;
  }[];
  const speakerH = content.speakers as { badge?: string; title?: string; description?: string };
  const featured = content._featuredEvent as Record<string, unknown> | undefined;

  // Schedule: prefer featured event DB sessions, fallback to CMS
  const dbSessions = (featured?.sessions as { day: number; time: string; title: string; speaker: string; type: string }[]) ?? [];
  const schedH = { badge: "Schedule", title: dbSessions.length > 0 ? "Event Schedule" : (content.schedule as { badge?: string; title?: string })?.title || "Schedule" };
  const schedDays: { day: string; date: string; sessions: { time: string; title: string; speaker: string; type: string }[] }[] = dbSessions.length > 0
    ? (() => {
        const m = new Map<number, typeof dbSessions>();
        dbSessions.forEach((s) => { if (!m.has(s.day)) m.set(s.day, []); m.get(s.day)!.push(s); });
        return [...m.entries()].map(([d, sessions]) => ({ day: `Day ${d}`, date: `Oct ${d}, 2026`, sessions }));
      })()
    : ((content.schedule as { days?: { day: string; date: string; sessions: { time: string; title: string; speaker: string; type: string }[] }[] })?.days ?? []);
  const ticketH = content.tickets as { badge?: string; title?: string; description?: string };
  const tixCMS = ((
    content.tickets as {
      tiers?: {
        name: string;
        price: number;
        features: string[];
        color: string;
        highlighted: boolean;
      }[];
    }
  )?.tiers ?? []) as {
    name: string;
    price: number;
    features: string[];
    color: string;
    highlighted: boolean;
  }[];
  const dbTix = ((content._featuredEvent as Record<string, unknown>)?.ticketTypes ?? []) as {
    name: string;
    price: number;
    perks: string[];
    color: string;
  }[];
  const displayTickets = dbTix.length
    ? dbTix.map((t, i) => ({
        name: t.name,
        price: t.price,
        features: t.perks,
        color: t.color || "from-purple-600 to-cyan-600",
        highlighted: i === 1,
      }))
    : tixCMS;
  const dbSponsors = (content._dbSponsors ?? []) as {
    name: string;
    tier: string;
    initials: string;
    color: string;
    logoUrl?: string;
  }[];
  const spCMS = ((
    content.sponsors as {
      items?: { name: string; tier: string; initials: string; color: string }[];
    }
  )?.items ?? []) as {
    name: string;
    tier: string;
    initials: string;
    color: string;
    logoUrl?: string;
  }[];
  const displaySponsors = dbSponsors.length
    ? (dbSponsors as {
        name: string;
        tier: string;
        initials: string;
        color: string;
        logoUrl?: string;
      }[])
    : spCMS;
  const sponsorH = content.sponsors as { badge?: string; title?: string; description?: string };
  const faqs = ((content.faq as { items?: { q: string; a: string }[] })?.items ?? []) as {
    q: string;
    a: string;
  }[];
  const faqH = content.faq as { badge?: string; title?: string };
  const news = content.newsletter as Record<string, string>;
  const cta = content.cta as Record<string, string>;

  // Icon map for benefits
  const iconMap: Record<string, React.ElementType> = {
    Lightbulb,
    FlaskConical,
    Globe,
    Monitor,
    Briefcase,
    HeartHandshake,
  };

  // ── Ticket auto-scroll ──
  useEffect(() => {
    const el = ticketScrollRef.current;
    if (!el || displayTickets.length < 2) return;
    const cards = [...displayTickets, ...displayTickets];
    const w = 324;
    let pos = 0;
    const max = cards.length * w;
    let raf: number;
    const anim = () => {
      pos += 0.4;
      if (pos >= max / 2) pos = 0;
      el.scrollLeft = pos;
      raf = requestAnimationFrame(anim);
    };
    raf = requestAnimationFrame(anim);
    return () => cancelAnimationFrame(raf);
  }, [displayTickets]);

  // ── Render ──
  return (
    <>
      {/* ═══════════════════════════════════════════
          HERO
          ═══════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative flex h-screen items-center overflow-hidden bg-[#0a0a1a]"
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
          preload="metadata"
        >
          <source src="/videos/hero-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1a] via-transparent to-[#0a0a1a]/30" />

        <motion.div
          className="container relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-purple-500/25 bg-purple-500/10 px-4 py-1.5 text-xs font-medium text-purple-300">
                {hero?.badge || "The Future of Intelligence"}
              </span>
              <h1 className="mt-5 text-5xl font-bold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
                {hero?.title || "AI Summit"}{" "}
                <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  {hero?.year || "2026"}
                </span>
              </h1>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-gray-400">
                {hero?.description ||
                  "Join thought leaders, developers, and researchers exploring how AI reshapes industries."}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-5 text-sm text-gray-400">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-purple-400" />
                  {hero?.date || "October 1–5, 2026"}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-purple-400" />
                  {hero?.location || "San Francisco, CA"}
                </span>
              </div>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href={hero?.ctaLink || "/events"}>
                  <Button
                    size="lg"
                    className="gap-2 bg-purple-600 px-6 text-white hover:bg-purple-700"
                  >
                    {hero?.ctaText || "Get Tickets"}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <a href={hero?.secondaryCtaLink || "#schedule"}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-gray-700 px-6 text-white hover:bg-white/10"
                  >
                    {hero?.secondaryCtaText || "View Schedule"}
                  </Button>
                </a>
              </div>
            </motion.div>
            <motion.div
              className="hidden lg:block"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div className="grid grid-cols-2 gap-3">
                {stats.slice(0, 4).map((s) => (
                  <div
                    key={s.label}
                    className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5 text-center backdrop-blur-sm transition-colors hover:border-purple-500/20 hover:bg-white/[0.06]"
                  >
                    <div className="text-2xl font-bold text-white">{s.value}</div>
                    <div className="mt-1 text-xs font-medium uppercase tracking-wider text-gray-500">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a1a] to-transparent" />
        <motion.div
          className="absolute bottom-5 left-0 right-0 z-20 hidden px-4 lg:block"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <div className="mx-auto flex max-w-3xl items-center gap-6 rounded-xl border border-white/[0.08] bg-white/[0.03] px-6 py-3 backdrop-blur-xl">
            <div className="shrink-0">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-purple-400">
                {hero?.hurryText || "Hurry Up!"}
              </p>
              <p className="text-xs text-gray-500">{hero?.hurrySubtext || "Book Your Seat Now"}</p>
            </div>
            <CountdownTimer target={hero?.countdownTarget} />
            <div className="hidden items-center gap-2 sm:flex">
              <MapPin className="h-4 w-4 shrink-0 text-purple-400" />
              <p className="text-xs text-gray-500">
                {hero?.venueAddress || "121 AI Blvd, San Francisco, CA 94107"}
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════
          MARQUEE BANDS
          ═══════════════════════════════════════════ */}
      <section className="overflow-hidden bg-[#0a0a1a]">
        <div className="relative -rotate-1 scale-105 bg-gradient-to-r from-purple-900/20 via-[#0a0a1a] to-purple-900/10 py-4">
          <div className="animate-marquee flex whitespace-nowrap text-5xl font-extrabold uppercase tracking-wider text-white/[0.07] sm:text-6xl">
            {[...Array(4)].flatMap((_, setIdx) =>
              (marquee.length
                ? marquee
                : [
                    "Next Intelligence",
                    "Future Now",
                    "Empowering Innovation",
                    "Smarter Tomorrow",
                    "Think Forward",
                    "Cognitive Shift",
                  ]
              ).map((t, i) => (
                <span key={`a-${setIdx}-${i}`} className="mx-3 flex items-center gap-3">
                  {t}
                  <span className="mx-2 text-purple-500/20">/</span>
                </span>
              ))
            )}
          </div>
        </div>
        <div className="relative -mt-5 rotate-1 scale-105 bg-gradient-to-r from-cyan-900/20 via-purple-900/10 to-cyan-900/10 py-4">
          <div className="animate-marquee-reverse flex whitespace-nowrap text-5xl font-extrabold uppercase tracking-wider text-white/[0.07] sm:text-6xl">
            {[...Array(4)].flatMap((_, setIdx) =>
              qMarquee.map((t, i) => (
                <span key={`b-${setIdx}-${i}`} className="mx-3 flex items-center gap-3">
                  {t}
                  <span className="mx-2 text-cyan-500/20">/</span>
                </span>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          ABOUT
          ═══════════════════════════════════════════ */}
      <section className="bg-[#0a0a1a] py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center" {...fadeIn}>
            <span className="inline-block rounded-full border border-purple-500/25 bg-purple-500/10 px-4 py-1 text-xs font-medium text-purple-400">
              {about?.badge || "About the Event"}
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {about?.title || "A Global Gathering of AI Innovators"}
            </h2>
            <p className="mt-4 leading-relaxed text-gray-400">
              {about?.description ||
                "Join thought leaders, developers, researchers, and founders exploring how AI is reshaping industries."}
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          WHY ATTEND
          ═══════════════════════════════════════════ */}
      <section className="bg-[#0a0a1a] pb-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center" {...fadeIn}>
            <span className="inline-block rounded-full border border-purple-500/25 bg-purple-500/10 px-4 py-1 text-xs font-medium text-purple-400">
              {why?.badge || "Why Attend"}
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {why?.title || "What You'll Gain"}
            </h2>
            <p className="mt-3 text-gray-400">
              {why?.description ||
                "Hear from global AI pioneers and bold thinkers shaping the future."}
            </p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b, idx) => {
              const Icon = iconMap[b.icon] || Lightbulb;
              const gradients = [
                "from-purple-500 to-pink-500",
                "from-cyan-500 to-blue-500",
                "from-amber-500 to-orange-500",
                "from-emerald-500 to-teal-500",
                "from-violet-500 to-purple-500",
                "from-rose-500 to-pink-500",
              ];
              const accent = gradients[idx % gradients.length];
              return (
                <BenefitCard
                  key={b.title}
                  title={b.title}
                  description={b.description}
                  icon={Icon}
                  accent={accent}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          TESTIMONIALS
          ═══════════════════════════════════════════ */}
      <section
        className="border-y border-white/[0.05] py-24"
        style={{
          backgroundImage: "url('/images/bg-testimonials.svg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container">
          <div className="mx-auto max-w-2xl text-center" {...fadeIn}>
            <span className="inline-block rounded-full border border-purple-500/25 bg-purple-500/10 px-4 py-1 text-xs font-medium text-purple-400">
              Testimonials
            </span>
            <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
              What People Are Saying
            </h2>
          </div>
          <div className="mt-10" {...fadeIn}>
            <TestimonialCarousel items={testimonials} />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SPEAKERS
          ═══════════════════════════════════════════ */}
      <section className="bg-[#0a0a1a] py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center" {...fadeIn}>
            <span className="inline-block rounded-full border border-purple-500/25 bg-purple-500/10 px-4 py-1 text-xs font-medium text-purple-400">
              {speakerH?.badge || "Speakers"}
            </span>
            <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
              {speakerH?.title || "Meet the Visionaries"}
            </h2>
            <p className="mt-3 text-gray-400">
              {speakerH?.description ||
                "World-class speakers sharing insights on AI and machine learning."}
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {speakers.map((s, idx) => {
              const accents = [
                "from-purple-500 to-pink-500",
                "from-cyan-500 to-blue-500",
                "from-amber-500 to-orange-500",
                "from-emerald-500 to-teal-500",
                "from-violet-500 to-purple-500",
                "from-rose-500 to-pink-500",
              ];
              return (
                <SpeakerCard
                  key={s.name}
                  name={s.name}
                  role={s.role}
                  company={s.company}
                  initials={s.initials}
                  accent={s.color || accents[idx % accents.length]}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SCHEDULE
          ═══════════════════════════════════════════ */}
      {schedDays.length > 0 && (
        <section id="schedule" className="border-y border-white/[0.05] bg-[#0a0a1a] py-24">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center" {...fadeIn}>
              <span className="inline-block rounded-full border border-purple-500/25 bg-purple-500/10 px-4 py-1 text-xs font-medium text-purple-400">
                {schedH?.badge || "Schedule"}
              </span>
              <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
                {schedH?.title || "Event Schedule"}
              </h2>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {schedDays.map((d, i) => (
                <button
                  key={i}
                  onClick={() => setActiveDay(i)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${activeDay === i ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20" : "border border-white/[0.08] text-gray-400 hover:bg-white/5 hover:text-gray-200"}`}
                >
                  {d.day}
                  <span className="ml-2 text-xs opacity-60">{d.date}</span>
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDay}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="mx-auto mt-8 max-w-3xl space-y-3"
              >
                {schedDays[activeDay]?.sessions.map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex flex-col gap-3 rounded-lg border border-white/[0.07] bg-white/[0.02] p-4 transition-colors hover:border-purple-500/20 sm:flex-row sm:items-center"
                  >
                    <div className="flex items-center gap-2 text-sm text-gray-400 sm:w-36">
                      <Clock className="h-4 w-4 shrink-0 text-purple-400" />
                      {s.time}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-white">{s.title}</h4>
                      <p className="text-sm text-gray-500">{s.speaker}</p>
                    </div>
                    <Badge variant="outline" className="w-fit border-purple-500/20 text-purple-400">
                      {s.type}
                    </Badge>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          TICKETS
          ═══════════════════════════════════════════ */}
      <section className="bg-[#0a0a1a] py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center" {...fadeIn}>
            <span className="inline-block rounded-full border border-purple-500/25 bg-purple-500/10 px-4 py-1 text-xs font-medium text-purple-400">
              {ticketH?.badge || "Ticket Options"}
            </span>
            <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
              {ticketH?.title || "Choose Your Pass"}
            </h2>
            <p className="mt-3 text-gray-400">
              {ticketH?.description ||
                "Select the perfect ticket and gain access to exclusive sessions."}
            </p>
          </div>
          <div className="relative mt-10">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#0a0a1a] to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#0a0a1a] to-transparent" />
            <div
              ref={ticketScrollRef}
              className="flex gap-5 overflow-hidden"
              style={{ scrollbarWidth: "none" }}
            >
              {[...displayTickets, ...displayTickets].map((t, i) => (
                <motion.div
                  key={`${t.name}-${i}`}
                  className={`flex w-[280px] shrink-0 flex-col rounded-2xl border sm:w-[300px] ${t.highlighted ? "border-purple-500/40 bg-gradient-to-b from-purple-900/20 to-[#0a0a1a] shadow-lg shadow-purple-500/10" : "border-white/[0.08] bg-white/[0.02] opacity-70 transition-all duration-300 hover:opacity-100"}`}
                  whileHover={{ y: -4 }}
                >
                  <div className="flex items-center justify-between px-5 pt-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-cyan-600 text-xs font-bold text-white">
                        E
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-white">AI SUMMIT</p>
                        <p className="text-[9px] uppercase tracking-wider text-gray-500">2026</p>
                      </div>
                    </div>
                    <BarcodeBars value={`${t.name}-${t.price}`} className="h-10" />
                  </div>
                  <div className="flex flex-1 flex-col p-5 pt-3">
                    <div
                      className={`mb-3 h-0.5 w-12 rounded-full bg-gradient-to-r ${t.color || "from-purple-600 to-cyan-600"}`}
                    />
                    <div className="flex items-end justify-between">
                      <h3 className="text-base font-bold text-white">{t.name}</h3>
                      <div className="flex items-baseline gap-0.5">
                        <span className="text-[10px] text-gray-500">$</span>
                        <span className="text-2xl font-bold text-white">{t.price}</span>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2 rounded-lg border border-white/[0.05] bg-white/[0.01] px-3 py-2 text-[11px] text-gray-500">
                      <Calendar className="h-3 w-3 shrink-0 text-purple-400" />
                      October 1 to 5 · 10:00 AM
                    </div>
                    <div className="my-4 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
                    <ul className="space-y-2">
                      {t.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-xs text-gray-400">
                          <Check className="mt-0.5 h-3 w-3 shrink-0 text-purple-400" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Link href="/events" className="mt-auto block pt-4">
                      <Button
                        className={`w-full text-sm ${t.highlighted ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg shadow-purple-600/20" : "border border-white/[0.08] bg-white/5 text-white hover:bg-white/10"}`}
                      >
                        Buy Ticket
                        <MoveRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SPONSORS
          ═══════════════════════════════════════════ */}
      <section
        className="border-y border-white/[0.05] py-24"
        style={{
          backgroundImage: "url('/images/bg-sponsors.svg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container">
          <div className="mx-auto max-w-2xl text-center" {...fadeIn}>
            <span className="inline-block rounded-full border border-purple-500/25 bg-purple-500/10 px-4 py-1 text-xs font-medium text-purple-400">
              {sponsorH?.badge || "Sponsors"}
            </span>
            <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
              {sponsorH?.title || "Our Partners"}
            </h2>
            <p className="mt-3 text-gray-400">
              {sponsorH?.description || "Leading organizations powering the future of innovation."}
            </p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {displaySponsors.slice(0, 8).map((s) => (
              <div
                key={s.name}
                className="group flex flex-col items-center rounded-xl border border-white/[0.07] bg-white/[0.02] p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.15]"
              >
                {s.logoUrl ? (
                  <img
                    src={String(s.logoUrl)}
                    alt={s.name}
                    className="h-12 w-auto object-contain opacity-80 transition-opacity group-hover:opacity-100"
                  />
                ) : (
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-xl text-lg font-bold text-white shadow-lg"
                    style={{ background: `linear-gradient(135deg, ${s.color}, ${s.color}88)` }}
                  >
                    {s.initials}
                  </div>
                )}
                <h3 className="mt-3 text-sm font-semibold text-white">{s.name}</h3>
                <span
                  className="mt-1.5 inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                  style={{
                    borderColor: `${s.color}40`,
                    color: s.color,
                    background: `${s.color}15`,
                  }}
                >
                  {s.tier}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          VENUE
          ═══════════════════════════════════════════ */}
      {featured && (
        <section className="bg-[#0a0a1a] py-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center" {...fadeIn}>
              <span className="inline-block rounded-full border border-purple-500/25 bg-purple-500/10 px-4 py-1 text-xs font-medium text-purple-400">
                Event Location
              </span>
              <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">Location & Venue</h2>
              <p className="mt-3 text-gray-400">Join us in the heart of innovation.</p>
            </div>
            <div className="mx-auto mt-10 grid max-w-3xl gap-5 sm:grid-cols-3">
              {[
                {
                  icon: MapPin,
                  label: "Address",
                  value: String(
                    featured.venueAddress ||
                      `${featured.venueCity || ""}, ${featured.venueCountry || ""}`
                  ),
                },
                {
                  icon: Calendar,
                  label: "Date",
                  value: featured.startDate
                    ? new Date(String(featured.startDate)).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "TBA",
                },
                { icon: Mic, label: "Event", value: String(featured.category || "Technology") },
              ].map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-6 text-center backdrop-blur-sm"
                >
                  <Icon className="mx-auto h-7 w-7 text-purple-400" />
                  <h4 className="mt-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    {label}
                  </h4>
                  <p className="mt-1.5 text-sm text-white">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          FAQ
          ═══════════════════════════════════════════ */}
      <section className="border-y border-white/[0.05] bg-[#0a0a1a] py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center" {...fadeIn}>
            <span className="inline-block rounded-full border border-purple-500/25 bg-purple-500/10 px-4 py-1 text-xs font-medium text-purple-400">
              {faqH?.badge || "FAQ"}
            </span>
            <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
              {faqH?.title || "Everything You Need to Know"}
            </h2>
          </div>
          <div className="mx-auto mt-10 max-w-2xl space-y-3">
            {faqs.map((f, i) => (
              <FAQItem
                key={i}
                q={f.q}
                a={f.a}
                open={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          NEWSLETTER
          ═══════════════════════════════════════════ */}
      <section
        className="py-24"
        style={{
          backgroundImage: "url('/images/bg-newsletter.svg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container">
          <div className="mx-auto max-w-lg text-center" {...fadeIn}>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-cyan-600">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-white sm:text-3xl">
              {news?.title || "Stay in the Loop"}
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              {news?.description || "Get the latest event updates delivered to your inbox."}
            </p>
          </div>
          <form
            className="mx-auto mt-6 max-w-md space-y-3"
            onSubmit={async (e) => {
              e.preventDefault();
              const email = (e.currentTarget.elements.namedItem("email") as HTMLInputElement)
                ?.value;
              try {
                const r = await fetch("/api/newsletter/subscribe", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email }),
                });
                const d = await r.json();
                if (d.success) {
                  toast.success("Subscribed!");
                  (e.target as HTMLFormElement).reset();
                } else toast.error(d.error || "Failed");
              } catch {
                toast.error("Network error");
              }
            }}
          >
            <div className="flex gap-2">
              <input
                name="email"
                type="email"
                required
                placeholder={String(news?.placeholder || "Enter your email")}
                className="flex-1 rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none placeholder:text-gray-500 focus:border-purple-500/50"
              />
              <Button
                type="submit"
                className="gap-2 bg-gradient-to-r from-purple-600 to-cyan-600 text-white"
              >
                {news?.buttonText || "Subscribe"}
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <label className="flex items-start gap-2 text-xs text-gray-500">
              <input type="checkbox" required className="mt-0.5 accent-purple-500" />
              {news?.consentLabel || "I agree to receive event updates. Unsubscribe anytime."}
            </label>
          </form>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CTA
          ═══════════════════════════════════════════ */}
      <section className="bg-[#0a0a1a] pb-24">
        <div className="container">
          <div
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-purple-700 to-cyan-600 p-10 text-center text-white"
            {...fadeIn}
          >
            <div className="absolute -left-16 -top-16 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
            <h2 className="relative text-2xl font-bold sm:text-3xl">
              {cta?.title || "Ready to Join the Future?"}
            </h2>
            <p className="relative mt-2 text-white/80">
              {cta?.description || "Book your seat now and be part of something extraordinary."}
            </p>
            <Link href={cta?.buttonLink || "/events"} className="relative mt-6 inline-block">
              <Button size="lg" className="bg-white px-8 text-purple-700 hover:bg-gray-100">
                {cta?.buttonText || "Get Your Tickets Now"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
