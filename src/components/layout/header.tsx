"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { defaultContent } from "@/lib/landing-defaults";

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

function NavLinks({ isHome }: { isHome: boolean }) {
  const pathname = usePathname();
  const isActive = (path: string) => (pathname === path ? "active" : "");

  return (
    <ul>
      <li className={`has-dropdown ${isActive("/") ? "active" : ""}`}>
        <a href="/" className={isHome ? "border-none" : undefined}>
          Home
        </a>
        <ul className="submenu">
          <li><a href="/">Design Conference</a></li>
        </ul>
      </li>
      <li
        className={`has-dropdown ${
          isActive("/about") ||
          isActive("/sponsor") ||
          isActive("/pricing") ||
          isActive("/service") ||
          isActive("/service-details")
            ? "active"
            : ""
        }`}
      >
        <a href="/about">Pages</a>
        <ul className="submenu">
          <li><a href="/about">About Us</a></li>
          <li className="has-dropdown">
            <a href="/service-details">
              Our Service <i className="fas fa-angle-right"></i>
            </a>
            <ul className="submenu">
              <li><a href="/service">Our Services</a></li>
              <li><a href="/service-details">Service Details</a></li>
            </ul>
          </li>
          <li><a href="/sponsor">Sponsor</a></li>
          <li><a href="/pricing">Our Pricing</a></li>
        </ul>
      </li>
      <li className={`has-dropdown ${isActive("/events") || isActive("/event-details") ? "active" : ""}`}>
        <a href="/events">event</a>
        <ul className="submenu">
          <li><a href="/events">Event</a></li>
          <li><a href="/event-details">Event Details</a></li>
        </ul>
      </li>
      <li className={`has-dropdown ${isActive("/speakers") || isActive("/speaker-details") ? "active" : ""}`}>
        <a href="/speakers">Speaker</a>
        <ul className="submenu">
          <li><a href="/speakers">Speaker</a></li>
          <li><a href="/speaker-details">Speaker Details</a></li>
        </ul>
      </li>
      <li className={`has-dropdown ${isActive("/blog") || isActive("/news-grid") || isActive("/news-details") ? "active" : ""}`}>
        <a href="/blog">Blog</a>
        <ul className="submenu">
          <li><a href="/news-grid">Blog Grid</a></li>
          <li><a href="/blog">Blog Standard</a></li>
          <li><a href="/news-details">Blog Details</a></li>
        </ul>
      </li>
      <li className={isActive("/contact")}>
        <a href="/contact">Contact Us</a>
      </li>
    </ul>
  );
}

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
  const logoSrc = isHome ? "/assets/img/logo/blue-logo.svg" : "/assets/img/logo/black-logo.svg";
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
                <img src={logoSrc} alt="logo-img" />
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
