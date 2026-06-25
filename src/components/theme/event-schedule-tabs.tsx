"use client";

import Link from "next/link";
import { useState } from "react";
import { eventScheduleListImage, themeAssets } from "@/lib/theme-images";

export interface ScheduleDay {
  id: string;
  label: string;
  sessions: {
    title: string;
    date: string;
    room: string;
    location?: string;
    href?: string;
    image?: string;
  }[];
}

const defaultSchedule: ScheduleDay[] = [
  {
    id: "day01",
    label: "day 01",
    sessions: [
      {
        title: "data science upcoming business conference in town",
        date: "25 april, 2025",
        room: "Room 2025",
        location: "Bauhof, 4652 Steinerkirchen an der Traun",
      },
      {
        title: "Everyday Intelligence Research Rewired events",
        date: "25 april, 2025",
        room: "Room 2025",
        location: "Bauhof, 4652 Steinerkirchen an der Traun",
      },
      {
        title: "A general list of well-known business conferences",
        date: "25 april, 2025",
        room: "Room 202",
        location: "Bauhof, 4652 Steinerkirchen an der Traun",
      },
    ],
  },
  {
    id: "day02",
    label: "day 02",
    sessions: [
      {
        title: "data science upcoming business conference in town",
        date: "26 april, 2025",
        room: "Room 2025",
        location: "Bauhof, 4652 Steinerkirchen an der Traun",
      },
      {
        title: "Everyday Intelligence Research Rewired events",
        date: "26 april, 2025",
        room: "Room 2025",
        location: "Bauhof, 4652 Steinerkirchen an der Traun",
      },
      {
        title: "A general list of well-known business conferences",
        date: "26 april, 2025",
        room: "Room 202",
        location: "Bauhof, 4652 Steinerkirchen an der Traun",
      },
    ],
  },
  {
    id: "day03",
    label: "day 03",
    sessions: [
      {
        title: "data science upcoming business conference in town",
        date: "27 april, 2025",
        room: "Room 2025",
        location: "Bauhof, 4652 Steinerkirchen an der Traun",
      },
      {
        title: "Everyday Intelligence Research Rewired events",
        date: "27 april, 2025",
        room: "Room 2025",
        location: "Bauhof, 4652 Steinerkirchen an der Traun",
      },
      {
        title: "A general list of well-known business conferences",
        date: "27 april, 2025",
        room: "Room 202",
        location: "Bauhof, 4652 Steinerkirchen an der Traun",
      },
    ],
  },
  {
    id: "day04",
    label: "day 04",
    sessions: [
      {
        title: "data science upcoming business conference in town",
        date: "28 april, 2025",
        room: "Room 2025",
        location: "Bauhof, 4652 Steinerkirchen an der Traun",
      },
      {
        title: "Everyday Intelligence Research Rewired events",
        date: "28 april, 2025",
        room: "Room 2025",
        location: "Bauhof, 4652 Steinerkirchen an der Traun",
      },
      {
        title: "A general list of well-known business conferences",
        date: "28 april, 2025",
        room: "Room 202",
        location: "Bauhof, 4652 Steinerkirchen an der Traun",
      },
    ],
  },
];

export function EventScheduleTabs({
  days,
  defaultTicketHref = "/events",
  embedded = false,
}: {
  days?: ScheduleDay[];
  defaultTicketHref?: string;
  embedded?: boolean;
}) {
  const schedule = days && days.length > 0 ? days : defaultSchedule;
  const [activeTab, setActiveTab] = useState(schedule[0]?.id || "day01");

  const content = (
    <>
      {!embedded && (
        <div className="gt-section-title text-center">
          <span className="gt-sub-title wow fadeInUp">events schedule</span>
          <h2 className="wow fadeInUp" data-wow-delay=".3s">
            our events Schedule
          </h2>
        </div>
      )}

      <div className="gt-event-schedule-wrapper">
        <ul className="nav" role="tablist">
          {schedule.map((d, i) => (
            <li key={d.id} className="nav-item wow fadeInUp" data-wow-delay={`.${2 + i * 2}s`}>
              <a
                href={`#${d.id}`}
                className={`nav-link ${activeTab === d.id ? "active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab(d.id);
                }}
                role="tab"
              >
                {d.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="tab-content">
          {schedule
            .filter((d) => d.id === activeTab)
            .map((d) => (
            <div key={d.id} className="tab-pane fade active show" role="tabpanel">
              <div className="row">
                <div className="col-xl-12">
                  {d.sessions.map((s, i) => (
                    <div key={`${d.id}-${i}`} className="gt-event-schedule-item">
                      <div className="gt-dot-shape">
                        <img src={themeAssets.scheduleDot} alt="" />
                      </div>
                      <div className="gt-event-image">
                        <img
                          src={s.image || eventScheduleListImage(i)}
                          alt={s.title}
                        />
                      </div>
                      <div className="gt-event-schedule-content">
                        <ul className="gt-event-list">
                          <li>
                            <i className="fa-regular fa-calendar-days"></i> {s.date}
                          </li>
                          <li>
                            <i className="fa-regular fa-door-open"></i> {s.room}
                          </li>
                        </ul>
                        <h3>
                          <Link href={s.href || defaultTicketHref}>{s.title}</Link>
                        </h3>
                        <ul className="gt-list">
                          <li>
                            <i className="fa-regular fa-location-dot"></i>{" "}
                            {s.location || "Bauhof, 4652 Steinerkirchen an der Traun"}
                          </li>
                        </ul>
                        <div className="gt-client-info">
                          <div className="gt-client-image">
                            <img src={themeAssets.schedule.client} alt="Event speakers" />
                          </div>
                          <div className="gt-text">
                            <h6>speakers</h6>
                          </div>
                        </div>
                      </div>
                      <div className="gt-event-button">
                        <Link href={s.href || defaultTicketHref} className="gt-theme-btn">
                          <i className="fa-solid fa-arrow-up"></i> get tickets
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  if (embedded) return content;

  return (
    <section className="gt-events-schedule-section section-padding fix">
      <div className="gt-left-shape">
        <img src="/assets/img/home-1/event/circle-shape-2.png" alt="" />
      </div>
      <div className="gt-middle-shape">
        <img src="/assets/img/home-1/event/circle-shape.png" alt="" />
      </div>
      <div className="gt-right-shape">
        <img src="/assets/img/home-1/event/circle-shape-3.png" alt="" />
      </div>
      <div className="container">{content}</div>
    </section>
  );
}
