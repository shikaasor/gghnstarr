'use client';

import { useState, useEffect } from 'react';

const TARGET_DATE = new Date('2026-06-28T00:00:00');

export function ConferenceHero() {
  const [daysLeft, setDaysLeft] = useState<number | null>(null);

  useEffect(() => {
    function computeDays() {
      const now = new Date();
      const diff = Math.ceil((TARGET_DATE.getTime() - now.getTime()) / 86400000);
      return Math.max(0, diff);
    }

    setDaysLeft(computeDays());

    const interval = setInterval(() => {
      setDaysLeft(computeDays());
    }, 60_000);

    return () => clearInterval(interval);
  }, []);

  const isPast = daysLeft !== null && daysLeft <= 0;

  if (isPast) {
    return (
      <section className="bg-navy-950 text-white py-20 px-4 text-center">
        <p className="text-amr-gold font-semibold uppercase tracking-widest text-sm mb-6">
          5th High-Level Inter-Ministerial Meeting on Antimicrobial Resistance
        </p>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Conference Held June 28–30, 2026
        </h1>
        <p className="text-slate-300 text-lg mb-8 max-w-xl mx-auto">
          The 5th High-Level Inter-Ministerial Meeting on AMR took place at the Transcorp Hilton Conference Center, Abuja, Nigeria.
        </p>
        <a
          href="https://www.5thhighlevelministerialng.com/registration"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-teal-600 text-white font-bold px-8 py-3 rounded-lg text-lg hover:bg-teal-500 transition-colors"
        >
          View Conference Outcomes
        </a>
      </section>
    );
  }

  return (
    <section className="bg-navy-950 text-white py-20 px-4 text-center">
      <p className="text-amr-gold font-semibold uppercase tracking-widest text-sm mb-4">
        5th High-Level Inter-Ministerial Meeting on Antimicrobial Resistance
      </p>
      {/* Large countdown numeral */}
      <div className="text-9xl font-bold tabular-nums leading-none mb-2 text-white">
        {daysLeft === null ? '—' : daysLeft}
      </div>
      <p className="text-2xl text-slate-300 mb-2">
        {daysLeft === null ? 'Loading…' : daysLeft === 1 ? 'day to go' : 'days to go'}
      </p>
      <p className="text-lg text-slate-400 mb-8">
        June 28–30, 2026 · Transcorp Hilton Conference Center, Abuja, Nigeria
      </p>
      <a
        href="https://www.5thhighlevelministerialng.com/registration"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-[#DC2626] text-white font-bold px-8 py-3 rounded-lg text-lg hover:bg-red-700 transition-colors animate-cta-pulse hover:animate-none"
      >
        Register Now
      </a>
    </section>
  );
}
