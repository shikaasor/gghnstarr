// app/components/layout/Footer.tsx
import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="bg-navy-950 text-slate-400 border-t border-navy-800 mt-auto">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">

          {/* Branding block */}
          <div className="max-w-sm">
            <div className="bg-white rounded px-2 py-1 inline-block">
              <Image
                src="/amr-logo.jpeg"
                alt="AntiMicrobial Resistance Initiative"
                width={140}
                height={56}
                className="object-contain h-12 w-auto"
              />
            </div>
            <p className="text-slate-300 text-sm mt-2">
              Africa AMR Modeling Initiative
            </p>
            <p className="text-slate-500 text-sm mt-2 italic">
              Evidence. Advocacy. Action.
            </p>
          </div>

          {/* Partners + contact block */}
          <div className="flex flex-col gap-3">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">
              Partners
            </p>
            <p className="text-sm text-slate-400">
              Fleming Fund &middot; Africa CDC &middot; WHO AFRO
            </p>

            <div className="flex flex-col gap-1 mt-2">
              <a
                href="mailto:starr@gghn.org.ng"
                className="text-sm text-teal-500 hover:text-teal-400 transition-colors"
              >
                starr@gghn.org.ng
              </a>
              <a
                href="https://linkedin.com/company/gghn-nigeria"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-teal-500 hover:text-teal-400 transition-colors"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-navy-800 text-xs text-slate-600 text-center">
          &copy; {new Date().getFullYear()} Good Governance for Health in Nigeria (GGHN). All rights reserved.
        </div>
      </div>
    </footer>
  );
}
