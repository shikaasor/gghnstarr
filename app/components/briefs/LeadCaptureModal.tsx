'use client';

import { useState } from 'react';
import { markLeadCaptureComplete } from '@/lib/lead-capture';

interface LeadCaptureModalProps {
  href: string;      // PDF URL to download after submit
  onClose: () => void; // called when modal should close (both dismiss and success paths)
}

const inputClass =
  'border border-slate-200 rounded px-4 py-2 text-navy-950 focus:outline-none focus:ring-2 focus:ring-teal-600 w-full';

export function LeadCaptureModal({ href, onClose }: LeadCaptureModalProps) {
  const [email, setEmail] = useState('');
  const [audienceCategory, setAudienceCategory] = useState('');
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function triggerDownload() {
    const a = document.createElement('a');
    a.href = href;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Simple email format validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;

    setSubmitting(true);

    try {
      await fetch(process.env.NEXT_PUBLIC_GAS_URL ?? '', {
        method: 'POST',
        redirect: 'follow',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          formType: 'lead-capture',
          email,
          audienceCategory,
          name: name || undefined,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch {
      // GAS failure is silent — download still proceeds
    }

    markLeadCaptureComplete(email);
    triggerDownload();
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6 relative">
        {/* X button */}
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Header */}
        <h2 className="font-serif text-navy-950 text-xl font-bold mb-1">Download AMR Resource</h2>
        <p className="text-slate-500 text-sm mb-4">
          Help us understand who accesses AMR resources — takes 30 seconds.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email — required */}
          <div>
            <label htmlFor="lc-email" className="block text-sm font-medium text-navy-950 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="lc-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className={inputClass}
            />
          </div>

          {/* Audience Category — required */}
          <div>
            <label htmlFor="lc-audience" className="block text-sm font-medium text-navy-950 mb-1">
              Audience Category <span className="text-red-500">*</span>
            </label>
            <select
              id="lc-audience"
              required
              value={audienceCategory}
              onChange={(e) => setAudienceCategory(e.target.value)}
              className={inputClass}
            >
              <option value="" disabled>
                Select your category
              </option>
              <option value="Policymaker">Policymaker</option>
              <option value="Healthcare Worker">Healthcare Worker</option>
              <option value="Researcher">Researcher</option>
              <option value="Student">Student</option>
              <option value="General Public">General Public</option>
            </select>
          </div>

          {/* Name — optional */}
          <div>
            <label htmlFor="lc-name" className="block text-sm font-medium text-navy-950 mb-1">
              Name
            </label>
            <input
              id="lc-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name (optional)"
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={`bg-teal-600 hover:bg-teal-500 text-white font-medium px-6 py-2.5 rounded transition-colors${submitting ? ' opacity-60' : ''}`}
          >
            {submitting ? 'Submitting...' : 'Access Resource'}
          </button>
        </form>
      </div>
    </div>
  );
}
