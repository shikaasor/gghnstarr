'use client';

import { useState } from 'react';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { trackNewsletterSignup } from '@/lib/analytics';

type FormState = 'idle' | 'submitting' | 'success' | 'error';

async function submitNewsletter(emailValue: string): Promise<'success' | 'error'> {
  try {
    const res = await fetch(process.env.NEXT_PUBLIC_GAS_URL!, {
      method: 'POST',
      redirect: 'follow',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ formType: 'newsletter', email: emailValue, source: 'homepage', timestamp: new Date().toISOString() }),
    });
    if (!res.ok) return 'error';
    const json = await res.json();
    return json.status === 'success' ? 'success' : 'error';
  } catch {
    return 'error';
  }
}

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<FormState>('idle');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState('submitting');
    const result = await submitNewsletter(email);
    if (result === 'success') {
      trackNewsletterSignup();
    }
    setState(result);
  }

  if (state === 'success') {
    return (
      <section className="bg-slate-100 py-16 text-center">
        <Container>
          <CheckCircle className="mx-auto text-teal-600 mb-3" size={32} />
          <p className="text-navy-950 font-medium text-lg">You&apos;re subscribed.</p>
          <p className="text-slate-600 mt-1">We&apos;ll send each policy brief directly to your inbox.</p>
        </Container>
      </section>
    );
  }

  return (
    <section className="bg-slate-100 py-16">
      <Container className="max-w-lg text-center">
        <h2 className="font-serif text-2xl text-navy-950 mb-2">Stay Informed</h2>
        <p className="text-slate-600 mb-6">Receive each policy brief as it&apos;s published.</p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="flex-1 border border-slate-200 rounded px-4 py-2 text-navy-950 focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
          <button
            type="submit"
            disabled={state === 'submitting'}
            className="bg-teal-600 hover:bg-teal-500 disabled:opacity-60 text-white font-medium px-6 py-2 rounded transition-colors inline-flex items-center gap-2"
          >
            {state === 'submitting' && <Loader2 size={16} className="animate-spin" />}
            Subscribe
          </button>
        </form>
        {state === 'error' && (
          <p className="mt-3 text-sm text-red-600 flex items-center justify-center gap-1">
            <AlertCircle size={14} />
            Something went wrong. Please try again or email us directly.
          </p>
        )}
      </Container>
    </section>
  );
}
