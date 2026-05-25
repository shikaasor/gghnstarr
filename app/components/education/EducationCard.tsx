import type { EducationItem } from '@/lib/types';

interface EducationCardProps {
  item: EducationItem;
}

export default function EducationCard({ item }: EducationCardProps) {
  const isPublication = item.format === 'Publication';

  return (
    <div className="group bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col gap-3">
      {/* Format badge + source row */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">
          {item.source}
        </span>
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            isPublication
              ? 'bg-navy-950 text-white'
              : 'bg-slate-100 text-slate-600'
          }`}
        >
          {item.format}
        </span>
      </div>

      {/* Title — the primary link */}
      <h3 className="font-serif font-semibold text-navy-950 text-sm leading-snug">
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-teal-700 transition-colors focus:outline-none focus-visible:underline"
        >
          {item.title}
        </a>
      </h3>

      {/* Description excerpt */}
      {item.description && (
        <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
          {item.description}
        </p>
      )}

      {/* Publication metadata */}
      {isPublication && (
        <div className="flex flex-col gap-1">
          {item.authors && (
            <p className="text-xs text-slate-500">{item.authors}</p>
          )}
          {item.journal && (
            <p className="text-xs text-slate-500 italic">{item.journal}</p>
          )}
          {item.doi && (
            <a
              href={`https://doi.org/${item.doi}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-teal-700 hover:underline w-fit"
            >
              DOI: {item.doi}
            </a>
          )}
        </div>
      )}

      {/* Training platform */}
      {item.tab === 'training' && item.platform && (
        <p className="text-xs text-slate-500">via {item.platform}</p>
      )}

      {/* Source unverified flag */}
      {item.sourceVerified === false && (
        <span className="text-xs px-2 py-0.5 rounded-full border bg-amber-50 text-amber-700 border-amber-200 w-fit">
          Source unverified
        </span>
      )}

      {/* Footer: audience tags + region badge + year */}
      <div className="mt-auto flex flex-wrap items-center gap-2">
        {item.audiences.map((audience) => (
          <span
            key={audience}
            className="bg-teal-50 text-teal-700 text-xs px-2 py-0.5 rounded-full font-medium"
          >
            {audience}
          </span>
        ))}
        {item.region && (
          <span className="text-xs px-2 py-0.5 rounded-full border border-slate-300 text-slate-500 font-medium">
            {item.region}
          </span>
        )}
        {item.year !== undefined && (
          <span className="text-xs text-slate-400 ml-auto">{item.year}</span>
        )}
      </div>
    </div>
  );
}
