'use client';

// app/components/sections/FeaturedBrief.tsx
import { useState, useEffect } from 'react';
import { Container } from '@/components/layout/Container';
import { Download } from 'lucide-react';
import type { Brief } from '@/lib/types';
import { hasCompletedLeadCapture } from '@/lib/lead-capture';
import { LeadCaptureModal } from '@/components/briefs/LeadCaptureModal';

interface FeaturedBriefProps {
  brief: Brief;
}

export default function FeaturedBrief({ brief }: FeaturedBriefProps) {
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setAlreadySubmitted(hasCompletedLeadCapture());
  }, []);

  return (
    <>
      <section className="bg-slate-100 py-16">
        <Container>
          <p className="text-xs uppercase tracking-wider text-teal-600 font-medium mb-2">
            Featured Policy Brief
          </p>
          <h2 className="font-serif text-2xl md:text-3xl text-navy-950 mb-6">
            {brief.title}
          </h2>
          <ul className="space-y-3 mb-8">
            {brief.keyMessages.map((msg, i) => (
              <li key={i} className="flex gap-3 text-slate-600">
                <span className="text-teal-600 flex-shrink-0 mt-0.5 font-bold">•</span>
                <span>{msg}</span>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => {
              if (alreadySubmitted) {
                window.open(brief.pdfUrl, '_blank', 'noopener,noreferrer');
              } else {
                setShowModal(true);
              }
            }}
            className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-medium px-6 py-3 rounded transition-colors"
          >
            <Download size={18} />
            Download PDF
          </button>
        </Container>
      </section>
      {showModal && (
        <LeadCaptureModal
          href={brief.pdfUrl}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
