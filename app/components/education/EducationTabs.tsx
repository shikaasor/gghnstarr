'use client';

import { useState, useEffect, useMemo } from 'react';
import type { EducationItem, EducationTab, AudienceType, ContentFormat, TopicTag, WHORegion } from '@/lib/types';
import EducationCard from './EducationCard';
import EducationFilters from './EducationFilters';

interface EducationTabsProps {
  items: EducationItem[];
}

const PAGE_SIZE = 12;

export default function EducationTabs({ items }: EducationTabsProps) {
  const [activeTab, setActiveTab] = useState<EducationTab>('training');

  useEffect(() => {
    const readHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'training' || hash === 'resources') setActiveTab(hash);
    };
    readHash(); // read on mount
    window.addEventListener('popstate', readHash);
    return () => window.removeEventListener('popstate', readHash);
  }, []);

  const [selectedAudiences, setSelectedAudiences] = useState<AudienceType[]>([]);
  const [selectedFormats, setSelectedFormats] = useState<ContentFormat[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<TopicTag[]>([]);
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<WHORegion[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const handleTabClick = (tab: EducationTab) => {
    setActiveTab(tab);
    window.history.pushState(null, '', `#${tab}`);
    // Reset filters on tab switch
    setSelectedAudiences([]);
    setSelectedFormats([]);
    setSelectedTopics([]);
    setSelectedYears([]);
    setSelectedRegions([]);
    setCurrentPage(1);
  };

  // Derive tab items and available filter options
  const tabItems = useMemo(
    () => items.filter((i) => i.tab === activeTab),
    [items, activeTab]
  );

  const availableAudiences = useMemo(
    () => [...new Set(tabItems.flatMap((i) => i.audiences))].sort() as AudienceType[],
    [tabItems]
  );
  const availableFormats = useMemo(
    () => [...new Set(tabItems.map((i) => i.format))].sort() as ContentFormat[],
    [tabItems]
  );
  const availableTopics = useMemo(
    () => [...new Set(tabItems.flatMap((i) => i.topics))].sort() as TopicTag[],
    [tabItems]
  );
  const availableYears = useMemo(
    () =>
      [...new Set(tabItems.map((i) => i.year).filter((y): y is number => y !== undefined))].sort(
        (a, b) => b - a
      ),
    [tabItems]
  );
  const availableRegions = useMemo(
    () =>
      [...new Set(tabItems.map((i) => i.region).filter((r): r is WHORegion => r !== undefined))].sort() as WHORegion[],
    [tabItems]
  );

  // Apply filters: OR within dimension, AND across dimensions
  const filtered = useMemo(() => {
    return tabItems.filter((item) => {
      const audienceMatch =
        selectedAudiences.length === 0 ||
        selectedAudiences.some((a) => item.audiences.includes(a));
      const formatMatch =
        selectedFormats.length === 0 || selectedFormats.includes(item.format);
      const topicMatch =
        selectedTopics.length === 0 ||
        selectedTopics.some((t) => item.topics.includes(t));
      const yearMatch =
        selectedYears.length === 0 ||
        (item.year !== undefined && selectedYears.includes(item.year));
      const regionMatch =
        selectedRegions.length === 0 ||
        (item.region !== undefined && selectedRegions.includes(item.region));
      return audienceMatch && formatMatch && topicMatch && yearMatch && regionMatch;
    });
  }, [tabItems, selectedAudiences, selectedFormats, selectedTopics, selectedYears, selectedRegions]);

  // Pagination — clamp currentPage so stale page state after filter change
  // does not produce an empty slice when totalPages decreases.
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  // Windowed page numbers: show at most 7 pages around current
  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const delta = 2;
    const start = Math.max(2, safePage - delta);
    const end = Math.min(totalPages - 1, safePage + delta);
    const pages: (number | '...')[] = [1];
    if (start > 2) pages.push('...');
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages - 1) pages.push('...');
    pages.push(totalPages);
    return pages;
  }, [totalPages, safePage]);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-1 border-b border-slate-200 mb-8">
        {(['training', 'resources'] as EducationTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            aria-selected={activeTab === tab}
            className={
              activeTab === tab
                ? 'px-5 py-2.5 text-sm font-semibold text-teal-700 border-b-2 border-teal-600 -mb-px'
                : 'px-5 py-2.5 text-sm text-slate-500 hover:text-slate-800'
            }
          >
            {tab === 'training' ? 'Training' : 'Resources'}
          </button>
        ))}
      </div>

      {/* Filters */}
      <EducationFilters
        audiences={availableAudiences}
        formats={availableFormats}
        topics={availableTopics}
        years={availableYears}
        regions={availableRegions}
        selectedAudiences={selectedAudiences}
        selectedFormats={selectedFormats}
        selectedTopics={selectedTopics}
        selectedYears={selectedYears}
        selectedRegions={selectedRegions}
        onAudienceChange={(v) => {
          setSelectedAudiences(v);
          setCurrentPage(1);
        }}
        onFormatChange={(v) => {
          setSelectedFormats(v);
          setCurrentPage(1);
        }}
        onTopicChange={(v) => {
          setSelectedTopics(v);
          setCurrentPage(1);
        }}
        onYearChange={(v) => {
          setSelectedYears(v);
          setCurrentPage(1);
        }}
        onRegionChange={(v) => {
          setSelectedRegions(v);
          setCurrentPage(1);
        }}
        onClearAll={() => {
          setSelectedAudiences([]);
          setSelectedFormats([]);
          setSelectedTopics([]);
          setSelectedYears([]);
          setSelectedRegions([]);
          setCurrentPage(1);
        }}
      />

      {/* Result count */}
      <p className="text-slate-500 text-sm mb-6">
        {filtered.length} {filtered.length === 1 ? 'item' : 'items'}
        {filtered.length !== tabItems.length && ` (filtered from ${tabItems.length})`}
      </p>

      {/* Card grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {paginated.map((item) => (
          <EducationCard key={item.id} item={item} />
        ))}
      </div>

      {paginated.length === 0 && (
        <p className="text-slate-500 text-sm py-8 text-center">
          No items match the selected filters.
        </p>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10 flex-wrap">
          <button
            onClick={() => goToPage(Math.max(1, safePage - 1))}
            disabled={safePage === 1}
            className="px-3 py-1.5 text-sm rounded border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
          >
            ← Prev
          </button>
          {pageNumbers.map((page, idx) =>
            page === '...' ? (
              <span key={`ellipsis-${idx}`} className="px-2 text-slate-400 text-sm select-none">
                …
              </span>
            ) : (
              <button
                key={page}
                onClick={() => goToPage(page as number)}
                className={`px-3 py-1.5 text-sm rounded border ${
                  page === safePage
                    ? 'bg-teal-600 text-white border-teal-600'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                {page}
              </button>
            )
          )}
          <button
            onClick={() => goToPage(Math.min(totalPages, safePage + 1))}
            disabled={safePage === totalPages}
            className="px-3 py-1.5 text-sm rounded border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
