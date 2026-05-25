'use client';

import { useState, useMemo } from 'react';
import type { ToolItem, OHOrganizationLevel, OHAudienceType, OHScope } from '@/lib/types';
import ToolCard from './ToolCard';
import ToolsFilters from './ToolsFilters';

interface ToolsGridProps {
  tools: ToolItem[];
}

const PAGE_SIZE = 12;

export default function ToolsGrid({ tools }: ToolsGridProps) {
  const [selectedOrgLevels, setSelectedOrgLevels] = useState<OHOrganizationLevel[]>([]);
  const [selectedAudienceTypes, setSelectedAudienceTypes] = useState<OHAudienceType[]>([]);
  const [selectedScopes, setSelectedScopes] = useState<OHScope[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Derive available filter options from the full tool set
  const availableOrgLevels = useMemo(
    () => [...new Set(tools.flatMap((t) => t.organizationLevels))].sort() as OHOrganizationLevel[],
    [tools]
  );
  const availableAudienceTypes = useMemo(
    () => [...new Set(tools.flatMap((t) => t.audienceTypes))].sort() as OHAudienceType[],
    [tools]
  );
  const availableScopes = useMemo(
    () => [...new Set(tools.flatMap((t) => t.scopes))].sort() as OHScope[],
    [tools]
  );

  // Apply filters: OR within dimension, AND across dimensions; plus free-text search
  const filtered = useMemo(() => {
    return tools.filter((tool) => {
      const orgMatch =
        selectedOrgLevels.length === 0 ||
        selectedOrgLevels.some((x) => tool.organizationLevels.includes(x));
      const audienceMatch =
        selectedAudienceTypes.length === 0 ||
        selectedAudienceTypes.some((x) => tool.audienceTypes.includes(x));
      const scopeMatch =
        selectedScopes.length === 0 ||
        selectedScopes.some((x) => tool.scopes.includes(x));
      const searchMatch =
        searchQuery === '' ||
        [tool.name, tool.organization, tool.description]
          .join(' ')
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      return orgMatch && audienceMatch && scopeMatch && searchMatch;
    });
  }, [tools, selectedOrgLevels, selectedAudienceTypes, selectedScopes, searchQuery]);

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
      {/* Search + filters */}
      <ToolsFilters
        organizationLevels={availableOrgLevels}
        audienceTypes={availableAudienceTypes}
        scopes={availableScopes}
        selectedOrgLevels={selectedOrgLevels}
        selectedAudienceTypes={selectedAudienceTypes}
        selectedScopes={selectedScopes}
        searchQuery={searchQuery}
        onOrgLevelChange={(v) => {
          setSelectedOrgLevels(v);
          setCurrentPage(1);
        }}
        onAudienceTypeChange={(v) => {
          setSelectedAudienceTypes(v);
          setCurrentPage(1);
        }}
        onScopeChange={(v) => {
          setSelectedScopes(v);
          setCurrentPage(1);
        }}
        onSearchChange={(v) => {
          setSearchQuery(v);
          setCurrentPage(1);
        }}
        onClearAll={() => {
          setSelectedOrgLevels([]);
          setSelectedAudienceTypes([]);
          setSelectedScopes([]);
          setSearchQuery('');
          setCurrentPage(1);
        }}
      />

      {/* Result count */}
      <p className="text-slate-500 text-sm mb-6">
        {filtered.length} {filtered.length === 1 ? 'tool' : 'tools'}
        {filtered.length !== tools.length && ` (filtered from ${tools.length})`}
      </p>

      {/* Card grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {paginated.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>

      {paginated.length === 0 && (
        <p className="text-slate-500 text-sm py-8 text-center">
          No tools match the selected filters.
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
