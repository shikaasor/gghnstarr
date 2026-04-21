'use client';

import { useState, useEffect } from 'react';

interface Stat {
  value: string;
  label: string;
}

interface StatStripProps {
  stats: Stat[];
}

export default function StatStrip({ stats }: StatStripProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (stats.length <= 1) return;

    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % stats.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [stats.length]);

  const stat = stats[index];
  if (!stat) return null;

  return (
    <section className="bg-slate-100 py-12 text-center">
      <p className="text-4xl md:text-5xl font-serif font-bold text-teal-600">{stat.value}</p>
      <p className="text-slate-600 mt-2 text-base md:text-lg">{stat.label}</p>
    </section>
  );
}
