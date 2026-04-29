// app/lib/content.ts
import fs from 'fs';
import path from 'path';
import type { Brief, Expert, SiteContent } from './types';

const CONTENT_DIR = path.join(process.cwd(), 'content');

// Returns only published briefs (publicationDate <= today at build time), sorted newest-first
export function getAllBriefs(): Brief[] {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, 'briefs-index.json'), 'utf-8');
  const all: Brief[] = JSON.parse(raw);
  const today = new Date().toISOString().slice(0, 10);
  return all
    .filter((b) => b.publicationDate <= today)
    .sort((a, b) => b.publicationDate.localeCompare(a.publicationDate));
}

export function getBriefBySlug(slug: string): Brief | undefined {
  return getAllBriefs().find((b) => b.slug === slug);
}

export function getExperts(): Expert[] {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, 'experts.json'), 'utf-8');
  return JSON.parse(raw) as Expert[];
}

export function getSiteContent(): SiteContent {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, 'site.json'), 'utf-8');
  return JSON.parse(raw) as SiteContent;
}

// Returns the most recently published brief (newest publicationDate <= today)
export function getFeaturedBrief(): Brief | undefined {
  return getAllBriefs()[0];
}
