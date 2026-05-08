'use client';
import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { trackPdfDownload } from '@/lib/analytics';
import { hasCompletedLeadCapture } from '@/lib/lead-capture';
import { LeadCaptureModal } from './LeadCaptureModal';

interface DownloadButtonProps {
  href: string;
  briefSlug: string;
  label?: string;
  variant?: 'primary' | 'outline';
}

export function DownloadButton({
  href,
  briefSlug,
  label = 'Download PDF',
  variant = 'primary',
}: DownloadButtonProps) {
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setAlreadySubmitted(hasCompletedLeadCapture());
  }, []);

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    trackPdfDownload(briefSlug);
    if (alreadySubmitted) {
      window.open(href, '_blank', 'noopener,noreferrer');
    } else {
      setShowModal(true);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={
          variant === 'primary'
            ? 'inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-medium px-5 py-2.5 rounded transition-colors text-sm'
            : 'inline-flex items-center gap-2 border border-teal-600 text-teal-600 hover:bg-teal-50 font-medium px-5 py-2.5 rounded transition-colors text-sm'
        }
      >
        <Download size={16} />
        {label}
      </button>
      {showModal && (
        <LeadCaptureModal
          href={href}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
