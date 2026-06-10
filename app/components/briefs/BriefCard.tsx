'use client';
import Link from 'next/link';
import type { Brief } from '@/lib/types';

interface BriefCardProps {
  brief: Brief;
}

export default function BriefCard({ brief }: BriefCardProps) {
  const dateLabel = new Date(brief.publicationDate).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Link href={`/briefs/${brief.slug}`} className="group block h-full">
      <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 flex flex-col h-full transition-shadow duration-200 group-hover:shadow-md">
        <div className="p-5 flex flex-col flex-grow">
          {/* Date */}
          <p className="text-xs text-slate-500 mb-3">{dateLabel}</p>

          {/* Category badge */}
          {brief.category && (
            <span className="inline-block text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded mb-2 self-start leading-tight">
              {brief.category}
            </span>
          )}

          {/* Long title */}
          <h2 className="font-serif text-navy-950 font-bold text-base leading-snug mb-3 group-hover:text-teal-700 transition-colors">
            {brief.title}
          </h2>

          {/* Write-up summary */}
          {brief.writeupSummary && (
            <p className="text-sm text-slate-600 leading-relaxed line-clamp-3 mb-4 flex-grow">
              {brief.writeupSummary}
            </p>
          )}

          {/* Call to action */}
          {brief.callToAction && (
            <div className="mt-auto pt-3 border-t border-slate-100">
              <p className="text-xs font-medium text-teal-700 leading-snug line-clamp-2">
                <span className="uppercase tracking-wide text-slate-400 mr-1">Action →</span>
                {brief.callToAction}
              </p>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
