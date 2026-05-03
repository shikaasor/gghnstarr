'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const TARGET_DATE = new Date('2026-06-28T00:00:00');

function computeDays(): number {
  return Math.max(0, Math.ceil((TARGET_DATE.getTime() - Date.now()) / 86400000));
}

export function ConferenceBar() {
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Init dismissed state from sessionStorage
    setDismissed(sessionStorage.getItem('conf-bar-dismissed') === 'true');

    // Init countdown
    setDaysLeft(computeDays());

    const interval = setInterval(() => {
      setDaysLeft(computeDays());
    }, 60_000);

    return () => clearInterval(interval);
  }, []);

  const isConferencePage = pathname === '/conference';
  const conferenceHasPassed = daysLeft !== null && new Date() >= TARGET_DATE;

  if (isConferencePage || conferenceHasPassed || dismissed) {
    return null;
  }

  return (
    <div className="sticky top-0 z-[60] bg-[#DC2626] text-white">
      <div className="max-w-5xl mx-auto px-4 h-10 flex items-center justify-between gap-3 text-sm">
        {/* Left: event label */}
        <span className="font-medium truncate">
          <span className="hidden sm:inline">5th High-Level Inter-Ministerial Meeting on AMR — </span>
          <span className="sm:hidden">5th AMR Ministerial — </span>
          June 28, Abuja
        </span>

        {/* Center: countdown */}
        <span className="shrink-0 font-bold tabular-nums whitespace-nowrap">
          {daysLeft === null ? '…' : `${daysLeft}d`}
        </span>

        {/* Right: CTA + dismiss */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href="https://www.5thhighlevelministerialng.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-[#DC2626] font-semibold px-3 py-0.5 rounded text-xs animate-cta-pulse hover:animate-none hover:bg-slate-100 transition-colors"
          >
            Register Now
          </a>
          <button
            onClick={() => {
              sessionStorage.setItem('conf-bar-dismissed', 'true');
              setDismissed(true);
            }}
            aria-label="Dismiss conference banner"
            className="text-white/70 hover:text-white transition-colors ml-1"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
