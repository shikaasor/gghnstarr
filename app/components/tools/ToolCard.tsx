import type { ToolItem } from '@/lib/types';

interface ToolCardProps {
  tool: ToolItem;
}

export default function ToolCard({ tool }: ToolCardProps) {
  return (
    <div className="group bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col gap-3">
      {/* Organization row */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">
          {tool.organization}
        </span>
      </div>

      {/* Title — the primary link */}
      <h3 className="font-serif font-semibold text-navy-950 text-sm leading-snug">
        {tool.url ? (
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-teal-700 transition-colors focus:outline-none focus-visible:underline"
          >
            {tool.name}
          </a>
        ) : (
          <span>{tool.name}</span>
        )}
      </h3>

      {/* Description excerpt */}
      {tool.description && (
        <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
          {tool.description}
        </p>
      )}

      {/* Footer: audience type pills + org level pills + year */}
      <div className="mt-auto flex flex-wrap items-center gap-2">
        {tool.audienceTypes.map((audience) => (
          <span
            key={audience}
            className="bg-teal-50 text-teal-700 text-xs px-2 py-0.5 rounded-full font-medium"
          >
            {audience}
          </span>
        ))}
        {tool.organizationLevels.map((level) => (
          <span
            key={level}
            className="text-xs px-2 py-0.5 rounded-full border border-slate-300 text-slate-500 font-medium"
          >
            {level}
          </span>
        ))}
        {tool.year !== undefined && (
          <span className="text-xs text-slate-400 ml-auto">{tool.year}</span>
        )}
      </div>
    </div>
  );
}
