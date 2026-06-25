"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/speakers", label: "Speakers" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact Us" },
  { href: "/blog", label: "Blog" },
  { href: "/pricing", label: "Pricing" },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <div className="fix-area">
        <div className={`offcanvas__info ${isOpen ? "info-open" : ""}`}>
          <div className="offcanvas__wrapper">
            <div className="offcanvas__content">
              <div className="offcanvas__top mb-5 d-flex justify-content-between align-items-center">
                <div className="offcanvas__logo">
                  <Link href="/">
                    <img src="/assets/img/logo/blue-logo.svg" alt="logo-img" />
                  </Link>
                </div>
                <div className="offcanvas__close">
                  <button onClick={() => setIsOpen(false)} aria-label="Close">
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>
              <div className="mobile-menus fix mb-3">
                <nav>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {navLinks.map((link) => (
                      <li key={link.href} style={{ borderBottom: "1px solid #eee" }}>
                        <Link
                          href={link.href}
                          onClick={() => setIsOpen(false)}
                          style={{
                            display: "block",
                            padding: "15px 0",
                            color: "#333",
                            textDecoration: "none",
                          }}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
              <div className="sideber-image">
                <img src="/assets/img/header/sideber.jpg" alt="img" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`offcanvas__overlay ${isOpen ? "overlay-open" : ""}`}
        onClick={() => setIsOpen(false)}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.5)",
          zIndex: isOpen ? 9997 : -1,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
          transition: "opacity 0.3s ease",
        }}
      />

      <div className="search-popup">
        <div
          className={`search-popup__overlay search-toggler ${searchOpen ? "show" : ""}`}
          onClick={() => setSearchOpen(false)}
        />
        <div className="search-popup__content" style={{ display: searchOpen ? "block" : "none" }}>
          <form role="search" style={{ display: "flex" }}>
            <input
              type="text"
              placeholder="Search Here..."
              style={{
                flex: 1,
                padding: "10px 15px",
                border: "1px solid #ddd",
                borderRadius: "4px 0 0 4px",
                fontSize: "16px",
              }}
            />
            <button
              type="submit"
              className="search-btn gt-style-3"
              style={{
                padding: "10px 20px",
                background: "#1539EE",
                color: "#fff",
                border: "none",
                borderRadius: "0 4px 4px 0",
                cursor: "pointer",
              }}
            >
              <span><i className="fa-regular fa-magnifying-glass"></i></span>
            </button>
          </form>
          <button
            onClick={() => setSearchOpen(false)}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              background: "none",
              border: "none",
              fontSize: "20px",
              cursor: "pointer",
            }}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      </div>

      <div
        className="header__hamburger d-xl-block my-auto"
        onClick={() => setIsOpen(true)}
        style={{ cursor: "pointer" }}
      >
        <div className="sidebar__toggle">
          <i className="fas fa-bars"></i>
        </div>
      </div>
    </>
  );
}