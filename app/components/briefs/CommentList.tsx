'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Comment {
  id: string;
  name: string;
  comment: string;
  created_at: string;
}

interface Props {
  slug: string;
}

export function CommentList({ slug }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('comments')
      .select('id, name, comment, created_at')
      .eq('slug', slug)
      .eq('status', 'approved')
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        setComments(data ?? []);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <p className="text-sm text-slate-400">Loading comments…</p>;

  if (comments.length === 0) {
    return (
      <p className="text-sm text-slate-500 italic">
        No comments yet — be the first to share your thoughts.
      </p>
    );
  }

  return (
    <ul className="space-y-6">
      {comments.map(c => (
        <li key={c.id} className="border-l-2 border-teal-200 pl-4">
          <div className="flex items-baseline gap-3 mb-1">
            <span className="font-medium text-sm text-navy-950">{c.name}</span>
            <span className="text-xs text-slate-400">
              {new Date(c.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed">{c.comment}</p>
        </li>
      ))}
    </ul>
  );
}
