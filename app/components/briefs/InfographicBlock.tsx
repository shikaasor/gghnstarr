'use client';
import { trackInfographicView } from '@/lib/analytics';

interface InfographicBlockProps {
  imageUrl: string;
  briefSlug: string;
  briefTitle: string;
}

export function InfographicBlock({ imageUrl, briefSlug, briefTitle }: InfographicBlockProps) {
  return (
    <section>
      <h2 className="font-serif text-xl text-navy-950 font-bold mb-4">Infographic</h2>
      <a
        href={imageUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackInfographicView(briefSlug)}
      >
        <img
          src={imageUrl}
          alt={`Infographic for ${briefTitle}`}
          className="w-full rounded-lg shadow-md cursor-pointer hover:opacity-90 transition-opacity"
        />
      </a>
      <p className="text-xs text-slate-500 mt-2">Click image to view full size</p>
    </section>
  );
}
