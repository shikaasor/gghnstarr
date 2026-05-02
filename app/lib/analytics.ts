// app/lib/analytics.ts
// GA4 event helpers — import from 'use client' components only
// sendGAEvent calls window.dataLayer and must NOT be called from Server Components
import { sendGAEvent } from '@next/third-parties/google';

export function trackPdfDownload(briefSlug: string) {
  sendGAEvent('event', 'pdf_download', { brief_slug: briefSlug });
}

export function trackInfographicView(briefSlug: string) {
  sendGAEvent('event', 'infographic_view', { brief_slug: briefSlug });
}

export function trackNewsletterSignup() {
  sendGAEvent('event', 'newsletter_signup', {});
}

export function trackPledgeSubmit() {
  sendGAEvent('event', 'pledge_submit', {});
}

export function trackCommitmentSubmit() {
  sendGAEvent('event', 'commitment_submit', {});
}

// No-op until Phase 11 /tools quiz page exists
export function trackQuizComplete() {
  // Phase 11: sendGAEvent('event', 'quiz_complete', {});
}
