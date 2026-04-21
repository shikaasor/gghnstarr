// app/lib/content.ts
import fs from 'fs';
import path from 'path';
import type { Brief, Expert, SiteContent } from './types';

const CONTENT_DIR = path.join(process.cwd(), 'content');

export function getAllBriefs(): Brief[] {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, 'briefs-index.json'), 'utf-8');
  const briefs: Brief[] = JSON.parse(raw);
  return briefs.sort((a, b) => a.weekNumber - b.weekNumber);
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

export function getFeaturedBrief(): Brief | undefined {
  return getAllBriefs().find((b) => b.featured === true);
}
