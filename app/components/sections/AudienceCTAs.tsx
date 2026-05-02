// app/components/sections/AudienceCTAs.tsx
import Link from 'next/link';
import { Landmark, Stethoscope, Users, LucideIcon } from 'lucide-react';
import { Container } from '@/components/layout/Container';

interface SecondaryLink {
  label: string;
  href: string;
  live: boolean;  // false = future page, renders disabled
}

interface AudienceCard {
  icon: LucideIcon;
  headline: string;
  subtext: string;
  primaryLabel: string;
  primaryHref: string;
  primaryLive: boolean;
  secondaryLinks: SecondaryLink[];
}

const audiences: AudienceCard[] = [
  {
    icon: Landmark,
    headline: 'For Policymakers & Ministers',
    subtext: 'Find evidence-backed briefs to inform national AMR strategy and budget decisions.',
    primaryLabel: 'Browse Policy Briefs',
    primaryHref: '/briefs',
    primaryLive: true,
    secondaryLinks: [
      { label: 'AMR Awareness Hub', href: '/awareness', live: true },
      { label: 'Take Action', href: '/take-action#pledge', live: true },
    ],
  },
  {
    icon: Stethoscope,
    headline: 'For Healthcare Workers',
    subtext: 'Access stewardship resources and clinical guidance relevant to your role on the frontline.',
    primaryLabel: 'Explore Resources',
    primaryHref: '/education',
    primaryLive: true,
    secondaryLinks: [
      { label: 'Policy Briefs', href: '/briefs', live: true },
      { label: 'Take Action', href: '/take-action#commitment', live: true },
    ],
  },
  {
    icon: Users,
    headline: 'For the General Public',
    subtext: 'Learn what antimicrobial resistance means for your community and what you can do.',
    primaryLabel: 'Learn What You Can Do',
    primaryHref: '/awareness',
    primaryLive: true,
    secondaryLinks: [
      { label: 'Policy Briefs', href: '/briefs', live: true },
      { label: 'AMR Awareness Hub', href: '/awareness', live: true },
    ],
  },
];

export default function AudienceCTAs() {
  return (
    <section className="bg-slate-100 py-16">
      <Container>
        <div className="text-center mb-10">
          <h2 className="font-serif text-2xl md:text-3xl text-navy-950 font-bold mb-3">
            Find resources for your role
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto">
            AMR touches every sector. Navigate to the content most relevant to how you work.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {audiences.map((audience) => {
            const Icon = audience.icon;
            return (
              <div
                key={audience.headline}
                className="bg-white rounded-lg p-6 shadow-sm border border-slate-200 flex flex-col"
              >
                <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center mb-4 flex-shrink-0">
                  <Icon size={24} className="text-teal-600" />
                </div>

                <h3 className="font-serif text-navy-950 font-bold text-lg mb-2">
                  {audience.headline}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-grow">
                  {audience.subtext}
                </p>

                {/* Primary CTA */}
                {audience.primaryLive ? (
                  <Link
                    href={audience.primaryHref}
                    className="inline-flex items-center justify-center bg-teal-600 hover:bg-teal-500 text-white font-medium px-5 py-2.5 rounded transition-colors text-sm mb-4"
                  >
                    {audience.primaryLabel}
                  </Link>
                ) : (
                  <span
                    aria-disabled="true"
                    className="inline-flex items-center justify-center bg-slate-300 text-slate-500 font-medium px-5 py-2.5 rounded text-sm mb-4 cursor-not-allowed"
                  >
                    {audience.primaryLabel}
                  </span>
                )}

                {/* Secondary links */}
                <div className="flex gap-4 justify-center">
                  {audience.secondaryLinks.map((link) =>
                    link.live ? (
                      <Link
                        key={link.label}
                        href={link.href}
                        className="text-sm text-teal-600 hover:text-teal-500 underline underline-offset-2"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <span
                        key={link.label}
                        aria-disabled="true"
                        className="text-sm text-slate-400 cursor-not-allowed"
                      >
                        {link.label}
                      </span>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
