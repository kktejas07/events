"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock, Users, Mic, ChevronRight, Check, Sparkles } from "lucide-react";
import { useState } from "react";

const ticketTiers = [
  {
    name: "Standard",
    price: "\u20b9299",
    perks: ["Keynote access", "Exhibition entry", "Networking", "Digital materials"],
    color: "from-purple-600 to-purple-400",
    highlighted: false,
  },
  {
    name: "VIP",
    price: "\u20b9699",
    perks: ["All Standard", "VIP lounge", "Front-row seating", "VIP swag bag"],
    color: "from-cyan-600 to-cyan-400",
    highlighted: true,
  },
  {
    name: "Full Access",
    price: "\u20b91,199",
    perks: ["All VIP", "Workshop access", "Personalized schedule", "Speaker meet & greet"],
    color: "from-amber-500 to-orange-400",
    highlighted: false,
  },
  {
    name: "Student",
    price: "\u20b9149",
    perks: ["Keynote access", "Student networking", "Discounted resources", "Student meetups"],
    color: "from-emerald-600 to-emerald-400",
    highlighted: false,
  },
];

const schedule = [
  {
    day: 1,
    date: "Oct 1",
    sessions: [
      {
        time: "08:00 AM",
        title: "Opening Keynote \u2014 The State of AI",
        speaker: "Joshua Henry",
        room: "Main Hall",
      },
      {
        time: "12:00 PM",
        title: "Building Human-Centered Products",
        speaker: "Leila Zhang",
        room: "Workshop A",
      },
      {
        time: "04:00 PM",
        title: "Policy & Regulation Overview",
        speaker: "Carlos Rivera",
        room: "Panel Room",
      },
    ],
  },
  {
    day: 2,
    date: "Oct 2",
    sessions: [
      {
        time: "09:00 AM",
        title: "Ethical AI \u2014 Theory to Practice",
        speaker: "Lisa Zhang",
        room: "Main Hall",
      },
      {
        time: "02:00 PM",
        title: "Generative Models Beyond Text",
        speaker: "Markus Blom",
        room: "Workshop B",
      },
    ],
  },
];

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.1 } },
  viewport: { once: true, margin: "-80px" },
};

const staggerItem = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

export default function EventDetailPage({ params }: { params: { slug: string } }) {
  const [activeDay, setActiveDay] = useState(0);

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-900/40 via-[#0a0a1a] to-cyan-900/30 py-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="container relative z-10">
          <motion.div
            className="mx-auto max-w-3xl text-center text-white"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.span
              className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-5 py-1.5 text-sm font-medium text-purple-300"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Technology
            </motion.span>
            <motion.h1
              className="mt-4 text-4xl font-bold sm:text-5xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              AI Summit 2026
            </motion.h1>
            <motion.p
              className="mt-4 text-lg text-gray-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Join thought leaders, developers, researchers, and founders as we explore how
              artificial intelligence is reshaping industries.
            </motion.p>
            <motion.div
              className="mt-6 flex flex-wrap justify-center gap-6 text-sm text-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              {[
                { icon: Calendar, text: "October 1-5, 2026" },
                { icon: MapPin, text: "San Francisco, CA" },
                { icon: Clock, text: "10:00 AM - 6:00 PM" },
                { icon: Users, text: "5 Days" },
              ].map((item) => (
                <span key={item.text} className="flex items-center gap-1.5">
                  <item.icon className="h-4 w-4 text-purple-400" />
                  {item.text}
                </span>
              ))}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <Link href="#tickets">
                <Button
                  size="lg"
                  className="mt-8 gap-2 bg-purple-600 text-white hover:bg-purple-700"
                >
                  Get Tickets <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 h-32 w-full bg-gradient-to-t from-[#0a0a1a] to-transparent" />
      </section>

      <motion.section
        className="py-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <span className="inline-block rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1 text-sm font-medium text-purple-400">
              About
            </span>
            <h2 className="mt-4 text-3xl font-bold text-white">About the Event</h2>
            <p className="mt-4 leading-relaxed text-gray-400">
              A global gathering of innovators. 5 days of keynotes, workshops, and networking. 50
              world-class speakers. Startup showcase and live demos. This is where the future of
              technology comes to life.
            </p>
          </div>
        </div>
      </motion.section>

      <motion.section
        className="border-y border-white/5 bg-[#0a0a1a] py-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-block rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1 text-sm font-medium text-purple-400">
              Schedule
            </span>
            <h2 className="mt-4 text-3xl font-bold text-white">Event Schedule</h2>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {schedule.map((d, i) => (
              <button
                key={i}
                onClick={() => setActiveDay(i)}
                className={`rounded-lg px-5 py-2.5 text-sm font-medium transition-all duration-300 ${activeDay === i ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30" : "border border-white/10 text-gray-400 hover:bg-white/5"}`}
              >
                Day {d.day} - {d.date}
              </button>
            ))}
          </div>

          <div className="mx-auto mt-8 max-w-4xl space-y-3">
            {schedule[activeDay].sessions.map((session, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group flex flex-col gap-4 rounded-lg border border-white/10 bg-white/[0.03] p-5 transition-all duration-300 hover:border-purple-500/30 sm:flex-row sm:items-center"
              >
                <div className="shrink-0 rounded-lg bg-purple-500/10 px-4 py-2 text-center">
                  <div className="text-sm font-semibold text-purple-400">{session.time}</div>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-white">{session.title}</h4>
                  <div className="flex flex-wrap gap-3 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <Mic className="h-3 w-3 text-purple-400" /> {session.speaker}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-purple-400" /> {session.room}
                    </span>
                  </div>
                </div>
                <Badge variant="outline" className="border-purple-500/30 text-purple-400">
                  Session
                </Badge>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        id="tickets"
        className="py-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-block rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1 text-sm font-medium text-purple-400">
              Tickets
            </span>
            <h2 className="mt-4 text-3xl font-bold text-white">Choose Your Pass</h2>
            <p className="mt-2 text-gray-400">Select the perfect ticket for your needs.</p>
          </div>
          <motion.div
            className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-80px" }}
          >
            {ticketTiers.map((tier) => (
              <motion.div
                key={tier.name}
                variants={staggerItem}
                className={`relative rounded-xl border p-6 transition-all duration-300 hover:-translate-y-2 ${tier.highlighted ? "border-purple-500/50 bg-purple-500/10 shadow-lg shadow-purple-500/10" : "border-white/10 bg-white/[0.03] hover:border-purple-500/30"}`}
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
                    <span className="text-4xl font-bold text-white">{tier.price}</span>
                  </div>
                  <div className="my-5 h-px bg-white/10" />
                  <ul className="space-y-3 text-left">
                    {tier.perks.map((perk) => (
                      <li key={perk} className="flex items-start gap-2 text-sm text-gray-400">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-purple-400" />
                        {perk}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`mt-4 w-full ${tier.highlighted ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg" : "border-white/10 bg-white/5 text-white hover:bg-white/10"}`}
                  >
                    Buy Ticket
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      <section className="border-y border-white/5 bg-[#0a0a1a] py-16">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-block rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1 text-sm font-medium text-purple-400">
              FAQ
            </span>
            <h2 className="mt-4 text-3xl font-bold text-white">Frequently Asked Questions</h2>
          </div>
          <div className="mx-auto mt-8 max-w-2xl space-y-3">
            {[
              {
                q: "What is the AI Summit 2026?",
                a: "A premier event gathering leading experts, thought leaders, and innovators featuring keynotes, workshops, panels, and networking.",
              },
              {
                q: "How can I register?",
                a: "Register through our website by choosing your ticket type and filling out the registration form.",
              },
              {
                q: "Can I transfer my ticket?",
                a: "Tickets are transferable up to 7 days before the event. Contact support for assistance.",
              },
              {
                q: "Is virtual participation available?",
                a: "Yes! We offer virtual tickets providing access to live-streamed sessions and online networking.",
              },
            ].map((faq, i) => (
              <div
                key={i}
                className="rounded-lg border border-white/10 bg-white/[0.03] p-5 transition-all duration-300 hover:border-purple-500/30"
              >
                <h4 className="font-semibold text-white">{faq.q}</h4>
                <p className="mt-2 text-sm text-gray-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <motion.section
        className="py-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-block rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1 text-sm font-medium text-purple-400">
              Venue
            </span>
            <h2 className="mt-4 text-3xl font-bold text-white">Location & Venue</h2>
          </div>
          <div className="mx-auto mt-8 max-w-lg rounded-xl border border-white/10 bg-white/[0.03] p-8 text-center backdrop-blur-sm">
            <MapPin className="mx-auto h-8 w-8 text-purple-400" />
            <p className="mt-4 text-lg font-semibold text-white">San Francisco Tech Pavilion</p>
            <p className="text-sm text-gray-400">121 AI Blvd, San Francisco, CA 94107</p>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
