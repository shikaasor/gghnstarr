import { getExperts } from '@/lib/content';
import { ExpertCard } from '@/components/experts/ExpertCard';
import { Container } from '@/components/layout/Container';

export const metadata = { title: 'Our Experts | GGHN STARR' };

export default function ExpertsPage() {
  const experts = getExperts();

  return (
    <>
      <section className="bg-white pt-16 pb-8">
        <Container>
          <h1 className="font-serif text-3xl font-bold text-navy-950 mb-4">Our Experts</h1>
          <p className="text-slate-600 max-w-2xl">
            The GGHN STARR initiative is led by specialists in predictive modeling, genomic surveillance,
            and One Health governance, each bringing field implementation experience across African health systems.
          </p>
        </Container>
      </section>
      <section className="py-12 bg-slate-50">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {experts.map((expert) => (
              <ExpertCard key={expert.id} expert={expert} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
