// app/components/layout/Header.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/briefs', label: 'Briefs' },
  { href: '/awareness', label: 'Awareness' },
  { href: '/education', label: 'Education' },
  { href: '/tools-directory', label: 'Tools' },
  { href: '/news', label: 'News' },
  { href: '/methodology', label: 'Methodology' },
  { href: '/experts', label: 'Experts' },
  { href: '/contact', label: 'Contact' },
  { href: '/conference', label: 'Conference' },
  { href: '/take-action', label: 'Take Action', isButton: true },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-teal-600 text-white sticky top-0 z-50">
      <div className="w-full px-4 sm:px-6 lg:px-10 flex items-center justify-between h-24">
        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <div className="bg-white rounded px-2 py-1">
            <Image
              src="/amr-logo.jpeg"
              alt="AntiMicrobial Resistance Initiative"
              width={160}
              height={64}
              priority
              className="object-contain h-10 w-auto"
            />
          </div>
        </Link>

        {/* Desktop nav — hidden on mobile */}
        <nav className="hidden md:flex items-center gap-6 ml-10" aria-label="Main navigation">
          {navLinks.map((link) =>
            link.isButton ? (
              <Link
                key={link.href}
                href={link.href}
                className="bg-amr-gold text-navy-950 hover:bg-yellow-400 font-semibold px-4 py-1.5 rounded transition-colors text-sm"
              >
                {link.label}
              </Link>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="text-slate-200 hover:text-teal-400 transition-colors text-sm font-medium"
              >
                {link.label}
              </Link>
            )
          )}
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
          className="md:hidden bg-teal-700 border-t border-teal-800 px-4 py-4 flex flex-col gap-1"
          aria-label="Mobile navigation"
        >
          {navLinks.map((link) =>
            link.isButton ? (
              <Link
                key={link.href}
                href={link.href}
                className="text-navy-950 bg-amr-gold hover:bg-yellow-400 font-semibold px-3 py-2 rounded text-base transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="text-slate-200 hover:text-teal-400 hover:bg-navy-800 transition-colors text-base font-medium px-3 py-2 rounded"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            )
          )}
        </nav>
      )}
    </header>
  );
}
