export const dynamic = "force-dynamic";

import Link from "next/link";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { themeAssets } from "@/lib/theme-images";

export default function ServiceDetailsPage() {
  return (
    <>
      <Breadcrumb title="SERVICE DETAILS" label="SERVICE DETAILS" />

      <section className="gt-service-details-section section-padding fix">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-8">
              <div className="gt-service-details-content">
                <div className="gt-details-image wow fadeInUp" data-wow-delay=".3s">
                  <img src={themeAssets.services.faq2} alt="Conference workshop" />
                </div>
                <h2 className="wow fadeInUp" data-wow-delay=".3s">
                  Premium Event Services for Design Conferences
                </h2>
                <p className="wow fadeInUp" data-wow-delay=".5s">
                  Our comprehensive event services cover everything from registration and ticketing
                  to speaker management, sponsor coordination, and post-event analytics. We help you
                  deliver a world-class design conference experience.
                </p>
                <p className="wow fadeInUp" data-wow-delay=".5s">
                  Boost your brand with live media coverage, influencer engagement, sponsored content,
                  press interviews, and digital campaigns across social platforms and partner networks
                  during the conference.
                </p>
                <div className="row g-4 mt-3">
                  {[
                    { title: "Registration & Ticketing", desc: "Seamless online registration with multiple ticket tiers and payment options." },
                    { title: "Speaker Management", desc: "End-to-end speaker coordination from invitations to session scheduling." },
                    { title: "Sponsor Packages", desc: "Customizable sponsorship tiers with brand visibility and networking access." },
                    { title: "Live Streaming", desc: "Professional live streaming and recording for virtual attendees worldwide." },
                  ].map((item, i) => (
                    <div key={i} className="col-md-6 wow fadeInUp" data-wow-delay={`.${3 + i * 2}s`}>
                      <div className="gt-service-box-item">
                        <h4>{item.title}</h4>
                        <p>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="gt-service-sidebar">
                <div className="gt-sidebar-widget wow fadeInUp" data-wow-delay=".3s">
                  <h4>Our Services</h4>
                  <ul>
                    <li><Link href="/service">All Services</Link></li>
                    <li><Link href="/service-details">Service Details</Link></li>
                    <li><Link href="/events">Event Management</Link></li>
                    <li><Link href="/sponsor">Sponsorship</Link></li>
                    <li><Link href="/pricing">Ticket Pricing</Link></li>
                  </ul>
                </div>
                <div className="gt-sidebar-widget wow fadeInUp" data-wow-delay=".5s">
                  <img src={themeAssets.services.man} alt="Event team" className="w-100" style={{ borderRadius: 12 }} />
                </div>
                <div className="gt-sidebar-widget wow fadeInUp" data-wow-delay=".7s">
                  <Link href="/contact" className="gt-theme-btn w-100 text-center">
                    <i className="fa-solid fa-arrow-up"></i> Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
