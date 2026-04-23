import { getAllBriefs, getBriefBySlug, getExperts } from '@/lib/content';
import { Container } from '@/components/layout/Container';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Download } from 'lucide-react';
import type { Metadata } from 'next';

// REQUIRED for output:'export' — enumerates all slugs at build time
export function generateStaticParams() {
  const briefs = getAllBriefs();
  return briefs.map(b => ({ slug: b.slug }));
  // Returns: [
  //   { slug: 'week-01-amr-governance-frameworks' },
  //   { slug: 'week-02-laboratory-systems-capacity' },
  //   { slug: 'week-03-predictive-analytics-amr-burden' },
  // ]
}

// Per-page metadata with OG/Twitter for rich WhatsApp previews
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const brief = getBriefBySlug(slug);
  if (!brief) return {};
  return {
    title: brief.title,   // Root layout template adds ' | GGHN STARR' automatically
    description: brief.keyTakeaway,
    alternates: {
      canonical: `/briefs/${brief.slug}`,
    },
    openGraph: {
      title: brief.title,
      description: brief.keyTakeaway,
      type: 'article',
      publishedTime: brief.publicationDate,
      images: [
        {
          url: brief.thumbnailUrl,  // e.g. '/images/thumbnails/week-01-amr-governance-frameworks.jpg'
          width: 641,
          height: 360,
          alt: brief.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: brief.title,
      description: brief.keyTakeaway,
      images: [brief.thumbnailUrl],
    },
  };
}

// Page component — async because params is a Promise in Next.js 16
export default async function BriefDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const brief = getBriefBySlug(slug);
  if (!brief) notFound();

  const experts = getExperts();
  const author = experts.find(e => e.id === brief.authorId);

  // Prev/Next navigation — computed from sorted array
  const allBriefs = getAllBriefs(); // sorted by weekNumber ascending
  const currentIndex = allBriefs.findIndex(b => b.slug === slug);
  const prevBrief = currentIndex > 0 ? allBriefs[currentIndex - 1] : null;
  const nextBrief = currentIndex < allBriefs.length - 1 ? allBriefs[currentIndex + 1] : null;

  const dateLabel = new Date(brief.publicationDate).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });

  return (
    <Container className="py-12">

      {/* Hero: text-first, thumbnail beside — locked decision */}
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        {/* Text column */}
        <div className="flex-1">
          <p className="text-xs uppercase tracking-wider text-teal-600 font-medium mb-2">
            Week {brief.weekNumber} · {dateLabel}
          </p>
          <h1 className="font-serif text-2xl md:text-3xl text-navy-950 font-bold mb-3">
            {brief.title}
          </h1>
          {author && (
            <p className="text-slate-600 text-sm mb-6">By {author.name}</p>
          )}
          {/* Download buttons — hero area only, not repeated below — locked decision */}
          <div className="flex flex-wrap gap-3 no-print">
            <a
              href={brief.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-medium px-5 py-2.5 rounded transition-colors text-sm"
            >
              <Download size={16} />
              Download PDF
            </a>
            <a
              href={brief.infographicPdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-teal-600 text-teal-600 hover:bg-teal-50 font-medium px-5 py-2.5 rounded transition-colors text-sm"
            >
              <Download size={16} />
              Download Infographic
            </a>
          </div>
        </div>
        {/* Thumbnail — smaller, beside text — locked decision */}
        <div className="md:w-64 flex-shrink-0">
          <img
            src={brief.thumbnailUrl}
            alt={brief.title}
            className="w-full rounded-lg shadow-md object-cover"
          />
        </div>
      </div>

      {/* Content sections below hero — locked decision */}
      <div className="max-w-3xl space-y-10">

        {/* Executive Summary */}
        <section>
          <h2 className="font-serif text-xl text-navy-950 font-bold mb-4">Executive Summary</h2>
          <p className="text-slate-700 leading-relaxed">{brief.executiveSummary}</p>
        </section>

        {/* Key Messages — bullet list */}
        <section>
          <h2 className="font-serif text-xl text-navy-950 font-bold mb-4">Key Messages</h2>
          <ul className="space-y-3">
            {brief.keyMessages.map((msg, i) => (
              <li key={i} className="flex gap-3 text-slate-700">
                <span className="text-teal-600 flex-shrink-0 font-bold mt-0.5">•</span>
                <span>{msg}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Author bio excerpt */}
        {author && (
          <section>
            <h2 className="font-serif text-xl text-navy-950 font-bold mb-4">About the Author</h2>
            <div className="flex gap-4 items-start">
              <img
                src={author.photoUrl}
                alt={author.name}
                className="w-16 h-16 rounded-full object-cover flex-shrink-0"
              />
              <div>
                <p className="font-medium text-navy-950">{author.name}</p>
                <p className="text-sm text-slate-600 mb-2">{author.title}, {author.organization}</p>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {/* Show first 200 chars of bio as excerpt */}
                  {author.bio.slice(0, 200)}{author.bio.length > 200 ? '\u2026' : ''}
                </p>
              </div>
            </div>
          </section>
        )}

      </div>

      {/* Prev/Next navigation — locked decision (discretion: placement and styling) */}
      <nav className="mt-16 pt-8 border-t border-slate-200 flex justify-between gap-4 no-print">
        <div>
          {prevBrief && (
            <Link
              href={`/briefs/${prevBrief.slug}`}
              className="group flex flex-col text-sm"
            >
              <span className="text-xs text-slate-500 mb-1">&larr; Previous</span>
              <span className="text-teal-600 group-hover:text-teal-500 font-medium line-clamp-2">
                {prevBrief.title}
              </span>
            </Link>
          )}
        </div>
        <div className="text-right">
          {nextBrief && (
            <Link
              href={`/briefs/${nextBrief.slug}`}
              className="group flex flex-col text-sm items-end"
            >
              <span className="text-xs text-slate-500 mb-1">Next &rarr;</span>
              <span className="text-teal-600 group-hover:text-teal-500 font-medium line-clamp-2">
                {nextBrief.title}
              </span>
            </Link>
          )}
        </div>
      </nav>

    </Container>
  );
}
