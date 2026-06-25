export const dynamic = "force-dynamic";
export const revalidate = 0;

import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import { db } from "@/lib/db";

export default async function PricingPage() {
  noStore();

  let pricingContent: Record<string, unknown> = {};

  try {
    const row = await db.siteContent.findFirst({ where: { section: "pricing-page" } });
    if (row?.data) pricingContent = row.data as Record<string, unknown>;
  } catch (error) {
    console.error("Pricing page fetch error:", error);
  }

  const badge = (pricingContent.badge as string) || "buy ticket";
  const title = (pricingContent.title as string) || "buy a ticket be the first one";
  const packages =
    (pricingContent.packages as {
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
              PRICING PLAN
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
              <span>PRICING PLAN</span>
            </li>
          </ul>
        </div>
      </div>

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
                {badge}
                <span className="left-small-border"></span>
                <span className="left-large-border"></span>
              </span>
              <h2 className="wow fadeInUp" data-wow-delay=".3s">
                {title?.includes("first one") ? (
                  <>buy a ticket be the <br /><span>first one</span></>
                ) : (
                  title
                )}
              </h2>
            </div>
            <Link href="/events" className="gt-theme-btn gt-theme-btn-2 gt-border-btn">
              <i className="fa-solid fa-ticket-simple"></i> PURCHASE TICKET
            </Link>
          </div>
          <div className="row">
            {(packages.length > 0
              ? packages
              : [
                  { name: "Gold package", price: "$99", highlighted: false, features: [] },
                  { name: "Diamond package", price: "$149", highlighted: true, features: [] },
                  { name: "platinum package", price: "$199", highlighted: false, features: [] },
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
                      {t.features && t.features.length > 0 ? (
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

      <section className="gt-events-schedule-section section-padding fix pt-0">
        <div className="gt-right-shape">
          <img src="/assets/img/decorations/circle-shape-3.png" alt="img" />
        </div>
        <div className="container">
          <div className="gt-section-title text-center">
            <span className="gt-sub-title wow fadeInUp">events schedule</span>
            <h2 className="wow fadeInUp" data-wow-delay=".3s">our events Schedule</h2>
          </div>
          <div className="gt-event-schedule-wrapper">
            <ul className="nav" role="tablist">
              {["day 01", "day 02", "day 03", "day 04"].map((day, i) => (
                <li key={day} className="nav-item wow fadeInUp" data-wow-delay={`.${2 + i * 2}s`}>
                  <a
                    href={`#${["technical", "work", "ambition", "skill"][i]}`}
                    data-bs-toggle="tab"
                    className={`nav-link ${i === 0 ? "active" : ""}`}
                    aria-selected={i === 0}
                    role="tab"
                  >
                    {day}
                  </a>
                </li>
              ))}
            </ul>
            <div className="tab-content">
              {[
                [
                  { date: "25 april, 2025", room: "Room 2025", title: "data science upcoming business conference in town", location: "Bauhof, 4652 Steinerkirchen an der Traun" },
                  { date: "25 april, 2025", room: "Room 2025", title: "Everyday Intelligence Research Rewired events", location: "Bauhof, 4652 Steinerkirchen an der Traun" },
                  { date: "25 april, 2025", room: "Room 2025", title: "A general list of well-known business conferences", location: "Bauhof, 4652 Steinerkirchen an der Traun" },
                ],
                [
                  { date: "26 april, 2025", room: "Room 2025", title: "data science upcoming business conference in town", location: "Bauhof, 4652 Steinerkirchen an der Traun" },
                  { date: "26 april, 2025", room: "Room 2025", title: "Everyday Intelligence Research Rewired events", location: "Bauhof, 4652 Steinerkirchen an der Traun" },
                  { date: "26 april, 2025", room: "Room 2025", title: "A general list of well-known business conferences", location: "Bauhof, 4652 Steinerkirchen an der Traun" },
                ],
                [
                  { date: "27 april, 2025", room: "Room 2025", title: "data science upcoming business conference in town", location: "Bauhof, 4652 Steinerkirchen an der Traun" },
                  { date: "27 april, 2025", room: "Room 2025", title: "Everyday Intelligence Research Rewired events", location: "Bauhof, 4652 Steinerkirchen an der Traun" },
                  { date: "27 april, 2025", room: "Room 2025", title: "A general list of well-known business conferences", location: "Bauhof, 4652 Steinerkirchen an der Traun" },
                ],
                [
                  { date: "28 april, 2025", room: "Room 2025", title: "data science upcoming business conference in town", location: "Bauhof, 4652 Steinerkirchen an der Traun" },
                  { date: "28 april, 2025", room: "Room 2025", title: "Everyday Intelligence Research Rewired events", location: "Bauhof, 4652 Steinerkirchen an der Traun" },
                  { date: "28 april, 2025", room: "Room 2025", title: "A general list of well-known business conferences", location: "Bauhof, 4652 Steinerkirchen an der Traun" },
                ],
              ].map((sessions, tabIdx) => (
                <div
                  key={tabIdx}
                  id={["technical", "work", "ambition", "skill"][tabIdx]}
                  className={`tab-pane fade ${tabIdx === 0 ? "active show" : ""}`}
                  role="tabpanel"
                >
                  <div className="row">
                    <div className="col-xl-12">
                      {sessions.map((s, i) => (
                        <div key={i} className="gt-event-schedule-item">
                          <div className="gt-dot-shape">
                            <img src="/assets/img/home-1/event/line-shape-2.png" alt="" />
                          </div>
                          <div className="gt-event-image">
                            <img src={`/assets/img/home-1/event/event-${(i % 3) + 1}.png`} alt="img" />
                          </div>
                          <div className="gt-event-schedule-content">
                            <ul className="gt-event-list">
                              <li><i className="fa-regular fa-calendar-days"></i> {s.date}</li>
                              <li><i className="fa-regular fa-door-open"></i> {s.room}</li>
                            </ul>
                            <h3><Link href="/events">{s.title}</Link></h3>
                            <ul className="gt-list">
                              <li><i className="fa-regular fa-location-dot"></i> {s.location}</li>
                            </ul>
                            <div className="gt-client-info">
                              <div className="gt-client-image">
                                <img src="/assets/img/home-1/event/client.png" alt="img" />
                              </div>
                              <div className="gt-text"><h6>speakers</h6></div>
                            </div>
                          </div>
                          <div className="gt-event-button">
                            <Link href="/events" className="gt-theme-btn"><i className="fa-solid fa-arrow-up"></i> get tickets</Link>
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
    </>
  );
}
