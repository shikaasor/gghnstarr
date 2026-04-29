// app/lib/types.ts

// LOCKED — all fields mandated by CONTEXT.md decisions
export interface Brief {
  slug: string;                    // URL-safe identifier: "week-01-amr-governance"
  title: string;                   // Full brief title
  weekNumber: number;              // Publication week (1, 2, 3...)
  publicationDate: string;         // ISO date string: "2026-03-24"
  authorId?: string;               // References Expert.id in experts.json (optional — some briefs have no author)
  keyTakeaway: string;             // One-sentence key insight
  executiveSummary: string;        // 100-150 word summary
  keyMessages: string[];           // 3-7 bullet points
  pdfUrl: string;                  // "/briefs/week-01-amr-governance.pdf"
  infographicPdfUrl?: string;      // "/infographics/week-01-infographic.pdf" (optional — Phase 7 briefs have no infographic PDFs)
  infographicImageUrl?: string;    // "/infographics/IMG_9750.jpeg" (optional — inline JPEG for brief detail pages)
  thumbnailUrl: string;            // "/images/thumbnails/week-01.jpg"
  themes: string[];                // Subset of: "Governance" | "Laboratory Systems" |
                                   // "Predictive Analytics" | "One Health" | "Stewardship"
  featured?: boolean;              // True for the single featured brief on homepage
}

// REQUIRED: id, name, bio, photoUrl, specialties required by Phase 4
// DISCRETION: title, organization, linkedinUrl — use judgment
export interface Expert {
  id: string;                      // Referenced by Brief.authorId
  name: string;
  title: string;                   // Professional title
  organization: string;            // Institutional affiliation
  bio: string;                     // 200-word professional bio
  photoUrl: string;                // "/images/experts/{slug}.jpg"
  specialties: string[];           // e.g. ["AMR Surveillance", "Genomics"]
  linkedinUrl?: string;            // Optional LinkedIn profile URL
}

// DISCRETION — structure serves getSiteContent(); designed for Phase 2 homepage needs
export interface SiteContent {
  siteTitle: string;
  tagline: string;                 // "Evidence. Advocacy. Action."
  conferenceDate: string;          // "June 28, 2026"
  conferenceLocation: string;      // Used in hero badge
  partners: Array<{
    name: string;
    logoUrl: string;               // "/images/partners/{slug}.png"
    url?: string;                  // Optional partner website
  }>;
  contactEmail: string;
  linkedinUrl?: string;
  footerTagline: string;           // Short tagline shown in footer
  stats: Array<{ value: string; label: string; }>;
}

// Phase 8: Education Library types
export type AudienceType = 'Policymaker' | 'Healthcare Worker' | 'General Public';
export type ResourceFormat = 'Article' | 'Download' | 'Video';
export interface EducationResource {
  title: string;
  audiences: AudienceType[];
  format: ResourceFormat;
  source: string;
  url: string;
}
