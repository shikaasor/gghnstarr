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

// Phase 8 → Phase 16: AudienceType retained (used by EducationItem.audiences in Phase 16 components)
export type AudienceType = 'Policymaker' | 'Healthcare Worker' | 'General Public';

// Phase 16: Education Redesign types
export type EducationTab = 'training' | 'resources';
export type ContentFormat =
  | 'Course'
  | 'Webinar'
  | 'Article'
  | 'Download'
  | 'Video'
  | 'Publication';
export type TopicTag =
  | 'AMR Surveillance'
  | 'Stewardship'
  | 'Governance'
  | 'One Health'
  | 'Diagnostics'
  | 'Policy'
  | 'Awareness'
  | 'Research';

// Phase 20: WHO region tokens from AMR Resource Repository spreadsheet
export type WHORegion =
  | 'AFRO'
  | 'EURO'
  | 'PAHO'
  | 'EMRO'
  | 'WPRO'
  | 'SEARO'
  | 'All regions';

export interface EducationItem {
  id: string;                    // slug-style unique ID e.g. "au-amr-framework-2020"
  tab: EducationTab;             // 'training' | 'resources'
  title: string;
  audiences: AudienceType[];
  format: ContentFormat;
  topics: TopicTag[];
  year?: number;                 // Publication or event year (optional — 62 imported records have no extractable year)
  source: string;                // Organization name e.g. "WHO" or "Africa CDC"
  sourceVerified: boolean;       // true = working external link confirmed; false = show "Source unverified" flag
  url: string;                   // External link or hosted /public path
  description?: string;          // From AMR Repository Description column (Phase 20 import)
  region?: WHORegion;            // WHO region (Phase 20 import); 20-02 adds a region filter
  // Training-specific (optional for resources tab)
  platform?: string;             // e.g. "WHO Academy", "Coursera", "ECHO"
  // Publication-specific (only for format === 'Publication')
  authors?: string;              // "Lastname, A. et al."
  journal?: string;              // "Lancet Infectious Diseases"
  doi?: string;                  // "10.1016/..." — used as secondary link if url is the DOI resolver
}

// Phase 9: News Feed types
export type NewsSource = 'arXiv' | 'PubMed';

export interface NewsArticle {
  id: string;            // arXiv ID (e.g. "2504.12345") or PMID (e.g. "38123456")
  source: NewsSource;    // "arXiv" | "PubMed"
  title: string;         // Full article title
  authors: string;       // "FirstAuthor et al." or single author name
  publishedDate: string; // ISO date YYYY-MM-DD (normalized from source)
  journal: string;       // Journal name (PubMed) or primary arXiv category (e.g. "q-bio.OT")
  abstract: string;      // Full abstract text (UI truncates to 2-3 sentences in NewsCard)
  url: string;           // https://pubmed.ncbi.nlm.nih.gov/{pmid}/ or https://arxiv.org/abs/{id}
  doi?: string;          // DOI if available (used for deduplication)
}
