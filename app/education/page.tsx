import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import EducationGrid from '@/components/education/EducationGrid';
import type { EducationResource } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Education Library | GGHN STARR',
  description: 'Audience-specific AMR learning materials for policymakers, healthcare workers, and the general public — curated from WHO, Africa CDC, and leading research institutions.',
};

const educationResources: EducationResource[] = [
  // Policymaker
  {
    title: 'African Union Framework for Antimicrobial Resistance Control 2020–2025',
    audiences: ['Policymaker'],
    format: 'Download',
    source: 'Africa CDC',
    url: 'https://africacdc.org/download/african-union-framework-for-antimicrobial-resistance-control-2020-2025/',
  },
  {
    title: 'African Union AMR Landmark Report: Voicing African Priorities on the Active Pandemic',
    audiences: ['Policymaker'],
    format: 'Download',
    source: 'Africa CDC',
    url: 'https://africacdc.org/download/african-union-amr-landmark-report-voicing-african-priorities-on-the-active-pandemic/',
  },
  {
    title: 'Global Antibiotic Resistance Surveillance Report 2025',
    audiences: ['Policymaker', 'Healthcare Worker'],
    format: 'Article',
    source: 'WHO',
    url: 'https://www.who.int/publications/i/item/9789240116337',
  },
  {
    title: 'Implementing the Global Action Plan on Antimicrobial Resistance',
    audiences: ['Policymaker'],
    format: 'Download',
    source: 'WOAH / WHO',
    url: 'https://www.woah.org/app/uploads/2024/01/implementing-the-global-action-plan-on-antimicrobial-resistance.pdf',
  },
  // Healthcare Worker
  {
    title: 'AMR Surveillance Guidance for the African Region',
    audiences: ['Healthcare Worker', 'Policymaker'],
    format: 'Download',
    source: 'Africa CDC',
    url: 'https://africacdc.org/download/antimicrobial-resistance-surveillance-guidance-for-the-african-region/',
  },
  {
    title: 'Knowledge, Attitudes and Practices on AMR Among Pharmacy Workers in 28 African Countries',
    audiences: ['Healthcare Worker'],
    format: 'Article',
    source: 'Africa Health Knowledge Hub',
    url: 'https://khub.africacdc.org/records/resource?id=152',
  },
  {
    title: 'Antimicrobial Stewardship in Africa: Policy Analysis Across Five Countries',
    audiences: ['Healthcare Worker', 'Policymaker'],
    format: 'Article',
    source: 'Cambridge / ASH&E',
    url: 'https://www.cambridge.org/core/journals/antimicrobial-stewardship-and-healthcare-epidemiology/article/antimicrobial-stewardship-in-africa-a-policy-analysis-of-national-action-plans-across-five-african-countries/EC7184C836CDF3B8F56DC6DA3A6ABC02',
  },
  {
    title: 'Combating AMR in Africa: Strategic Roadmap for Surveillance, Stewardship, and Research',
    audiences: ['Healthcare Worker', 'Policymaker'],
    format: 'Article',
    source: 'Frontiers',
    url: 'https://www.frontiersin.org/journals/cellular-and-infection-microbiology/articles/10.3389/fcimb.2025.1714021/full',
  },
  // General Public
  {
    title: 'Antimicrobial Resistance — WHO Fact Sheet',
    audiences: ['General Public', 'Healthcare Worker'],
    format: 'Article',
    source: 'WHO',
    url: 'https://www.who.int/news-room/fact-sheets/detail/antimicrobial-resistance',
  },
  {
    title: 'World AMR Awareness Week 2024: Educate. Advocate. Act Now.',
    audiences: ['General Public'],
    format: 'Article',
    source: 'WHO',
    url: 'https://www.who.int/campaigns/world-amr-awareness-week/2024',
  },
  {
    title: 'Enhancing General Public Knowledge of AMR in Africa: A Video-Based Educational Review',
    audiences: ['General Public'],
    format: 'Article',
    source: 'PubMed / JAC-AMR',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11775625/',
  },
  {
    title: 'Global Call to Action to Address Antimicrobial Resistance (October 2025)',
    audiences: ['General Public', 'Policymaker'],
    format: 'Download',
    source: 'WHO',
    url: 'https://cdn.who.int/media/docs/default-source/antimicrobial-resistance/amr-gcp-asa/global-call-to-action-to-address-amr---oct-2025.pdf',
  },
];

export default function EducationPage() {
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
              Curated materials from WHO, Africa CDC, Fleming Fund, and leading research institutions — filtered for your role and professional context.
            </p>
          </div>
        </Container>
      </section>

      {/* Filtered grid */}
      <section className="py-14 bg-slate-50">
        <Container>
          <h2 className="font-serif text-2xl font-bold text-navy-950 mb-2">
            Browse Resources
          </h2>
          <p className="text-slate-600 text-sm mb-8">
            {educationResources.length} resources available. Filter by your audience to find the most relevant materials.
          </p>
          <EducationGrid resources={educationResources} />
        </Container>
      </section>
    </main>
  );
}
