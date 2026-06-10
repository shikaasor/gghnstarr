import { getAllBriefs, getBriefBySlug, getExperts } from '@/lib/content';
import { Container } from '@/components/layout/Container';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CommentForm } from '@/components/briefs/CommentForm';
import { CommentList } from '@/components/briefs/CommentList';
import type { Metadata } from 'next';

// REQUIRED for output:'export' — enumerates all slugs at build time
export function generateStaticParams() {
  const briefs = getAllBriefs();
  return briefs.map(b => ({ slug: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const brief = getBriefBySlug(slug);
  if (!brief) return {};
  return {
    title: brief.title,
    description: brief.keyTakeaway,
    alternates: { canonical: `/briefs/${brief.slug}` },
    openGraph: {
      title: brief.title,
      description: brief.keyTakeaway,
      type: 'article',
      publishedTime: brief.publicationDate,
      images: brief.slideImageUrl
        ? [{ url: brief.slideImageUrl, width: 1920, height: 1080, alt: brief.title }]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: brief.title,
      description: brief.keyTakeaway,
      images: brief.slideImageUrl ? [brief.slideImageUrl] : [],
    },
  };
}

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

  const allBriefs = getAllBriefs();
  const currentIndex = allBriefs.findIndex(b => b.slug === slug);
  const prevBrief = currentIndex > 0 ? allBriefs[currentIndex - 1] : null;
  const nextBrief = currentIndex < allBriefs.length - 1 ? allBriefs[currentIndex + 1] : null;

  const dateLabel = new Date(brief.publicationDate).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });

  return (
    <Container className="py-12">

      {/* Back to catalog */}
      <div className="mb-6">
        <Link
          href="/briefs"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-teal-600 transition-colors"
        >
          <span aria-hidden="true">&larr;</span>
          Back to Policy Briefs
        </Link>
      </div>

      {/* Header */}
      <div className="max-w-3xl mb-8">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full">
            Brief #{brief.weekNumber}
          </span>
          {brief.category && (
            <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
              {brief.category}
            </span>
          )}
          <span className="text-xs text-slate-500">{dateLabel}</span>
        </div>

        {brief.shortTitle && (
          <p className="text-sm font-medium text-teal-600 uppercase tracking-wide mb-1">
            {brief.shortTitle}
          </p>
        )}
        <h1 className="font-serif text-2xl md:text-3xl text-navy-950 font-bold mb-3 leading-tight">
          {brief.title}
        </h1>

        {brief.domain && (
          <p className="text-sm text-slate-500">
            {brief.domain}{brief.subdomain ? ` · ${brief.subdomain}` : ''}
          </p>
        )}

        {author && (
          <p className="text-slate-600 text-sm mt-2">By {author.name}</p>
        )}
      </div>

      {/* Slide image — full width, prominent */}
      {brief.slideImageUrl && (
        <div className="mb-10 rounded-xl overflow-hidden shadow-lg border border-slate-200">
          <img
            src={brief.slideImageUrl}
            alt={`Slide for Brief #${brief.weekNumber}: ${brief.title}`}
            className="w-full h-auto"
          />
        </div>
      )}

      {/* Content sections */}
      <div className="max-w-3xl space-y-10">

        {/* Write-up summary */}
        {brief.writeupSummary && (
          <section>
            <h2 className="font-serif text-xl text-navy-950 font-bold mb-4">Summary</h2>
            <p className="text-slate-700 leading-relaxed">{brief.writeupSummary}</p>
          </section>
        )}

        {/* Call to action */}
        {brief.callToAction && (
          <section className="bg-teal-50 border border-teal-100 rounded-xl p-6">
            <h2 className="font-serif text-lg text-teal-900 font-bold mb-2">Call to Action</h2>
            <p className="text-teal-800 leading-relaxed">{brief.callToAction}</p>
          </section>
        )}

        {/* Key messages (aim) */}
        {brief.keyMessages.length > 0 && (
          <section>
            <h2 className="font-serif text-xl text-navy-950 font-bold mb-4">Aim</h2>
            <ul className="space-y-3">
              {brief.keyMessages.map((msg, i) => (
                <li key={i} className="flex gap-3 text-slate-700">
                  <span className="text-teal-600 flex-shrink-0 font-bold mt-0.5">•</span>
                  <span>{msg}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Abuja / 5th HLMM alignment */}
        {brief.alignment && (
          <section>
            <h2 className="font-serif text-xl text-navy-950 font-bold mb-3">
              Alignment — Abuja / 5th HLMM
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">{brief.alignment}</p>
          </section>
        )}

        {/* Author bio */}
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
                  {author.bio.slice(0, 200)}{author.bio.length > 200 ? '…' : ''}
                </p>
              </div>
            </div>
          </section>
        )}

      </div>

      {/* Prev/Next navigation */}
      <nav className="mt-16 pt-8 border-t border-slate-200 flex justify-between gap-4 no-print">
        <div>
          {prevBrief && (
            <Link href={`/briefs/${prevBrief.slug}`} className="group flex flex-col text-sm">
              <span className="text-xs text-slate-500 mb-1">&larr; Previous</span>
              <span className="text-teal-600 group-hover:text-teal-500 font-medium line-clamp-2">
                {prevBrief.title}
              </span>
            </Link>
          )}
        </div>
        <div className="text-right">
          {nextBrief && (
            <Link href={`/briefs/${nextBrief.slug}`} className="group flex flex-col text-sm items-end">
              <span className="text-xs text-slate-500 mb-1">Next &rarr;</span>
              <span className="text-teal-600 group-hover:text-teal-500 font-medium line-clamp-2">
                {nextBrief.title}
              </span>
            </Link>
          )}
        </div>
      </nav>

      {/* Discussion */}
      <section className="no-print mt-16 pt-8 border-t border-slate-200">
        <h2 className="font-serif text-xl text-navy-950 font-bold mb-8">Discussion</h2>
        <div className="mb-10">
          <CommentList slug={slug} />
        </div>
        <CommentForm slug={slug} />
      </section>

    </Container>
  );
}
