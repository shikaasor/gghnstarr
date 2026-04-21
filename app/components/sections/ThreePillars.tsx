import { Container } from '@/components/layout/Container';
import { Dna, TrendingUp, Globe } from 'lucide-react';

const pillars = [
  { icon: Dna, title: 'Genomic Surveillance' },
  { icon: TrendingUp, title: 'Predictive Analytics' },
  { icon: Globe, title: 'One Health Governance' },
] as const;

export default function ThreePillars() {
  return (
    <section className="bg-white py-16">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {pillars.map(({ icon: Icon, title }) => (
            <div key={title} className="flex flex-col items-center gap-4">
              <Icon size={48} className="text-teal-600" strokeWidth={1.5} />
              <h3 className="font-serif font-bold text-xl text-navy-950">{title}</h3>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
