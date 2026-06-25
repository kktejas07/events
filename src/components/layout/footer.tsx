import Link from "next/link";
import { db } from "@/lib/db";
import { NewsletterForm } from "@/components/ui/newsletter-form";
import { themeAssets } from "@/lib/theme-images";

const SOCIAL_ICONS: { key: string; icon: string }[] = [
  { key: "SOCIAL_FACEBOOK_URL", icon: "fab fa-facebook-f" },
  { key: "SOCIAL_TWITTER_URL", icon: "fab fa-twitter" },
  { key: "SOCIAL_LINKEDIN_URL", icon: "fa-brands fa-linkedin-in" },
  { key: "SOCIAL_INSTAGRAM_URL", icon: "fa-brands fa-instagram" },
];

async function getSocialLinks(): Promise<Record<string, string>> {
  try {
    const rows = await db.platformSetting.findMany({
      where: { key: { in: SOCIAL_ICONS.map((s) => s.key) } },
    });
    return Object.fromEntries(rows.map((r) => [r.key, r.value]));
  } catch {
    return {};
  }
}

export async function Footer() {
  const socialLinks = await getSocialLinks();
  return (
    <footer
      className="gt-footer-section-3 fix bg-cover"
      style={{ backgroundImage: `url(${themeAssets.footer.background})` }}
    >
      <div className="container">
        <div className="footer-widget-wrapper-3">
          <div className="row justify-content-center">
            <div className="col-xl-10">
              <div className="gt-widget-head-logo wow fadeInUp" data-wow-delay=".3s">
                <Link href="/" className="gt-footer-logo">
                  <img src="/assets/img/logo/white-logo.svg" alt="img" />
                </Link>
              </div>
              <ul className="gt-footer-list wow fadeInUp" data-wow-delay=".5s">
                <li>
                  <Link href="/">home</Link>
                </li>
                <li>
                  <Link href="/about">about us</Link>
                </li>
                <li>
                  <Link href="/events">events</Link>
                </li>
                <li>
                  <Link href="/speakers">speakers</Link>
                </li>
                <li>
                  <Link href="/contact">contact us</Link>
                </li>
              </ul>
              <div className="wow fadeInUp" data-wow-delay=".3s">
                <NewsletterForm />
              </div>
              <div className="gt-footer-wrapper-3">
                <p className="wow fadeInLeft" data-wow-delay=".3s">
                  &copy; {new Date().getFullYear()} echo. All Rights Reserved.
                </p>
                <div
                  className="gt-social-icon d-flex align-items-center wow fadeInRight"
                  data-wow-delay=".5s"
                >
                  {SOCIAL_ICONS.filter((s) => socialLinks[s.key]).map((s) => (
                    <a key={s.key} href={socialLinks[s.key]} target="_blank" rel="noopener noreferrer">
                      <i className={s.icon}></i>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}