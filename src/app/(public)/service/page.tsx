export const dynamic = "force-dynamic";

import Link from "next/link";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { themeAssets } from "@/lib/theme-images";

const serviceItems = [
  { num: "01", title: "Networking", body: "Connect with designers, developers, and creative leaders from around the world at curated networking sessions and social events." },
  { num: "02", title: "Connecting minds", body: "Collaborate in workshops and breakout sessions designed to spark new ideas and cross-disciplinary innovation." },
  { num: "03", title: "Creating future", body: "Explore emerging trends in digital design, from AI-assisted workflows to immersive experiences shaping tomorrow." },
  { num: "04", title: "Great Speakers", body: "Learn from industry pioneers who have shaped products used by millions. Their insights will transform your approach." },
];

function ServiceAccordion({
  id,
  items,
  image,
}: {
  id: string;
  items: typeof serviceItems;
  image: string;
}) {
  return (
    <div className="gt-service-item mb-0">
      <div className="faq-accordion">
        <div className="accordion" id={id}>
          {items.map((item, idx) => (
            <div key={item.num} className={`accordion-item ${idx === items.length - 1 ? "mb-0" : "mb-3"}`}>
              <h5 className="accordion-header">
                <button
                  className={`accordion-button d-flex gap-2 flex-wrap ${idx === 3 ? "" : "collapsed"}`}
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#${id}-faq${idx}`}
                  aria-expanded={idx === 3 ? "true" : "false"}
                >
                  <span>{item.num}</span> {item.title}
                </button>
              </h5>
              <div
                id={`${id}-faq${idx}`}
                className={`accordion-collapse collapse ${idx === 3 ? "show" : ""}`}
                data-bs-parent={`#${id}`}
              >
                <div className="accordion-body">
                  {item.body}
                  <div className="thumb">
                    <img src={image} alt={item.title} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ServicePage() {
  return (
    <>
      <Breadcrumb title="SERVICES" />

      <section className="gt-service-section section-padding fix">
        <div className="container">
          <div className="gt-service-wrapper">
            <div className="row g-4">
              <div className="col-lg-6">
                <ServiceAccordion id="accordionLeft" items={serviceItems} image={themeAssets.services.faq2} />
              </div>
              <div className="col-lg-6">
                <ServiceAccordion id="accordionRight" items={serviceItems} image={themeAssets.services.faq3} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="gt-marquee-section-2 fix">
        <div className="mycustom-marque">
          <div className="scrolling-wrap gt-style-inner">
            {[1, 2, 3].map((n) => (
              <div key={n} className="comm">
                <div></div>
                <div className="cmn-textslide">
                  <img src="/assets/img/marquee/01.png" alt="" /> marketing
                </div>
                <div className="cmn-textslide">
                  <img src="/assets/img/marquee/01.png" alt="" /> BUSINESS
                </div>
                <div className="cmn-textslide">
                  <img src="/assets/img/marquee/01.png" alt="" /> branding
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="gt-news-section-2 section-padding fix">
        <div className="container">
          <div className="gt-section-title text-center mb-0">
            <span className="gt-sub-title wow fadeInUp">events news</span>
            <h2 className="wow fadeInUp" data-wow-delay=".3s">
              Our trending news
            </h2>
          </div>
          <div className="row">
            {themeAssets.news.items.map((img, i) => (
              <div key={i} className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp" data-wow-delay={`.${3 + i * 2}s`}>
                <div className="gt-news-card-item">
                  <div className="gt-news-image">
                    <img src={img} alt="Conference news" />
                    <span>Corporate</span>
                  </div>
                  <div className="gt-news-content">
                    <h3>
                      <Link href="/blog">Design conference highlights and industry insights</Link>
                    </h3>
                    <p>Stay updated with the latest from our design conference community.</p>
                  </div>
                  <div className="gt-news-post-item">
                    <div className="post-date">
                      <h5>{20 - i * 2}</h5>
                      <p>april</p>
                    </div>
                    <Link href="/blog" className="gt-link-btn">
                      <span className="gt-icon-btn">
                        <i className="fa-solid fa-chevrons-right"></i>
                      </span>
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
