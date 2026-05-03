'use client';

import { useState } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { formConfig } from '@/lib/form-config';
import { trackPledgeSubmit } from '@/lib/analytics';

type FormState = 'idle' | 'submitting' | 'success' | 'error';

interface PledgePayload {
  formType: 'pledge';
  name: string;
  country: string;
  role: string;
  commitmentStatement: string;
  timestamp: string;
}

async function submitToGAS(url: string, payload: PledgePayload): Promise<'success' | 'error'> {
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

interface PledgeFormProps {
  onSuccess: () => void;
}

export function PledgeForm({ onSuccess }: PledgeFormProps) {
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [role, setRole] = useState('');
  const [commitmentStatement, setCommitmentStatement] = useState('');
  const [state, setState] = useState<FormState>('idle');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!formConfig.formUrl) {
      setState('error');
      return;
    }
    setState('submitting');
    const result = await submitToGAS(formConfig.formUrl, {
      formType: 'pledge',
      name,
      country,
      role,
      commitmentStatement,
      timestamp: new Date().toISOString(),
    });
    if (result === 'success') {
      trackPledgeSubmit();
      onSuccess();
    }
    setState(result);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
      <div>
        <label htmlFor="pledge-name" className="block text-sm font-medium text-navy-950 mb-1">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          id="pledge-name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your full name"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="pledge-country" className="block text-sm font-medium text-navy-950 mb-1">
          Country <span className="text-red-500">*</span>
        </label>
        <input
          id="pledge-country"
          type="text"
          required
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          placeholder="Your country"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="pledge-role" className="block text-sm font-medium text-navy-950 mb-1">
          Role / Title <span className="text-red-500">*</span>
        </label>
        <input
          id="pledge-role"
          type="text"
          required
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="e.g. Policymaker, Minister of Health"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="pledge-statement" className="block text-sm font-medium text-navy-950 mb-1">
          Commitment Statement <span className="text-red-500">*</span>
        </label>
        <textarea
          id="pledge-statement"
          required
          minLength={20}
          value={commitmentStatement}
          onChange={(e) => setCommitmentStatement(e.target.value)}
          placeholder="Describe your commitment to fighting AMR (at least 20 characters)..."
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
        {state === 'submitting' ? 'Submitting...' : 'Sign the Pledge'}
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
