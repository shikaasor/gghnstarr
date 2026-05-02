import { Download } from 'lucide-react';

interface DownloadCardProps {
  title: string;
  description: string;
  format: string;
  href: string;
  filename: string;
}

export function DownloadCard({ title, description, format, href, filename }: DownloadCardProps) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-serif text-navy-950 font-semibold leading-snug">{title}</h3>
        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono shrink-0">
          [{format}]
        </span>
      </div>
      <p className="text-slate-600 text-sm leading-relaxed flex-grow">{description}</p>
      <a
        href={href}
        download={filename}
        className="inline-flex items-center gap-2 border border-teal-600 text-teal-600 hover:bg-teal-50 font-medium px-4 py-2 rounded transition-colors text-sm self-start"
      >
        <Download size={14} />
        Download
      </a>
    </div>
  );
}
