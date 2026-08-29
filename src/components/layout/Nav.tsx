"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/menu", label: "Menu" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isDark = isHome && !scrolled;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
          scrolled || !isHome
            ? "bg-red py-3 shadow-lg"
            : "bg-transparent py-5"
        }`}
      >
        <div className="mx-auto max-w-6xl px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Image
              src={
                isDark
                  ? "/images/logos/solamada-logo-blanco-sol.png"
                  : "/images/logos/solamada-logo-blanco-sol.png"
              }
              alt="Solamada"
              width={100}
              height={100}
              className="h-10 w-auto"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-body text-sm font-medium uppercase tracking-widest transition-colors duration-200 ${
                  pathname === link.href
                    ? "text-gold"
                    : "text-white hover:text-gold"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA + Hamburger */}
          <div className="flex items-center gap-4">
            <Link
              href="/book"
              className="hidden md:inline-flex items-center justify-center rounded-pill bg-red px-5 py-2.5 font-body text-sm font-bold uppercase tracking-widest text-white transition-all duration-300 hover:bg-gold hover:shadow-btn-hover"
            >
              Get a Quote
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              className="md:hidden flex flex-col gap-1.5 p-2"
            >
              <span
                className={`block h-0.5 w-6 bg-white transition-all duration-300 ${mobileOpen ? "translate-y-2 rotate-45" : ""}`}
              />
              <span
                className={`block h-0.5 w-6 bg-white transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`block h-0.5 w-6 bg-white transition-all duration-300 ${mobileOpen ? "-translate-y-2 -rotate-45" : ""}`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-40 bg-red transition-transform duration-400 ease-out-expo flex flex-col items-center justify-center gap-8 md:hidden ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <Image
          src="/images/logos/solamada-logo-blanco-sol.png"
          alt="Solamada"
          width={140}
          height={140}
          className="h-28 w-auto mb-4"
        />
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="font-display text-3xl font-bold text-white hover:text-gold transition-colors"
          >
            {link.label}
          </Link>
        ))}
        <Link
          href="/book"
          className="mt-4 inline-flex items-center justify-center rounded-pill bg-white px-8 py-4 font-body text-base font-bold uppercase tracking-widest text-red transition-all duration-300 hover:bg-gold hover:text-white"
        >
          Get a Quote
        </Link>
      </div>
    </>
  );
}
