"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { NewsletterForm } from "@/components/ui/newsletter-form";

function CountdownTimer({ target }: { target: string }) {
  const [time, setTime] = useState({ days: "00", hours: "00", mins: "00", secs: "00" });

  useEffect(() => {
    const end = new Date(target).getTime();
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
    <div className="gt-coming-soon-time" data-event-time={target}>
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

export default function ComingSoonPage() {
  return (
    <section className="gt-coming-soon-section section-padding fix">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="gt-coming-soon-items">
              <Link href="/" className="gt-footer-logo">
                <img src="/assets/img/logo/blue-logo.svg" alt="Events logo" />
              </Link>
              <div className="gt-coming-soon-image">
                <img
                  src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80"
                  alt="Coming soon"
                  style={{ maxWidth: 200, borderRadius: "50%" }}
                />
                <CountdownTimer target="2025-12-31T23:59:59" />
              </div>
              <div className="gt-coming-soon-content">
                <h2>We are Currently Building our Website.</h2>
                <p>Watch this space for something incredible! Sign up to get notifications.</p>
                <NewsletterForm
                  placeholder="Your Email Address"
                  buttonText="SUBSCRIBE NOW"
                  className="wow fadeInUp"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
