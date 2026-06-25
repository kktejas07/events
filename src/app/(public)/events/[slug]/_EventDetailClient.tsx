"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

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

const topicImages = [
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80",
];

const unsplashEventDetail =
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80";

export default function EventDetailClient({ event }: { event: EventData }) {
  const [activeDay, setActiveDay] = useState(0);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    if (event.ticketTypes.length > 0) {
      const initial: Record<string, number> = {};
      event.ticketTypes.forEach((t) => {
        initial[t.id] = 1;
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
              EVENT DETAILS
            </h1>
          </div>
          <ul className="gt-breadcrumb-items wow fadeInUp" data-wow-delay=".5s">
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <i className="fa-solid fa-chevron-right"></i>
            </li>
            <li>
              <span>EVENT DETAILS</span>
            </li>
          </ul>
        </div>
      </div>

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
                    <img src={event.coverImage || unsplashEventDetail} alt={event.title} />
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
                        <img src={topicImages[0]} alt="img" />
                      </div>
                    </div>
                    <div className="col-xl-6 col-lg-12">
                      <div className="gt-thumb">
                        <img src={topicImages[1]} alt="img" />
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
                    <div className="mb-4 mt-4">
                      <h3>Event Schedule</h3>
                      <div className="d-flex mb-4 mt-3 flex-wrap gap-2">
                        {sessionDays.map((d, i) => (
                          <button
                            key={i}
                            onClick={() => setActiveDay(i)}
                            className={`btn btn-sm ${activeDay === i ? "gt-theme-btn" : "btn-outline-light"}`}
                          >
                            Day {d.day}
                          </button>
                        ))}
                      </div>
                      <div className="space-y-3">
                        {sessionDays[activeDay]?.sessions.map((session) => (
                          <div
                            key={session.id}
                            className="gt-card d-flex flex-column flex-sm-row align-items-center gap-4 p-4"
                          >
                            <div className="rounded-3 shrink-0 bg-purple-500/10 px-4 py-2 text-center">
                              <div className="fw-semibold text-purple text-sm">
                                {new Date(session.startTime).toLocaleTimeString("en-US", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </div>
                            </div>
                            <div className="flex-1">
                              <h4 className="fw-semibold text-white">{session.title}</h4>
                              <div className="d-flex flex-wrap gap-3 text-sm text-gray-400">
                                {session.speaker && (
                                  <span>
                                    <i className="fa-solid fa-microphone text-purple me-1"></i>{" "}
                                    {session.speaker.firstName} {session.speaker.lastName}
                                  </span>
                                )}
                                {session.room && (
                                  <span>
                                    <i className="fa-solid fa-location-dot text-purple me-1"></i>{" "}
                                    {session.room}
                                  </span>
                                )}
                              </div>
                            </div>
                            <span className="badge text-purple shrink-0 border border-purple-500/30">
                              Session
                            </span>
                          </div>
                        ))}
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
                      <div className="mt-3 space-y-3">
                        {event.faqs.map((faq) => (
                          <div key={faq.id} className="gt-card p-4">
                            <h4 className="fw-semibold text-white">{faq.question}</h4>
                            <p className="mt-2 text-sm text-gray-400">{faq.answer}</p>
                          </div>
                        ))}
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
                        <span>Organizer</span>: Events Platform
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
                      <a href="#">
                        <i className="fab fa-twitter"></i>
                      </a>
                      <a href="#">
                        <i className="fa-brands fa-youtube"></i>
                      </a>
                      <a href="#">
                        <i className="fa-brands fa-instagram"></i>
                      </a>
                      <a href="#">
                        <i className="fab fa-facebook-f"></i>
                      </a>
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
                                    [tier.id]: Math.max(1, (prev[tier.id] || 1) - 1),
                                  }))
                                }
                              >
                                &minus;
                              </button>
                              <input
                                type="number"
                                min="1"
                                max="10"
                                step="1"
                                value={quantities[tier.id] || 1}
                                onChange={(e) =>
                                  setQuantities((prev) => ({
                                    ...prev,
                                    [tier.id]: Math.max(1, parseInt(e.target.value) || 1),
                                  }))
                                }
                              />
                              <button
                                className="qtyplus"
                                onClick={() =>
                                  setQuantities((prev) => ({
                                    ...prev,
                                    [tier.id]: Math.min(10, (prev[tier.id] || 1) + 1),
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
                              ₹{((quantities[tier.id] || 1) * Number(tier.price)).toLocaleString()}
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
                    <Link
                      href={`/checkout?eventId=${event.id}&ticketTypeId=${event.ticketTypes.find((t) => (quantities[t.id] || 0) > 0)?.id || event.ticketTypes[0]?.id || ""}`}
                      className="gt-theme-btn d-block w-100 text-center"
                    >
                      PURCHASE TICKET <i className="fa-solid fa-arrow-right ms-2"></i>
                    </Link>
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
