import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import InfographicGrid from '@/components/awareness/InfographicGrid';
import AccordionSection from '@/components/awareness/AccordionSection';

export const metadata: Metadata = {
  title: 'AMR Awareness Hub | GGHN STARR',
  description: 'Learn about antimicrobial resistance — what it is, why it matters for Africa, and what you can do. Explore infographics and download fact sheets.',
};

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
          The World Health Organization estimates that bacterial AMR was directly responsible for 1.27 million deaths globally in 2019, contributing to approximately 4.95 million deaths in total when counting associated mortality. Without decisive action, AMR could cause up to 10 million deaths annually by 2050 — surpassing cancer as a leading cause of death. The economic cost could exceed $100 trillion in lost global output over the same period.
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
      {/* Hero */}
      <section className="bg-teal-600 text-white py-14">
        <Container>
          <div className="max-w-2xl">
            <span className="inline-block bg-white/20 text-white text-xs font-medium px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
              AMR Awareness Hub
            </span>
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Understanding Antimicrobial Resistance
            </h1>
            <p className="text-teal-100 text-lg leading-relaxed">
              AMR is one of the greatest public health threats of our time. Explore infographics, learn the facts, and find resources relevant to your role.
            </p>
          </div>
        </Container>
      </section>

      {/* Infographic grid */}
      <section className="py-14 bg-slate-50">
        <Container>
          <h2 className="font-serif text-2xl font-bold text-navy-950 mb-2">
            Fleming Fund Rwanda Infographics
          </h2>
          <p className="text-slate-600 text-sm mb-8">
            Click any infographic to view it in full size.
          </p>
          <InfographicGrid infographics={infographics} />
        </Container>
      </section>

      {/* Explainer accordions */}
      <section className="py-14 bg-white">
        <Container>
          <h2 className="font-serif text-2xl font-bold text-navy-950 mb-2">
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