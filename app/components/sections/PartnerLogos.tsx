'use client';
// app/components/sections/PartnerLogos.tsx
import { useState } from 'react';
import { Container } from '@/components/layout/Container';
import type { SiteContent } from '@/lib/types';

interface PartnerLogosProps {
  partners: SiteContent['partners'];
}

function PartnerLogo({ name, logoUrl, url }: { name: string; logoUrl: string; url?: string }) {
  const [failed, setFailed] = useState(false);

  const inner = failed ? (
    <span className="text-sm font-medium text-slate-500 px-3 py-2 border border-slate-200 rounded">
      {name}
    </span>
  ) : (
    <img
      src={logoUrl}
      alt={name}
      className="h-10 w-auto object-contain"
      onError={() => setFailed(true)}
    />
  );

  return (
    <a
      href={url ?? '#'}
      target="_blank"
      rel="noopener noreferrer"
      className="opacity-80 hover:opacity-100 transition-opacity"
    >
      {inner}
    </a>
  );
}

export default function PartnerLogos({ partners }: PartnerLogosProps) {
  return (
    <section className="bg-white py-12">
      <Container>
        <p className="text-xs uppercase tracking-wider text-slate-400 font-medium text-center mb-8">
          Partners
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {partners.map((p) => (
            <PartnerLogo key={p.name} name={p.name} logoUrl={p.logoUrl} url={p.url} />
          ))}
        </div>
      </Container>
    </section>
  );
}
