import Link from "next/link";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { themeAssets } from "@/lib/theme-images";

export default function NotFound() {
  return (
    <>
      <Breadcrumb title="ERROR 404" label="ERROR 404" />

      <section className="gt-error-section section-padding fix">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="gt-error-items">
                <div className="gt-error-image wow fadeInUp" data-wow-delay=".3s">
                  <img
                    src={themeAssets.error404}
                    alt="404 illustration"
                    style={{ maxWidth: 300, borderRadius: 20 }}
                  />
                </div>
                <h2 className="wow fadeInUp" data-wow-delay=".5s">
                  Page not Found
                </h2>
                <p>Sorry, we could not find the page you are looking for</p>
                <Link href="/" className="gt-theme-btn">
                  back to home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
