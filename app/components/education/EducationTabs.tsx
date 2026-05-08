'use client';

import { useState, useEffect, useMemo } from 'react';
import type { EducationItem, EducationTab, AudienceType, ContentFormat, TopicTag } from '@/lib/types';
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
  const [currentPage, setCurrentPage] = useState(1);

  const handleTabClick = (tab: EducationTab) => {
    setActiveTab(tab);
    window.history.pushState(null, '', `#${tab}`);
    // Reset filters on tab switch
    setSelectedAudiences([]);
    setSelectedFormats([]);
    setSelectedTopics([]);
    setSelectedYears([]);
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
    () => [...new Set(tabItems.map((i) => i.year))].sort((a, b) => b - a),
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
        selectedYears.length === 0 || selectedYears.includes(item.year);
      return audienceMatch && formatMatch && topicMatch && yearMatch;
    });
  }, [tabItems, selectedAudiences, selectedFormats, selectedTopics, selectedYears]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

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
        selectedAudiences={selectedAudiences}
        selectedFormats={selectedFormats}
        selectedTopics={selectedTopics}
        selectedYears={selectedYears}
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
        onClearAll={() => {
          setSelectedAudiences([]);
          setSelectedFormats([]);
          setSelectedTopics([]);
          setSelectedYears([]);
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
        <div className="flex items-center justify-center gap-2 mt-10">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 text-sm rounded border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
          >
            ← Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1.5 text-sm rounded border ${
                page === currentPage
                  ? 'bg-teal-600 text-white border-teal-600'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 text-sm rounded border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
