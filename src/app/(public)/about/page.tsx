export const dynamic = "force-dynamic";
export const revalidate = 0;

import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import { db } from "@/lib/db";
import { defaultContent } from "@/lib/landing-defaults";
import { themeAssets } from "@/lib/theme-images";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { AboutConferenceSection } from "@/components/theme/about-conference-section";

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

  const aboutDefaults = defaultContent["about-page"] as Record<string, unknown>;
  const badge = (aboutContent.badge as string) || (aboutDefaults.badge as string);
  const title = (aboutContent.title as string) || (aboutDefaults.title as string);
  const description =
    (aboutContent.description as string) || (aboutDefaults.description as string);
  const stats = (aboutContent.stats as { value: string; label: string; suffix?: string }[]) ||
    (aboutDefaults.stats as { value: string; label: string; suffix?: string }[]);
  const phoneNumber = (aboutContent.phoneNumber as string) || (aboutDefaults.phoneNumber as string);
  const ticketPackages =
    (aboutContent.ticketPackages as {
      name: string;
      price: string;
      highlighted: boolean;
      features: string[];
    }[]) || [];

  return (
    <>
      <Breadcrumb title="ABOUT US" />

      <AboutConferenceSection
        badge={badge}
        title={title}
        description={description}
        image={aboutContent.image as string}
        stats={stats}
        phoneNumber={phoneNumber}
      />

      <section className="gt-event-ticket-section-2 section-padding fix">
        <div className="gt-top-shape float-bob-y">
          <img src={themeAssets.decorations.box1} alt="img" />
        </div>
        <div className="gt-left-shape float-bob-y">
          <img src={themeAssets.decorations.box1} alt="img" />
        </div>
        <div className="gt-right-shape float-bob-y">
          <img src={themeAssets.decorations.box2} alt="img" />
        </div>
        <div className="gt-right-shape-2">
          <img src={themeAssets.decorations.blur2} alt="img" />
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
                  <img src={themeAssets.testimonial} alt="Conference attendee" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
