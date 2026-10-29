"use client";

import { useState, useEffect } from "react";

export function HeaderNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  const navLinks = [
    { href: "#projects", label: "Projects" },
    { href: "#about", label: "About" },
    { href: "#skills", label: "Skills" },
    { href: "#education", label: "Education" },
    { href: "#experience", label: "Experience" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <header className={`site-header ${scrolled ? "site-header-scrolled" : ""}`}>
      <div className="header-container">
        <a className="wordmark" href="#home" aria-label="Shreyas P R home">
          <span className="wordmark-mark">S</span>
          <span className="wordmark-text">
            Shreyas P R<span className="wordmark-period">.</span>
          </span>
        </a>

        <nav className="desktop-nav" aria-label="Main navigation">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="nav-link">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <a className="header-cta" href="#contact">
            <span>Let&apos;s connect</span>
            <span className="cta-arrow" aria-hidden="true">↗</span>
          </a>

          <button
            type="button"
            className="mobile-menu-toggle"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            <span className={`hamburger-line ${mobileMenuOpen ? "open-top" : ""}`} />
            <span className={`hamburger-line ${mobileMenuOpen ? "open-mid" : ""}`} />
            <span className={`hamburger-line ${mobileMenuOpen ? "open-bot" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <div
        className={`mobile-nav-drawer ${mobileMenuOpen ? "mobile-nav-drawer-open" : ""}`}
        aria-hidden={!mobileMenuOpen}
        inert={!mobileMenuOpen}
      >
        <div className="mobile-nav-inner">
          <p className="mobile-nav-heading">NAVIGATION</p>
          <nav className="mobile-nav-links">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="mobile-nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>{link.label}</span>
                <span className="mobile-nav-arrow" aria-hidden="true">→</span>
              </a>
            ))}
          </nav>
          <div className="mobile-nav-footer">
            <a
              href="#contact"
              className="button button-primary mobile-cta-button"
              onClick={() => setMobileMenuOpen(false)}
            >
              Get in touch <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
