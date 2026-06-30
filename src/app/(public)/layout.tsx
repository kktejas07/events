export const dynamic = "force-dynamic";
export const revalidate = 0;

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ThemeInit } from "@/components/ui/theme-init";
import { themeAssets } from "@/lib/theme-images";
import { Logo } from "@/components/ui/logo";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Preloader Start */}
      <div id="preloader" className="preloader" suppressHydrationWarning>
        <div className="animation-preloader">
          <div className="spinner"></div>
          <div className="txt-loading">
            <span data-text-preloader="E" className="letters-loading">E</span>
            <span data-text-preloader="C" className="letters-loading">C</span>
            <span data-text-preloader="H" className="letters-loading">H</span>
            <span data-text-preloader="O" className="letters-loading">O</span>
          </div>
          <p className="text-center">Loading</p>
        </div>
        <div className="loader">
          <div className="row">
            <div className="col-3 loader-section section-left"><div className="bg"></div></div>
            <div className="col-3 loader-section section-left"><div className="bg"></div></div>
            <div className="col-3 loader-section section-right"><div className="bg"></div></div>
            <div className="col-3 loader-section section-right"><div className="bg"></div></div>
          </div>
        </div>
      </div>

      {/* GT Back To Top Start */}
      <button id="gt-back-top" className="gt-back-to-top show">
        <i className="fa-regular fa-arrow-up"></i>
      </button>

      {/* GT MouseCursor Start */}
      <div className="mouseCursor cursor-outer"></div>
      <div className="mouseCursor cursor-inner"></div>

      {/* Offcanvas Area Start */}
      <div className="fix-area">
        <div className="offcanvas__info">
          <div className="offcanvas__wrapper">
            <div className="offcanvas__content">
              <div className="offcanvas__top mb-5 d-flex justify-content-between align-items-center">
                <div className="offcanvas__logo">
                  <a href="/">
                    <Logo />
                  </a>
                </div>
                <div className="offcanvas__close">
                  <button><i className="fas fa-times"></i></button>
                </div>
              </div>
              <div className="mobile-menu fix mb-3"></div>
              <div className="mobile-menus fix mb-3"></div>
              <div className="sideber-image">
                <img src={themeAssets.sideber} alt="Conference" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="offcanvas__overlay"></div>

      {/* GT Search Start */}
      <div className="search-popup">
        <div className="search-popup__overlay search-toggler"></div>
        <div className="search-popup__content">
          <form role="search" method="get" className="search-popup__form" action="#">
            <input type="text" id="search" name="search" placeholder="Search Here..." />
            <button type="submit" aria-label="search submit" className="search-btn gt-style-3">
              <span><i className="fa-regular fa-magnifying-glass"></i></span>
            </button>
          </form>
        </div>
      </div>

      <Header />
      <main>{children}</main>
      <Footer />
      <ThemeInit />
    </>
  );
}