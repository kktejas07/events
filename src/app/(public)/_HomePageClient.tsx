"use client";

import Link from "next/link";
import { BarcodeBars } from "@/components/ui/barcode-bars";
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
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.08 } },
  viewport: { once: true, margin: "-80px" },
};

const staggerItem = {
  initial: { opacity: 0, y: 50 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.85 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

function TestimonialCarousel({
  testimonials,
}: {
  testimonials: {
    quote: string;
    name: string;
    role: string;
    initials: string;
    color: string;
    rating: number;
  }[];
}) {
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || !testimonials.length) return;
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(id);
  }, [isPaused, testimonials.length]);

  if (!testimonials.length) return null;

  return (
    <div
      className="relative mx-auto max-w-3xl"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <div className="mb-6 flex justify-center">
            {Array.from({ length: testimonials[active].rating }).map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <Quote className="mx-auto mb-4 h-8 w-8 text-purple-400/40" />
          <p className="text-xl italic leading-relaxed text-gray-300">
            &ldquo;{testimonials[active].quote}&rdquo;
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${testimonials[active].color} text-sm font-bold text-white shadow-lg`}
            >
              {testimonials[active].initials}
            </div>
            <div className="text-left">
              <p className="font-semibold text-white">{testimonials[active].name}</p>
              <p className="text-sm text-gray-500">{testimonials[active].role}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="mt-6 flex justify-center gap-2">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`h-2 rounded-full transition-all duration-300 ${i === active ? "w-8 bg-purple-500" : "w-2 bg-white/20 hover:bg-white/40"}`}
          />
        ))}
      </div>
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
    <div className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.03] transition-all duration-300 hover:border-purple-500/30">
      <button onClick={onToggle} className="flex w-full items-center justify-between p-5 text-left">
        <span className="font-medium text-white">{q}</span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-gray-400 transition-transform duration-300 ${open ? "rotate-180 text-purple-400" : ""}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/10 px-5 pb-5 pt-3 text-sm leading-relaxed text-gray-400">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CountdownTimer({ target: targetDate }: { target?: string }) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = targetDate ? new Date(targetDate) : new Date("2026-10-01T09:00:00");
    const tick = () => {
      const diff = Math.max(0, target.getTime() - Date.now());
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="flex gap-3 text-center">
      {[
        { label: "Days", value: time.days },
        { label: "Hours", value: pad(time.hours) },
        { label: "Mins", value: pad(time.minutes) },
        { label: "Secs", value: pad(time.seconds) },
      ].map(({ label, value }) => (
        <div key={label} className="min-w-[60px]">
          <div className="text-2xl font-bold text-white">{value}</div>
          <div className="mt-0.5 text-[10px] uppercase tracking-widest text-gray-500">{label}</div>
        </div>
      ))}
    </div>
  );
}

export default function HomePageClient({
  initialContent,
}: {
  initialContent: Record<string, unknown>;
}) {
  const [content, setContent] = useState<Record<string, unknown>>(initialContent);
  const [activeDay, setActiveDay] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const hero = content.hero as Record<string, string>;
  const benefitsFromContent =
    (
      content.whyAttend as {
        benefits?: Array<{ icon: string; title: string; description: string }>;
      }
    )?.benefits ?? [];
  const statsFromContent =
    (content.stats as Array<{ icon: string; value: string; label: string }>) ?? [];
  const speakersFromContent =
    (
      content.speakers as {
        badge?: string;
        title?: string;
        description?: string;
        items?: Array<{
          name: string;
          role: string;
          company: string;
          initials: string;
          color: string;
        }>;
      }
    )?.items ?? [];
  const scheduleFromContent =
    (
      content.schedule as {
        badge?: string;
        title?: string;
        days?: Array<{
          day: string;
          date: string;
          sessions: Array<{ time: string; title: string; speaker: string; type: string }>;
        }>;
      }
    )?.days ?? [];
  const ticketsFromContent =
    (
      content.tickets as {
        badge?: string;
        title?: string;
        description?: string;
        tiers?: Array<{
          name: string;
          price: number;
          features: string[];
          color: string;
          highlighted: boolean;
        }>;
      }
    )?.tiers ?? [];
  const sponsorsFromContent =
    (
      content.sponsors as {
        badge?: string;
        title?: string;
        description?: string;
        items?: Array<{ name: string; tier: string; initials: string; color: string }>;
      }
    )?.items ?? [];
  const faqsFromContent =
    (content.faq as { badge?: string; title?: string; items?: Array<{ q: string; a: string }> })
      ?.items ?? [];
  const testimonialsFromContent =
    (content.testimonials as Array<{
      quote: string;
      name: string;
      role: string;
      initials: string;
      color: string;
      rating: number;
    }>) ?? [];
  const aboutContent = content.about as Record<string, string>;
  const whyAttendContent = content.whyAttend as Record<string, string>;
  const ticketHeader = content.tickets as { badge?: string; title?: string; description?: string };
  const sponsorHeader = content.sponsors as {
    badge?: string;
    title?: string;
    description?: string;
  };
  const faqHeader = content.faq as { badge?: string; title?: string };
  const speakerHeader = content.speakers as {
    badge?: string;
    title?: string;
    description?: string;
  };
  const scheduleHeader = content.schedule as { badge?: string; title?: string };
  const newsletterContent = content.newsletter as Record<string, string>;
  const ctaContent = content.cta as Record<string, string>;

  // Real DB data (injected by server component)
  const dbSponsors = (content._dbSponsors as Array<{
    name: string;
    tier: string;
    logoUrl: string;
    websiteUrl: string;
  }>) ?? [];
  const featuredEvent = content._featuredEvent as Record<string, unknown> | undefined;

  // Use DB sponsors for the section if available, otherwise use CMS data
  const displaySponsors =
    dbSponsors.length > 0
      ? dbSponsors.map((s) => ({
          name: s.name,
          tier: s.tier,
          initials: s.name.slice(0, 2).toUpperCase(),
          color: s.logoUrl
            ? "#6C5CE7"
            : ["#7C3AED", "#06B6D4", "#F59E0B", "#8B5CF6", "#10B981", "#EC4899"][
                s.name.length % 6
              ],
        }))
      : sponsorsFromContent;

  const marqueeTexts = (content.marquee as string[]) ?? [];
  const quoteMarqueeTexts =
    ((content.quoteMarquee as { texts?: string[] })?.texts as string[]) ?? [];

  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Lightbulb,
    FlaskConical,
    Globe,
    Monitor,
    Briefcase,
    HeartHandshake,
    Users,
    Mic,
    Calendar,
    Star,
    MapPin,
  };

  const stats = statsFromContent.map((s) => ({ ...s, Icon: iconMap[s.icon] }));
  const benefits = benefitsFromContent.map((b) => ({
    ...b,
    Icon: iconMap[b.icon as keyof typeof iconMap] || Lightbulb,
  }));

  return (
    <>
      <section
        ref={heroRef}
        className="relative -mt-16 flex h-dvh items-center justify-center overflow-hidden bg-[#0a0a1a]"
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/videos/hero-bg.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1a] via-transparent to-[#0a0a1a]/30" />

        <motion.div
          className="container relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.span
                className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-5 py-1.5 text-sm font-medium text-purple-300"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Sparkles className="h-3.5 w-3.5" />
                {hero?.badge || "The Future of Intelligence"}
              </motion.span>
              <motion.h1
                className="mt-6 text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                {hero?.title || "AI Summit"}{" "}
                <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  {hero?.year || "2026"}
                </span>
              </motion.h1>
              <motion.p
                className="mt-4 max-w-lg text-lg leading-relaxed text-gray-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                {hero?.description ||
                  "Join thought leaders, developers, and researchers as we explore how AI is reshaping industries, creativity, and the future of work."}
              </motion.p>
              <motion.div
                className="mt-6 flex flex-wrap items-center gap-4 text-gray-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-purple-400" />
                  {hero?.date || "October 1-5, 2026"}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-purple-400" />
                  {hero?.location || "San Francisco, CA"}
                </span>
              </motion.div>
              <motion.div
                className="mt-8 flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <Link href="/events">
                  <Button
                    size="lg"
                    className="group gap-2 bg-purple-600 text-white hover:bg-purple-700"
                  >
                    {hero?.ctaText || "Get Tickets"}{" "}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <a href={hero?.secondaryCtaLink || "#schedule"}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-gray-600 text-white hover:bg-white/10"
                  >
                    {hero?.secondaryCtaText || "View Schedule"}
                  </Button>
                </a>
              </motion.div>
              <motion.div
                className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
              >
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-lg border border-white/10 bg-white/5 p-3 text-center backdrop-blur-sm transition-all duration-300 hover:border-purple-500/30 hover:bg-white/10"
                  >
                    <stat.Icon className="mx-auto h-5 w-5 text-purple-400" />
                    <div className="mt-1 text-xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              className="relative hidden lg:block"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <div className="relative mx-auto aspect-square w-full max-w-lg">
                <div className="animate-float absolute inset-0 rounded-full bg-gradient-to-br from-purple-600/30 via-cyan-600/20 to-transparent blur-3xl" />
                <div className="relative flex h-full w-full items-center justify-center">
                  <div className="grid grid-cols-3 gap-3 p-8">
                    {[
                      { label: "50+", sub: "Speakers", gradient: "from-purple-500 to-pink-500" },
                      { label: "100+", sub: "Sessions", gradient: "from-cyan-500 to-blue-500" },
                      { label: "30+", sub: "Workshops", gradient: "from-amber-500 to-orange-500" },
                      { label: "5K+", sub: "Attendees", gradient: "from-emerald-500 to-teal-500" },
                      { label: "AI", sub: "Summit", gradient: "from-violet-500 to-purple-500" },
                      { label: "2026", sub: "Edition", gradient: "from-rose-500 to-pink-500" },
                    ].map((item, i) => (
                      <motion.div
                        key={item.label}
                        className="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] p-4 text-center backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-white/20"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 + i * 0.08, duration: 0.4 }}
                      >
                        <div
                          className={`bg-gradient-to-br bg-clip-text text-2xl font-extrabold text-transparent ${item.gradient}`}
                        >
                          {item.label}
                        </div>
                        <div className="mt-0.5 text-[10px] uppercase tracking-wider text-gray-500">
                          {item.sub}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a1a] to-transparent" />

        <motion.div
          className="absolute bottom-6 left-0 right-0 z-20 hidden px-4 lg:block"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.6 }}
        >
          <div className="mx-auto flex max-w-4xl items-center gap-8 rounded-xl border border-white/10 bg-white/[0.04] px-8 py-4 backdrop-blur-xl">
            <div className="shrink-0">
              <p className="text-xs font-semibold uppercase tracking-widest text-purple-400">
                {hero?.hurryText || "Hurry Up!"}
              </p>
              <p className="text-sm text-gray-400">{hero?.hurrySubtext || "Book Your Seat Now"}</p>
            </div>
            <CountdownTimer target={hero?.countdownTarget} />
            <div className="hidden items-center gap-3 sm:flex">
              <MapPin className="h-5 w-5 shrink-0 text-purple-400" />
              <p className="text-sm text-gray-400">
                {hero?.venueAddress || "121 AI Blvd, San Francisco, CA 94107"}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.a
          href="#about"
          className="absolute bottom-2 left-1/2 z-20 -translate-x-1/2 lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
        >
          <div className="flex flex-col items-center gap-1 text-gray-500">
            <span className="text-[10px] uppercase tracking-widest">Scroll</span>
            <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
              <ChevronDown className="h-5 w-5" />
            </motion.div>
          </div>
        </motion.a>
      </section>

      <motion.section
        id="about"
        className="overflow-hidden border-y border-white/5 bg-[#0a0a1a] py-5"
        {...fadeInUp}
      >
        <div className="w-full overflow-hidden whitespace-nowrap">
          <div className="animate-marquee flex gap-16 text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
            {Array.from({ length: 2 }).flatMap((_, setIdx) =>
              (marqueeTexts.length
                ? marqueeTexts
                : [
                    "Next Intelligence",
                    "Future Now",
                    "Empowering Innovation",
                    "Smarter Tomorrow",
                    "Think Forward",
                    "Cognitive Shift",
                  ]
              ).map((text, i) => (
                <span key={`${setIdx}-${i}`} className="flex items-center gap-16">
                  <span>{text}</span>
                  <span className="h-2 w-2 rounded-full bg-purple-500/50" />
                </span>
              ))
            )}
          </div>
        </div>
      </motion.section>

      <section className="bg-[#0a0a1a] py-24">
        <div className="container">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative aspect-[4/3] rounded-2xl border border-white/10 bg-gradient-to-br from-purple-900/30 via-[#0a0a1a] to-cyan-900/20 p-8">
                <div className="grid h-full grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                      <div className="text-3xl font-bold text-purple-400">5</div>
                      <div className="text-sm text-gray-400">Days of Content</div>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                      <div className="text-3xl font-bold text-cyan-400">50+</div>
                      <div className="text-sm text-gray-400">World-Class Speakers</div>
                    </div>
                  </div>
                  <div className="mt-8 space-y-4">
                    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                      <div className="text-3xl font-bold text-amber-400">100+</div>
                      <div className="text-sm text-gray-400">Interactive Sessions</div>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                      <div className="text-3xl font-bold text-emerald-400">5K+</div>
                      <div className="text-sm text-gray-400">Global Attendees</div>
                    </div>
                  </div>
                </div>
                <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-purple-500/20 via-transparent to-cyan-500/20 opacity-0 transition-opacity duration-500 hover:opacity-100" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1 text-sm font-medium text-purple-400">
                About the Event
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                A Global Gathering of AI Innovators
              </h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Join thought leaders, developers, researchers, and founders as we explore how
                artificial intelligence is reshaping industries, creativity, and the future of work.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "5 days of keynotes, workshops, and networking",
                  "50 world-class speakers",
                  "Startup showcase and live demos",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-gray-400">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-500/10 text-xs text-purple-400">
                      <Check className="h-3 w-3" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-[#0a0a1a] py-4">
        <div className="w-full overflow-hidden bg-gradient-to-r from-purple-600/20 via-cyan-600/20 to-purple-600/20 py-4">
          <div className="animate-marquee-reverse flex whitespace-nowrap text-3xl font-bold uppercase tracking-widest text-white/10">
            {Array.from({ length: 3 }).flatMap((_, setIdx) =>
              (quoteMarqueeTexts.length
                ? quoteMarqueeTexts
                : ["Next Intelligence", "Future Now", "Empowering Innovation", "Smarter Tomorrow"]
              ).map((text, i) => (
                <span key={`${setIdx}-${i}`} className="mx-8 flex items-center gap-8">
                  <span>{text}</span>
                  <span className="h-3 w-3 rounded-full bg-purple-500/30" />
                </span>
              ))
            )}
          </div>
        </div>
      </section>

      <motion.section id="why-attend" className="bg-[#0a0a1a] py-24" {...fadeInUp}>
        <div className="container">
          <motion.div
            className="mx-auto max-w-2xl text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1 text-sm font-medium text-purple-400">
              Why Attend
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              What You&apos;ll Gain
            </h2>
            <p className="mt-4 text-muted-foreground">
              Hear from global AI pioneers, industry disruptors, and bold thinkers shaping the
              future.
            </p>
          </motion.div>
          <motion.div
            className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-80px" }}
          >
            {benefits.map((item) => (
              <motion.div key={item.title} variants={staggerItem}>
                <Card className="group h-full border border-white/10 bg-white/[0.03] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10">
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 transition-all duration-300 group-hover:scale-110 group-hover:bg-purple-500/20">
                      <item.Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        id="testimonials"
        className="border-y border-white/5 bg-[#0a0a1a] py-24"
        {...fadeInUp}
      >
        <div className="container">
          <motion.div
            className="mx-auto max-w-2xl text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1 text-sm font-medium text-purple-400">
              Testimonials
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              What People Are Saying
            </h2>
            <p className="mt-4 text-muted-foreground">
              Hear from thought leaders and innovators about the future of AI.
            </p>
          </motion.div>
          <motion.div
            className="mt-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <TestimonialCarousel testimonials={testimonialsFromContent} />
          </motion.div>
        </div>
      </motion.section>

      <motion.section id="speakers" className="bg-[#0a0a1a] py-24" {...fadeInUp}>
        <div className="container">
          <motion.div
            className="mx-auto max-w-2xl text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1 text-sm font-medium text-purple-400">
              Speakers
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Meet the Visionaries
            </h2>
            <p className="mt-4 text-muted-foreground">
              World-class speakers sharing insights on the latest in AI and machine learning.
            </p>
          </motion.div>
          <motion.div
            className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-80px" }}
          >
            {speakersFromContent.map((s) => (
              <motion.div
                key={s.name}
                variants={staggerItem}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center transition-all duration-300 hover:-translate-y-2 hover:border-purple-500/30 hover:shadow-xl hover:shadow-purple-500/10"
              >
                <div
                  className={`mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br ${s.color} p-0.5 transition-transform duration-300 group-hover:scale-110`}
                >
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-[#0a0a1a] text-2xl font-bold text-white">
                    {s.initials}
                  </div>
                </div>
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-purple-500/10 blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:opacity-50" />
                <h3 className="relative mt-5 text-lg font-semibold text-white">{s.name}</h3>
                <p className="relative text-sm text-purple-400">{s.role}</p>
                <p className="relative text-sm text-gray-500">{s.company}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        id="schedule"
        className="border-y border-white/5 bg-[#0a0a1a] py-24"
        {...fadeInUp}
      >
        <div className="container">
          <motion.div
            className="mx-auto max-w-2xl text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1 text-sm font-medium text-purple-400">
              Schedule
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              5 Days of AI Excellence
            </h2>
          </motion.div>
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {scheduleFromContent.map((d, i) => (
              <button
                key={i}
                onClick={() => setActiveDay(i)}
                className={`rounded-lg px-5 py-2.5 text-sm font-medium transition-all duration-300 ${activeDay === i ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30" : "border border-white/10 text-gray-400 hover:bg-white/5"}`}
              >
                <span className="block">{d.day}</span>
                <span className="text-xs opacity-70">{d.date}</span>
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeDay}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mt-8 space-y-4"
            >
              {scheduleFromContent[activeDay].sessions.map((session, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.3 }}
                  className="group flex flex-col gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-5 transition-all duration-300 hover:border-purple-500/30 hover:bg-white/[0.06] sm:flex-row sm:items-center"
                >
                  <div className="flex items-center gap-2 text-sm text-gray-400 sm:w-44">
                    <Clock className="h-4 w-4 text-purple-400" />
                    {session.time}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-white">{session.title}</h4>
                    <p className="text-sm text-gray-500">{session.speaker}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-purple-500/30 text-purple-400 transition-colors group-hover:bg-purple-500/10"
                  >
                    {session.type}
                  </Badge>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.section>

      <section className="border-y border-white/5 bg-[#0a0a1a] py-16">
        <div className="container">
          <motion.div
            className="relative overflow-hidden"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#0a0a1a] to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#0a0a1a] to-transparent" />
            <div className="animate-marquee flex gap-16 hover:[animation-play-state:paused]">
              {[...displaySponsors, ...displaySponsors].map((sp, i) => (
                <div
                  key={i}
                  className="flex shrink-0 items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3 transition-all duration-300 hover:border-purple-500/30 hover:bg-white/[0.06]"
                >
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold text-white"
                    style={{ background: sp.color }}
                  >
                    {sp.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{sp.name}</p>
                    <p className="text-[10px] uppercase tracking-wider text-gray-500">{sp.tier}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <motion.section id="tickets" className="bg-[#0a0a1a] py-24" {...fadeInUp}>
        <div className="container">
          <motion.div
            className="mx-auto max-w-2xl text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1 text-sm font-medium text-purple-400">
              Ticket Options
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              {ticketHeader?.title || "Choose Your Pass"}
            </h2>
            <p className="mt-4 text-muted-foreground">
              {ticketHeader?.description ||
                "Select the perfect ticket for your needs and gain access to exclusive sessions, workshops, and more."}
            </p>
          </motion.div>
          <motion.div
            className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-80px" }}
          >
            {ticketsFromContent.map((tier) => (
              <motion.div
                key={tier.name}
                variants={staggerItem}
                className={`group relative overflow-hidden rounded-2xl transition-all duration-500 hover:-translate-y-2 ${
                  tier.highlighted
                    ? "border-2 border-purple-500/50 bg-gradient-to-b from-purple-900/30 to-[#0a0a1a] shadow-xl shadow-purple-500/20"
                    : "border border-white/10 bg-white/[0.02] hover:border-purple-500/30 hover:bg-white/[0.04]"
                }`}
              >
                {tier.highlighted && (
                  <div className="absolute right-0 top-0 z-10 rounded-bl-xl bg-gradient-to-r from-purple-600 to-cyan-600 px-4 py-1.5 text-xs font-bold text-white shadow-lg">
                    POPULAR
                  </div>
                )}

                {/* Barcode at the top */}
                <div className="flex items-center justify-between px-6 pt-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-cyan-600 text-sm font-bold text-white shadow-lg shadow-purple-600/30">
                      E
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">AI SUMMIT</p>
                      <p className="text-[10px] uppercase tracking-wider text-gray-500">2026</p>
                    </div>
                  </div>
                  <BarcodeBars value={`${tier.name}-${tier.price}`} className="h-12" />
                </div>

                {/* Content */}
                <div className="relative p-6 pt-4">
                  {/* Gradient line */}
                  <div
                    className={`mb-4 h-1 w-16 rounded-full bg-gradient-to-r ${tier.color || "from-purple-600 to-cyan-600"}`}
                  />

                  {/* Plan name & price */}
                  <div className="flex items-end justify-between">
                    <h3 className="text-lg font-bold text-white">{tier.name}</h3>
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-xs text-gray-500">$</span>
                      <span className="text-3xl font-bold text-white">{tier.price}</span>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="mt-4 flex items-center gap-2 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 text-xs text-gray-500">
                    <Calendar className="h-3.5 w-3.5 shrink-0 text-purple-400" />
                    <span>October 1 to 5 - 10:00 AM</span>
                  </div>

                  {/* Divider */}
                  <div className="my-5 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                  {/* Features */}
                  <ul className="space-y-2.5">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs text-gray-400">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-purple-400" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Buy button */}
                  <Link href="/events" className="mt-6 block">
                    <Button
                      className={`w-full text-sm transition-all duration-300 ${
                        tier.highlighted
                          ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg shadow-purple-600/30 hover:shadow-xl hover:shadow-purple-600/40"
                          : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
                      }`}
                    >
                      Buy Ticket <MoveRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        id="sponsors"
        className="border-y border-white/5 bg-[#0a0a1a] py-24"
        {...fadeInUp}
      >
        <div className="container">
          <motion.div
            className="mx-auto max-w-2xl text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1 text-sm font-medium text-purple-400">
              Sponsors
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Our Partners</h2>
            <p className="mt-4 text-muted-foreground">
              Leading organizations powering the future of AI innovation.
            </p>
          </motion.div>
          <motion.div
            className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-80px" }}
          >
            {displaySponsors.slice(0, 8).map((sp) => (
              <motion.div
                key={sp.name}
                variants={staggerItem}
                className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-lg"
              >
                <div
                  className="absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-20 blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:opacity-30"
                  style={{ background: sp.color }}
                />
                <div className="relative flex flex-col items-center text-center">
                  <div
                    className="flex h-20 w-20 items-center justify-center rounded-2xl text-2xl font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110"
                    style={{ background: `linear-gradient(135deg, ${sp.color}, ${sp.color}88)` }}
                  >
                    {sp.initials}
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-white">{sp.name}</h3>
                  <span
                    className="mt-2 inline-block rounded-full px-3 py-0.5 text-xs font-semibold uppercase tracking-wider"
                    style={{
                      background: `${sp.color}20`,
                      color: sp.color,
                      border: `1px solid ${sp.color}40`,
                    }}
                  >
                    {sp.tier}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      <motion.section id="faq" className="bg-[#0a0a1a] py-24" {...fadeInUp}>
        <div className="container">
          <motion.div
            className="mx-auto max-w-2xl text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1 text-sm font-medium text-purple-400">
              FAQ
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Everything You Need to Know
            </h2>
          </motion.div>
          <motion.div
            className="mx-auto mt-10 max-w-2xl space-y-3"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {faqsFromContent.map((faq, i) => (
              <FAQItem
                key={i}
                q={faq.q}
                a={faq.a}
                open={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? null : i)}
              />
            ))}
          </motion.div>
        </div>
      </motion.section>

      <motion.section id="newsletter" className="bg-[#0a0a1a] py-24" {...fadeInUp}>
        <div className="container">
          <div className="mx-auto max-w-2xl">
            <motion.div
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 backdrop-blur-sm"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-cyan-600 shadow-lg shadow-purple-600/20">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <h2 className="mt-4 text-2xl font-bold text-white sm:text-3xl">
                  {newsletterContent?.title || "Stay in the Loop"}
                </h2>
                <p className="mt-2 text-sm text-gray-400">
                  {newsletterContent?.description ||
                    "Get the latest event updates, speaker announcements, and exclusive offers delivered straight to your inbox."}
                </p>
              </div>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const email = (e.currentTarget.elements.namedItem("email") as HTMLInputElement)
                    ?.value;
                  try {
                    const res = await fetch("/api/newsletter/subscribe", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ email }),
                    });
                    const data = await res.json();
                    if (data.success) {
                      toast.success(data.message || "Subscribed!");
                      (e.target as HTMLFormElement).reset();
                    } else {
                      toast.error(data.error || "Subscription failed");
                    }
                  } catch {
                    toast.error("Network error. Please try again.");
                  }
                }}
                className="mt-6 space-y-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    name="email"
                    type="email"
                    placeholder={newsletterContent?.placeholder || "Enter your email address"}
                    required
                    className="flex-1 rounded-lg border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-all duration-300 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
                  />
                  <Button
                    type="submit"
                    className="gap-2 bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg shadow-purple-600/30 hover:shadow-xl hover:shadow-purple-600/40"
                  >
                    {newsletterContent?.buttonText || "Subscribe"}
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <label className="flex items-start gap-2 text-left text-xs text-gray-500">
                  <input type="checkbox" required className="mt-0.5 accent-purple-500" />{" "}
                  <span>
                    {newsletterContent?.consentLabel ||
                      "I agree to receive event updates and acknowledge the Privacy Policy. You can unsubscribe at any time."}
                  </span>
                </label>
              </form>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <section className="bg-[#0a0a1a] pb-24">
        <div className="container">
          <motion.div
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-purple-700 to-cyan-600 p-12 text-center text-white"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
            <div className="relative z-10">
              <h2 className="text-3xl font-bold sm:text-4xl">Ready to Join the Future?</h2>
              <p className="mt-4 text-lg text-white/80">
                Book your seat now and be part of something extraordinary.
              </p>
              <motion.div
                className="mt-8"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Link href="/events">
                  <Button size="lg" className="group bg-white text-purple-700 hover:bg-gray-100">
                    Get Your Tickets Now{" "}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
