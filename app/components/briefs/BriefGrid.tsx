'use client';
import { useState, useMemo } from 'react';
import type { Brief } from '@/lib/types';
import BriefCard from './BriefCard';

interface BriefGridProps {
  briefs: Brief[];
  experts?: import('@/lib/types').Expert[];
}

export default function BriefGrid({ briefs }: BriefGridProps) {
  const [monthFilter, setMonthFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

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

  const categories = useMemo(() => {
    const all = briefs.map(b => b.category).filter(Boolean) as string[];
    return [...new Set(all)].sort();
  }, [briefs]);

  const filtered = useMemo(() => briefs.filter(b => {
    const monthMatch = !monthFilter ||
      new Date(b.publicationDate).toLocaleString('en-US', { month: 'long', year: 'numeric' }) === monthFilter;
    const categoryMatch = !categoryFilter || b.category === categoryFilter;
    return monthMatch && categoryMatch;
  }), [briefs, monthFilter, categoryFilter]);

  return (
    <div>
      <div className="flex flex-wrap gap-4 mb-8">
        <select
          value={monthFilter}
          onChange={e => setMonthFilter(e.target.value)}
          className="border border-slate-300 rounded px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="">All months</option>
          {months.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="border border-slate-300 rounded px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="">All categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        {(monthFilter || categoryFilter) && (
          <button
            onClick={() => { setMonthFilter(''); setCategoryFilter(''); }}
            className="text-sm text-teal-600 underline hover:text-teal-500"
          >
            Clear filters
          </button>
        )}
      </div>

      <p className="text-sm text-slate-500 mb-6">
        Showing {filtered.length} of {briefs.length} briefs
      </p>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-slate-600 mb-4">No briefs match your current filters.</p>
          <button
            onClick={() => { setMonthFilter(''); setCategoryFilter(''); }}
            className="text-teal-600 underline hover:text-teal-500 text-sm"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(b => (
            <BriefCard key={b.slug} brief={b} />
          ))}
        </div>
      )}
    </div>
  );
}
