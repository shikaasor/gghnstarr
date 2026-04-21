import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ConferenceBadge from './ConferenceBadge';

interface HeroSectionProps {
  conferenceDate: string;
}

export default function HeroSection({ conferenceDate }: HeroSectionProps) {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 bg-navy-950"
      style={{ backgroundImage: 'url(/images/hero-bg.webp)', backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="absolute inset-0 bg-navy-950/70" />
      <div className="relative z-10 flex flex-col items-center">
        <ConferenceBadge conferenceDate={conferenceDate} />
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mt-6 max-w-3xl drop-shadow-lg">
          AMR Policy Intelligence for Africa
        </h1>
        <p className="text-white/90 text-lg md:text-xl mt-4 max-w-2xl drop-shadow">
          Evidence-backed policy briefs from the GGHN STARR initiative, informing Africa&apos;s response to antimicrobial resistance
        </p>
        <Link
          href="/briefs"
          className="mt-8 inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-medium px-6 py-3 rounded transition-colors"
        >
          Read the Latest Policy Brief
          <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}
