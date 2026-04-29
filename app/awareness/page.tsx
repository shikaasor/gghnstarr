import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import InfographicGrid from '@/components/awareness/InfographicGrid';
import AccordionSection from '@/components/awareness/AccordionSection';

export const metadata: Metadata = {
  title: 'AMR Awareness Hub | GGHN STARR',
  description: 'Learn about antimicrobial resistance — what it is, why it matters for Africa, and what you can do. Explore infographics and download fact sheets.',
};

const statCards = [
  {
    value: '1.27M',
    label: 'Deaths directly caused by bacterial AMR globally — WHO, 2019',
    source: 'WHO Global Antimicrobial Resistance and Use Survey, 2022',
  },
  {
    value: '700K',
    label: 'Deaths from AMR in the WHO African Region annually',
    source: 'WHO GLASS Report, 2024',
  },
  {
    value: '$100T',
    label: 'Projected lost global output by 2050 if AMR trends continue',
    source: 'World Bank, 2017',
  },
  {
    value: '10M',
    label: 'Projected annual deaths from AMR globally by 2050 — surpassing cancer',
    source: 'WHO Review on AMR, 2016',
  },
];

const actionCards = [
  {
    title: 'Explore the Education Library',
    description: 'Find resources tailored to your role — policymaker, healthcare worker, or general public.',
    href: '/education',
    label: 'Browse Resources',
  },
  {
    title: 'Take Action',
    description: 'Sign a public pledge, record a prescribing commitment, or download advocacy toolkit assets.',
    href: '/take-action',
    label: 'Take Action',
  },
  {
    title: 'Download Fact Sheets',
    description: 'Access WHO fact sheets, Africa CDC reports, and One Health guidance for your community.',
    href: 'https://www.who.int/docs/default-source/antimicrobial-resistance/amr-factsheet.pdf',
    label: 'Downloads',
    external: true,
  },
];

const infographics = [
  {
    src: '/infographics/IMG_9750.jpeg',
    title: 'AMR Laboratory Surveillance in Rwanda',
    description: 'Strengthening diagnostic capacity and laboratory networks to detect and monitor antimicrobial resistance across Rwanda\'s health system.',
  },
  {
    src: '/infographics/IMG_9751.jpeg',
    title: 'Financing AMR Response in Rwanda',
    description: 'Domestic financing mechanisms and resource mobilisation strategies to sustain Rwanda\'s national AMR action plan implementation.',
  },
  {
    src: '/infographics/IMG_9752.jpeg',
    title: 'One Health Governance for AMR',
    description: 'Coordinating human, animal, and environmental health sectors under a One Health framework to address AMR at its source.',
  },
];

const accordionItems = [
  {
    title: 'What is AMR?',
    content: (
      <>
        <p>
          Antimicrobial resistance (AMR) occurs when bacteria, viruses, fungi, and parasites evolve over time and no longer respond to medicines, making infections harder to treat and increasing the risk of disease spread, severe illness, and death. AMR is a natural biological process, but it is being dramatically accelerated by the misuse and overuse of antimicrobials in humans, animals, and agriculture.
        </p>
        <p>
          The World Health Organization estimates that bacterial AMR was directly responsible for 1.27 million deaths globally in 2019, contributing to approximately 4.95 million deaths in total when counting associated mortality. In the WHO African Region specifically, AMR accounts for approximately 700,000 deaths annually — a disproportionate burden driven by high infectious disease prevalence and limited diagnostic capacity.
        </p>
        <p>
          Addressing AMR requires a coordinated One Health approach — recognising that the health of humans, animals, and the environment are deeply interconnected. This means evidence-based prescribing, robust surveillance, investment in diagnostics, and sustained political commitment at the highest levels.
        </p>
        <p>
          <a
            href="https://www.who.int/docs/default-source/antimicrobial-resistance/amr-factsheet.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-600 hover:text-teal-500 underline underline-offset-2 font-medium"
          >
            Download WHO AMR Fact Sheet (PDF)
          </a>
        </p>
      </>
    ),
  },
  {
    title: 'Why Does Africa Face a Disproportionate Burden?',
    content: (
      <>
        <p>
          Africa carries a disproportionate share of the global AMR burden, driven by high infectious disease prevalence, limited diagnostic capacity, and gaps in national action plan (NAP) implementation. High rates of infectious diseases such as malaria, TB, HIV, and pneumonia create frequent antibiotic use — and misuse — at scale. Without reliable diagnostic tools, clinicians often prescribe broad-spectrum antibiotics empirically, accelerating resistance development.
        </p>
        <p>
          Encouragingly, 45 of 47 WHO African Region countries have now developed NAPs for AMR. However, development and implementation remain two very different challenges. Funding gaps, fragmented supply chains, and limited laboratory infrastructure mean that surveillance data is often incomplete, making it difficult to track the true scale of resistance or measure the impact of interventions. Rwanda's national laboratories — supported by initiatives such as the Fleming Fund — represent a model for the continent, demonstrating what is achievable with sustained investment and political will.
        </p>
        <p>
          The Fleming Fund, Africa CDC, and WHO AFRO are investing in strengthening AMR surveillance networks across the continent. These partnerships aim to build the evidence base that will allow African policymakers to make data-driven decisions — turning NAPs from documents into lived realities.
        </p>
        <p>
          <a
            href="https://africacdc.org/download/african-union-amr-landmark-report-voicing-african-priorities-on-the-active-pandemic/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-600 hover:text-teal-500 underline underline-offset-2 font-medium"
          >
            Read the Africa CDC AMR Landmark Report
          </a>
        </p>
      </>
    ),
  },
  {
    title: 'What Can You Do?',
    content: (
      <>
        <p>
          AMR is not just a problem for scientists or governments — it is shaped by the actions of individuals, communities, and institutions at every level. Individuals can make a difference by only taking antibiotics when prescribed by a qualified healthcare provider, never sharing or using leftover antibiotics, completing the full course even when feeling better, and practising good hand hygiene to prevent the spread of infections in the first place.
        </p>
        <p>
          Healthcare workers and prescribers can champion antimicrobial stewardship programmes in their facilities — promoting evidence-based prescribing, investing in rapid diagnostics to guide treatment decisions, and reporting resistance patterns to national surveillance systems. Policymakers can embed AMR in national budgets, strengthen laboratory infrastructure, and ensure that NAPs are funded, monitored, and updated on the basis of local evidence.
        </p>
        <p>
          Communities and advocates can support World AMR Awareness Week, held annually from 18–24 November, by sharing accurate information about resistance, engaging with One Health initiatives, and holding institutions accountable for stewardship commitments. Every action — however small — contributes to slowing the spread of resistance and preserving the effectiveness of the medicines that billions of people depend on.
        </p>
        <p>
          <a
            href="https://www.who.int/campaigns/world-amr-awareness-week/2024"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-600 hover:text-teal-500 underline underline-offset-2 font-medium"
          >
            World AMR Awareness Week 2024 — WHO Campaign
          </a>
        </p>
      </>
    ),
  },
];

export default function AwarenessPage() {
  return (
    <main>
      {/* Hero — dark teal with bold title */}
      <section className="bg-navy-950 text-white py-16 md:py-20">
        <Container>
          <div className="max-w-2xl">
            <span className="inline-block bg-amr-gold/20 text-amr-gold text-xs font-semibold px-3 py-1 rounded-full mb-5 uppercase tracking-wide">
              AMR Awareness Hub
            </span>
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-5 leading-tight">
              Be AMR Aware
            </h1>
            <p className="text-slate-300 text-lg md:text-xl leading-relaxed">
              Antimicrobial resistance is one of the greatest threats to human health. Learn the facts, explore real stories from Africa, and find out what you can do — today.
            </p>
          </div>
        </Container>
      </section>

      {/* Know the Facts — warm cream background */}
      <section className="py-16 bg-amber-50/60">
        <Container>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-navy-950 mb-10 text-center">
            Know the Facts
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {statCards.map((stat) => (
              <div
                key={stat.value}
                className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm"
              >
                <div className="font-serif text-4xl font-bold text-teal-600 mb-3">
                  {stat.value}
                </div>
                <p className="text-slate-700 text-sm leading-relaxed mb-3 font-medium">
                  {stat.label}
                </p>
                <p className="text-slate-400 text-xs italic">{stat.source}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Fleming Fund infographics — full-width grid with lightbox */}
      <section className="py-16 bg-white">
        <Container>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-navy-950 mb-2">
            Fleming Fund Rwanda Infographics
          </h2>
          <p className="text-slate-600 text-sm mb-10">
            Real programmes, real impact — click any infographic to view it in full size and download.
          </p>
          <InfographicGrid infographics={infographics} />
        </Container>
      </section>

      {/* Get Involved — dark navy background */}
      <section className="py-16 bg-navy-800 text-white">
        <Container>
          <h2 className="font-serif text-2xl md:text-3xl font-bold mb-2">
            Get Involved
          </h2>
          <p className="text-slate-300 text-sm mb-10">
            AMR affects everyone. Here is how you can join the response — in your clinic, your community, and your country.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {actionCards.map((action) => (
              <a
                key={action.title}
                href={action.href}
                target={action.external ? '_blank' : undefined}
                rel={action.external ? 'noopener noreferrer' : undefined}
                className="group block bg-navy-950 rounded-xl p-6 border border-white/10 hover:border-amr-gold/40 transition-colors"
              >
                <div className="font-serif text-lg font-bold text-white mb-2 group-hover:text-amr-gold transition-colors">
                  {action.title}
                </div>
                <p className="text-slate-400 text-sm leading-relaxed mb-5">
                  {action.description}
                </p>
                <span className="inline-flex items-center gap-2 bg-amr-gold text-navy-950 text-sm font-semibold px-4 py-2 rounded-lg group-hover:bg-white transition-colors">
                  {action.label}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </a>
            ))}
          </div>
        </Container>
      </section>

      {/* AMR Explained — warm cream, accordion for deeper reading */}
      <section className="py-16 bg-amber-50/60">
        <Container>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-navy-950 mb-2">
            AMR Explained
          </h2>
          <p className="text-slate-600 text-sm mb-8">
            Select a topic to expand and read. Fact sheets and further reading are linked within each section.
          </p>
          <div className="max-w-3xl">
            <AccordionSection items={accordionItems} />
          </div>
        </Container>
      </section>

    </main>
  );
}