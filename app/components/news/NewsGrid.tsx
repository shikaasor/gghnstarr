'use client';
import { useState } from 'react';
import type { NewsArticle } from '@/lib/types';
import NewsCard from './NewsCard';

type SourceFilter = 'All' | 'arXiv' | 'PubMed';
type DateFilter = 'Last 7 days' | 'Last 30 days' | 'All time';

const SOURCE_TABS: SourceFilter[] = ['All', 'arXiv', 'PubMed'];
const DATE_TABS: DateFilter[] = ['Last 7 days', 'Last 30 days', 'All time'];
const PAGE_SIZE = 20;

interface NewsGridProps {
  articles: NewsArticle[];
}

export default function NewsGrid({ articles }: NewsGridProps) {
  const [source, setSource] = useState<SourceFilter>('All');
  const [dateRange, setDateRange] = useState<DateFilter>('All time');
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);

  function handleSourceChange(tab: SourceFilter) {
    setSource(tab);
    setVisibleCount(PAGE_SIZE);
  }

  function handleDateChange(tab: DateFilter) {
    setDateRange(tab);
    setVisibleCount(PAGE_SIZE);
  }

  const cutoff: string | null =
    dateRange === 'Last 7 days'
      ? new Date(Date.now() - 7 * 86_400_000).toISOString().slice(0, 10)
      : dateRange === 'Last 30 days'
      ? new Date(Date.now() - 30 * 86_400_000).toISOString().slice(0, 10)
      : null;

  const filtered = articles
    .filter(a => source === 'All' || a.source === source)
    .filter(a => cutoff === null || a.publishedDate >= cutoff);

  const visible = filtered.slice(0, visibleCount);

  return (
    <div>
      {/* Source filter row */}
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter by source">
        {SOURCE_TABS.map(tab => (
          <button
            key={tab}
            role="tab"
            aria-selected={source === tab}
            onClick={() => handleSourceChange(tab)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 ${
              source === tab
                ? 'bg-teal-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Date range filter row */}
      <div className="flex flex-wrap gap-2 mt-3 mb-8" role="tablist" aria-label="Filter by date range">
        {DATE_TABS.map(tab => (
          <button
            key={tab}
            role="tab"
            aria-selected={dateRange === tab}
            onClick={() => handleDateChange(tab)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 ${
              dateRange === tab
                ? 'bg-teal-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Article grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {visible.map(article => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <p className="text-slate-500 text-sm py-8 text-center">
          No articles found for this filter.
        </p>
      )}

      {/* Load more button */}
      {visibleCount < filtered.length && (
        <button
          onClick={() => setVisibleCount(v => v + PAGE_SIZE)}
          className="mt-8 block mx-auto px-6 py-2 rounded-full bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 transition-colors"
        >
          Load more ({filtered.length - visibleCount} remaining)
        </button>
      )}
    </div>
  );
}
