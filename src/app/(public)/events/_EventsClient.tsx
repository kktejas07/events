"use client";

import { Breadcrumb } from "@/components/layout/breadcrumb";
import { EventScheduleTabs, type ScheduleDay } from "@/components/theme/event-schedule-tabs";
import { EventTicketPackages, type TicketPackage } from "@/components/theme/event-ticket-packages";
import { MarqueeSection } from "@/components/theme/marquee-section";
import { TrendingNewsSection, type NewsPostItem } from "@/components/theme/trending-news-section";

export default function EventsPageClient({
  scheduleDays,
  ticketPackages,
  blogPosts,
  purchaseHref,
}: {
  scheduleDays?: ScheduleDay[];
  ticketPackages?: TicketPackage[];
  blogPosts?: NewsPostItem[];
  purchaseHref?: string;
}) {
  return (
    <>
      <Breadcrumb title="ALL EVENT" />

      <EventScheduleTabs days={scheduleDays} defaultTicketHref={purchaseHref || "/events"} />

      <MarqueeSection />

      <EventTicketPackages packages={ticketPackages} purchaseHref={purchaseHref || "/events"} />

      <TrendingNewsSection posts={blogPosts} />
    </>
  );
}
