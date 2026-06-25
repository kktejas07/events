export const dynamic = "force-dynamic";
export const revalidate = 0;

import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { EventScheduleTabs } from "@/components/theme/event-schedule-tabs";
import { db } from "@/lib/db";
import { themeAssets } from "@/lib/theme-images";

export default async function PricingPage() {
  noStore();

  let pricingContent: Record<string, unknown> = {};
  let firstEventSlug = "";

  try {
    const row = await db.siteContent.findFirst({ where: { section: "pricing-page" } });
    if (row?.data) pricingContent = row.data as Record<string, unknown>;
    const firstEvent = await db.event.findFirst({
      where: { status: "PUBLISHED" },
      select: { slug: true },
      orderBy: { startDate: "asc" },
    });
    if (firstEvent) firstEventSlug = firstEvent.slug;
  } catch (error) {
    console.error("Pricing page fetch error:", error);
  }

  const ticketHref = firstEventSlug ? `/events/${firstEventSlug}` : "/events";

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
      <Breadcrumb title="PRICING PLAN" />

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
            <Link href={ticketHref} className="gt-theme-btn gt-theme-btn-2 gt-border-btn">
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
                          <p>{t.price}</p>
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
                      <Link href={ticketHref} className="gt-theme-btn gt-theme-btn-2">
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
          <img src={themeAssets.decorations.circle3} alt="img" />
        </div>
        <div className="container">
          <div className="gt-section-title text-center">
            <span className="gt-sub-title wow fadeInUp">events schedule</span>
            <h2 className="wow fadeInUp" data-wow-delay=".3s">
              our events Schedule
            </h2>
          </div>
          <EventScheduleTabs embedded defaultTicketHref={ticketHref} />
        </div>
      </section>
    </>
  );
}
