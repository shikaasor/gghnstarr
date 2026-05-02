'use client';

import { useState } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { formConfig } from '@/lib/form-config';
import { trackCommitmentSubmit } from '@/lib/analytics';

type FormState = 'idle' | 'submitting' | 'success' | 'error';

interface CommitmentPayload {
  name: string;
  facility: string;
  specialty: string;
  specificCommitment: string;
  timestamp: string;
}

async function submitToGAS(url: string, payload: CommitmentPayload): Promise<'success' | 'error'> {
  try {
    const res = await fetch(url, {
      method: 'POST',
      redirect: 'follow',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return 'error';
    const json = await res.json();
    return json.status === 'success' ? 'success' : 'error';
  } catch {
    return 'error';
  }
}

const inputClass =
  'border border-slate-200 rounded px-4 py-2 text-navy-950 focus:outline-none focus:ring-2 focus:ring-teal-600 w-full';

interface CommitmentFormProps {
  onSuccess: () => void;
}

export function CommitmentForm({ onSuccess }: CommitmentFormProps) {
  const [name, setName] = useState('');
  const [facility, setFacility] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [specificCommitment, setSpecificCommitment] = useState('');
  const [state, setState] = useState<FormState>('idle');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!formConfig.commitmentUrl) {
      setState('error');
      return;
    }
    setState('submitting');
    const result = await submitToGAS(formConfig.commitmentUrl, {
      name,
      facility,
      specialty,
      specificCommitment,
      timestamp: new Date().toISOString(),
    });
    if (result === 'success') {
      trackCommitmentSubmit();
      onSuccess();
    }
    setState(result);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
      <div>
        <label htmlFor="commitment-name" className="block text-sm font-medium text-navy-950 mb-1">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          id="commitment-name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your full name"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="commitment-facility" className="block text-sm font-medium text-navy-950 mb-1">
          Facility / Institution <span className="text-red-500">*</span>
        </label>
        <input
          id="commitment-facility"
          type="text"
          required
          value={facility}
          onChange={(e) => setFacility(e.target.value)}
          placeholder="Hospital or clinic name"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="commitment-specialty" className="block text-sm font-medium text-navy-950 mb-1">
          Specialty <span className="text-red-500">*</span>
        </label>
        <input
          id="commitment-specialty"
          type="text"
          required
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
          placeholder="e.g. General Practitioner, Pharmacist"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="commitment-specific" className="block text-sm font-medium text-navy-950 mb-1">
          Specific Commitment <span className="text-red-500">*</span>
        </label>
        <textarea
          id="commitment-specific"
          required
          minLength={20}
          value={specificCommitment}
          onChange={(e) => setSpecificCommitment(e.target.value)}
          placeholder="Describe your specific prescribing commitment (at least 20 characters)..."
          rows={4}
          className={`${inputClass} resize-none`}
        />
      </div>

      <button
        type="submit"
        disabled={state === 'submitting'}
        className="bg-teal-600 hover:bg-teal-500 disabled:opacity-60 text-white font-medium px-6 py-2.5 rounded transition-colors inline-flex items-center justify-center gap-2"
      >
        {state === 'submitting' && <Loader2 size={16} className="animate-spin" />}
        {state === 'submitting' ? 'Submitting...' : 'Record My Commitment'}
      </button>

      {state === 'error' && (
        <p className="text-sm text-red-600 flex items-center gap-1.5">
          <AlertCircle size={14} className="flex-shrink-0" />
          Submission failed. Please try again.
        </p>
      )}
    </form>
  );
}
