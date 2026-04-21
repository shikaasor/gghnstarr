'use client';
import { useState, useMemo } from 'react';
import type { Brief, Expert } from '@/lib/types';
import BriefCard from './BriefCard';

interface BriefGridProps {
  briefs: Brief[];
  experts: Expert[];
}

export default function BriefGrid({ briefs, experts }: BriefGridProps) {
  const [monthFilter, setMonthFilter] = useState('');
  const [themeFilter, setThemeFilter] = useState('');

  const months = useMemo(() => {
    const seen = new Set<string>();
    const result: string[] = [];
    for (const b of briefs) {
      const label = new Date(b.publicationDate).toLocaleString('en-US', {
        month: 'long',
        year: 'numeric',
      });
      if (!seen.has(label)) {
        seen.add(label);
        result.push(label);
      }
    }
    return result;
  }, [briefs]);

  const themes = useMemo(() => {
    const all = briefs.flatMap(b => b.themes);
    return [...new Set(all)].sort();
  }, [briefs]);

  const filtered = useMemo(() => briefs.filter(b => {
    const monthMatch = !monthFilter ||
      new Date(b.publicationDate).toLocaleString('en-US', { month: 'long', year: 'numeric' }) === monthFilter;
    const themeMatch = !themeFilter || b.themes.includes(themeFilter);
    return monthMatch && themeMatch;
  }), [briefs, monthFilter, themeFilter]);

  return (
    <div>
      <div className="flex flex-wrap gap-4 mb-8">
        <select
          value={monthFilter}
          onChange={e => setMonthFilter(e.target.value)}
          className="border border-slate-300 rounded px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="">Month</option>
          {months.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <select
          value={themeFilter}
          onChange={e => setThemeFilter(e.target.value)}
          className="border border-slate-300 rounded px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="">Theme</option>
          {themes.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-slate-600 mb-4">No briefs match your current filters.</p>
          <button
            onClick={() => { setMonthFilter(''); setThemeFilter(''); }}
            className="text-teal-600 underline hover:text-teal-500 text-sm"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(b => (
            <BriefCard
              key={b.slug}
              brief={b}
              expert={experts.find(e => e.id === b.authorId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
