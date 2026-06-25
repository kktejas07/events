"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { themeAssets, scheduleImage, speakerImage, newsImage } from "@/lib/theme-images";
import { hyderabadColleges } from "@/lib/hyderabad-colleges";
import { TestimonialSliders } from "@/components/ui/testimonial-sliders";

const FALLBACK_IMG = "/assets/img/logo/blue-logo.svg";

function handleImgError(e: React.SyntheticEvent<HTMLImageElement>) {
  const img = e.currentTarget;
  if (!img.dataset.fallbackAttempted) {
    img.dataset.fallbackAttempted = "true";
    img.src = FALLBACK_IMG;
  }
}

function CountdownTimer({ target }: { target?: string }) {
  const [time, setTime] = useState({ days: "00", hours: "00", mins: "00", secs: "00" });
  useEffect(() => {
    const end = new Date(target || "2026-10-01T09:00:00").getTime();
    const tick = () => {
      const diff = Math.max(0, end - Date.now());
      setTime({
        days: String(Math.floor(diff / 86400000)).padStart(2, "0"),
        hours: String(Math.floor((diff % 86400000) / 3600000)).padStart(2, "0"),
        mins: String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0"),
        secs: String(Math.floor((diff % 60000) / 1000)).padStart(2, "0"),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  return (
    <div className="gt-coming-soon-time">
      <div className="gt-timer-content">
        <h3 className="gt-day">{time.days}</h3>
        <p>Days</p>
      </div>
      <div className="gt-timer-content">
        <h3 className="gt-hour">{time.hours}</h3>
        <p>hrs</p>
      </div>
      <div className="gt-timer-content">
        <h3 className="gt-min">{time.mins}</h3>
        <p>mins</p>
      </div>
      <div className="gt-timer-content">
        <h3 className="gt-sec">{time.secs}</h3>
        <p>secs</p>
      </div>
    </div>
  );
}

const schedData = [
  {
    day: "day 01",
    date: "25 april, 2025",
    sessions: [
      { title: "Everyday Intelligence Research Rewired events", room: "Room 2024" },
      { title: "Major Digital Design Conferences in 2025 Adobe MAX", room: "Room 2024" },
      { title: "Figma's Annual digital Conference site develop", room: "Room 2024" },
      { title: "UXDX USA 2025 digital awards show 2025, in new york", room: "Room 2024" },
    ],
  },
  {
    day: "day 02",
    date: "26 april, 2025",
    sessions: [
      { title: "Everyday Intelligence Research Rewired events", room: "Room 2024" },
      { title: "Major Digital Design Conferences in 2025 Adobe MAX", room: "Room 2024" },
      { title: "Figma's Annual digital Conference site develop", room: "Room 2024" },
      { title: "UXDX USA 2025 digital awards show 2025, in new york", room: "Room 2024" },
    ],
  },
  {
    day: "day 03",
    date: "27 april, 2025",
    sessions: [
      { title: "Everyday Intelligence Research Rewired events", room: "Room 2024" },
      { title: "Major Digital Design Conferences in 2025 Adobe MAX", room: "Room 2024" },
      { title: "Figma's Annual digital Conference site develop", room: "Room 2024" },
      { title: "UXDX USA 2025 digital awards show 2025, in new york", room: "Room 2024" },
    ],
  },
  {
    day: "day 04",
    date: "28 april, 2025",
    sessions: [
      { title: "Everyday Intelligence Research Rewired events", room: "Room 2024" },
      { title: "Major Digital Design Conferences in 2025 Adobe MAX", room: "Room 2024" },
      { title: "Figma's Annual digital Conference site develop", room: "Room 2024" },
      { title: "UXDX USA 2025 digital awards show 2025, in new york", room: "Room 2024" },
    ],
  },
];

export default function HomePageClient({
  initialContent = {},
}: {
  initialContent?: Record<string, unknown>;
}) {
  const [activeTab, setActiveTab] = useState("day 01");
  const [activeVideo, setActiveVideo] = useState("ambitions");

  const hero = (initialContent.hero as Record<string, string>) || {};
  const heroBg = hero.backgroundImage || themeAssets.hero.background;
  const heroShapeImage = hero.heroImage || themeAssets.hero.shape;
  const about = (initialContent.about as Record<string, string>) || {};
  const aboutImage = about.image || themeAssets.about.image;
  const statsArr = (initialContent.stats as Record<string, string>[]) || [];
  const speakersSection = (initialContent.speakers as Record<string, unknown>) || {};
  const speakersItems = (speakersSection.items as Record<string, string>[]) || [];
  const speakerBadge =
    typeof speakersSection.badge === "string" ? speakersSection.badge : "event speakers";
  const speakerTitle =
    typeof speakersSection.title === "string" ? speakersSection.title : "Meet Our Event Speaker's";
  const speakerDesc =
    typeof speakersSection.description === "string" ? speakersSection.description : "";
  const testimonialsArr = (initialContent.testimonials as Record<string, string>[]) || [];
  const faqSection = (initialContent.faq as Record<string, unknown>) || {};
  const faqItems = (faqSection.items as Record<string, string>[]) || [];
  const faqBadge =
    typeof faqSection.badge === "string" ? faqSection.badge : "why you join this events";
  const faqTitle = typeof faqSection.title === "string" ? faqSection.title : "you will get to know";
  const faqImage =
    typeof faqSection.image === "string" ? faqSection.image : themeAssets.services.man;
  const ticketsSection = (initialContent.tickets as Record<string, unknown>) || {};
  const ticketTiers = (ticketsSection.tiers as Record<string, unknown>[]) || [];
  const ticketsBadge =
    typeof ticketsSection.badge === "string" ? ticketsSection.badge : "get your seat";
  const ticketsTitle =
    typeof ticketsSection.title === "string"
      ? ticketsSection.title
      : "buy a ticket be the first one";
  const sponsorsSection = (initialContent.sponsors as Record<string, unknown>) || {};
  const sponsorTitle =
    typeof sponsorsSection.title === "string" ? sponsorsSection.title : "apply for event sponsors";
  const sponsorDesc =
    typeof sponsorsSection.description === "string" ? sponsorsSection.description : "";
  const dbSponsors = (initialContent._dbSponsors as Record<string, string>[]) || [];
  const featuredEvent = initialContent._featuredEvent as Record<string, unknown> | undefined;
  const blogPosts = (initialContent._blogPosts as Record<string, string>[]) || [];

  return (
    <>
      {/* ════════ HERO ════════ */}
      <section
        className="gt-hero-section gt-hero-3 fix bg-cover"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="gt-shape">
          <img src={heroShapeImage} alt="img" />
        </div>
        <CountdownTimer target={hero.countdownTarget} />
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-10">
              <div className="gt-hero-content">
                <span
                  className="img-custom-anim-left"
                >
                  {hero.badge || "digital Design"}
                </span>
                <h1
                  className="img-custom-anim-right"
                >
                  {hero.title || "conference"}
                </h1>
                <span className="gt-style-2 wow fadeInUp" data-wow-delay=".5s">
                  {hero.year || "2025"}
                </span>
                <p className="wow fadeInUp" data-wow-delay=".7s">
                  {hero.date || "september 25 - 10:00Am - 5:00 pm"}
                </p>
                <div className="hero-button wow fadeInUp" data-wow-delay=".3s">
                  <Link href={hero.ctaLink || "/events"} className="gt-theme-btn gt-theme-btn-3">
                    <i className="fa-solid fa-arrow-up"></i> {hero.ctaText || "get tickets"}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ ABOUT ════════ */}
      <section className="gt-about-section section-padding fix">
        <div className="gt-left-shape">
          <img src={themeAssets.about.shape1} alt="" />
        </div>
        <div className="gt-right-shape">
          <img src={themeAssets.about.shape2} alt="" />
        </div>
        <div className="gt-blur-shape">
          <img src={themeAssets.about.blur} alt="" />
        </div>
        <div className="container">
          <div className="gt-about-wrapper-3">
            <div className="row g-4">
              <div className="col-lg-6">
                <div className="gt-about-image wow fadeInUp" data-wow-delay=".3s">
                  <img src={aboutImage} alt="img" />
                  <div className="gt-circle-shape">
                    <img src={themeAssets.about.circle} alt="" />
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="gt-about-content">
                  <div className="gt-section-title mb-0">
                    <span className="gt-sub-title gt-style-4 wow fadeInUp">
                      {about.badge || "About design conference"}
                    </span>
                    <h2 className="wow fadeInUp" data-wow-delay=".3s">
                      {about.title || "Building The Future of digital design & Conferences"}
                    </h2>
                  </div>
                  <p className="gt-text wow fadeInUp" data-wow-delay=".5s">
                    {about.description ||
                      "Welcome to our AI Business & Startup hub, where innovation meets ingenuity! We are a community of forward-thinking entrepreneurs, industry leaders, and AI experts, united by our shared passion."}
                  </p>
                  <div className="gt-counter-box wow fadeInUp" data-wow-delay=".3s">
                    {statsArr.length > 0 ? (
                      statsArr.map((s, i) => (
                        <div key={i} className="gt-count-item">
                          <h2>
                            <span className="gt-count">{s.value}</span>
                            {s.suffix || ""}
                          </h2>
                          <p>{s.label}</p>
                        </div>
                      ))
                    ) : (
                      <>
                        <div className="gt-count-item">
                          <h2>
                            <span className="gt-count">25</span>+
                          </h2>
                          <p>Our Visionary Speakers</p>
                        </div>
                        <div className="gt-count-item">
                          <h2>
                            <span className="gt-count">897</span>+
                          </h2>
                          <p>Event Participants</p>
                        </div>
                        <div className="gt-count-item">
                          <h2>
                            <span className="gt-count">69</span>+
                          </h2>
                          <p>International Sponsors</p>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="gt-about-button wow fadeInUp" data-wow-delay=".5s">
                    <Link href="/events" className="gt-theme-btn gt-theme-btn-3">
                      <i className="fa-solid fa-arrow-up"></i> get tickets
                    </Link>
                    <ul className="gt-button">
                      <li>
                        <i className="fa-solid fa-phone-volume"></i>
                        <a href="tel:+9132140203420">+91 3214 0203 420</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ EVENT INTRO ════════ */}
      <section className="gt-event-intro-section section-padding pb-0">
        <div className="gt-blur-shape">
          <img src={themeAssets.intro.shape} alt="" />
        </div>
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="gt-event-intro-items">
                <div className="gt-intro-video">
                  <div
                    className="gt-intro-image img-custom-anim-left"
                  >
                    <img src={themeAssets.intro.text} alt="Conference" />
                  </div>
                  <div className="video-icon">
                    <a
                      href="https://www.youtube.com/watch?v=Cn4G2lZ_g2I"
                      className="video-btn ripple video-popup"
                    >
                      <i className="fa-solid fa-play"></i>
                    </a>
                  </div>
                </div>
                <div className="gt-intro-content wow fadeInUp" data-wow-delay=".3s">
                  <h2>conference</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ SCHEDULE ════════ */}
      <section className="gt-event-schedule-section-3 fix">
        <div className="gt-top-shape float-bob-x">
          <img src={themeAssets.schedule.shape} alt="" />
        </div>
        <div className="container">
          <div className="gt-section-title-area mb-0">
            <div className="gt-section-title mb-0">
              <h2 className="wow fadeInUp" data-wow-delay=".3s">
                Schedule
              </h2>
            </div>
            <ul className="gt-nav" role="tablist">
              {schedData.map((d, i) => (
                <li key={i} className="nav-item wow fadeInUp" data-wow-delay={`.${2 + i * 2}s`}>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab(d.day);
                    }}
                    className={`nav-link ${activeTab === d.day ? "active" : ""}`}
                    role="tab"
                  >
                    {d.day}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="tab-content">
            {schedData.map((d) => (
              <div
                key={d.day}
                className={`tab-pane fade ${activeTab === d.day ? "active show" : ""}`}
                role="tabpanel"
              >
                <div className="row g-4">
                  {d.sessions.map((s, i) => (
                    <div key={i} className="col-xl-3 col-lg-6 col-md-6">
                      <div className="event-schedule-box-items-3">
                        <div className="event-schedule-image">
                          <img
                            src={scheduleImage(i)}
                            alt={s.title}
                            onError={handleImgError}
                          />
                          <ul className="gt-event-post">
                            <li>
                              <i className="fa-regular fa-calendar-days"></i>
                              {d.date}
                            </li>
                          </ul>
                        </div>
                        <div className="gt-event-schedule-content">
                          <h3>
                            <a href="/events">{s.title}</a>
                          </h3>
                          <ul className="gt-list">
                            <li>
                              <i className="fa-regular fa-door-open"></i>
                              {s.room}
                            </li>
                          </ul>
                          <div className="gt-group-image">
                            <img src={themeAssets.schedule.group} alt="" />
                          </div>
                          <a href="/events" className="gt-icon">
                            <i className="fa-solid fa-chevron-right"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ EVENT VIDEO ════════ */}
      <section className="gt-event-video-section section-padding pt-0">
        <div className="gt-left-shape">
          <img src="/assets/img/home-3/event/blur-shape.png" alt="" />
        </div>
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="gt-event-video-item">
                <div className="tab-content">
                  {["technic", "worker", "ambitions", "skills", "year"].map((tab) => (
                    <div
                      key={tab}
                      className={`tab-pane fade ${activeVideo === tab ? "active show" : ""}`}
                      role="tabpanel"
                    >
                      <div className="gt-event-video-image">
                        <video
                          src="/assets/img/events/business.mp4"
                          autoPlay
                          muted
                          loop
                          playsInline
                          className="w-100"
                          style={{ objectFit: "cover", borderRadius: "40px", maxHeight: "700px" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="gt-gallery-items">
                  <h2>previous events gallery</h2>
                  <ul className="gt-nav" role="tablist">
                    {[
                      { id: "technic", label: "2005" },
                      { id: "worker", label: "2010" },
                      { id: "ambitions", label: "2015" },
                      { id: "skills", label: "2020" },
                      { id: "year", label: "2025" },
                    ].map((v, i) => (
                      <li key={v.id} className="nav-item">
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setActiveVideo(v.id);
                          }}
                          className={`nav-link ${activeVideo === v.id ? "active" : ""} ${i === 4 ? "gt-style-2" : ""}`}
                          role="tab"
                        >
                          {v.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ SPEAKERS ════════ */}
      <section className="gt-speaker-section-3">
        <div className="gt-left-shape">
          <img src={themeAssets.speakers.dark} alt="" />
        </div>
        <div className="container">
          <div
            className="gt-speaker-wrapper-3 bg-cover"
            style={{ backgroundImage: `url(${themeAssets.speakers.bg})` }}
          >
            <div className="row g-4">
              {speakersItems.slice(0, 2).map((sp, i) => (
                <div
                  key={i}
                  className={`col-xl-4 col-lg-6 col-md-6 ${i === 0 ? "img-custom-anim-left" : "img-custom-anim-right"}`}
                >
                  <div className="gt-speaker-items-3">
                    <div className="gt-speaker-image">
                      <img
                        src={speakerImage(i, sp.photoUrl)}
                        alt={sp.name}
                        onError={handleImgError}
                      />
                      <div className="gt-social-icon d-flex align-items-center">
                        <a href="#" className="ms-3">
                          <i className="fab fa-facebook-f"></i>
                        </a>
                        <a href="#" className="me-3">
                          <i className="fab fa-twitter"></i>
                        </a>
                        <a href="#" className="me-3">
                          <i className="fa-brands fa-linkedin-in"></i>
                        </a>
                        <a href="#">
                          <i className="fa-brands fa-instagram"></i>
                        </a>
                      </div>
                      <div className="gt-speaker-content">
                        <a
                          href="https://www.youtube.com/watch?v=Cn4G2lZ_g2I"
                          className="video-btn video-popup"
                        >
                          <i className="fa-solid fa-play"></i>
                        </a>
                        <h4>
                          <a href="#">{sp.name}</a>
                        </h4>
                        <p>{sp.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="col-xl-4 col-lg-6 col-md-6">
                <div className="gt-section-title mb-0">
                  <span className="gt-sub-title gt-style-4 wow fadeInUp text-white">
                    {speakerBadge}
                  </span>
                  <h2 className="wow fadeInUp text-white" data-wow-delay=".3s">
                    {speakerTitle}
                  </h2>
                  <p className="mt-mb-0 wow fadeInUp mt-3 text-white" data-wow-delay=".5s">
                    {speakerDesc ||
                      "Welcome to our AI Business & Startup hub, where innovation meets ingenuity! We are a community of forward-thinking"}
                  </p>
                </div>
                <Link
                  href="/speakers"
                  className="gt-theme-btn gt-theme-btn-3 wow fadeInUp mt-5"
                  data-wow-delay=".3s"
                >
                  <i className="fa-solid fa-arrow-up"></i> view all speakers
                </Link>
              </div>
              {speakersItems.slice(2, 5).map((sp, i) => (
                <div
                  key={i + 2}
                  className={`col-xl-4 col-lg-6 col-md-6 ${["img-custom-anim-left", "img-custom-anim-top", "img-custom-anim-right"][i]}`}
                >
                  <div className="gt-speaker-items-3">
                    <div className="gt-speaker-image">
                      <img
                        src={speakerImage(i + 2, sp.photoUrl)}
                        alt={sp.name}
                        onError={handleImgError}
                      />
                      <div className="gt-social-icon d-flex align-items-center">
                        <a href="#" className="ms-3">
                          <i className="fab fa-facebook-f"></i>
                        </a>
                        <a href="#" className="me-3">
                          <i className="fab fa-twitter"></i>
                        </a>
                        <a href="#" className="me-3">
                          <i className="fa-brands fa-linkedin-in"></i>
                        </a>
                        <a href="#">
                          <i className="fa-brands fa-instagram"></i>
                        </a>
                      </div>
                      <div className="gt-speaker-content">
                        <a
                          href="https://www.youtube.com/watch?v=Cn4G2lZ_g2I"
                          className="video-btn video-popup"
                        >
                          <i className="fa-solid fa-play"></i>
                        </a>
                        <h4>
                          <a href="#">{sp.name}</a>
                        </h4>
                        <p>{sp.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <TestimonialSliders items={testimonialsArr} />

      {/* ════════ SERVICE / FAQ ════════ */}
      <section className="gt-service-section-3 section-padding">
        <div className="gt-circle-shape">
          <img src={themeAssets.services.circle} alt="" />
        </div>
        <div className="gt-top-shape">
          <img src={themeAssets.services.dark} alt="" />
        </div>
        <div className="container">
          <div className="gt-service-wrapper">
            <div className="row g-4">
              <div className="col-lg-6">
                <div className="gt-service-dark-box">
                  <h6 className="wow fadeInUp" data-wow-delay=".3s">
                    {faqBadge}
                  </h6>
                  <h2 className="wow fadeInUp" data-wow-delay=".5s">
                    {faqTitle}
                  </h2>
                  <div className="gt-shape">
                    <img src={themeAssets.services.shape2} alt="" />
                  </div>
                    <div className="gt-service-image img-custom-anim-left">
                      <img src={faqImage} alt="Event attendee" />
                    </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="gt-service-item gt-style-2">
                  <div className="gt-bg-shape">
                    <img src={themeAssets.services.bgShape} alt="" />
                  </div>
                  <div className="faq-accordion">
                    <div className="accordion" id="accordion">
                      {(faqItems.length > 0
                        ? faqItems
                        : [
                            {
                              q: "Networking",
                              a: "Welcome to our AI Business & Startup hub, where innovation meets ingenuity! We are a community of forward-thinking entrepreneurs, industry leaders, and AI experts, united by our shared passion.",
                            },
                            {
                              q: "Connecting minds",
                              a: "Welcome to our AI Business & Startup hub, where innovation meets ingenuity! We are a community of forward-thinking entrepreneurs, industry leaders, and AI experts, united by our shared passion.",
                            },
                            {
                              q: "Creating future",
                              a: "Welcome to our AI Business & Startup hub, where innovation meets ingenuity! We are a community of forward-thinking entrepreneurs, industry leaders, and AI experts, united by our shared passion.",
                            },
                            {
                              q: "Great Speakers",
                              a: "Welcome to our AI Business & Startup hub, where innovation meets ingenuity! We are a community of forward-thinking entrepreneurs, industry leaders, and AI experts, united by our shared passion.",
                            },
                            {
                              q: "New People",
                              a: "Welcome to our AI Business & Startup hub, where innovation meets ingenuity! We are a community of forward-thinking entrepreneurs, industry leaders, and AI experts, united by our shared passion.",
                            },
                            {
                              q: "Have Fun",
                              a: "Welcome to our AI Business & Startup hub, where innovation meets ingenuity! We are a community of forward-thinking entrepreneurs, industry leaders, and AI experts, united by our shared passion.",
                            },
                          ]
                      ).map((item: Record<string, string>, idx: number) => (
                        <div key={idx} className="accordion-item mb-3">
                          <h5 className="accordion-header">
                            <button
                              className={`accordion-button d-flex flex-wrap gap-2 ${idx === 3 ? "" : "collapsed"}`}
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target={`#faq${idx}`}
                              aria-expanded={idx === 3 ? "true" : "false"}
                            >
                              <span>{String(idx + 1).padStart(2, "0")}</span>
                              {item.q || item.title}
                            </button>
                          </h5>
                          <div
                            id={`faq${idx}`}
                            className={`accordion-collapse collapse ${idx === 3 ? "show" : ""}`}
                            data-bs-parent="#accordion"
                          >
                            <div className="accordion-body">
                              {item.a ||
                                item.description ||
                                "Welcome to our AI Business & Startup hub, where innovation meets ingenuity!"}
                              <div className="thumb">
                                <img
                                  src={
                                    [themeAssets.services.faq2, themeAssets.services.faq2, themeAssets.services.faq3][idx % 3]
                                  }
                                  alt={item.q || item.title || "Event benefit"}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ TICKETS ════════ */}
      <section className="gt-event-ticket-section-3">
        <div className="gt-dark-shape">
          <img src={themeAssets.sponsors.dark} alt="" />
        </div>
        <div className="gt-right-shape">
          <img src={themeAssets.services.rightShape} alt="" />
        </div>
        <div className="container">
          <div className="gt-section-title text-center">
            <span className="gt-sub-title gt-style-4 wow fadeInUp">{ticketsBadge}</span>
            <h2 className="wow fadeInUp" data-wow-delay=".3s">
              {ticketsTitle}
            </h2>
          </div>
          <div className="row">
            {(ticketTiers.length > 0
              ? ticketTiers
              : [
                  { name: "Gold package", price: "09$" },
                  { name: "Diamond package", price: "09$" },
                  { name: "platinum package", price: "09$" },
                ]
            ).map((t: Record<string, unknown>, i: number) => (
              <div
                key={i}
                className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp"
                data-wow-delay={`.${3 + i * 2}s`}
              >
                <div
                  className={`gt-main-card-item ${i === 1 ? "gt-style-2 gt-bg-color" : "gt-bg"}`}
                >
                  <div className="gt-event-ticket-card-item">
                    <h3 style={{ textTransform: "capitalize" }}>{t.name as string}</h3>
                    <div className="gt-event-box-item">
                      <h6>
                        DEFAULT <span>(Unlimited tickets)</span>
                      </h6>
                      <div className="gt-box-item">
                        <div className="gt-item">
                          <span>Ticket Price :</span>
                          <p>{(t.price as string) || `$${t.price as number}`}</p>
                        </div>
                        <div className="gt-item">
                          <span>Quantity :</span>
                          <p className="qty">
                            <button className="qtyminus" aria-hidden="true">
                              &minus;
                            </button>
                            <input
                              type="number"
                              name="qty"
                              min="1"
                              max="10"
                              step="1"
                              defaultValue={1}
                            />
                            <button className="qtyplus" aria-hidden="true">
                              +
                            </button>
                          </p>
                        </div>
                        <div className="gt-item">
                          <span>Sub Total :</span>
                          <p>18$</p>
                        </div>
                      </div>
                    </div>
                    <ul className="gt-list-item">
                      <li>
                        <span>Lunch & Coffee :</span> Yes
                      </li>
                      <li>
                        <span>Certificate :</span> Yes
                      </li>
                    </ul>
                    <div className="gt-card-button gt-cart-button-2">
                      <Link href="/events" className="gt-theme-btn gt-theme-btn-2">
                        PURCHASE TICKET
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ SPONSOR ════════ */}
      <section className="gt-sponsor-bg-section section-padding fix">
        <div className="container">
          <div
            className="gt-sponsor-bg-wrapper bg-cover"
            style={{ backgroundImage: `url(${themeAssets.sponsors.bg})` }}
          >
            <div className="gt-right-shape">
              <img src={themeAssets.sponsors.shape} alt="" />
            </div>
            <div className="gt-sponsor-content">
              <h2 className="wow fadeInUp" data-wow-delay=".3s">
                {sponsorTitle}
              </h2>
              <p className="wow fadeInUp" data-wow-delay=".5s">
                {sponsorDesc ||
                  "Welcome to our Business & Startup hub, where innovation meets ingenuity! We are a community of forward-thinking entrepreneurs, industry leaders, and AI experts, united by our shared passion."}
              </p>
              <Link href="/contact" className="gt-theme-btn wow fadeInUp" data-wow-delay=".3s">
                <i className="fa-solid fa-arrow-up"></i> get sponsors
              </Link>
            </div>
            <div className="gt-qr-image wow fadeInUp" data-wow-delay=".3s">
              <img src={themeAssets.sponsors.qr} alt="Sponsor QR" />
            </div>
          </div>
        </div>
      </section>

      {/* ════════ NEWS ════════ */}
      <section className="gt-news-section-3 section-padding fix pt-0">
        <div className="gt-left-shape">
          <img src={themeAssets.news.shape} alt="" />
        </div>
        <div className="container">
          <div className="gt-section-title-area">
            <div className="gt-section-title mb-0">
              <span className="gt-sub-title gt-style-4 wow fadeInUp">latest news</span>
              <h2 className="wow fadeInUp" data-wow-delay=".3s">
                event latest news
              </h2>
            </div>
            <Link
              href="/blog"
              className="gt-theme-btn gt-theme-btn-3 wow fadeInUp"
              data-wow-delay=".5s"
            >
              <i className="fa-solid fa-arrow-up"></i> view all blogs
            </Link>
          </div>
          <div className="news-wrapper-3">
            <div className="row">
              <div className="col-xl-12">
                {(blogPosts.length > 0
                  ? blogPosts
                  : [
                      { title: "Major Digital Design Conferences in 2025", slug: "/blog", category: "Corporate", date: "11 march 2025", day: "20", month: "april", excerpt: "Explore the top design conferences shaping the creative industry this year.", image: newsImage(0) },
                      { title: "Figma's Annual Digital Conference Highlights", slug: "/blog", category: "Corporate", date: "11 march 2025", day: "20", month: "april", excerpt: "Key takeaways from the biggest design tool conference of the year.", image: newsImage(1) },
                      { title: "UXDX USA 2025 Digital Awards Preview", slug: "/blog", category: "Corporate", date: "11 march 2025", day: "20", month: "april", excerpt: "A preview of the most anticipated UX and design awards show.", image: newsImage(2) },
                    ]
                ).map((post, i) => (
                  <div key={i} className={`gt-news-items-3 ${i < 2 ? "gt-style-2" : "mb-0"}`}>
                    <div className="gt-news-content">
                      <ul className="gt-post">
                        <li>{post.category || "Corporate"}</li>
                        <li className="gt-style-2">{post.date || "11 march 2025"}</li>
                      </ul>
                      <h3>
                        <Link href={post.slug?.startsWith("/") ? post.slug : `/blog/${post.slug}`}>
                          {post.title}
                        </Link>
                      </h3>
                      <p>{post.excerpt || "Stay updated with the latest from our design conference community."}</p>
                      <Link
                        href={post.slug?.startsWith("/") ? post.slug : `/blog/${post.slug}`}
                        className="gt-link-btn"
                      >
                        <span className="gt-icon-btn">
                          <i className="fa-solid fa-chevrons-right"></i>
                        </span>
                        <span className="gt-radius-btn">READ MORE</span>
                      </Link>
                    </div>
                    <div className="gt-news-image">
                      <img src={post.image || newsImage(i)} alt={post.title} onError={handleImgError} />
                      <div className="post-date">
                        <h5>{post.day || "20"}</h5>
                        <p>{post.month || "april"}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ BRAND ════════ */}
      <div className="gt-brand-section section-padding fix pt-0">
        <div className="container">
          <div className="brand-wrapper">
            <h4>official sponsorship</h4>
            <div className="swiper gt-brand-slider">
              <div className="swiper-wrapper">
                {(dbSponsors.length > 0
                  ? dbSponsors
                  : hyderabadColleges.map((c) => ({
                      name: c.name,
                      logoUrl: c.logo,
                      websiteUrl: c.website,
                    }))
                ).map((sp: unknown, i: number) => {
                    const sponsor = (sp || {}) as Record<string, string>;
                    return (
                      <div key={i} className="swiper-slide">
                        <div className="brand-image text-center">
                          <img
                            src={
                              sponsor.logoUrl ||
                              hyderabadColleges[i % hyderabadColleges.length]?.logo
                            }
                            alt={sponsor.name || "brand"}
                            onError={handleImgError}
                          />
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
