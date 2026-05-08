'use client';
// app/components/briefs/BriefCard.tsx
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Download } from 'lucide-react';
import type { Brief, Expert } from '@/lib/types';
import { hasCompletedLeadCapture } from '@/lib/lead-capture';
import { LeadCaptureModal } from './LeadCaptureModal';

interface BriefCardProps {
  brief: Brief;
  expert?: Expert;
}

export default function BriefCard({ brief, expert }: BriefCardProps) {
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [showInfographicModal, setShowInfographicModal] = useState(false);

  useEffect(() => {
    setAlreadySubmitted(hasCompletedLeadCapture());
  }, []);

  const weekLabel = `Week ${brief.weekNumber}`;
  const dateLabel = new Date(brief.publicationDate).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  function handlePdfClick() {
    if (alreadySubmitted) {
      window.open(brief.pdfUrl, '_blank', 'noopener,noreferrer');
    } else {
      setShowPdfModal(true);
    }
  }

  function handleInfographicClick() {
    if (alreadySubmitted) {
      window.open(brief.infographicPdfUrl!, '_blank', 'noopener,noreferrer');
    } else {
      setShowInfographicModal(true);
    }
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-slate-200 flex flex-col">
      <Link href={`/briefs/${brief.slug}`} className="block">
        <img
          src={brief.thumbnailUrl}
          alt={brief.title}
          className="w-full aspect-video object-cover"
        />
      </Link>
      <div className="p-4 flex flex-col flex-grow">
        <p className="text-xs text-teal-600 font-medium mb-1">
          {weekLabel} · {dateLabel}
        </p>
        <Link href={`/briefs/${brief.slug}`}>
          <h2 className="font-serif text-navy-950 font-bold text-base mb-2 hover:text-teal-600 transition-colors">
            {brief.title}
          </h2>
        </Link>
        {expert && (
          <p className="text-sm text-slate-600 mb-2">{expert.name}</p>
        )}
        <p className="text-sm text-slate-700 leading-snug mb-4">{brief.keyTakeaway}</p>
        <div className={brief.infographicPdfUrl ? "mt-auto grid grid-cols-2 gap-2" : "mt-auto"}>
          <button
            type="button"
            onClick={handlePdfClick}
            className="inline-flex items-center justify-center gap-1 text-sm font-medium border border-teal-600 text-teal-600 hover:bg-teal-50 px-3 py-2 rounded transition-colors"
          >
            <Download size={14} />Download PDF
          </button>
          {brief.infographicPdfUrl && (
            <button
              type="button"
              onClick={handleInfographicClick}
              className="inline-flex items-center justify-center gap-1 text-sm font-medium border border-slate-400 text-slate-600 hover:bg-slate-50 px-3 py-2 rounded transition-colors"
            >
              <Download size={14} />Infographic
            </button>
          )}
        </div>
      </div>
      {showPdfModal && (
        <LeadCaptureModal href={brief.pdfUrl} onClose={() => setShowPdfModal(false)} />
      )}
      {brief.infographicPdfUrl && showInfographicModal && (
        <LeadCaptureModal href={brief.infographicPdfUrl} onClose={() => setShowInfographicModal(false)} />
      )}
    </div>
  );
}
