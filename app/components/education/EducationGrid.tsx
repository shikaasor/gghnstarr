'use client';
import { useState } from 'react';
import { FileText, Download, Play } from 'lucide-react';
import type { EducationResource, AudienceType, ResourceFormat } from '@/lib/types';

const FORMAT_ICONS: Record<ResourceFormat, React.ReactNode> = {
  Article: <FileText size={14} className="inline-block mr-1" />,
  Download: <Download size={14} className="inline-block mr-1" />,
  Video: <Play size={14} className="inline-block mr-1" />,
};

const TABS = ['All', 'Policymaker', 'Healthcare Worker', 'General Public'] as const;
type Tab = typeof TABS[number];

interface EducationGridProps {
  resources: EducationResource[];
}

export default function EducationGrid({ resources }: EducationGridProps) {
  const [activeTab, setActiveTab] = useState<Tab>('All');

  const filtered = activeTab === 'All'
    ? resources
    : resources.filter(r => r.audiences.includes(activeTab as AudienceType));

  return (
    <div>
      {/* Tab bar */}
      <div className="flex flex-wrap gap-2 mb-8" role="tablist" aria-label="Filter by audience">
        {TABS.map(tab => (
          <button
            key={tab}
            role="tab"
            aria-selected={activeTab === tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 ${
              activeTab === tab
                ? 'bg-teal-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Resource grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(resource => (
          <a
            key={resource.url}
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
          >
            {/* Source */}
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">
              {resource.source}
            </span>

            {/* Title */}
            <h3 className="font-serif text-navy-950 font-semibold text-sm leading-snug group-hover:text-teal-700 transition-colors">
              {resource.title}
            </h3>

            {/* Audience tags + format */}
            <div className="mt-auto flex flex-wrap items-center gap-2">
              {resource.audiences.map(audience => (
                <span
                  key={audience}
                  className="bg-teal-50 text-teal-700 text-xs px-2 py-0.5 rounded-full font-medium"
                >
                  {audience}
                </span>
              ))}
              <span className="text-slate-400 text-xs ml-auto flex items-center">
                {FORMAT_ICONS[resource.format]}
                {resource.format}
              </span>
            </div>
          </a>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-slate-500 text-sm py-8 text-center">
          No resources found for this audience.
        </p>
      )}
    </div>
  );
}
