// app/lib/types.ts

// LOCKED — all fields mandated by CONTEXT.md decisions
export interface Brief {
  slug: string;                    // URL-safe identifier: "brief-01-governance-markets-microbes"
  title: string;                   // Long title (full brief title)
  shortTitle?: string;             // Short/display title from catalog
  weekNumber: number;              // Brief number (1–54)
  publicationDate: string;         // ISO date string: "2026-01-05"
  authorId?: string;               // References Expert.id in experts.json (optional)
  keyTakeaway: string;             // One-sentence key insight / call to action
  executiveSummary: string;        // Write-up summary (~50 words)
  keyMessages: string[];           // Aim / key messages
  pdfUrl?: string;                 // "/briefs/week-01-amr-governance.pdf" (optional)
  infographicPdfUrl?: string;      // "/infographics/week-01-infographic.pdf" (optional)
  infographicImageUrl?: string;    // "/infographics/IMG_9750.jpeg" (optional)
  thumbnailUrl: string;            // Slide PNG used as thumbnail: "/slides/brief-01.png"
  slideImageUrl?: string;          // Full slide PNG: "/slides/brief-01.png"
  themes: string[];                // Derived from category for legacy compat
  category?: string;               // e.g. "Governance & Political Economy"
  domain?: string;                 // e.g. "AMR system drivers"
  subdomain?: string;              // e.g. "Multi-country political-economy analysis"
  writeupSummary?: string;         // Write-up summary (~50 words) from catalog
  callToAction?: string;           // Call to action summary (~20 words) from catalog
  alignment?: string;              // Alignment to Abuja / 5th HLMM
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

// Phase 21: One Health Tools Directory
// Token unions verified by openpyxl distinct-value scan of the 50 Table 1 data rows.
export type OHOrganizationLevel =
  | 'Quadripartite'
  | 'National'
  | 'International/Regional'
  | 'NGO'
  | 'Academic';
export type OHAudienceType =
  | 'Multisectoral'
  | 'Policymakers'
  | 'Animal health'
  | 'Laboratory'
  | 'Environment'
  | 'Public health';
export type OHScope =
  | 'Assessment'
  | 'Implementation'
  | 'Monitoring'
  | 'Action Plans'
  | 'Prioritisation';

export interface ToolItem {
  id: string;                                  // slug from name
  name: string;                                // C1 (whitespace-collapsed)
  year?: number;                               // C2 (optional — some entries may lack a year)
  organization: string;                        // C3 (whitespace-collapsed)
  organizationLevels: OHOrganizationLevel[];   // C4 (comma-split + normalized)
  scopes: OHScope[];                           // C5 (comma-split)
  audienceLevels: string[];                    // C8 (e.g. National, Subnational)
  audienceTypes: OHAudienceType[];             // C9 (comma-split)
  description: string;                         // C11
  url: string;                                 // C13 (cleaned; '' if none)
}
