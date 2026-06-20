import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, ArrowRight } from "lucide-react";

const events = [
  {
    id: "1",
    title: "AI Summit 2026",
    slug: "ai-summit-2026",
    date: "October 1–5, 2026",
    location: "San Francisco, CA",
    image: "/images/event-1.jpg",
    category: "Technology",
    price: "From ₹299",
  },
  {
    id: "2",
    title: "Web Development Conference",
    slug: "web-dev-conf-2026",
    date: "November 10–12, 2026",
    location: "Bangalore, India",
    image: "/images/event-2.jpg",
    category: "Development",
    price: "From ₹199",
  },
  {
    id: "3",
    title: "Startup Founder Summit",
    slug: "startup-summit-2026",
    date: "December 5–7, 2026",
    location: "Mumbai, India",
    image: "/images/event-3.jpg",
    category: "Business",
    price: "From ₹499",
  },
];

export default function EventsPage() {
  return (
    <div className="py-12">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight">Upcoming Events</h1>
          <p className="mt-4 text-muted-foreground">
            Discover and register for the most exciting events near you.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Link key={event.id} href={`/events/${event.slug}`}>
              <Card className="group overflow-hidden transition-all hover:shadow-xl">
                <div className="relative h-48 bg-gradient-to-br from-primary/20 to-secondary/20">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl font-bold text-primary/20">{event.category[0]}</span>
                  </div>
                  <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-medium text-white">
                    {event.category}
                  </span>
                </div>
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    {event.date}
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    {event.location}
                  </div>
                  <h3 className="mt-3 text-lg font-semibold group-hover:text-primary">
                    {event.title}
                  </h3>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm font-semibold text-primary">{event.price}</span>
                    <span className="flex items-center gap-1 text-sm font-medium text-primary transition-all group-hover:gap-2">
                      View Details <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
