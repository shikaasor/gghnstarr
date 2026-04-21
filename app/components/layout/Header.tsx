// app/components/layout/Header.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/briefs', label: 'Briefs' },
  { href: '/methodology', label: 'Methodology' },
  { href: '/experts', label: 'Experts' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-navy-950 text-white sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between h-24">
        {/* Logo */}
        <Link
          href="/"
          className="font-serif font-bold text-lg text-teal-400 hover:text-teal-300 transition-colors"
        >
          GGHN STARR
        </Link>

        {/* Desktop nav — hidden on mobile */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-slate-200 hover:text-teal-400 transition-colors text-sm font-medium"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile hamburger button — visible on mobile only */}
        <button
          className="md:hidden text-slate-200 hover:text-teal-400 transition-colors p-1"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isOpen}
          aria-controls="mobile-nav"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile slide-out nav panel */}
      {isOpen && (
        <nav
          id="mobile-nav"
          className="md:hidden bg-navy-900 border-t border-navy-800 px-4 py-4 flex flex-col gap-1"
          aria-label="Mobile navigation"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-slate-200 hover:text-teal-400 hover:bg-navy-800 transition-colors text-base font-medium px-3 py-2 rounded"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
