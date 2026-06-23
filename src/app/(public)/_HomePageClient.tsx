"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  Users,
  Mic,
  Star,
  ArrowRight,
  Clock,
  Check,
  Mail,
  Send,
  Sparkles,
  Monitor,
  Globe,
  Briefcase,
  HeartHandshake,
  Lightbulb,
  FlaskConical,
  MoveRight,
  Quote,
} from "lucide-react";
import { toast } from "sonner";

// ── Text reveal animation (Travelik-inspired) ──
function AnimatedText({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const words = text.split(" ");
  return (
    <span className="inline-flex flex-wrap">
      {words.map((word, i) => (
        <span key={i} className="inline-flex overflow-hidden">
          <motion.span
            className={className}
            initial={{ y: "100%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94], delay: delay + i * 0.08 }}
          >
            {word}&nbsp;
          </motion.span>
        </span>
      ))}
    </span>
  );
}

// ── Decorative badge (Travelik-style section span) ──
function SectionBadge({ text }: { text: string }) {
  return (
    <motion.span
      className="inline-block rounded-full border border-purple-500/20 bg-purple-500/[0.08] px-4 py-1.5 text-xs font-medium tracking-wide text-purple-300"
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      {text}
    </motion.span>
  );
}

// ── Image reveal on scroll (inspired by .image-anime) ──
function RevealImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <div className="relative overflow-hidden">
      <motion.div
        className="absolute inset-0 z-10 origin-left bg-purple-600/20"
        initial={{ scaleX: 1 }}
        whileInView={{ scaleX: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      />
      <motion.img
        src={src}
        alt={alt}
        className={className}
        initial={{ opacity: 0, scale: 1.1 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.1 }}
      />
    </div>
  );
}

// ── Rotating text circle (Travelik hero video button style) ──
function RotatingCircle({ text }: { text: string }) {
  return (
    <svg viewBox="0 0 100 100" className="h-24 w-24 sm:h-28 sm:w-28">
      <defs>
        <path id="circlePath" d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="none" />
      </defs>
      <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(139,92,246,0.15)" strokeWidth="1" />
      <text className="fill-purple-400/60 text-[9px] font-semibold uppercase tracking-widest">
        <textPath href="#circlePath" startOffset="0%">
          {text}
        </textPath>
      </text>
      <circle
        cx="50"
        cy="50"
        r="16"
        fill="none"
        stroke="rgba(139,92,246,0.25)"
        strokeWidth="1"
        className="animate-spin-slow"
        style={{ animationDuration: "8s" }}
      />
      <circle
        cx="50"
        cy="50"
        r="16"
        fill="rgba(139,92,246,0.1)"
        className="animate-pulse-glow"
      >
        <animate attributeName="r" values="16;18;16" dur="3s" repeatCount="indefinite" />
      </circle>
      <motion.circle
        cx="50"
        cy="50"
        r="3"
        fill="rgba(139,92,246,0.8)"
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </svg>
  );
}

const fadeIn = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, ease: "easeOut" },
};

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" },
};

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
    <div className="flex gap-3 sm:gap-5">
      {[
        { label: "Days", value: time.days },
        { label: "Hours", value: String(time.hours).padStart(2, "0") },
        { label: "Mins", value: String(time.mins).padStart(2, "0") },
        { label: "Secs", value: String(time.secs).padStart(2, "0") },
      ].map(({ label, value }) => (
        <div key={label} className="text-center">
          <div className="relative mx-auto mb-1 flex h-14 w-14 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm sm:h-16 sm:w-16 lg:h-20 lg:w-20">
            <span className="text-xl font-bold tabular-nums text-white sm:text-2xl lg:text-3xl">
              {value}
            </span>
          </div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-500 sm:text-xs">
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}

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
    <div className="overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.01] transition-all duration-300 hover:border-white/[0.14]">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between px-6 py-5 text-left"
      >
        <span className="pr-4 text-sm font-medium text-white/90">{q}</span>
        <div
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/[0.08] text-sm text-gray-500 transition-all duration-300 ${
            open ? "border-purple-500/40 bg-purple-500/10 text-purple-400" : ""
          }`}
        >
          <span className={`transition-transform duration-300 ${open ? "rotate-45" : ""}`}>+</span>
        </div>
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
            <div className="border-t border-white/[0.05] px-6 pb-6 pt-4 text-sm leading-relaxed text-gray-400">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

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
          <Quote className="mx-auto mb-4 h-8 w-8 text-purple-500/30" />
          <div className="mb-4 flex justify-center gap-0.5">
            {Array.from({ length: items[active].rating }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <p className="text-lg italic leading-relaxed text-gray-300">
            &ldquo;{items[active].quote}&rdquo;
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${items[active].color} text-xs font-bold text-white shadow-lg`}
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
      <div className="mt-6 flex justify-center gap-2">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === active ? "w-8 bg-purple-500" : "w-1.5 bg-white/15 hover:bg-white/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

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
      <div
        className="pointer-events-none absolute -inset-1 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle 250px at ${pos.x}% ${pos.y}%, rgba(139,92,246,0.1) 0%, transparent 60%)`,
        }}
      />
      <div
        className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r ${accent} transition-all duration-500 ${hover ? "w-full" : "w-0"}`}
      />
      <div
        className={`relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br ${accent} text-lg font-bold text-white shadow-lg transition-all duration-500 group-hover:scale-110`}
        style={{
          boxShadow: hover ? `0 0 25px rgba(139,92,246,0.35)` : "0 4px 15px rgba(0,0,0,0.3)",
        }}
      >
        {initials}
      </div>
      <div className="relative mt-4">
        <h3 className="text-base font-semibold text-white">{name}</h3>
        <p className="text-sm font-medium text-purple-400">{role}</p>
        <p className="text-sm text-gray-500">{company}</p>
      </div>
    </div>
  );
}

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
      <div
        className="pointer-events-none absolute -inset-1 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle 300px at ${pos.x}% ${pos.y}%, rgba(139,92,246,0.12) 0%, transparent 60%)`,
        }}
      />
      <div
        className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r ${accent} transition-all duration-500 ${hover ? "w-full" : "w-0"}`}
      />
      <div
        className={`relative mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${accent} transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg`}
        style={{ boxShadow: hover ? "0 0 20px rgba(139,92,246,0.3)" : "none" }}
      >
        <Icon className="h-5 w-5 text-white" />
      </div>
      <h3 className="relative text-base font-semibold text-white">{title}</h3>
      <p className="relative mt-2 text-sm leading-relaxed text-gray-400">{description}</p>
    </div>
  );
}

export default function HomePageClient({
  initialContent,
}: {
  initialContent: Record<string, unknown>;
}) {
  const [content] = useState(initialContent);
  const [activeDay, setActiveDay] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const ticketScrollRef = useRef<HTMLDivElement>(null);

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
  )?.benefits ?? []) as {
    icon: string;
    title: string;
    description: string;
  }[];
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

  const dbSessions =
    (featured?.sessions as {
      day: number;
      time: string;
      title: string;
      speaker: string;
      type: string;
    }[]) ?? [];
  const schedH = {
    badge: "Schedule",
    title:
      dbSessions.length > 0
        ? "Event Schedule"
        : (content.schedule as { badge?: string; title?: string })?.title || "Schedule",
  };
  const schedDays: {
    day: string;
    date: string;
    sessions: { time: string; title: string; speaker: string; type: string }[];
  }[] =
    dbSessions.length > 0
      ? (() => {
          const m = new Map<number, typeof dbSessions>();
          dbSessions.forEach((s) => {
            if (!m.has(s.day)) m.set(s.day, []);
            m.get(s.day)!.push(s);
          });
          return [...m.entries()].map(([d, sessions]) => ({
            day: `Day ${d}`,
            date: `Oct ${d}, 2026`,
            sessions,
          }));
        })()
      : ((
          content.schedule as {
            days?: {
              day: string;
              date: string;
              sessions: { time: string; title: string; speaker: string; type: string }[];
            }[];
          }
        )?.days ?? []);
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
  const displaySponsors = dbSponsors.length ? dbSponsors : spCMS;
  const sponsorH = content.sponsors as { badge?: string; title?: string; description?: string };
  const faqs = ((content.faq as { items?: { q: string; a: string }[] })?.items ?? []) as {
    q: string;
    a: string;
  }[];
  const faqH = content.faq as { badge?: string; title?: string };
  const news = content.newsletter as Record<string, string>;
  const cta = content.cta as Record<string, string>;

  const iconMap: Record<string, React.ElementType> = {
    Lightbulb,
    FlaskConical,
    Globe,
    Monitor,
    Briefcase,
    HeartHandshake,
  };

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

  const gradients = [
    "from-purple-500 to-pink-500",
    "from-cyan-500 to-blue-500",
    "from-amber-500 to-orange-500",
    "from-emerald-500 to-teal-500",
    "from-violet-500 to-purple-500",
    "from-rose-500 to-pink-500",
  ];

  return (
    <>
      {/* HERO */}
      <section className="relative flex min-h-screen items-center overflow-hidden bg-[#080816]">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
          preload="metadata"
          onError={(e) => { (e.target as HTMLElement).style.display = "none"; }}
        >
          <source src="/videos/hero-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080816] via-transparent to-[#080816]/30" />
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('/images/grid.svg')] bg-center opacity-[0.03]" />
          <div className="absolute left-1/2 top-1/4 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600/10 blur-[120px]" />
          <div className="absolute right-0 top-1/3 h-[400px] w-[400px] rounded-full bg-cyan-600/[0.08] blur-[100px]" />
          <div className="absolute bottom-0 left-1/4 h-[300px] w-[300px] rounded-full bg-amber-500/[0.05] blur-[80px]" />
        </div>

        {/* Floating geometric shapes */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-float absolute left-[10%] top-[20%] h-4 w-4 rounded border border-purple-500/20" />
          <div className="animate-float-delayed absolute right-[15%] top-[30%] h-6 w-6 rounded-full border border-cyan-500/20" />
          <div className="animate-float absolute bottom-[25%] left-[5%] h-3 w-3 rounded-full bg-amber-500/10" />
          <div className="animate-float-delayed absolute right-[25%] top-[60%] h-5 w-5 rounded border border-purple-500/15" />
          <motion.div
            className="absolute bottom-[15%] right-[8%] hidden lg:block"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <RotatingCircle text="✦ EVENTS 2026 ✦ FUTURE OF AI ✦" />
          </motion.div>
        </div>

        <div className="container relative z-10">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <motion.div {...fadeInUp}>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/[0.08] px-4 py-1.5 text-xs font-medium tracking-wide text-purple-300"
              >
                <Sparkles className="h-3 w-3" />
                <span className="inline-flex overflow-hidden">
                  <motion.span
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="inline-block"
                  >
                    {hero?.badge || "The Future of Intelligence"}
                  </motion.span>
                </span>
              </motion.div>
              <h1 className="overflow-hidden text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
                <AnimatedText text={hero?.title || "AI Summit"} delay={0.4} />
                <span className="inline-block overflow-hidden">
                  <motion.span
                    className="inline-block bg-gradient-to-r from-purple-300 via-amber-300 to-purple-300 bg-clip-text text-transparent"
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.7 }}
                  >
                    {hero?.year || "2026"}
                  </motion.span>
                </span>
              </h1>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-gray-400">
                {hero?.description ||
                  "Join thought leaders, developers, and researchers exploring how AI is reshaping industries, creativity, and the future of work."}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-5 text-sm text-gray-500">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-amber-400" />
                  {hero?.date || "October 1–5, 2026"}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-amber-400" />
                  {hero?.location || "San Francisco, CA"}
                </span>
              </div>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href={hero?.ctaLink || "/events"}>
                  <Button
                    size="lg"
                    className="gap-2 bg-gradient-to-r from-purple-600 to-amber-600 px-6 text-white shadow-lg shadow-purple-600/25 hover:shadow-xl hover:shadow-purple-600/30"
                  >
                    {hero?.ctaText || "Get Tickets"}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <a href={hero?.secondaryCtaLink || "#schedule"}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/[0.12] px-6 text-white hover:bg-white/[0.06]"
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
                    className="group relative overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.02] p-5 text-center backdrop-blur-sm transition-all duration-300 hover:border-purple-500/20 hover:bg-white/[0.05]"
                  >
                    <div className="absolute -right-6 -top-6 h-12 w-12 rounded-full bg-purple-500/5 blur-xl transition-all duration-500 group-hover:bg-purple-500/15" />
                    <div className="relative text-2xl font-bold text-white sm:text-3xl">
                      {s.value}
                    </div>
                    <div className="relative mt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#080816] to-transparent" />
        <motion.div
          className="absolute bottom-6 left-0 right-0 z-20 px-4 sm:bottom-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.02] px-5 py-5 backdrop-blur-xl sm:flex-row sm:justify-between sm:px-8 sm:py-5">
            <div className="shrink-0 text-center sm:text-left">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-amber-400 sm:text-sm">
                {hero?.hurryText || "Hurry Up!"}
              </p>
              <p className="text-xs text-gray-500 sm:text-sm">
                {hero?.hurrySubtext || "Book Your Seat Now"}
              </p>
            </div>
            <CountdownTimer target={hero?.countdownTarget} />
            <div className="hidden items-center gap-2 sm:flex sm:gap-3">
              <MapPin className="h-4 w-4 shrink-0 text-amber-400 sm:h-5 sm:w-5" />
              <p className="max-w-[180px] text-xs leading-relaxed text-gray-500 sm:text-sm">
                {hero?.venueAddress || "121 AI Blvd, San Francisco, CA 94107"}
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* MARQUEE BANDS */}
      <section className="overflow-hidden bg-[#080816]">
        <div className="relative bg-gradient-to-r from-purple-800/50 via-purple-600/40 to-purple-800/50 py-5">
          <div className="animate-marquee flex whitespace-nowrap text-3xl font-bold uppercase tracking-[0.08em] text-white/80 sm:text-4xl lg:text-5xl">
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
                <span key={`a-${setIdx}-${i}`} className="mx-6 flex items-center gap-6">
                  {t}
                  <span className="text-purple-400/30">✦</span>
                </span>
              ))
            )}
          </div>
        </div>
        <div className="relative -mt-4 origin-left rotate-[-0.5deg] bg-gradient-to-r from-amber-800/40 via-amber-600/30 to-amber-800/40 py-5">
          <div className="animate-marquee-reverse flex whitespace-nowrap text-3xl font-bold uppercase tracking-[0.08em] text-white/70 sm:text-4xl lg:text-5xl">
            {[...Array(4)].flatMap((_, setIdx) =>
              qMarquee.map((t, i) => (
                <span key={`b-${setIdx}-${i}`} className="mx-6 flex items-center gap-6">
                  {t}
                  <span className="text-amber-400/30">✦</span>
                </span>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="bg-[#080816] py-24 sm:py-32">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center" {...fadeIn}>
            <SectionBadge text={about?.badge || "About the Event"} />
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              {about?.title || "A Global Gathering of AI Innovators"}
            </h2>
            <p className="mt-4 leading-relaxed text-gray-400">
              {about?.description ||
                "Join thought leaders, developers, researchers, and founders exploring how AI is reshaping industries, creativity, and the future of work."}
            </p>
          </div>
        </div>
      </section>

      {/* WHY ATTEND */}
      <section className="bg-[#080816] pb-24 sm:pb-32">
        <div className="container">
          <motion.div className="mx-auto max-w-2xl text-center" {...fadeIn}>
            <SectionBadge text={why?.badge || "Why Attend"} />
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {why?.title || "What You&apos;ll Gain"}
            </h2>
            <p className="mt-3 text-gray-400">
              {why?.description ||
                "Hear from global AI pioneers and bold thinkers shaping the future."}
            </p>
          </motion.div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b, idx) => {
              const Icon = iconMap[b.icon] || Lightbulb;
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

      {/* TESTIMONIALS */}
      <section className="relative border-y border-white/[0.05] bg-[#080816] py-24 sm:py-32">
        <div className="absolute inset-0 bg-[url('/images/grid.svg')] bg-center opacity-[0.02]" />
        <div className="container relative">
          <motion.div className="mx-auto max-w-2xl text-center" {...fadeIn}>
            <SectionBadge text="Testimonials" />
            <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
              What People Are Saying
            </h2>
          </motion.div>
          <div className="mt-10" {...fadeIn}>
            <TestimonialCarousel items={testimonials} />
          </div>
        </div>
      </section>

      {/* SPEAKERS */}
      <section id="speakers" className="bg-[#080816] py-24 sm:py-32">
        <div className="container">
          <motion.div className="mx-auto max-w-2xl text-center" {...fadeIn}>
            <SectionBadge text={speakerH?.badge || "Speakers"} />
            <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
              {speakerH?.title || "Meet the Visionaries"}
            </h2>
            <p className="mt-3 text-gray-400">
              {speakerH?.description ||
                "World-class speakers sharing insights on AI and machine learning."}
            </p>
          </motion.div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {speakers.map((s, idx) => (
              <SpeakerCard
                key={s.name}
                name={s.name}
                role={s.role}
                company={s.company}
                initials={s.initials}
                accent={s.color || gradients[idx % gradients.length]}
              />
            ))}
          </div>
        </div>
      </section>

      {/* SCHEDULE */}
      {schedDays.length > 0 && (
        <section id="schedule" className="border-y border-white/[0.05] bg-[#080816] py-24 sm:py-32">
          <div className="container">
            <motion.div className="mx-auto max-w-2xl text-center" {...fadeIn}>
              <SectionBadge text={schedH?.badge || "Schedule"} />
              <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
                {schedH?.title || "Event Schedule"}
              </h2>
            </motion.div>
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {schedDays.map((d, i) => (
                <button
                  key={i}
                  onClick={() => setActiveDay(i)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    activeDay === i
                      ? "bg-gradient-to-r from-purple-600 to-amber-600 text-white shadow-lg shadow-purple-600/20"
                      : "border border-white/[0.08] text-gray-400 hover:bg-white/5 hover:text-gray-200"
                  }`}
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
                      <Clock className="h-4 w-4 shrink-0 text-amber-400" />
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

      {/* TICKETS */}
      <section id="tickets" className="bg-[#080816] py-24 sm:py-32">
        <div className="container">
          <motion.div className="mx-auto max-w-2xl text-center" {...fadeIn}>
            <SectionBadge text={ticketH?.badge || "Ticket Options"} />
            <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
              {ticketH?.title || "Choose Your Pass"}
            </h2>
            <p className="mt-3 text-gray-400">
              {ticketH?.description ||
                "Select the perfect ticket and gain access to exclusive sessions."}
            </p>
          </motion.div>
          <div className="relative mt-12">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-[#080816] to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-[#080816] to-transparent" />
            <div
              ref={ticketScrollRef}
              className="flex gap-5 overflow-hidden"
              style={{ scrollbarWidth: "none" }}
            >
              {[...displayTickets, ...displayTickets].map((t, i) => (
                <motion.div
                  key={`${t.name}-${i}`}
                  className={`flex w-[280px] shrink-0 flex-col rounded-2xl border sm:w-[300px] ${
                    t.highlighted
                      ? "border-purple-500/40 bg-gradient-to-b from-purple-900/20 to-[#080816] shadow-lg shadow-purple-500/10"
                      : "border-white/[0.08] bg-white/[0.02] opacity-70 transition-all duration-300 hover:opacity-100"
                  }`}
                  whileHover={{ y: -4 }}
                >
                  <div className="relative flex items-center justify-between px-5 pt-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-amber-600 text-xs font-bold text-white shadow-lg">
                        E
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-white">AI SUMMIT</p>
                        <p className="text-[9px] uppercase tracking-wider text-gray-500">2026</p>
                      </div>
                    </div>
                    <svg className="h-10 w-20" viewBox="0 0 80 40">
                      {Array.from({ length: 16 }).map((_, j) => (
                        <rect
                          key={j}
                          x={j * 5}
                          y={0}
                          width="2"
                          height={40}
                          rx="1"
                          fill="rgba(255,255,255,0.08)"
                        />
                      ))}
                    </svg>
                  </div>
                  <div className="flex flex-1 flex-col p-5 pt-3">
                    <div className="mb-3 h-0.5 w-12 rounded-full bg-gradient-to-r from-purple-500 to-amber-500" />
                    <div className="flex items-end justify-between">
                      <h3 className="text-base font-bold text-white">{t.name}</h3>
                      <div className="flex items-baseline gap-0.5">
                        <span className="text-[10px] text-gray-500">₹</span>
                        <span className="text-2xl font-bold text-white">{t.price}</span>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2 rounded-lg border border-white/[0.05] bg-white/[0.01] px-3 py-2 text-[11px] text-gray-500">
                      <Calendar className="h-3 w-3 shrink-0 text-amber-400" />
                      October 1 to 5 · 10:00 AM
                    </div>
                    <div className="my-4 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
                    <ul className="space-y-2">
                      {t.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-xs text-gray-400">
                          <Check className="mt-0.5 h-3 w-3 shrink-0 text-emerald-400" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Link href="/events" className="mt-auto block pt-4">
                      <Button
                        className={`w-full text-sm ${
                          t.highlighted
                            ? "bg-gradient-to-r from-purple-600 to-amber-600 text-white shadow-lg shadow-purple-600/20"
                            : "border border-white/[0.08] bg-white/5 text-white hover:bg-white/10"
                        }`}
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

      {/* SPONSORS */}
      <section id="sponsors" className="border-y border-white/[0.05] bg-[#080816] py-24 sm:py-32">
        <div className="container">
          <motion.div className="mx-auto max-w-2xl text-center" {...fadeIn}>
            <SectionBadge text={sponsorH?.badge || "Sponsors"} />
            <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
              {sponsorH?.title || "Our Partners"}
            </h2>
            <p className="mt-3 text-gray-400">
              {sponsorH?.description || "Leading organizations powering the future of innovation."}
            </p>
          </motion.div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {displaySponsors.slice(0, 8).map((s) => (
              <div
                key={s.name}
                className="group flex flex-col items-center rounded-xl border border-white/[0.07] bg-white/[0.02] p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.15] hover:shadow-lg hover:shadow-purple-500/5"
              >
                {s.logoUrl ? (
                  <img
                    src={String(s.logoUrl)}
                    alt={s.name}
                    className="h-12 w-auto object-contain opacity-70 transition-all duration-300 group-hover:scale-110 group-hover:opacity-100"
                  />
                ) : (
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-xl text-lg font-bold text-white shadow-lg transition-all duration-300 group-hover:scale-110"
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

      {/* VENUE */}
      {featured && (
        <section className="bg-[#080816] py-24 sm:py-32">
          <div className="container">
            <motion.div className="mx-auto max-w-3xl text-center" {...fadeIn}>
              <SectionBadge text="Event Location" />
              <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">Location & Venue</h2>
              <p className="mt-3 text-gray-400">Join us in the heart of innovation.</p>
            </motion.div>
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
                {
                  icon: Mic,
                  label: "Event",
                  value: String(featured.category || "Technology"),
                },
              ].map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="group rounded-xl border border-white/[0.07] bg-white/[0.02] p-6 text-center backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.12] hover:shadow-lg"
                >
                  <Icon className="mx-auto h-6 w-6 text-amber-400 transition-all duration-300 group-hover:scale-110" />
                  <h4 className="mt-3 text-xs font-semibold uppercase tracking-[0.1em] text-gray-500">
                    {label}
                  </h4>
                  <p className="mt-1.5 text-sm text-white">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section id="faq" className="border-y border-white/[0.05] bg-[#080816] py-24 sm:py-32">
        <div className="container">
          <motion.div className="mx-auto max-w-2xl text-center" {...fadeIn}>
            <SectionBadge text={faqH?.badge || "FAQ"} />
            <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
              {faqH?.title || "Everything You Need to Know"}
            </h2>
          </motion.div>
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

      {/* NEWSLETTER */}
      <section className="relative bg-[#080816] py-24 sm:py-32">
        <div className="absolute inset-0 bg-[url('/images/grid.svg')] bg-center opacity-[0.02]" />
        <div className="container relative">
          <motion.div className="mx-auto max-w-lg text-center" {...fadeIn}>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-amber-600 shadow-lg shadow-purple-600/20">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-white sm:text-3xl">
              {news?.title || "Stay in the Loop"}
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              {news?.description || "Get the latest event updates delivered to your inbox."}
            </p>
          </motion.div>
          <form
            className="mx-auto mt-8 max-w-md space-y-3"
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
                } else {
                  toast.error(d.error || "Failed");
                }
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
                className="flex-1 rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none placeholder:text-gray-500 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20"
              />
              <Button
                type="submit"
                className="gap-2 bg-gradient-to-r from-purple-600 to-amber-600 text-white shadow-lg shadow-purple-600/20"
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

      {/* CTA */}
      <section className="bg-[#080816] pb-24 sm:pb-32">
        <div className="container">
          <motion.div
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-700 via-purple-800 to-amber-800 p-10 text-center text-white sm:p-16"
            {...fadeIn}
          >
            <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-white/[0.06] blur-3xl" />
            <div className="absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-white/[0.06] blur-3xl" />
            <div className="absolute left-1/2 top-1/2 h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/10 blur-[100px]" />
            <h2 className="relative text-2xl font-bold sm:text-3xl lg:text-4xl">
              {cta?.title || "Ready to Join the Future?"}
            </h2>
            <p className="relative mt-2 text-white/70">
              {cta?.description || "Book your seat now and be part of something extraordinary."}
            </p>
            <Link href={cta?.buttonLink || "/events"} className="relative mt-6 inline-block">
              <Button
                size="lg"
                className="bg-white px-8 text-purple-800 shadow-xl hover:bg-gray-100"
              >
                {cta?.buttonText || "Get Your Tickets Now"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
