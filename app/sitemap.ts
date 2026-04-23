import type { MetadataRoute } from 'next';
import { getAllBriefs } from '@/lib/content';

export const dynamic = 'force-static';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://gghnstarr.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const briefs = getAllBriefs();

  const briefEntries: MetadataRoute.Sitemap = briefs.map((b) => ({
    url: `${BASE_URL}/briefs/${b.slug}`,
    lastModified: new Date(b.publicationDate),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${BASE_URL}/briefs`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/methodology`,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/experts`,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/contact`,
      changeFrequency: 'yearly' as const,
      priority: 0.4,
    },
    ...briefEntries,
  ];
}
