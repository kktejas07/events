"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarcodeBars } from "@/components/ui/barcode-bars";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Mic,
  ChevronRight,
  Check,
  Sparkles,
  MoveRight,
} from "lucide-react";
import { useState } from "react";

interface EventData {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string | null;
  startDate: string;
  endDate: string;
  category: string | null;
  venue: {
    name: string;
    address: string;
    city: string;
    state: string | null;
    country: string;
    zipCode: string | null;
  } | null;
  ticketTypes: {
    id: string;
    name: string;
    price: number;
    perks: string[];
    color: string | null;
  }[];
  sessions: {
    id: string;
    title: string;
    description: string | null;
    startTime: string;
    endTime: string;
    room: string | null;
    day: number;
    speaker: { firstName: string; lastName: string; title: string | null } | null;
  }[];
  faqs: { id: string; question: string; answer: string }[];
}

const gradients = [
  "from-purple-600 to-purple-400",
  "from-cyan-600 to-cyan-400",
  "from-amber-500 to-orange-400",
  "from-emerald-600 to-emerald-400",
  "from-rose-600 to-rose-400",
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

export default function EventDetailClient({ event }: { event: EventData }) {
  const [activeDay, setActiveDay] = useState(0);

  const start = new Date(event.startDate);
  const end = new Date(event.endDate);
  const dateStr = `${start.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`;
  const timeStr = `${start.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })} - ${end.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
  const daysDiff = Math.ceil((end.getTime() - start.getTime()) / 86400000) + 1;

  const sessionDays = event.sessions.reduce(
    (acc, s) => {
      if (!acc[s.day - 1]) acc[s.day - 1] = { day: s.day, sessions: [] };
      acc[s.day - 1].sessions.push(s);
      return acc;
    },
    [] as { day: number; sessions: EventData["sessions"] }[]
  );

  const venueStr = event.venue
    ? `${event.venue.name}, ${event.venue.city}, ${event.venue.country}`
    : "";

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
              {event.category || "Event"}
            </motion.span>
            <motion.h1
              className="mt-4 text-4xl font-bold sm:text-5xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              {event.title}
            </motion.h1>
            <motion.p
              className="mt-4 text-lg text-gray-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {event.shortDescription || event.description.slice(0, 120)}
            </motion.p>
            <motion.div
              className="mt-6 flex flex-wrap justify-center gap-6 text-sm text-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-purple-400" />
                {dateStr}
              </span>
              {event.venue && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-purple-400" />
                  {event.venue.city}, {event.venue.country}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-purple-400" />
                {start.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-purple-400" />
                {daysDiff} {daysDiff === 1 ? "Day" : "Days"}
              </span>
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
            <p className="mt-4 leading-relaxed text-gray-400">{event.description}</p>
          </div>
        </div>
      </motion.section>

      {sessionDays.length > 0 && (
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
              {sessionDays.map((d, i) => (
                <button
                  key={i}
                  onClick={() => setActiveDay(i)}
                  className={`rounded-lg px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
                    activeDay === i
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                      : "border border-white/10 text-gray-400 hover:bg-white/5"
                  }`}
                >
                  Day {d.day}
                </button>
              ))}
            </div>

            <div className="mx-auto mt-8 max-w-4xl space-y-3">
              {sessionDays[activeDay]?.sessions.map((session, idx) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group flex flex-col gap-4 rounded-lg border border-white/10 bg-white/[0.03] p-5 transition-all duration-300 hover:border-purple-500/30 sm:flex-row sm:items-center"
                >
                  <div className="shrink-0 rounded-lg bg-purple-500/10 px-4 py-2 text-center">
                    <div className="text-sm font-semibold text-purple-400">
                      {new Date(session.startTime).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{session.title}</h4>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-400">
                      {session.speaker && (
                        <span className="flex items-center gap-1">
                          <Mic className="h-3 w-3 text-purple-400" /> {session.speaker.firstName}{" "}
                          {session.speaker.lastName}
                        </span>
                      )}
                      {session.room && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-purple-400" /> {session.room}
                        </span>
                      )}
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
      )}

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
              Ticket Options
            </span>
            <h2 className="mt-4 text-3xl font-bold text-white">Choose Your Pass</h2>
            <p className="mt-2 text-gray-400">Select the perfect ticket for your needs.</p>
          </div>
          <div className="relative mt-12">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[#0a0a1a] to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[#0a0a1a] to-transparent" />

            <div
              className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-4"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {event.ticketTypes.map((tier, i) => {
                const isHighlighted = i === 1;
                return (
                  <motion.div
                    key={tier.id}
                    className={`group relative w-[280px] shrink-0 snap-start overflow-hidden rounded-2xl transition-all duration-500 hover:-translate-y-2 sm:w-[300px] ${
                      isHighlighted
                        ? "border-2 border-purple-500/50 bg-gradient-to-b from-purple-900/30 to-[#0a0a1a] shadow-xl shadow-purple-500/20"
                        : "border border-white/10 bg-white/[0.02] hover:border-purple-500/30 hover:bg-white/[0.04]"
                    }`}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    {isHighlighted && (
                      <div className="absolute right-0 top-0 z-10 rounded-bl-xl bg-gradient-to-r from-purple-600 to-cyan-600 px-4 py-1.5 text-xs font-bold text-white shadow-lg">
                        POPULAR
                      </div>
                    )}

                    <div className="flex items-center justify-between px-6 pt-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-cyan-600 text-sm font-bold text-white shadow-lg shadow-purple-600/30">
                          E
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-white">
                            {event.title.slice(0, 10).toUpperCase()}
                          </p>
                          <p className="text-[10px] uppercase tracking-wider text-gray-500">
                            {new Date(event.startDate).getFullYear()}
                          </p>
                        </div>
                      </div>
                      <BarcodeBars value={`${tier.name}-${tier.price}`} className="h-12" />
                    </div>

                    <div className="relative p-6 pt-4">
                      <div
                        className={`mb-4 h-1 w-16 rounded-full bg-gradient-to-r ${tier.color || "from-purple-600 to-cyan-600"}`}
                      />
                      <div className="flex items-end justify-between">
                        <h3 className="text-lg font-bold text-white">{tier.name}</h3>
                        <div className="flex items-baseline gap-0.5">
                          <span className="text-xs text-gray-500">₹</span>
                          <span className="text-3xl font-bold text-white">
                            {Number(tier.price).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center gap-2 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 text-xs text-gray-500">
                        <Calendar className="h-3.5 w-3.5 shrink-0 text-purple-400" />
                        <span>
                          {new Date(event.startDate).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                          })}{" "}
                          to{" "}
                          {new Date(event.endDate).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                          })}{" "}
                          -{" "}
                          {new Date(event.startDate).toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <div className="my-5 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                      <ul className="space-y-2.5">
                        {tier.perks.map((perk) => (
                          <li key={perk} className="flex items-start gap-2 text-xs text-gray-400">
                            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-purple-400" />
                            <span>{perk}</span>
                          </li>
                        ))}
                      </ul>
                      <Link
                        href={`/checkout?event=${event.slug}&ticket=${tier.id}`}
                        className="mt-6 block"
                      >
                        <Button
                          className={`w-full text-sm transition-all duration-300 ${
                            isHighlighted
                              ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg shadow-purple-600/30 hover:shadow-xl hover:shadow-purple-600/40"
                              : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
                          }`}
                        >
                          Buy Ticket <MoveRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.section>

      {event.faqs.length > 0 && (
        <section className="border-y border-white/5 bg-[#0a0a1a] py-16">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <span className="inline-block rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1 text-sm font-medium text-purple-400">
                FAQ
              </span>
              <h2 className="mt-4 text-3xl font-bold text-white">Frequently Asked Questions</h2>
            </div>
            <div className="mx-auto mt-8 max-w-2xl space-y-3">
              {event.faqs.map((faq) => (
                <div
                  key={faq.id}
                  className="rounded-lg border border-white/10 bg-white/[0.03] p-5 transition-all duration-300 hover:border-purple-500/30"
                >
                  <h4 className="font-semibold text-white">{faq.question}</h4>
                  <p className="mt-2 text-sm text-gray-400">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {event.venue && (
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
              <p className="mt-4 text-lg font-semibold text-white">{event.venue.name}</p>
              <p className="text-sm text-gray-400">
                {event.venue.address}, {event.venue.city},{" "}
                {event.venue.state ? `${event.venue.state}, ` : ""}
                {event.venue.country} {event.venue.zipCode || ""}
              </p>
            </div>
          </div>
        </motion.section>
      )}
    </div>
  );
}
