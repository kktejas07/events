import Link from "next/link";
import { themeAssets, aboutImage } from "@/lib/theme-images";

export type AboutStat = {
  value: string;
  label: string;
  suffix?: string;
};

export function AboutConferenceSection({
  badge = "About design conference",
  title = "Building The Future of digital design & Conferences",
  description = "Welcome to our design conference hub, where creativity meets innovation! We are a community of forward-thinking designers, industry leaders, and creative experts, united by our shared passion for digital excellence.",
  image,
  stats,
  phoneNumber = "+91 3214 0203 420",
  ticketHref = "/events",
}: {
  badge?: string;
  title?: string;
  description?: string;
  image?: string | null;
  stats?: AboutStat[];
  phoneNumber?: string;
  ticketHref?: string;
}) {
  const imgSrc = aboutImage(image);
  const defaultStats: AboutStat[] = [
    { value: "25", label: "Our Visionary Speakers", suffix: "+" },
    { value: "897", label: "Event Participants", suffix: "+" },
    { value: "69", label: "International Sponsors", suffix: "+" },
  ];
  const statItems = stats && stats.length > 0 ? stats : defaultStats;

  return (
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
                <img src={imgSrc} alt="Design conference" />
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
                  {statItems.map((s, i) => (
                    <div key={i} className="gt-count-item">
                      <h2>
                        <span className="gt-count">{s.value}</span>
                        {s.suffix || ""}
                      </h2>
                      <p>{s.label}</p>
                    </div>
                  ))}
                </div>
                <div className="gt-about-button wow fadeInUp" data-wow-delay=".5s">
                  <Link href={ticketHref} className="gt-theme-btn gt-theme-btn-3">
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
  );
}
