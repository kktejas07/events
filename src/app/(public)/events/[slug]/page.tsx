import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, MapPin, Clock, Users, Mic, ChevronRight } from "lucide-react";

const ticketTiers = [
  {
    name: "Standard",
    price: "₹299",
    perks: ["Keynote access", "Exhibition entry", "Networking", "Digital materials"],
    color: "#6C5CE7",
  },
  {
    name: "VIP",
    price: "₹699",
    perks: ["All Standard", "VIP lounge", "Front-row seating", "VIP swag bag"],
    color: "#00CEC9",
  },
  {
    name: "Full Access",
    price: "₹1,199",
    perks: ["All VIP", "Workshop access", "Personalized schedule", "Speaker meet & greet"],
    color: "#FDCB6E",
  },
  {
    name: "Student",
    price: "₹149",
    perks: ["Keynote access", "Student networking", "Discounted resources", "Student meetups"],
    color: "#00B894",
  },
];

const schedule = [
  {
    day: 1,
    date: "Oct 1",
    sessions: [
      {
        time: "08:00 AM",
        title: "Opening Keynote — The State of AI",
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
        title: "Ethical AI — Theory to Practice",
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

export default function EventDetailPage({ params }: { params: { slug: string } }) {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-dark via-primary/10 to-dark py-20">
        <div className="container relative z-10">
          <div className="mx-auto max-w-3xl text-center text-white">
            <span className="rounded-full bg-primary/20 px-4 py-1 text-sm font-medium text-primary">
              Technology
            </span>
            <h1 className="mt-4 text-4xl font-bold sm:text-5xl">AI Summit 2026</h1>
            <p className="mt-4 text-lg text-gray-300">
              Join thought leaders, developers, researchers, and founders as we explore how
              artificial intelligence is reshaping industries.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm text-gray-300">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-primary" /> October 1–5, 2026
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-primary" /> San Francisco, CA
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-primary" /> 10:00 AM — 6:00 PM
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-primary" /> 5 Days
              </span>
            </div>
            <Link href="#tickets">
              <Button size="lg" className="mt-8 gap-2">
                Get Tickets <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 h-32 w-full bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* About */}
      <section className="py-16">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold">About the Event</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              A global gathering of innovators. 5 days of keynotes, workshops, and networking. 50
              world-class speakers. Startup showcase and live demos. This is where the future of
              technology comes to life.
            </p>
          </div>
        </div>
      </section>

      {/* Schedule */}
      <section className="bg-muted/50 py-16">
        <div className="container">
          <h2 className="text-center text-3xl font-bold">Event Schedule</h2>
          <div className="mt-8 space-y-8">
            {schedule.map((day) => (
              <div key={day.day}>
                <h3 className="mb-4 text-xl font-semibold">
                  Day {day.day} — {day.date}
                </h3>
                <div className="space-y-3">
                  {day.sessions.map((session, idx) => (
                    <Card key={idx} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                      <div className="shrink-0 rounded-lg bg-primary/10 px-4 py-2 text-center">
                        <div className="text-sm font-semibold text-primary">{session.time}</div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{session.title}</h4>
                        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Mic className="h-3 w-3" /> {session.speaker}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {session.room}
                          </span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tickets */}
      <section id="tickets" className="py-16">
        <div className="container">
          <h2 className="text-center text-3xl font-bold">Choose Your Pass</h2>
          <p className="mt-2 text-center text-muted-foreground">
            Select the perfect ticket for your needs.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {ticketTiers.map((tier) => (
              <Card
                key={tier.name}
                className="flex flex-col border-t-4 transition-shadow hover:shadow-lg"
                style={{ borderTopColor: tier.color }}
              >
                <CardHeader>
                  <CardTitle>{tier.name}</CardTitle>
                  <div className="text-3xl font-bold">{tier.price}</div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {tier.perks.map((perk) => (
                      <li key={perk} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" /> {perk}
                      </li>
                    ))}
                  </ul>
                  <Button className="mt-4 w-full" style={{ backgroundColor: tier.color }}>
                    Buy Ticket
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-muted/50 py-16">
        <div className="container">
          <h2 className="text-center text-3xl font-bold">Frequently Asked Questions</h2>
          <div className="mx-auto mt-8 max-w-2xl space-y-4">
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
              <Card key={i}>
                <CardContent className="p-6">
                  <h4 className="font-semibold">{faq.q}</h4>
                  <p className="mt-2 text-sm text-muted-foreground">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Venue */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-center text-3xl font-bold">Location & Venue</h2>
          <div className="mx-auto mt-8 max-w-2xl rounded-lg border bg-muted/30 p-8 text-center">
            <MapPin className="mx-auto h-8 w-8 text-primary" />
            <p className="mt-4 font-semibold">San Francisco Tech Pavilion</p>
            <p className="text-sm text-muted-foreground">121 AI Blvd, San Francisco, CA 94107</p>
          </div>
        </div>
      </section>
    </div>
  );
}
