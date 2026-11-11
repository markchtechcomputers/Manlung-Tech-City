import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  ChevronDown,
  Mail,
  MapPin,
  Menu,
  Phone,
  X,
} from "lucide-react";
import type { ReactNode } from "react";
import { businessContact } from "@/data/contact";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <a className="brand" href="/" aria-label="Manlung Tech City home">
      <svg
        className="brand-mark"
        viewBox="0 0 48 48"
        fill="none"
        aria-hidden="true"
      >
        <rect width="48" height="48" rx="11" fill="#35e897" />
        <path
          d="M24 7 39 13v11c0 9-7 14-15 18C16 38 9 33 9 24V13L24 7Z"
          fill="#0b1010"
        />
        <path
          d="M24 13v10m0 0-7 5v6m7-11 7 5v6"
          stroke="#35e897"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="24" cy="24" r="4" fill="#35e897" />
        <circle cx="24" cy="14" r="2" fill="#35e897" />
        <circle cx="17" cy="33" r="2.5" fill="#35e897" />
        <circle cx="31" cy="33" r="2.5" fill="#35e897" />
      </svg>
      {!compact && (
        <span className="brand-type">
          manlung<span>TECH CITY</span>
        </span>
      )}
    </a>
  );
}

const navigation = [
  ["Home", "/"],
  ["eCitizen", "/services/government-e-services"],
  ["KRA / iTax", "/services/kra-itax-assistance"],
  ["Services", "/services"],
  ["Courses", "/courses"],
  ["About", "/about"],
  ["Insights", "/insights"],
];

function isCurrentPage(path: string, href: string) {
  if (href === "/") return path === "/";
  return href === "/insights"
    ? path === href || path.startsWith(`${href}/`)
    : path === href;
}

export default function SiteLayout({
  children,
  path,
}: {
  children: ReactNode;
  path: string;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuToggleRef = useRef<HTMLButtonElement>(null);
  const mobileNavRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    mobileNavRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuToggleRef.current?.focus();
      }
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <div className="utility-bar">
        <div className="container utility-inner">
          <span>
            <MapPin size={12} /> Proudly serving Kenyans <i /> Nairobi, Kenya
          </span>
          <div className="utility-contact">
            <a href={businessContact.phoneHref}>
              <Phone size={12} /> {businessContact.phoneDisplay}
            </a>
            <a href={businessContact.emailHref}>
              <Mail size={12} /> {businessContact.email}
            </a>
          </div>
        </div>
      </div>
      <header className="site-header">
        <div className="container header-inner">
          <Brand />
          <nav className="desktop-nav" aria-label="Main navigation">
            {navigation.map(([label, href]) =>
              href === "/services" ? (
                <details className="nav-dropdown" key={href}>
                  <summary>
                    Services <ChevronDown size={14} />
                  </summary>
                  <div className="nav-dropdown-menu">
                    <a href="/services">All services</a>
                    <a href="/services/government-e-services">
                      eCitizen & NTSA assistance
                    </a>
                    <a href="/services/kra-itax-assistance">
                      KRA & iTax assistance
                    </a>
                    <a href="/services/it-digital-support">Digital support</a>
                    <a href="/services/whatsapp-bot-hosting">
                      WhatsApp bot hosting & deployment
                    </a>
                    <a href="/courses">Cybersecurity courses</a>
                  </div>
                </details>
              ) : (
                <a
                  key={href}
                  href={href}
                  className={isCurrentPage(path, href) ? "active" : ""}
                  aria-current={isCurrentPage(path, href) ? "page" : undefined}
                >
                  {label}
                </a>
              )
            )}
          </nav>
          <a className="button button-primary header-cta" href="/contact">
            Get Assistance <ArrowUpRight size={17} />
          </a>
          <button
            ref={menuToggleRef}
            className="menu-toggle"
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X /> : <Menu />}
            <span className="menu-toggle-label">
              {menuOpen ? "Close" : "Menu"}
            </span>
          </button>
        </div>
        <nav
          id="mobile-navigation"
          ref={mobileNavRef}
          className="mobile-nav"
          aria-label="Mobile navigation"
          hidden={!menuOpen}
        >
          {navigation.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className={isCurrentPage(path, href) ? "active" : ""}
              aria-current={isCurrentPage(path, href) ? "page" : undefined}
              onClick={() => setMenuOpen(false)}
            >
              <span>{label}</span>
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          ))}
          <a
            className="mobile-nav-cta"
            href="/contact"
            onClick={() => setMenuOpen(false)}
          >
            <span>Get Assistance</span>
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </nav>
      </header>
      <main id="main-content">{children}</main>
      <footer className="site-footer">
        <div className="container footer-top">
          <div className="footer-brand">
            <Brand />
            <p>
              Technology, knowledge, and digital support.
              <br />
              Built around your next step.
            </p>
            <span className="local-label">
              <span className="kenya-flag" /> Proudly Kenyan. Digitally
              connected.
            </span>
          </div>
          <div className="footer-links">
            <h3>Explore</h3>
            <a href="/services">Our services</a>
            <a href="/courses">Cybersecurity courses</a>
            <a href="/about">About Manlung</a>
            <a href="/insights">Insights & resources</a>
            <a href="/review">Leave a service review</a>
          </div>
          <div className="footer-links">
            <h3>Digital services</h3>
            <a href="/services/government-e-services">
              eCitizen & NTSA assistance
            </a>
            <a href="/services/kra-itax-assistance">KRA & iTax support</a>
            <a href="/services/security-tool-setup">Security tool setup</a>
            <a href="/services/whatsapp-bot-hosting">
              WhatsApp bot hosting & deployment
            </a>
            <a href="/contact">Request a consultation</a>
          </div>
          <div className="footer-links contact-links">
            <h3>Keep in touch</h3>
            <a href={businessContact.phoneHref}>
              <Phone size={15} /> {businessContact.phoneDisplay}
            </a>
            <a href={businessContact.emailHref}>
              <Mail size={15} /> {businessContact.email}
            </a>
            <a
              href="https://t.me/manlungtechcitybot"
              target="_blank"
              rel="noopener noreferrer"
            >
              Talk on Telegram <ArrowUpRight size={15} />
            </a>
            <span>
              <MapPin size={15} /> Nairobi, Kenya
            </span>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>
            © {new Date().getFullYear()} Manlung Tech City. All rights
            reserved.
          </span>
          <div>
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
            <a href="#main-content">Back to top ↑</a>
          </div>
        </div>
      </footer>
    </>
  );
}
