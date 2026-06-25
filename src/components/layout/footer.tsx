import Link from "next/link";
import { NewsletterForm } from "@/components/ui/newsletter-form";
import { themeAssets } from "@/lib/theme-images";

export function Footer() {
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
                <li>
                  <Link href="/blog">blog</Link>
                </li>
                <li>
                  <Link href="/pricing">pricing</Link>
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
                  <a href="#">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="#">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="#">
                    <i className="fa-brands fa-linkedin-in"></i>
                  </a>
                  <a href="#">
                    <i className="fa-brands fa-instagram"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}