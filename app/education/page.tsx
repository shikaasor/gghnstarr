import { readFileSync } from 'fs';
import { join } from 'path';
import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import EducationTabs from '@/components/education/EducationTabs';
import type { EducationItem } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Education Library | GGHN STARR',
  description:
    'Training courses, webinars, publications, and reference materials on antimicrobial resistance — curated from WHO, Africa CDC, and leading research institutions.',
};

export default function EducationPage() {
  const items: EducationItem[] = JSON.parse(
    readFileSync(join(process.cwd(), 'content/education.json'), 'utf-8')
  );

  return (
    <main>
      {/* Hero */}
      <section className="bg-teal-600 text-white py-14">
        <Container>
          <div className="max-w-2xl">
            <span className="inline-block bg-white/20 text-white text-xs font-medium px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
              Education Library
            </span>
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              AMR Learning Resources
            </h1>
            <p className="text-teal-100 text-lg leading-relaxed">
              Curated training courses, webinars, publications, and reference materials from
              WHO, Africa CDC, Fleming Fund, and leading research institutions.
            </p>
          </div>
        </Container>
      </section>

      {/* Tabs + filters + cards */}
      <section className="py-14 bg-slate-50">
        <Container>
          <EducationTabs items={items} />
        </Container>
      </section>
    </main>
  );
}
