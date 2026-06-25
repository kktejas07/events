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

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (!mounted) return null;

  return (
    <>
      <div className="header__hamburger d-xl-none my-auto">
        <button
          className="sidebar__toggle"
          onClick={() => setIsOpen(true)}
          aria-label="Open menu"
        >
          <i className="fas fa-bars"></i>
        </button>
      </div>

      {isOpen && (
        <>
          <div
            className="offcanvas__overlay"
            onClick={() => setIsOpen(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.5)",
              zIndex: 9998,
            }}
          />
          <div
            className="offcanvas__info"
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              width: "300px",
              height: "100vh",
              background: "#fff",
              zIndex: 9999,
              padding: "20px",
              overflowY: "auto",
              boxShadow: "-5px 0 15px rgba(0,0,0,0.1)",
            }}
          >
            <div className="offcanvas__top mb-5 d-flex justify-content-between align-items-center">
              <div className="offcanvas__logo">
                <Link href="/" onClick={() => setIsOpen(false)}>
                  <img src="/assets/img/logo/blue-logo.svg" alt="logo-img" style={{ height: "40px" }} />
                </Link>
              </div>
              <div className="offcanvas__close">
                <button onClick={() => setIsOpen(false)} aria-label="Close menu">
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
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
                        fontSize: "16px",
                      }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </>
      )}
    </>
  );
}