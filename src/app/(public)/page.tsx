"use client";

import Link from "next/link";
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
  MapPinned,
  Check,
  ChevronDown,
  Quote,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.1 } },
  viewport: { once: true, margin: "-100px" },
};

const speakers = [
  {
    name: "Joshua Henry",
    role: "Chief AI Scientist",
    company: "OpenAI",
    image: "JH",
    color: "from-purple-500 to-pink-500",
  },
  {
    name: "Leila Zhang",
    role: "VP of Machine Learning",
    company: "Google",
    image: "LZ",
    color: "from-cyan-500 to-blue-500",
  },
  {
    name: "Carlos Rivera",
    role: "Founder & CEO",
    company: "NeuralCore",
    image: "CR",
    color: "from-amber-500 to-orange-500",
  },
];

const scheduleDays = [
  {
    day: "Day 1",
    date: "Oct 1, 2026",
    sessions: [
      {
        time: "08:00 - 10:00",
        title: "Opening Keynote - The State of AI 2026",
        speaker: "Joshua Henry",
        type: "Keynote",
      },
      {
        time: "12:00 - 14:00",
        title: "Building Human-Centered AI Products",
        speaker: "Leila Zhang",
        type: "Workshop",
      },
      {
        time: "16:00 - 18:00",
        title: "AI Policy & Regulation - A Global Overview",
        speaker: "Carlos Rivera",
        type: "Panel",
      },
    ],
  },
  {
    day: "Day 2",
    date: "Oct 2, 2026",
    sessions: [
      {
        time: "09:00 - 10:30",
        title: "Ethical AI - From Theory to Practice",
        speaker: "Leila Zhang",
        type: "Session",
      },
      {
        time: "11:00 - 12:30",
        title: "Bias in Data - Hidden Dangers in AI Pipelines",
        speaker: "Lisa Zhang",
        type: "Session",
      },
      {
        time: "14:00 - 15:30",
        title: "Generative Models Beyond Text",
        speaker: "Markus Blom",
        type: "Workshop",
      },
    ],
  },
  {
    day: "Day 3",
    date: "Oct 3, 2026",
    sessions: [
      {
        time: "09:00 - 10:30",
        title: "Transformers in 2026 - What's Next?",
        speaker: "Sofia Romero",
        type: "Session",
      },
      {
        time: "14:00 - 15:30",
        title: "Panel: AI Regulation & Global Policy Outlook",
        speaker: "Aisha Mensah",
        type: "Panel",
      },
      {
        time: "16:00 - 17:30",
        title: "Embodied AI in Robotics",
        speaker: "Leo Tanaka",
        type: "Session",
      },
    ],
  },
];

const ticketTiers = [
  {
    name: "Standard",
    price: 299,
    features: [
      "Access to keynotes and sessions",
      "Admission to exhibitions and demos",
      "Networking opportunities",
      "Digital materials and recordings",
    ],
    color: "from-purple-600 to-purple-400",
    highlighted: false,
  },
  {
    name: "VIP",
    price: 699,
    features: [
      "All Standard benefits",
      "VIP lounge and exclusive events",
      "Front-row seating",
      "VIP swag bag and exclusive content",
    ],
    color: "from-cyan-600 to-cyan-400",
    highlighted: true,
  },
  {
    name: "Full Access",
    price: 1199,
    features: [
      "All VIP benefits",
      "All workshops and breakout sessions",
      "Personalized session scheduling",
      "Speaker meet-and-greet & after party",
    ],
    color: "from-amber-500 to-orange-400",
    highlighted: false,
  },
  {
    name: "Virtual",
    price: 99,
    features: [
      "Live-streamed keynotes and workshops",
      "On-demand session recordings",
      "Interactive Q&A with speakers",
      "Virtual networking and digital swag",
    ],
    color: "from-emerald-600 to-emerald-400",
    highlighted: false,
  },
];

const sponsors = [
  { name: "TechCorp", tier: "Platinum", color: "from-purple-500/20 to-purple-500/5" },
  { name: "DataFlow", tier: "Gold", color: "from-cyan-500/20 to-cyan-500/5" },
  { name: "CloudNine", tier: "Silver", color: "from-amber-500/20 to-amber-500/5" },
  { name: "NeuralCore", tier: "Platinum", color: "from-purple-500/20 to-purple-500/5" },
  { name: "SynthMind", tier: "Gold", color: "from-cyan-500/20 to-cyan-500/5" },
  { name: "VisionFlow", tier: "Silver", color: "from-amber-500/20 to-amber-500/5" },
];

const faqs = [
  {
    q: "What is the AI Summit 2026?",
    a: "A premier event gathering leading AI experts, thought leaders, and innovators featuring keynotes, workshops, panels, and networking opportunities focusing on the latest advancements in artificial intelligence.",
  },
  {
    q: "How can I register for the event?",
    a: "You can register through our website. Simply choose your ticket type and fill out the registration form. After payment confirmation, you'll receive your tickets via email.",
  },
  {
    q: "Can I transfer my ticket to someone else?",
    a: "Tickets are transferable up to 7 days before the event. Please contact our support team for assistance with the transfer process.",
  },
  {
    q: "Will there be virtual participation?",
    a: "Yes! Virtual tickets are available providing access to live-streamed sessions, workshops, and networking opportunities online.",
  },
  {
    q: "What is the refund policy?",
    a: "Full refunds are available up to 14 days before the event. Partial refunds (50%) are available up to 7 days before the event.",
  },
  {
    q: "Is there parking available at the venue?",
    a: "Yes, complimentary parking is available for all attendees. The venue is also accessible via public transit and ride-sharing services.",
  },
];

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
    <div className="rounded-lg border border-white/10 bg-white/5">
      <button onClick={onToggle} className="flex w-full items-center justify-between p-5 text-left">
        <span className="font-medium text-white">{q}</span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/10 px-5 pb-5 pt-3 text-sm text-gray-400">{a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function HomePage() {
  const [activeDay, setActiveDay] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center overflow-hidden bg-[#0a0a1a]">
        <div className="animate-gradient absolute inset-0 bg-gradient-to-br from-purple-900/40 via-[#0a0a1a] to-cyan-900/30" />
        <div className="animate-float absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="animate-float-delayed absolute right-1/4 top-1/3 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="animate-pulse-glow absolute bottom-1/4 left-1/3 h-48 w-48 rounded-full bg-pink-500/10 blur-3xl" />
        <div
          className="animate-float absolute right-1/3 top-2/3 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl"
          style={{ animationDelay: "4s" }}
        />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        <div className="container relative z-10">
          <motion.div
            className="mx-auto max-w-4xl text-center"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.span
              className="inline-block rounded-full border border-purple-500/30 bg-purple-500/10 px-5 py-1.5 text-sm font-medium text-purple-300"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              The Future of Intelligence
            </motion.span>
            <motion.h1
              className="mt-6 text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              AI Summit <span className="text-gradient">2026</span>
            </motion.h1>
            <motion.div
              className="mt-6 flex flex-wrap items-center justify-center gap-4 text-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-purple-400" />
                October 1&ndash;5, 2026
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-purple-400" />
                San Francisco, CA
              </span>
            </motion.div>
            <motion.div
              className="mt-8 flex flex-wrap justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <Link href="/events">
                <Button size="lg" className="gap-2 bg-purple-600 text-white hover:bg-purple-700">
                  Get Tickets <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a href="#schedule">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-gray-600 text-white hover:bg-white/10"
                >
                  View Schedule
                </Button>
              </a>
            </motion.div>
            <motion.div
              className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              {[
                { icon: Users, value: "5,000+", label: "Attendees" },
                { icon: Mic, value: "50+", label: "Speakers" },
                { icon: Calendar, value: "5 Days", label: "Conference" },
                { icon: Star, value: "100+", label: "Sessions" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
                >
                  <stat.icon className="mx-auto h-5 w-5 text-purple-400" />
                  <div className="mt-2 text-xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-gray-400">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Marquee */}
      <section className="overflow-hidden border-y border-white/5 bg-[#0a0a1a] py-5">
        <div className="flex whitespace-nowrap">
          <div className="animate-marquee flex gap-16 text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
            {[
              "Next Intelligence",
              "Future Now",
              "Empowering Innovation",
              "Smarter Tomorrow",
              "Think Forward",
              "Cognitive Shift",
              "Next Intelligence",
              "Future Now",
              "Empowering Innovation",
              "Smarter Tomorrow",
              "Think Forward",
              "Cognitive Shift",
            ].map((text, i) => (
              <span key={i} className="flex items-center gap-16">
                <span>{text}</span>
                <span className="h-2 w-2 rounded-full bg-purple-500/50" />
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Why Attend */}
      <motion.section id="about" className="py-24" {...fadeInUp}>
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
              future across every domain.
            </p>
          </motion.div>
          <motion.div
            className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-100px" }}
          >
            {[
              {
                title: "Cutting-Edge Knowledge",
                description:
                  "Stay ahead of the curve with insights from AI leaders shaping tomorrow's technology.",
              },
              {
                title: "Hands-On Learning",
                description:
                  "Join live workshops and labs to build practical skills in AI and machine learning.",
              },
              {
                title: "Global Networking",
                description:
                  "Meet developers, founders, and researchers from around the world to collaborate and grow.",
              },
              {
                title: "Startup Showcase",
                description:
                  "Explore the latest AI tools and ideas from promising startups and research labs.",
              },
              {
                title: "AI Career Boost",
                description:
                  "Access exclusive job fairs, mentorship sessions, and recruiting events to grow your career.",
              },
              {
                title: "Ethics & Future",
                description:
                  "Engage in vital conversations around AI ethics, policy, and the future of intelligence.",
              },
            ].map((item) => (
              <motion.div
                key={item.title}
                variants={{ initial: { opacity: 0, y: 40 }, whileInView: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.5 }}
              >
                <Card className="group h-full border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10">
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 transition-colors group-hover:bg-purple-500/20">
                      <ChevronRight className="h-5 w-5" />
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

      {/* Testimonial */}
      <section className="border-y border-white/5 bg-[#0a0a1a] py-20">
        <div className="container">
          <motion.div
            className="mx-auto max-w-3xl text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Quote className="mx-auto h-10 w-10 text-purple-500/50" />
            <p className="mt-6 text-xl italic leading-relaxed text-gray-300">
              &ldquo;Artificial intelligence is advancing rapidly, and while it offers immense
              opportunity, it also poses significant risks. If not properly regulated and aligned
              with human values, AI could become a fundamental threat to civilization.&rdquo;
            </p>
            <div className="mt-6">
              <p className="font-semibold text-white">Elon Musk</p>
              <p className="text-sm text-gray-500">Technologist &amp; Entrepreneur</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Speakers */}
      <motion.section id="speakers" className="py-24" {...fadeInUp}>
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
              World-class speakers sharing insights on the latest in AI, machine learning, and
              technology.
            </p>
          </motion.div>
          <motion.div
            className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-100px" }}
          >
            {speakers.map((s) => (
              <motion.div
                key={s.name}
                variants={{ initial: { opacity: 0, y: 40 }, whileInView: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.5 }}
                className="group text-center"
              >
                <div
                  className={`mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br ${s.color} p-0.5`}
                >
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-[#0a0a1a] text-2xl font-bold text-white">
                    {s.image}
                  </div>
                </div>
                <h3 className="mt-5 text-lg font-semibold text-white">{s.name}</h3>
                <p className="text-sm text-purple-400">{s.role}</p>
                <p className="text-sm text-gray-500">{s.company}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Schedule */}
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

          {/* Day tabs */}
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {scheduleDays.map((d, i) => (
              <button
                key={i}
                onClick={() => setActiveDay(i)}
                className={`rounded-lg px-5 py-2.5 text-sm font-medium transition-all ${
                  activeDay === i
                    ? "bg-purple-600 text-white"
                    : "border border-white/10 text-gray-400 hover:bg-white/5"
                }`}
              >
                <span className="block">{d.day}</span>
                <span className="text-xs opacity-70">{d.date}</span>
              </button>
            ))}
          </div>

          {/* Sessions */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeDay}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mt-8 space-y-4"
            >
              {scheduleDays[activeDay].sessions.map((session, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-3 rounded-lg border border-white/10 bg-white/5 p-5 sm:flex-row sm:items-center"
                >
                  <div className="flex items-center gap-2 text-sm text-gray-400 sm:w-44">
                    <Clock className="h-4 w-4 text-purple-400" />
                    {session.time}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-white">{session.title}</h4>
                    <p className="text-sm text-gray-500">{session.speaker}</p>
                  </div>
                  <Badge variant="outline" className="border-purple-500/30 text-purple-400">
                    {session.type}
                  </Badge>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.section>

      {/* Tickets / Pricing */}
      <motion.section id="tickets" className="py-24" {...fadeInUp}>
        <div className="container">
          <motion.div
            className="mx-auto max-w-2xl text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1 text-sm font-medium text-purple-400">
              Tickets
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Choose Your Pass</h2>
            <p className="mt-4 text-muted-foreground">
              Select the perfect ticket for your needs and gain access to exclusive sessions,
              workshops, and more.
            </p>
          </motion.div>
          <motion.div
            className="mt-12 grid gap-6 lg:grid-cols-4"
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-100px" }}
          >
            {ticketTiers.map((tier) => (
              <motion.div
                key={tier.name}
                variants={{ initial: { opacity: 0, y: 40 }, whileInView: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.5 }}
                className={`relative rounded-xl border p-6 transition-all duration-300 hover:-translate-y-1 ${
                  tier.highlighted
                    ? "border-purple-500/50 bg-purple-500/10 shadow-lg shadow-purple-500/10"
                    : "border-white/10 bg-white/5 hover:border-purple-500/30"
                }`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 px-3 py-1 text-xs font-semibold text-white">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-white">{tier.name}</h3>
                  <div className="mt-3">
                    <span className="text-4xl font-bold text-white">${tier.price}</span>
                  </div>
                  <Separator className="my-5 bg-white/10" />
                  <ul className="space-y-3 text-left">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-gray-400">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-purple-400" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/events" className="mt-6 block">
                    <Button
                      className={`w-full ${
                        tier.highlighted
                          ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white"
                          : "border-white/10 bg-white/5 text-white hover:bg-white/10"
                      }`}
                    >
                      Buy Ticket
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Sponsors */}
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
          </motion.div>
          <motion.div
            className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-100px" }}
          >
            {sponsors.map((sp) => (
              <motion.div
                key={sp.name}
                variants={{ initial: { opacity: 0, y: 40 }, whileInView: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.5 }}
                className={`flex flex-col items-center justify-center rounded-xl bg-gradient-to-br ${sp.color} p-8 text-center backdrop-blur-sm`}
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-2xl font-bold text-white">
                  {sp.name[0]}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">{sp.name}</h3>
                <span className="mt-1 rounded-full bg-white/10 px-3 py-0.5 text-xs font-medium text-purple-300">
                  {sp.tier}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* FAQ */}
      <motion.section id="faq" className="py-24" {...fadeInUp}>
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
            {faqs.map((faq, i) => (
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

      {/* CTA */}
      <section className="pb-24">
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
                  <Button size="lg" className="bg-white text-purple-700 hover:bg-gray-100">
                    Get Your Tickets Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#0a0a1a] py-12">
        <div className="container">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-cyan-600">
                <span className="text-sm font-bold text-white">E</span>
              </div>
              <span className="text-lg font-bold text-white">Events</span>
            </div>
            <p className="text-sm text-gray-500">
              &copy; 2026 Events Platform. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
