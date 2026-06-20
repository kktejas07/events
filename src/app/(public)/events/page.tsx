"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, ArrowRight, Sparkles } from "lucide-react";

const events = [
  {
    id: "1",
    title: "AI Summit 2026",
    slug: "ai-summit-2026",
    date: "October 1-5, 2026",
    location: "San Francisco, CA",
    category: "Technology",
    price: "From \u20b9299",
    gradient: "from-purple-600 to-cyan-600",
  },
  {
    id: "2",
    title: "Web Development Conference",
    slug: "web-dev-conf-2026",
    date: "November 10-12, 2026",
    location: "Bangalore, India",
    category: "Development",
    price: "From \u20b9199",
    gradient: "from-cyan-600 to-blue-600",
  },
  {
    id: "3",
    title: "Startup Founder Summit",
    slug: "startup-summit-2026",
    date: "December 5-7, 2026",
    location: "Mumbai, India",
    category: "Business",
    price: "From \u20b9499",
    gradient: "from-amber-600 to-orange-600",
  },
];

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.12 } },
  viewport: { once: true, margin: "-80px" },
};

const staggerItem = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a1a] py-24">
      <div className="container">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-5 py-1.5 text-sm font-medium text-purple-300">
            <Sparkles className="h-3.5 w-3.5" />
            Events
          </span>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Upcoming Events
          </h1>
          <p className="mt-4 text-muted-foreground">
            Discover and register for the most exciting events near you.
          </p>
        </motion.div>

        <motion.div
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          variants={staggerContainer}
          initial="initial"
          animate="whileInView"
        >
          {events.map((event) => (
            <motion.div key={event.id} variants={staggerItem}>
              <Link href={`/events/${event.slug}`}>
                <Card className="group overflow-hidden border border-white/10 bg-white/[0.03] backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:border-purple-500/30 hover:shadow-xl hover:shadow-purple-500/10">
                  <div className={`relative h-48 bg-gradient-to-br ${event.gradient}`}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-6xl font-bold text-white/20">{event.category[0]}</span>
                    </div>
                    <span className="absolute left-3 top-3 rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                      {event.category}
                    </span>
                  </div>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Calendar className="h-3.5 w-3.5 text-purple-400" />
                      {event.date}
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-sm text-gray-400">
                      <MapPin className="h-3.5 w-3.5 text-purple-400" />
                      {event.location}
                    </div>
                    <h3 className="mt-3 text-lg font-semibold text-white transition-colors group-hover:text-purple-400">
                      {event.title}
                    </h3>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm font-semibold text-purple-400">{event.price}</span>
                      <span className="flex items-center gap-1 text-sm font-medium text-purple-400 transition-all group-hover:gap-2">
                        View Details{" "}
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
