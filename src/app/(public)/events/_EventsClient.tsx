"use client";

import Link from "next/link";
import { useState } from "react";
import { eventScheduleListImage } from "@/lib/theme-images";

interface ScheduleSession {
  day: number;
  time: string;
  title: string;
  speaker: string;
  type: string;
}

interface EventData {
  id: string;
  title: string;
  slug: string;
  startDate: Date;
  shortDescription: string | null;
  category: string | null;
  coverImage: string | null;
  venue: { name: string; city: string; country: string } | null;
  ticketTypes: { price: number; name: string }[];
}

function buildSchedFromSessions(sessions: ScheduleSession[]) {
  const dayMap = new Map<
    number,
    { id: string; label: string; sessions: { title: string; date: string; room: string }[] }
  >();
  for (const s of sessions) {
    if (!dayMap.has(s.day)) {
      dayMap.set(s.day, {
        id: `day${String(s.day).padStart(2, "0")}`,
        label: `day ${String(s.day).padStart(2, "0")}`,
        sessions: [],
      });
    }
    dayMap.get(s.day)!.sessions.push({
      title: s.title,
      date: s.time,
      room: s.speaker ? `Speaker: ${s.speaker}` : "Room 2024",
    });
  }
  return Array.from(dayMap.values());
}

const unsplashEvents = [
  "/assets/img/home-1/event/event-1.png",
  "/assets/img/home-1/event/event-2.png",
  "/assets/img/home-1/event/event-3.png",
];

const schedData = [
  {
    id: "day01",
    label: "day 01",
    sessions: [
      {
        title: "Everyday Intelligence Research Rewired events",
        date: "25 april, 2025",
        room: "Room 2024",
      },
      {
        title: "Major Digital Design Conferences in 2025 Adobe MAX",
        date: "25 april, 2025",
        room: "Room 2024",
      },
      {
        title: "Figma's Annual digital Conference site develop",
        date: "25 april, 2025",
        room: "Room 2024",
      },
    ],
  },
  {
    id: "day02",
    label: "day 02",
    sessions: [
      {
        title: "Everyday Intelligence Research Rewired events",
        date: "26 april, 2025",
        room: "Room 2024",
      },
      {
        title: "Major Digital Design Conferences in 2025 Adobe MAX",
        date: "26 april, 2025",
        room: "Room 2024",
      },
      {
        title: "Figma's Annual digital Conference site develop",
        date: "26 april, 2025",
        room: "Room 2024",
      },
    ],
  },
  {
    id: "day03",
    label: "day 03",
    sessions: [
      {
        title: "Everyday Intelligence Research Rewired events",
        date: "27 april, 2025",
        room: "Room 2024",
      },
      {
        title: "Major Digital Design Conferences in 2025 Adobe MAX",
        date: "27 april, 2025",
        room: "Room 2024",
      },
      {
        title: "Figma's Annual digital Conference site develop",
        date: "27 april, 2025",
        room: "Room 2024",
      },
    ],
  },
  {
    id: "day04",
    label: "day 04",
    sessions: [
      {
        title: "Everyday Intelligence Research Rewired events",
        date: "28 april, 2025",
        room: "Room 2024",
      },
      {
        title: "Major Digital Design Conferences in 2025 Adobe MAX",
        date: "28 april, 2025",
        room: "Room 2024",
      },
      {
        title: "Figma's Annual digital Conference site develop",
        date: "28 april, 2025",
        room: "Room 2024",
      },
    ],
  },
];

export default function EventsPageClient({
  events,
  scheduleSessions,
}: {
  events: EventData[];
  scheduleSessions?: ScheduleSession[];
}) {
  const [activeTab, setActiveTab] = useState("day01");

  const sessionsData =
    scheduleSessions && scheduleSessions.length > 0
      ? buildSchedFromSessions(scheduleSessions)
      : schedData;

  return (
    <>
      <div className="gt-breadcrumb-wrapper fix">
        <div className="gt-top-shape">
          <img src="/assets/img/inner-page/breadcrumb/bg-shape.png" alt="img" />
        </div>
        <div className="gt-line-shape">
          <img src="/assets/img/inner-page/breadcrumb/line-shape.png" alt="img" />
        </div>
        <div className="gt-arrow-shape float-bob-y">
          <img src="/assets/img/inner-page/breadcrumb/arrow.png" alt="img" />
        </div>
        <div
          className="gt-page-heading bg-cover"
          style={{ backgroundImage: "url(/assets/img/inner-page/breadcrumb/bg.png)" }}
        >
          <div className="gt-breadcrumb-sub-title">
            <h1 className="wow fadeInUp" data-wow-delay=".3s">
              ALL EVENT
            </h1>
          </div>
          <ul className="gt-breadcrumb-items wow fadeInUp" data-wow-delay=".5s">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <i className="fa-solid fa-chevron-right"></i>
            </li>
            <li>
              <span>ALL EVENT</span>
            </li>
          </ul>
        </div>
      </div>

      {events.length > 0 && (
        <section className="gt-events-schedule-section section-padding fix pb-0">
          <div className="container">
            <div className="gt-section-title text-center">
              <span className="gt-sub-title wow fadeInUp">upcoming events</span>
              <h2 className="wow fadeInUp" data-wow-delay=".3s">All Events</h2>
            </div>
            <div className="row">
              {events.map((event, i) => (
                <div key={event.id} className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp" data-wow-delay={`.${3 + i * 2}s`}>
                  <div className="gt-event-ticket-card-item" style={{ background: "#fff", borderRadius: "16px", overflow: "hidden", border: "1px solid rgba(21,57,238,0.1)", height: "100%" }}>
                    <Link href={`/events/${event.slug}`}>
                      <img
                        src={event.coverImage || unsplashEvents[i % unsplashEvents.length]}
                        alt={event.title}
                        style={{ width: "100%", height: "220px", objectFit: "cover" }}
                      />
                    </Link>
                    <div style={{ padding: "24px" }}>
                      <div className="d-flex gap-2 mb-2 flex-wrap">
                        {event.category && <span style={{ background: "rgba(77,85,204,0.1)", color: "#4D55CC", padding: "4px 12px", borderRadius: "100px", fontSize: "12px", fontWeight: 600 }}>{event.category}</span>}
                        {event.ticketTypes[0] && <span style={{ background: "rgba(21,57,238,0.08)", color: "#1539EE", padding: "4px 12px", borderRadius: "100px", fontSize: "12px", fontWeight: 600 }}>₹{Number(event.ticketTypes[0].price).toLocaleString()}</span>}
                      </div>
                      <h5 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "8px" }}>
                        <Link href={`/events/${event.slug}`} style={{ color: "#1a1a2e", textDecoration: "none" }}>{event.title}</Link>
                      </h5>
                      <p style={{ fontSize: "14px", color: "#888", marginBottom: "12px" }}>{event.shortDescription || ""}</p>
                      <div className="d-flex align-items-center gap-2" style={{ fontSize: "13px", color: "#aaa" }}>
                        <i className="fa-regular fa-calendar"></i>
                        <span>{new Date(event.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                      </div>
                      {event.venue && (
                        <div className="d-flex align-items-center gap-2 mt-1" style={{ fontSize: "13px", color: "#aaa" }}>
                          <i className="fa-regular fa-location-dot"></i>
                          <span>{event.venue.city}, {event.venue.country}</span>
                        </div>
                      )}
                      <Link href={`/events/${event.slug}`} className="gt-theme-btn d-block text-center mt-4" style={{ fontSize: "14px", padding: "10px" }}>
                        GET TICKETS
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="gt-events-schedule-section section-padding fix">
        <div className="gt-left-shape">
          <img src="/assets/img/home-1/event/circle-shape-2.png" alt="img" />
        </div>
        <div className="gt-middle-shape">
          <img src="/assets/img/home-1/event/circle-shape.png" alt="img" />
        </div>
        <div className="gt-right-shape">
          <img src="/assets/img/home-1/event/circle-shape-3.png" alt="img" />
        </div>
        <div className="container">
          <div className="gt-section-title text-center">
            <span className="gt-sub-title wow fadeInUp">events schedule</span>
            <h2 className="wow fadeInUp" data-wow-delay=".3s">
              our events Schedule
            </h2>
          </div>

          <div className="gt-event-schedule-wrapper">
            <ul className="nav" role="tablist">
              {sessionsData.map((d, i) => (
                <li key={d.id} className="nav-item wow fadeInUp" data-wow-delay={`.${2 + i * 2}s`}>
                  <a
                    href={`#${d.id}`}
                    data-bs-toggle="tab"
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
              {sessionsData.map((d) => (
                <div
                  key={d.id}
                  className={`tab-pane fade ${activeTab === d.id ? "active show" : ""}`}
                  role="tabpanel"
                >
                  <div className="row">
                    <div className="col-xl-12">
                      {d.sessions.map((s, i) => (
                        <div key={i} className="gt-event-schedule-item">
                          <div className="gt-dot-shape">
                            <img src="/assets/img/home-1/event/line-shape-2.png" alt="" />
                          </div>
                          <div className="gt-event-image">
                            <img src={eventScheduleListImage(i)} alt={s.title} />
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
                              <Link href={events.length > 0 ? `/events/${events[0].slug}` : "/events"}>{s.title}</Link>
                            </h3>
                            <ul className="gt-list">
                              <li>
                                <i className="fa-regular fa-location-dot"></i> Bauhof, 4652
                                Steinerkirchen an der Traun
                              </li>
                            </ul>
                            <div className="gt-client-info">
                              <div className="gt-client-image">
                                <img src="/assets/img/home-1/event/client.png" alt="img" />
                              </div>
                              <div className="gt-text">
                                <h6>speakers</h6>
                              </div>
                            </div>
                          </div>
                          <div className="gt-event-button">
                            <Link href={events.length > 0 ? `/events/${events[0].slug}` : "/events"} className="gt-theme-btn">
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
        </div>
      </section>

      <div className="gt-marquee-section-2 fix">
        <div className="mycustom-marque">
          <div className="scrolling-wrap gt-style-3">
            {["marketing", "BUSINESS", "branding"].map((text) => (
              <div key={text} className="comm">
                <div></div>
                <div className="cmn-textslide"><img src="/assets/img/marquee/01.png" alt="img" /> {text}</div>
                <div className="cmn-textslide"><img src="/assets/img/marquee/01.png" alt="img" /> {text}</div>
                <div className="cmn-textslide"><img src="/assets/img/marquee/01.png" alt="img" /> {text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="gt-event-ticket-section section-padding fix bg-cover" style={{ backgroundImage: "url(/assets/img/events/event-bg-2.png)" }}>
        <div className="gt-blur-shape">
          <img src="/assets/img/events/blur-shape.png" alt="img" />
        </div>
        <div className="container">
          <div className="gt-section-title text-center">
            <span className="gt-sub-title gt-bg text-white wow fadeInUp">buy tickets</span>
            <h2 className="text-white wow fadeInUp" data-wow-delay=".3s">
              buy a ticket be the <br />
              <span>first one</span>
            </h2>
          </div>
          <div className="row">
            {["Gold package", "Diamond package", "platinum package"].map((pkg, i) => (
              <div key={pkg} className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp" data-wow-delay={`.${3 + i * 2}s`}>
                <div className={`gt-main-card-item${i === 1 ? " gt-style-2" : ""}`}>
                  <div className="gt-event-ticket-card-item">
                    <h3>{pkg}</h3>
                    <div className="gt-event-box-item">
                      <h6>DEFAULT <span>( Unlimited tickets)</span></h6>
                      <div className="gt-box-item">
                        <div className="gt-item">
                          <span>Ticket Price :</span>
                          <p>{["$99", "$149", "$199"][i]}</p>
                        </div>
                        <div className="gt-item">
                          <span>Quantity :</span>
                          <p className="qty">
                            <button className="qtyminus" aria-hidden="true">&minus;</button>
                            <input type="number" name="qty" min="1" max="10" step="1" defaultValue="1" />
                            <button className="qtyplus" aria-hidden="true">+</button>
                          </p>
                        </div>
                        <div className="gt-item">
                          <span>Sub Total :</span>
                          <p>{["$198", "$298", "$398"][i]}</p>
                        </div>
                      </div>
                    </div>
                    <ul className="gt-list-item">
                      <li><span>Lunch & Coffee :</span> Yes</li>
                      <li><span>Certificate :</span> Yes</li>
                    </ul>
                    <div className="gt-card-button">
                      <Link href={events.length > 0 ? `/events/${events[0].slug}` : "/events"} className="gt-theme-btn gt-style-2">PURCHASE TICKET</Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="gt-news-section-2 section-padding fix">
        <div className="container">
          <div className="gt-section-title text-center">
            <span className="gt-sub-title wow fadeInUp">events news</span>
            <h2 className="wow fadeInUp" data-wow-delay=".3s">Our trending news</h2>
          </div>
          <div className="row">
            {[
              { img: "news-1.jpg", date: "30", month: "april", cat: "Corporate", title: "Consectetur adipisicing elit, sed do eiusmod tempor", desc: "lipsum to our Business & Startup hub, where innovation meets ingenuity! We are a communi of forward-thinking entrepreneurs" },
              { img: "news-2.jpg", date: "30", month: "april", cat: "Corporate", title: "Consectetur adipisicing elit, sed do eiusmod tempor", desc: "lipsum to our Business & Startup hub, where innovation meets ingenuity! We are a communi of forward-thinking entrepreneurs" },
              { img: "news-3.jpg", date: "30", month: "april", cat: "Corporate", title: "Consectetur adipisicing elit, sed do eiusmod tempor", desc: "lipsum to our Business & Startup hub, where innovation meets ingenuity! We are a communi of forward-thinking entrepreneurs" },
            ].map((n, i) => (
              <div key={i} className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp" data-wow-delay={`.${3 + i * 2}s`}>
                <div className="gt-news-card-item">
                  <div className="gt-news-image">
                    <img src={`/assets/img/news/${n.img}`} alt="img" />
                    <span>{n.cat}</span>
                  </div>
                  <div className="gt-news-content">
                    <h3><Link href="/blog">{n.title}</Link></h3>
                    <p>{n.desc}</p>
                  </div>
                  <div className="gt-news-post-item">
                    <div className="post-date">
                      <h5>{n.date}</h5>
                      <p>{n.month}</p>
                    </div>
                    <Link href="/blog" className="gt-link-btn">
                      <span className="gt-icon-btn"><i className="fa-solid fa-chevrons-right"></i></span>
                      <span className="gt-radius-btn">READ MORE</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
