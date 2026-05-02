import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import ActionCardGrid from '@/components/take-action/ActionCardGrid';
import ToolkitSection from '@/components/take-action/ToolkitSection';

export const metadata: Metadata = {
  title: 'Take Action Against AMR | GGHN STARR',
  description:
    'Sign the public pledge or record your prescribing commitment. Every action strengthens antimicrobial resistance stewardship across Africa.',
};

export default function TakeActionPage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-navy-950 text-white py-16">
        <Container className="text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Take Action</h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">
            Every commitment matters. Whether you are a policymaker shaping national strategy or a
            healthcare worker at the frontline, your pledge helps build a stronger, more resilient
            response to antimicrobial resistance across Africa.
          </p>
        </Container>
      </section>

      {/* Forms */}
      <section id="forms" className="py-16 bg-slate-50">
        <Container>
          <ActionCardGrid />
        </Container>
      </section>

      {/* Toolkit */}
      <section id="toolkit" className="py-16 bg-white">
        <Container>
          <ToolkitSection />
        </Container>
      </section>
    </main>
  );
}
