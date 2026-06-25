import Link from "next/link";
import { themeAssets } from "@/lib/theme-images";

export interface TicketPackage {
  id?: string;
  name: string;
  price: number | string;
  highlighted?: boolean;
  features?: string[];
  href?: string;
}

const defaultPackages: TicketPackage[] = [
  { name: "Gold package", price: 99, highlighted: false },
  { name: "Diamond package", price: 149, highlighted: true },
  { name: "platinum package", price: 199, highlighted: false },
];

export function EventTicketPackages({
  packages,
  purchaseHref = "/events",
}: {
  packages?: TicketPackage[];
  purchaseHref?: string;
}) {
  const tiers = packages && packages.length > 0 ? packages.slice(0, 3) : defaultPackages;

  return (
    <section
      className="gt-event-ticket-section section-padding fix bg-cover"
      style={{ backgroundImage: "url(/assets/img/home-1/event/event-bg-2.png)" }}
    >
      <div className="gt-blur-shape">
        <img src={themeAssets.ticketBlur} alt="" />
      </div>
      <div className="container">
        <div className="gt-section-title text-center">
          <span className="gt-sub-title gt-bg text-white wow fadeInUp">buy tickets</span>
          <h2 className="text-white wow fadeInUp" data-wow-delay=".3s">
            buy a ticket be the <br />
            <span>first one</span>
          </h2>
        </div>
        <div className="row">
          {tiers.map((pkg, i) => {
            const price =
              typeof pkg.price === "number"
                ? pkg.price >= 1000
                  ? `₹${pkg.price.toLocaleString()}`
                  : `$${pkg.price}`
                : pkg.price;
            const subtotal =
              typeof pkg.price === "number"
                ? pkg.price >= 1000
                  ? `₹${(pkg.price * 2).toLocaleString()}`
                  : `$${pkg.price * 2}`
                : pkg.price;

            return (
              <div
                key={pkg.id || pkg.name}
                className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp"
                data-wow-delay={`.${3 + i * 2}s`}
              >
                <div className={`gt-main-card-item${pkg.highlighted ? " gt-style-2" : ""}`}>
                  <div className="gt-event-ticket-card-item">
                    <h3>{pkg.name}</h3>
                    <div className="gt-event-box-item">
                      <h6>
                        DEFAULT <span>( Unlimited tickets)</span>
                      </h6>
                      <div className="gt-box-item">
                        <div className="gt-item">
                          <span>Ticket Price :</span>
                          <p>{price}</p>
                        </div>
                        <div className="gt-item">
                          <span>Quantity :</span>
                          <p className="qty">
                            <button type="button" className="qtyminus" aria-hidden="true">
                              &minus;
                            </button>
                            <input type="number" name="qty" min="1" max="10" step="1" defaultValue="1" />
                            <button type="button" className="qtyplus" aria-hidden="true">
                              +
                            </button>
                          </p>
                        </div>
                        <div className="gt-item">
                          <span>Sub Total :</span>
                          <p>{subtotal}</p>
                        </div>
                      </div>
                    </div>
                    <ul className="gt-list-item">
                      {(pkg.features && pkg.features.length > 0
                        ? pkg.features.slice(0, 2)
                        : ["Lunch & Coffee : Yes", "Certificate : Yes"]
                      ).map((feature) => {
                        const [label, value] = feature.includes(":")
                          ? feature.split(":").map((s) => s.trim())
                          : [feature, "Yes"];
                        return (
                          <li key={feature}>
                            <span>{label} :</span> {value}
                          </li>
                        );
                      })}
                    </ul>
                    <div className="gt-card-button">
                      <Link href={pkg.href || purchaseHref} className="gt-theme-btn gt-style-2">
                        PURCHASE TICKET
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
