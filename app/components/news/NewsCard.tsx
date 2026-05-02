import type { NewsArticle } from '@/lib/types';

interface NewsCardProps {
  article: NewsArticle;
}

function truncateAbstract(text: string): string {
  // Split on sentence boundaries, take first 2-3 sentences
  const sentences = text.match(/[^.!?]+[.!?]+/g) ?? [];
  const excerpt = sentences.slice(0, 3).join(' ').trim();
  return excerpt && excerpt.length < text.length ? excerpt + '…' : text;
}

export default function NewsCard({ article }: NewsCardProps) {
  const abstractExcerpt = article.abstract ? truncateAbstract(article.abstract) : '';

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col gap-2">
      {/* Top row: source + date */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">
          {article.source}
        </span>
        <span className="text-xs text-slate-400">{article.publishedDate}</span>
      </div>

      {/* Title */}
      <h3 className="font-serif font-semibold text-sm leading-snug">
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-navy-950 hover:text-teal-700 transition-colors"
        >
          {article.title}
        </a>
      </h3>

      {/* Authors */}
      <p className="text-xs text-slate-500">{article.authors}</p>

      {/* Journal / category */}
      {article.journal && (
        <p className="text-xs text-slate-400 italic">{article.journal}</p>
      )}

      {/* Abstract excerpt */}
      {abstractExcerpt && (
        <p className="text-xs text-slate-600 leading-relaxed">{abstractExcerpt}</p>
      )}

      {/* Read article link */}
      <div className="mt-auto pt-2">
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-teal-700 hover:text-teal-900 font-medium transition-colors"
        >
          Read article &rarr;
        </a>
      </div>
    </div>
  );
}
