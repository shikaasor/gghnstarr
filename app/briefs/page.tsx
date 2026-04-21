import { getAllBriefs, getExperts } from '@/lib/content';
import { Container } from '@/components/layout/Container';
import BriefGrid from '@/components/briefs/BriefGrid';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Policy Briefs | GGHN STARR',
  description: 'Browse and download AMR policy briefs from the GGHN STARR Africa Initiative.',
};

export default function BriefsPage() {
  const briefs = getAllBriefs();   // runs at build time only — fs.readFileSync
  const experts = getExperts();   // runs at build time only — fs.readFileSync

  return (
    <Container className="py-12">
      <div className="mb-8">
        <h1 className="font-serif text-3xl md:text-4xl text-navy-950 mb-2">
          Policy Briefs
        </h1>
        <p className="text-slate-600">
          Weekly evidence briefs from the GGHN STARR Africa AMR Modeling Initiative.
        </p>
      </div>
      <BriefGrid briefs={briefs} experts={experts} />
    </Container>
  );
}
