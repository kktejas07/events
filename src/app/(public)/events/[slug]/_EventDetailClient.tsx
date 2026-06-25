"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { EventScheduleTabs, type ScheduleDay } from "@/components/theme/event-schedule-tabs";
import { eventCoverImage } from "@/lib/theme-images";

const detailImages = [
  "/assets/img/inner-page/event-details/details-2.jpg",
  "/assets/img/inner-page/event-details/details-3.jpg",
];

interface EventData {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string | null;
  startDate: string;
  endDate: string;
  category: string | null;
  coverImage: string | null;
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


const SOCIAL_ICONS: { key: string; icon: string }[] = [
  { key: "SOCIAL_TWITTER_URL", icon: "fab fa-twitter" },
  { key: "SOCIAL_YOUTUBE_URL", icon: "fa-brands fa-youtube" },
  { key: "SOCIAL_INSTAGRAM_URL", icon: "fa-brands fa-instagram" },
  { key: "SOCIAL_FACEBOOK_URL", icon: "fab fa-facebook-f" },
  { key: "SOCIAL_LINKEDIN_URL", icon: "fa-brands fa-linkedin-in" },
];

export default function EventDetailClient({ event, socialLinks = {} }: { event: EventData; socialLinks?: Record<string, string> }) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    if (event.ticketTypes.length > 0) {
      const initial: Record<string, number> = {};
      event.ticketTypes.forEach((t) => {
        initial[t.id] = 0;
      });
      setQuantities(initial);
    }
  }, [event.ticketTypes]);

  const start = new Date(event.startDate);
  const end = new Date(event.endDate);
  const dateStr = start.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const sessionDays = event.sessions.reduce(
    (acc, s) => {
      if (!acc[s.day - 1]) acc[s.day - 1] = { day: s.day, sessions: [] };
      acc[s.day - 1].sessions.push(s);
      return acc;
    },
    [] as { day: number; sessions: EventData["sessions"] }[]
  );

  const totalQuantity = Object.values(quantities).reduce((a, b) => a + b, 0);
  const totalPrice = event.ticketTypes.reduce(
    (sum, t) => sum + (quantities[t.id] || 0) * Number(t.price),
    0
  );

  const speaker = event.sessions.find((s) => s.speaker);

  const sessionScheduleDays: ScheduleDay[] = sessionDays.map((d) => ({
    id: `day${String(d.day).padStart(2, "0")}`,
    label: `day ${String(d.day).padStart(2, "0")}`,
    sessions: d.sessions.map((session) => ({
      title: session.title,
      date: `${new Date(session.startTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })} - ${new Date(session.endTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`,
      room: session.room || (session.speaker ? `${session.speaker.firstName} ${session.speaker.lastName}` : "Main Hall"),
      location: event.venue
        ? `${event.venue.address}, ${event.venue.city}`
        : undefined,
      href: `/events/${event.slug}`,
    })),
  }));

  return (
    <>
      <Breadcrumb title="EVENT DETAILS" />

      <section className="gt-events-details-section section-padding fix">
        <div className="container">
          <div className="gt-event-details-wrapper">
            <div className="row">
              <div className="col-xl-12">
                <div className="gt-details-post">
                  <ul className="gt-event-list">
                    <li>
                      <i className="fa-regular fa-calendar-days"></i> {dateStr}
                    </li>
                    {speaker?.speaker && (
                      <li>
                        <i className="fa-regular fa-door-open"></i> {speaker.speaker.firstName}{" "}
                        {speaker.speaker.lastName} (Speaker)
                      </li>
                    )}
                    {event.venue && (
                      <li>
                        <i className="fa-regular fa-location-dot"></i> {event.venue.name},{" "}
                        {event.venue.city}
                      </li>
                    )}
                  </ul>
                  <div className="gt-details-image">
                    <img src={eventCoverImage(0, event.coverImage)} alt={event.title} />
                    <div className="gt-client-image">
                      <img src="/assets/img/inner-page/event-details/client.png" alt="img" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row g-4">
              <div className="col-lg-8 col-12">
                <div className="gt-event-details-content">
                  <h2>{event.title}</h2>
                  <p>{event.description}</p>

                  <div className="row g-4 mb-4 mt-3">
                    <div className="col-xl-6 col-lg-12">
                      <div className="gt-details-list-item">
                        <h3>Key Topics Covered:</h3>
                        <ul className="gt-list">
                          <li>
                            <i className="fa-solid fa-chevron-right"></i> Predictive Analytics in
                            Business Strategy
                          </li>
                          <li>
                            <i className="fa-solid fa-chevron-right"></i> Natural Language
                            Processing (NLP) in Customer Service
                          </li>
                          <li>
                            <i className="fa-solid fa-chevron-right"></i> Machine Learning for Risk
                            Management
                          </li>
                          <li>
                            <i className="fa-solid fa-chevron-right"></i> Big Data Infrastructure
                            and Data Engineering
                          </li>
                          <li>
                            <i className="fa-solid fa-chevron-right"></i> Real-Time Analytics and
                            IoT Integration
                          </li>
                          <li>
                            <i className="fa-solid fa-chevron-right"></i> Ethics, Bias, and
                            Responsible AI
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="col-xl-6 col-lg-12">
                      <div className="gt-thumb">
                        <img src={detailImages[0]} alt="img" />
                      </div>
                    </div>
                    <div className="col-xl-6 col-lg-12">
                      <div className="gt-thumb">
                        <img src={detailImages[1]} alt="img" />
                      </div>
                    </div>
                    <div className="col-xl-6 col-lg-12">
                      <div className="gt-details-list-item">
                        <h3>Who Should Attend:</h3>
                        <ul className="gt-list">
                          <li>
                            <i className="fa-solid fa-chevron-right"></i> Data Scientists and
                            Machine Learning Engineers
                          </li>
                          <li>
                            <i className="fa-solid fa-chevron-right"></i> Business Analysts and
                            Strategy Professionals
                          </li>
                          <li>
                            <i className="fa-solid fa-chevron-right"></i> AI & Tech Startups
                          </li>
                          <li>
                            <i className="fa-solid fa-chevron-right"></i> Academicians and
                            Researchers
                          </li>
                          <li>
                            <i className="fa-solid fa-chevron-right"></i> Students in Data Science
                            and Business Analytics
                          </li>
                          <li>
                            <i className="fa-solid fa-chevron-right"></i> Policymakers and
                            Government Technologists
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <h3>Call for Papers:</h3>
                  <p className="mb-3 mt-3">
                    ICDSAIA 2025 welcomes original research papers and case studies in the fields of
                    AI, Data Science, Machine Learning, and related applications. Accepted papers
                    will be published in the official conference proceedings with an ISBN and
                    considered for journal publication.
                  </p>

                  <h3>Registration Fees:</h3>
                  <div className="gt-Registration-Fees-item">
                    <div className="gt-Registration-Fees-title">
                      <h5>Category</h5>
                      <h5>Early Bird (by May 30)</h5>
                      <h5>Regular (after May 30)</h5>
                    </div>
                    <ul className="gt-list">
                      <li>Local Participant</li>
                      <li>BDT 3,000</li>
                      <li>BDT 4,500</li>
                    </ul>
                    <ul className="gt-list">
                      <li>International</li>
                      <li>$80</li>
                      <li>$100</li>
                    </ul>
                    <ul className="gt-list">
                      <li>Student (BD)</li>
                      <li>BDT 1,500</li>
                      <li>BDT 2,000</li>
                    </ul>
                  </div>

                  {event.sessions.length > 0 && (
                    <div className="mt-4">
                      <h3>Event Schedule</h3>
                      <div className="mt-4">
                        <EventScheduleTabs
                          embedded
                          days={sessionScheduleDays}
                          defaultTicketHref={`/events/${event.slug}`}
                        />
                      </div>
                    </div>
                  )}

                  {event.venue && (
                    <div className="gt-map-items mt-4">
                      <h3>Venue Direction:</h3>
                      <p className="mb-4 mt-2">
                        {event.venue.name} &mdash; {event.venue.address}, {event.venue.city},{" "}
                        {event.venue.country}
                      </p>
                    </div>
                  )}

                  {event.faqs.length > 0 && (
                    <div className="mt-4">
                      <h3>Frequently Asked Questions</h3>
                      <div className="faq-accordion mt-3">
                        <div className="accordion" id="eventFaq">
                          {event.faqs.map((faq, idx) => (
                            <div key={faq.id} className={`accordion-item ${idx === event.faqs.length - 1 ? "mb-0" : "mb-3"}`}>
                              <h5 className="accordion-header">
                                <button
                                  className={`accordion-button ${idx === 0 ? "" : "collapsed"}`}
                                  type="button"
                                  data-bs-toggle="collapse"
                                  data-bs-target={`#faq-${faq.id}`}
                                  aria-expanded={idx === 0 ? "true" : "false"}
                                >
                                  {faq.question}
                                </button>
                              </h5>
                              <div
                                id={`faq-${faq.id}`}
                                className={`accordion-collapse collapse ${idx === 0 ? "show" : ""}`}
                                data-bs-parent="#eventFaq"
                              >
                                <div className="accordion-body">{faq.answer}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="col-lg-4">
                <div className="gt-event-main-sideber">
                  <div className="gt-event-sideber-widget">
                    <ul className="gt-sideber-list">
                      <li>
                        <span>Date</span>: {dateStr}
                      </li>
                      {event.venue && (
                        <li>
                          <span>Venue</span>: {event.venue.city}, {event.venue.country}
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="gt-event-sideber-widget">
                    <div className="gt-widget-title">
                      <h3>Short Details</h3>
                    </div>
                    <ul className="gt-sideber-list">
                      <li>
                        <span>Start Date</span>: {dateStr}
                      </li>
                      {event.venue && (
                        <li>
                          <span>Event Venue</span>: {event.venue.name}, {event.venue.city}
                        </li>
                      )}
                      <li>
                        <span>Organizer</span>: echo
                      </li>
                      <li>
                        <span>Category</span>: {event.category || "Conference"}
                      </li>
                      <li>
                        <span>Phone</span>: +1 (1234)-567-800
                      </li>
                      <li>
                        <span>Location</span>: {event.venue?.city || "N/A"}
                      </li>
                      <li>
                        <span>E-mail</span>: info@eventsplatform.com
                      </li>
                    </ul>
                  </div>

                    <div className="gt-event-sideber-widget">
                      <div className="gt-widget-title">
                        <h3>We&apos;re in the social</h3>
                      </div>
                      <div className="gt-social-icon d-flex align-items-center">
                        {SOCIAL_ICONS.filter((s) => socialLinks[s.key]).map((s) => (
                          <a key={s.key} href={socialLinks[s.key]} target="_blank" rel="noopener noreferrer">
                            <i className={s.icon}></i>
                          </a>
                        ))}
                      </div>
                    </div>

                  <div className="gt-event-sideber-widget mb-0">
                    <div className="gt-widget-title">
                      <h3>Purchase Ticket</h3>
                    </div>
                    {event.ticketTypes.map((tier) => (
                      <div key={tier.id} className="gt-event-box-item">
                        <h6>
                          {tier.name} <span>(Unlimited tickets)</span>
                        </h6>
                        <div className="gt-box-item">
                          <div className="gt-item">
                            <span>Ticket Price :</span>
                            <p>₹{Number(tier.price).toLocaleString()}</p>
                          </div>
                          <div className="gt-item">
                            <span>Quantity :</span>
                            <p className="qty">
                              <button
                                className="qtyminus"
                                onClick={() =>
                                  setQuantities((prev) => ({
                                    ...prev,
                                    [tier.id]: Math.max(0, (prev[tier.id] || 0) - 1),
                                  }))
                                }
                              >
                                &minus;
                              </button>
                              <input
                                type="number"
                                min="0"
                                max="10"
                                step="1"
                                value={quantities[tier.id] || 0}
                                onChange={(e) =>
                                  setQuantities((prev) => ({
                                    ...prev,
                                    [tier.id]: Math.max(0, parseInt(e.target.value) || 0),
                                  }))
                                }
                              />
                              <button
                                className="qtyplus"
                                onClick={() =>
                                  setQuantities((prev) => ({
                                    ...prev,
                                    [tier.id]: Math.min(10, (prev[tier.id] || 0) + 1),
                                  }))
                                }
                              >
                                +
                              </button>
                            </p>
                          </div>
                          <div className="gt-item">
                            <span>Sub Total :</span>
                            <p>
                              ₹{((quantities[tier.id] || 0) * Number(tier.price)).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    <ul className="gt-sideber-list gt-box">
                      <li>
                        <span>Total Quantity:</span> {totalQuantity}
                      </li>
                      <li>
                        <span>Total Price:</span> ₹{totalPrice.toLocaleString()}
                      </li>
                    </ul>
                    {totalQuantity > 0 ? (
                      <Link
                        href={`/checkout?eventId=${event.id}&selected=${encodeURIComponent(JSON.stringify(Object.fromEntries(event.ticketTypes.filter((t) => (quantities[t.id] || 0) > 0).map((t) => [t.id, quantities[t.id] || 0]))))}`}
                        className="gt-theme-btn d-block w-100 text-center"
                      >
                        PURCHASE TICKET <i className="fa-solid fa-arrow-right ms-2"></i>
                      </Link>
                    ) : (
                      <button className="gt-theme-btn d-block w-100 text-center" disabled style={{ opacity: 0.5, cursor: "not-allowed" }}>
                        SELECT TICKETS <i className="fa-solid fa-arrow-right ms-2"></i>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
