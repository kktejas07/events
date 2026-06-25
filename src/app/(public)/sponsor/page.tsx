export const dynamic = "force-dynamic";
export const revalidate = 0;

import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import { db } from "@/lib/db";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { themeAssets } from "@/lib/theme-images";
import { hyderabadColleges } from "@/lib/hyderabad-colleges";

export default async function SponsorPage() {
  noStore();

  let sponsors: {
    id: string;
    name: string;
    logoUrl: string | null;
    websiteUrl: string | null;
    tier: string;
  }[] = [];

  try {
    sponsors = await db.sponsor.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
  } catch (error) {
    console.error("Sponsor page fetch error:", error);
  }

  const displaySponsors =
    sponsors.length > 0
      ? sponsors
      : hyderabadColleges.map((c, i) => ({
          id: String(i),
          name: c.name,
          logoUrl: c.logo,
          websiteUrl: c.website,
          tier: c.tier || "Gold",
        }));

  return (
    <>
      <Breadcrumb title="OUR SPONSOR" />

      <section className="gt-sponsor-secton section-padding fix">
        <div className="container">
          <div className="row g-4">
            {displaySponsors.map((sp, i) => (
              <div
                key={sp.id}
                className="col-xl-3 col-lg-4 col-md-6 wow fadeInUp"
                data-wow-delay={`.${2 + (i % 4) * 2}s`}
              >
                <div className="gt-sponsor-item mt-0">
                  <div className="gt-sponsor-logo">
                    <img
                      src={sp.logoUrl || hyderabadColleges[i % hyderabadColleges.length].logo}
                      alt={sp.name}
                    />
                  </div>
                  <div className="gt-hover-bg">
                    <h4>
                      <a href={sp.websiteUrl || "/contact"} target="_blank" rel="noopener noreferrer">
                        {sp.name}
                      </a>
                    </h4>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="gt-sponsor-bg-section fix">
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
                apply for event sponsors
              </h2>
              <p className="wow fadeInUp" data-wow-delay=".5s">
                Partner with us alongside leading Hyderabad colleges and universities to reach
                thousands of students, faculty, and industry professionals.
              </p>
              <Link href="/contact" className="gt-theme-btn wow fadeInUp" data-wow-delay=".3s">
                <i className="fa-solid fa-arrow-up"></i> get sponsors
              </Link>
            </div>
            <div className="gt-qr-image wow fadeInUp" data-wow-delay=".3s">
              <img src={themeAssets.sponsors.qr} alt="Sponsor QR code" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
