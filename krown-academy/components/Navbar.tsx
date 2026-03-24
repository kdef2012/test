"use client";
import { useState } from "react";
import Link from "next/link";

const links = [
  { href: "/about", label: "About" },
  { href: "/academics", label: "Academics" },
  { href: "/athletics", label: "Athletics" },
  { href: "/enrollment", label: "Enrollment" },
  { href: "/scholarships", label: "Free Tuition" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-krown-black sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo-web.png" alt="Krown Academy" className="h-10 w-auto" />
            <span className="font-display text-2xl font-bold text-krown-red tracking-wider hidden sm:inline">
              KROWN ACADEMY
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-display text-sm font-medium text-white/80 hover:text-krown-red tracking-widest uppercase transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/enrollment"
              className="ml-2 bg-krown-red hover:bg-krown-dark-red text-white font-display text-sm font-semibold tracking-widest uppercase px-5 py-2 transition-colors"
            >
              ENROLL NOW
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-white p-2"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-krown-black border-t border-white/10 pb-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block px-6 py-3 font-display text-sm text-white/80 hover:text-krown-red tracking-widest uppercase"
            >
              {link.label}
            </Link>
          ))}
          <div className="px-6 pt-2">
            <Link
              href="/enrollment"
              onClick={() => setOpen(false)}
              className="block text-center bg-krown-red text-white font-display text-sm font-semibold tracking-widest uppercase px-5 py-3"
            >
              ENROLL NOW
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
