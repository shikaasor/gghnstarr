'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { trackEvent } from '@/lib/analytics';

interface Props {
  slug: string;
}

export function CommentForm({ slug }: Props) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('submitting');
    const { error } = await supabase
      .from('comments')
      .insert({ slug, name, email: email || null, comment, status: 'pending' });
    if (error) {
      setStatus('error');
      return;
    }
    trackEvent('comment_submitted', { brief_slug: slug });
    setStatus('success');
  }

  if (status === 'success') {
    return (
      <p className="text-sm text-teal-700 bg-teal-50 border border-teal-200 rounded-lg px-4 py-3">
        Thanks — your comment is awaiting moderation.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="comment-name" className="block text-sm font-medium text-navy-950 mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            id="comment-name"
            type="text"
            required
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="comment-email" className="block text-sm font-medium text-navy-950 mb-1">
            Email <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <input
            id="comment-email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
            placeholder="For reply notifications"
          />
        </div>
      </div>
      <div>
        <label htmlFor="comment-text" className="block text-sm font-medium text-navy-950 mb-1">
          Comment <span className="text-red-500">*</span>
        </label>
        <textarea
          id="comment-text"
          required
          rows={4}
          value={comment}
          onChange={e => setComment(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 resize-none"
          placeholder="Share your thoughts on this brief..."
        />
      </div>
      {status === 'error' && (
        <p className="text-sm text-red-600">Something went wrong. Please try again.</p>
      )}
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="px-5 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {status === 'submitting' ? 'Submitting…' : 'Submit Comment'}
      </button>
    </form>
  );
}
