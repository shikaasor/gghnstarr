import type { Metadata } from 'next';
import { ConferenceHero } from '@/components/conference/ConferenceHero';
import { ConferenceAbout } from '@/components/conference/ConferenceAbout';
import { ConferenceThemes } from '@/components/conference/ConferenceThemes';

export const metadata: Metadata = {
  title: '5th High-Level Inter-Ministerial Meeting on AMR',
  description:
    'Join ministers and health leaders at the 5th High-Level Inter-Ministerial Meeting on Antimicrobial Resistance — June 28–30, 2026, Abuja, Nigeria.',
  openGraph: {
    title: '5th High-Level Inter-Ministerial Meeting on AMR',
    description:
      'The first flagship AMR ministerial conference on the African continent. June 28–30, 2026 · Abuja, Nigeria.',
  },
};

export default function ConferencePage() {
  return (
    <div>
      <ConferenceHero />
      <ConferenceAbout />
      <ConferenceThemes />
    </div>
  );
}
