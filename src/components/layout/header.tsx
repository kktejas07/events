"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { defaultContent } from "@/lib/landing-defaults";
import { NavLinks } from "@/components/layout/nav-links";
import { Logo } from "@/components/ui/logo";

type SiteSettings = {
  headerAddress: string;
  ticketButtonText: string;
  ticketButtonLink: string;
};

const defaultSite: SiteSettings = {
  headerAddress:
    (defaultContent.site as SiteSettings)?.headerAddress || "4233 w. 65th st. chicago il 60629",
  ticketButtonText: (defaultContent.site as SiteSettings)?.ticketButtonText || "get ticket",
  ticketButtonLink: (defaultContent.site as SiteSettings)?.ticketButtonLink || "/events",
};

export function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [site, setSite] = useState<SiteSettings>(defaultSite);

  useEffect(() => {
    fetch("/api/site-content")
      .then((r) => r.json())
      .then((data) => {
        const siteData = (data?.site || {}) as Partial<SiteSettings>;
        setSite({ ...defaultSite, ...siteData });
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    document.querySelector(".offcanvas__info")?.classList.remove("info-open");
    document.querySelector(".offcanvas__overlay")?.classList.remove("overlay-open");
  }, [pathname]);

  const ticketHref = session ? "/dashboard" : site.ticketButtonLink;
  const ticketLabel = session ? "dashboard" : site.ticketButtonText;
  const navId = isHome ? "mobile-menus" : "mobile-menu";

  return (
    <header id="header-sticky" className={isHome ? "header-1 header-3" : "header-1"}>
      <div className={isHome ? "container" : "container-fluid"}>
        <div className="mega-menu-wrapper">
          <div className="header-main">
            {isHome && (
              <div className="header-left">
                <ul className="gt-left">
                  <li>
                    <i className="fa-solid fa-location-dot"></i>
                    {site.headerAddress}
                  </li>
                </ul>
              </div>
            )}
            <div className="logo">
              <Link href="/" className="header-logo">
                <Logo />
              </Link>
            </div>
            <div className="header-right d-flex justify-content-end align-items-center mt-0">
              <div className="mean__menu-wrapper">
                <div className="main-menu">
                  <nav id={navId}>
                    <NavLinks isHome={isHome} />
                  </nav>
                </div>
              </div>
              <div className="header-right-icon">
                <a href="#" className="main-header__search search-toggler">
                  <i className="fa-regular fa-magnifying-glass"></i>
                </a>
              </div>
              <div className={`header-button${isHome ? " mt-2" : ""}`}>
                <Link href={ticketHref} className="gt-theme-btn">
                  <i className="fa-solid fa-ticket-simple"></i> {ticketLabel}
                </Link>
              </div>
              <div className="header__hamburger d-xl-block my-auto">
                <div className="sidebar__toggle" role="button" tabIndex={0} aria-label="Open menu">
                  <i className="fas fa-bars"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
