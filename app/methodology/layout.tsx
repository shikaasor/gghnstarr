import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Methodology & Engine | GGHN STARR',
  description:
    "Explore the SEIR, machine learning, Bayesian forecasting, and agent-based simulation models powering GGHN STARR's AMR policy analysis.",
};

export default function MethodologyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
