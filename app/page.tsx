import { getSiteContent, getFeaturedBrief } from '@/lib/content';
import HeroSection from '@/components/sections/HeroSection';
import AudienceCTAs from '@/components/sections/AudienceCTAs';
import StatStrip from '@/components/sections/StatStrip';
import FeaturedBrief from '@/components/sections/FeaturedBrief';
import NewsletterSignup from '@/components/sections/NewsletterSignup';

export default function HomePage() {
  const site = getSiteContent();
  const featured = getFeaturedBrief();

  return (
    <>
      <HeroSection conferenceDate={site.conferenceDate} />
      <AudienceCTAs />
      <StatStrip stats={site.stats} />
      {featured && <FeaturedBrief brief={featured} />}
      <NewsletterSignup />
    </>
  );
}
