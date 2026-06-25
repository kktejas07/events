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

export function Offcanvas() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const offcanvasInfo = document.querySelector(".offcanvas__info");
      const offcanvasOverlay = document.querySelector(".offcanvas__overlay");

      const handleToggle = () => {
        setIsOpen((prev) => {
          const newState = !prev;
          if (offcanvasInfo) {
            if (newState) {
              offcanvasInfo.classList.add("info-open");
              offcanvasOverlay?.classList.add("overlay-open");
            } else {
              offcanvasInfo.classList.remove("info-open");
              offcanvasOverlay?.classList.remove("overlay-open");
            }
          }
          return newState;
        });
      };

      const handleClose = () => {
        setIsOpen(false);
        offcanvasInfo?.classList.remove("info-open");
        offcanvasOverlay?.classList.remove("overlay-open");
      };

      window.addEventListener("toggle-sidebar", handleToggle);
      document.querySelector(".offcanvas__close button")?.addEventListener("click", handleClose);
      document.querySelector(".offcanvas__overlay")?.addEventListener("click", handleClose);

      return () => {
        window.removeEventListener("toggle-sidebar", handleToggle);
        document.querySelector(".offcanvas__close button")?.removeEventListener("click", handleClose);
        document.querySelector(".offcanvas__overlay")?.removeEventListener("click", handleClose);
      };
    }
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div className="fix-area">
      <div className="offcanvas__info">
        <div className="offcanvas__wrapper">
          <div className="offcanvas__content">
            <div className="offcanvas__top mb-5 d-flex justify-content-between align-items-center">
              <div className="offcanvas__logo">
                <Link href="/">
                  <img src="/assets/img/logo/blue-logo.svg" alt="logo-img" />
                </Link>
              </div>
              <div className="offcanvas__close">
                <button>
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
      <div className="offcanvas__overlay" />
    </div>
  );
}