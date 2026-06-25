export const dynamic = "force-dynamic";
export const revalidate = 0;

import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import { db } from "@/lib/db";
import { themeAssets } from "@/lib/theme-images";

export default async function AboutPage() {
  noStore();

  let aboutContent: Record<string, unknown> = {};
  let testimonialsData: Record<string, string>[] = [];

  try {
    const aboutRow = await db.siteContent.findFirst({ where: { section: "about-page" } });
    if (aboutRow?.data) aboutContent = aboutRow.data as Record<string, unknown>;

    const testimonialsRow = await db.siteContent.findFirst({ where: { section: "testimonials" } });
    if (testimonialsRow?.data) testimonialsData = testimonialsRow.data as Record<string, string>[];
  } catch (error) {
    console.error("About page fetch error:", error);
  }

  const badge = (aboutContent.badge as string) || "About design conference";
  const title =
    (aboutContent.title as string) || "Building The Future of digital design & Conferences";
  const aboutImage = (aboutContent.image as string) || themeAssets.about.image;
  const description =
    (aboutContent.description as string) ||
    "Welcome to our AI Business & Startup hub, where innovation meets ingenuity! We are a community of forward-thinking entrepreneurs, industry leaders, and AI experts, united by our shared passion.";
  const stats = (aboutContent.stats as { value: string; label: string; suffix?: string }[]) || [];
  const phoneNumber = (aboutContent.phoneNumber as string) || "+91 3214 0203 420";
  const ticketPackages =
    (aboutContent.ticketPackages as {
      name: string;
      price: string;
      highlighted: boolean;
      features: string[];
    }[]) || [];

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
              ABOUT US
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
              <span>ABOUT US</span>
            </li>
          </ul>
        </div>
      </div>

      <section className="gt-about-section section-padding fix">
        <div className="gt-left-shape">
          <img src={themeAssets.about.shape1} alt="" />
        </div>
        <div className="gt-right-shape">
          <img src={themeAssets.about.shape2} alt="" />
        </div>
        <div className="container">
          <div className="gt-about-wrapper-3">
            <div className="row g-4">
              <div className="col-lg-6">
                <div className="gt-about-image wow fadeInUp" data-wow-delay=".3s">
                  <img src={aboutImage} alt="img" />
                  <div className="gt-blur-shape">
                    <img src={themeAssets.about.blur} alt="" />
                  </div>
                  <div className="gt-circle-shape">
                    <img src={themeAssets.about.circle} alt="" />
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="gt-about-content">
                  <div className="gt-section-title mb-0">
                    <span className="gt-sub-title gt-style-4 wow fadeInUp">{badge}</span>
                    <h2 className="wow fadeInUp" data-wow-delay=".3s">
                      {title}
                    </h2>
                  </div>
                  <p className="gt-text wow fadeInUp" data-wow-delay=".5s">
                    {description}
                  </p>
                  <div className="gt-counter-box wow fadeInUp" data-wow-delay=".3s">
                    {stats.length > 0
                      ? stats.map((s, i) => (
                          <div key={i} className="gt-count-item">
                            <h2>
                              <span className="gt-count">{s.value}</span>
                              {s.suffix || ""}
                            </h2>
                            <p>{s.label}</p>
                          </div>
                        ))
                      : [
                          { value: "25", label: "Our Visionary Speakers", suffix: "+" },
                          { value: "897", label: "Event Participants", suffix: "+" },
                          { value: "69", label: "International Sponsors", suffix: "+" },
                        ].map((s, i) => (
                          <div key={i} className="gt-count-item">
                            <h2>
                              <span className="gt-count">{s.value}</span>
                              {s.suffix}
                            </h2>
                            <p>{s.label}</p>
                          </div>
                        ))}
                  </div>
                  <div className="gt-about-button wow fadeInUp" data-wow-delay=".5s">
                    <Link href="/events" className="gt-theme-btn gt-theme-btn-3">
                      <i className="fa-solid fa-arrow-up"></i> get tickets
                    </Link>
                    <ul className="gt-button">
                      <li>
                        <i className="fa-solid fa-phone-volume"></i>
                        <a href={`tel:${phoneNumber.replace(/\s/g, "")}`}>{phoneNumber}</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="gt-event-ticket-section-2 section-padding fix">
        <div className="gt-top-shape float-bob-y">
          <img src="/assets/img/decorations/box-shape-1.png" alt="img" />
        </div>
        <div className="gt-left-shape float-bob-y">
          <img src="/assets/img/decorations/box-shape-1.png" alt="img" />
        </div>
        <div className="gt-right-shape float-bob-y">
          <img src="/assets/img/decorations/box-shape-2.png" alt="img" />
        </div>
        <div className="gt-right-shape-2">
          <img src="/assets/img/decorations/blur-shape-2.png" alt="img" />
        </div>
        <div className="container">
          <div className="gt-section-title-area">
            <div className="gt-section-title-2">
              <span className="gt-sub-title gt-style-2 style-3 wow fadeInUp">
                <span className="right-large-border"></span>
                <span className="right-small-border"></span>
                buy ticket
                <span className="left-small-border"></span>
                <span className="left-large-border"></span>
              </span>
              <h2 className="wow fadeInUp" data-wow-delay=".3s">
                buy a ticket be the <br />
                <span>first one</span>
              </h2>
            </div>
            <Link href="/events" className="gt-theme-btn gt-theme-btn-2 gt-border-btn">
              <i className="fa-solid fa-ticket-simple"></i> PURCHASE TICKET
            </Link>
          </div>
          <div className="row">
            {(ticketPackages.length > 0
              ? ticketPackages
              : [
                  { name: "Gold package", price: "09$", highlighted: false, features: [] },
                  { name: "Diamond package", price: "09$", highlighted: true, features: [] },
                  { name: "Platinum package", price: "09$", highlighted: false, features: [] },
                ]
            ).map((t, i) => (
              <div
                key={i}
                className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp"
                data-wow-delay={`.${3 + i * 2}s`}
              >
                <div className={`gt-main-card-item ${t.highlighted ? "gt-style-2" : "gt-bg"} mb-0`}>
                  <div className="gt-event-ticket-card-item">
                    <h3 style={{ textTransform: "capitalize" }}>{t.name}</h3>
                    <div className="gt-event-box-item">
                      <h6>
                        DEFAULT <span>(Unlimited tickets)</span>
                      </h6>
                      <div className="gt-box-item">
                        <div className="gt-item">
                          <span>Ticket Price :</span>
                          <p>{t.price}</p>
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
                              id={`qty${i}`}
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
                      {t.features.length > 0 ? (
                        t.features.map((f, fi) => (
                          <li key={fi}>
                            <span>{f.split(":")[0]}:</span> {f.split(":")[1] || "Yes"}
                          </li>
                        ))
                      ) : (
                        <>
                          <li>
                            <span>Lunch & Coffee :</span> Yes
                          </li>
                          <li>
                            <span>Certificate :</span> Yes
                          </li>
                        </>
                      )}
                    </ul>
                    <div className="gt-card-button">
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

      <section className="gt-testimonial-section-2 gt-margin-bootom fix bg-cover" style={{ backgroundColor: "#0a0a1a" }}>
        <div className="left-shape">
          <img src="/assets/img/testimonials/shape.png" alt="" />
        </div>
        <div className="container">
          <div className="gt-testimomnial-wrapper-2">
            <div className="row g-4 align-items-center">
              <div className="col-lg-6">
                <div className="gt-testimonial-card-item">
                  <div className="gt-shape">
                    <img src="/assets/img/testimonials/shape-2.png" alt="" />
                  </div>
                  <div className="gt-shape-2">
                    <img src="/assets/img/testimonials/shape-3.png" alt="" />
                  </div>
                  <div className="array-buttons-2">
                    <button className="array-prev"><i className="fa-solid fa-arrow-left"></i></button>
                    <button className="array-next"><i className="fa-solid fa-arrow-right"></i></button>
                  </div>
                  <div className="swiper gt-testimonial-slider-2">
                    <div className="swiper-wrapper">
                      {(testimonialsData.length > 0 ? testimonialsData : Array(3).fill(null)).map(
                        (t, i) => {
                          const item = (t || {}) as Record<string, string>;
                          return (
                            <div key={i} className="swiper-slide">
                              <div className="gt-testmonial-content">
                                <h3>Next-level experience!</h3>
                                <p>
                                  &ldquo;
                                  {item.quote ||
                                    "Attending this design conference was a game-changer. The speakers were not only knowledgeable but also made complex concepts easy to understand."}
                                  &rdquo;
                                </p>
                                <h6>
                                  {item.name || "Mark D."}, <span>{item.role || "Tech Entrepreneur"}</span>
                                </h6>
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="gt-testimonial-image">
                  <img src={themeAssets.speakers.photos[0]} alt="Conference attendee" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
