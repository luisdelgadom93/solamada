import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { href: "/menu", label: "Menu" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/services#choose-experience", label: "Get a Quote" },
];

export default function Footer() {
  return (
    <footer className="bg-black py-16 px-6 text-white/60">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col md:flex-row justify-between gap-12 mb-12">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <Image
              src="/images/logos/solamada-logo-blanco-sol.png"
              alt="Solamada"
              width={120}
              height={120}
              className="h-20 w-auto"
            />
            <p className="text-sm text-center md:text-left max-w-xs leading-relaxed">
              A curated mobile bartending experience. Crafted cocktails for
              unforgettable celebrations.
            </p>
          </div>

          {/* Nav */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <h4 className="font-body text-xs font-bold uppercase tracking-widest text-white mb-1">
              Navigate
            </h4>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm hover:text-gold transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Contact */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <h4 className="font-body text-xs font-bold uppercase tracking-widest text-white mb-1">
              Get in Touch
            </h4>
            <a
              href="https://instagram.com/solamada.bar"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm hover:text-gold transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              @solamada.bar
            </a>
            <a
              href="mailto:hello@solamada.com"
              className="text-sm hover:text-gold transition-colors"
            >
              hello@solamada.com
            </a>
            <a
              href="tel:7865851769"
              className="text-sm hover:text-gold transition-colors"
            >
              (786) 585-1769
            </a>
            <a
              href="tel:7862120577"
              className="text-sm hover:text-gold transition-colors"
            >
              (786) 212-0577
            </a>
            <Link
              href="/services#choose-experience"
              className="mt-2 inline-flex items-center justify-center rounded-pill bg-red px-5 py-2.5 font-body text-xs font-bold uppercase tracking-widest text-white transition-all duration-300 hover:bg-gold"
            >
              Get a Quote
            </Link>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p>
            &copy; {new Date().getFullYear()} Solamada. All rights reserved.
          </p>
          <p>Houston, TX &middot; TABC Certified</p>
        </div>
      </div>
    </footer>
  );
}
