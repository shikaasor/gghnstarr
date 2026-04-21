'use client';

import { useState } from 'react';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

type FormState = 'idle' | 'submitting' | 'success' | 'error';

const inputClass =
  'w-full border border-slate-200 rounded px-4 py-2 text-navy-950 focus:outline-none focus:ring-2 focus:ring-teal-600 bg-white';

async function submitContact(form: HTMLFormElement): Promise<'success' | 'error'> {
  try {
    const id = process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID;
    const res = await fetch(`https://formspree.io/f/${id}`, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' },
    });
    const json = await res.json();
    return res.ok && json.ok ? 'success' : 'error';
  } catch {
    return 'error';
  }
}

export default function ContactForm() {
  const [state, setState] = useState<FormState>('idle');

  if (state === 'success') {
    return (
      <div className="text-center py-12">
        <CheckCircle className="mx-auto text-teal-600 mb-3" size={40} />
        <p className="font-serif text-xl text-navy-950 font-semibold">Thank you for reaching out.</p>
        <p className="text-slate-600 mt-2">We&apos;ll be in touch shortly. We read every message.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setState('submitting');
        const result = await submitContact(e.currentTarget);
        setState(result);
      }}
      className="space-y-5"
    >
      <noscript>
        <p className="text-sm bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded mb-4">
          JavaScript is required for this form. To contact us directly, email{' '}
          <a href="mailto:starr@gghn.org" className="underline font-medium">starr@gghn.org</a>.
        </p>
      </noscript>

      {/* Name + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <label className="block">
          <span className="block text-sm font-medium text-navy-950 mb-1">
            Full Name <span className="text-red-500">*</span>
          </span>
          <input type="text" name="name" required className={inputClass} />
        </label>
        <label className="block">
          <span className="block text-sm font-medium text-navy-950 mb-1">
            Email <span className="text-red-500">*</span>
          </span>
          <input type="email" name="email" required className={inputClass} />
        </label>
      </div>

      {/* Title + Organization + Country */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <label className="block">
          <span className="block text-sm font-medium text-navy-950 mb-1">
            Title <span className="text-slate-400 font-normal">(optional)</span>
          </span>
          <input type="text" name="title" className={inputClass} />
        </label>
        <label className="block">
          <span className="block text-sm font-medium text-navy-950 mb-1">
            Ministry / Organization <span className="text-slate-400 font-normal">(optional)</span>
          </span>
          <input type="text" name="organization" className={inputClass} />
        </label>
        <label className="block sm:col-span-2">
          <span className="block text-sm font-medium text-navy-950 mb-1">
            Country <span className="text-slate-400 font-normal">(optional)</span>
          </span>
          <input type="text" name="country" className={inputClass} />
        </label>
      </div>

      {/* Inquiry Type */}
      <label className="block">
        <span className="block text-sm font-medium text-navy-950 mb-1">
          Inquiry Type <span className="text-red-500">*</span>
        </span>
        <select name="inquiryType" required className={inputClass}>
          <option value="" disabled>Select inquiry type&hellip;</option>
          <option value="Partnership / Collaboration">Partnership / Collaboration</option>
          <option value="Media Inquiry">Media Inquiry</option>
          <option value="Policy Brief Request">Policy Brief Request</option>
          <option value="Technical / Methodology">Technical / Methodology</option>
        </select>
      </label>

      {/* Message */}
      <label className="block">
        <span className="block text-sm font-medium text-navy-950 mb-1">
          Message <span className="text-red-500">*</span>
        </span>
        <textarea name="message" rows={5} required className={inputClass} />
      </label>

      {/* Submit */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={state === 'submitting'}
          className="bg-teal-600 hover:bg-teal-500 disabled:opacity-60 text-white font-medium px-8 py-3 rounded transition-colors inline-flex items-center gap-2"
        >
          {state === 'submitting' && <Loader2 size={16} className="animate-spin" />}
          Send Message
        </button>
      </div>
      {state === 'error' && (
        <p className="text-sm text-red-600 flex items-center gap-1 mt-2">
          <AlertCircle size={14} />
          Something went wrong. Please try again or email us at starr@gghn.org.
        </p>
      )}
    </form>
  );
}
