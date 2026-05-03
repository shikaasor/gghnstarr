import commentsData from '@/content/comments.json';

interface Comment {
  name: string;
  comment: string;
  date: string;
}

interface Props {
  slug: string;
}

export function CommentList({ slug }: Props) {
  const comments: Comment[] = (commentsData as Record<string, Comment[]>)[slug] ?? [];

  if (comments.length === 0) {
    return (
      <p className="text-sm text-slate-500 italic">
        No comments yet — be the first to share your thoughts.
      </p>
    );
  }

  return (
    <ul className="space-y-6">
      {comments.map((c, i) => (
        <li key={i} className="border-l-2 border-teal-200 pl-4">
          <div className="flex items-baseline gap-3 mb-1">
            <span className="font-medium text-sm text-navy-950">{c.name}</span>
            <span className="text-xs text-slate-400">{c.date}</span>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed">{c.comment}</p>
        </li>
      ))}
    </ul>
  );
}
