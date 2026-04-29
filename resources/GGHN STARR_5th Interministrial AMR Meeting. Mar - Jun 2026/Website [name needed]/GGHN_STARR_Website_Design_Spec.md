# GGHN STARR: Website Design & Development Specification

## 1. Project Overview
* **Project Name:** GGHN STARR (Africa AMR Modeling Initiative)
* **Primary Objective:** Deliver actionable, forward-looking intelligence on Antimicrobial Resistance (AMR) and Infectious Diseases to high-level African health officials via a weekly policy brief series (March–June 2026).
* **Target Audience:** Ministers of Health, Permanent Secretaries, Directors-General, and technical leads.
* **Key Milestone:** 5th Inter-Ministerial Conference on Health & AMR (June 28, 2026).
* **Tone & Vibe:** Authoritative, academic yet actionable, uncluttered, data-forward, and highly professional.

## 2. Technical & Constraints
* **Architecture:** Static site (fast load times, high security, excellent for low-bandwidth areas). Recommended stack: Next.js (Static Export), Astro, or plain HTML/TailwindCSS.
* **Access:** Fully public (no authentication/login required).
* **Visuals:** Static images and high-quality data visualization screenshots (no live embedded R/Shiny dashboards due to performance/security constraints).
* **Responsiveness:** Must be mobile-first. Target audience frequently reads briefs on tablets and mobile devices while traveling.

## 3. Design System (UI/UX)
* **Color Palette:**
  * **Primary (Authority):** Deep Navy Blue (`#0F172A`)
  * **Accent (Action/Health):** Medical Teal (`#0D9488`)
  * **Backgrounds:** Crisp White (`#FFFFFF`) and Light Slate (`#F8FAFC`) for section alternating.
  * **Text:** Slate Gray (`#334155`) for readable body copy.
* **Typography:**
  * **Headings:** *Merriweather* or *Playfair Display* (Serif) – Communicates formal policy and academic rigor.
  * **Body Text:** *Inter* or *Roboto* (Sans-serif) – Ensures maximum legibility for data-dense text.
* **Component Styling:**
  * Cards: Slight rounded corners (`rounded-xl`), subtle drop shadows (`shadow-sm` on rest, `shadow-md` on hover).
  * Buttons: Solid Teal for primary actions (Download), Outline Navy for secondary.

## 4. Information Architecture & Page Specifications

### Page 1: Homepage (The Executive Briefing)
* **Hero Section:**
  * Background: Solid Deep Navy.
  * Top Badge: "Road to the 5th Inter-Ministerial Conference • June 28, 2026" (with a countdown timer if feasible).
  * Headline: "Predictive Modeling for AMR & Infectious Diseases in Africa."
  * Sub-headline: "Actionable intelligence empowering policy leaders to strengthen national responses."
  * CTA Button: "Read the Latest Policy Brief" (Anchors to the Briefs section).
* **The 3 Pillars (Icon Grid):**
  1. *Genomic Surveillance:* Whole-genome sequencing & transmission tracking.
  2. *Predictive Analytics:* SEIR models, Random Forests, & outbreak forecasting.
  3. *One Health Governance:* Multisectoral AMR data integration & AMS/IPC stewardship.
* **Featured Intelligence (Split layout):**
  * Left: High-res static screenshot of a predictive dashboard (e.g., NIPAD or GlobalPPS).
  * Right: Title and executive summary of the *current week's* brief, with prominent "Download PDF" and "Download Infographic" buttons.

### Page 2: The Policy Briefs Library (The Core Engine)
* **Purpose:** A clean, filterable repository of the weekly briefs published from March to June.
* **Layout:** Grid of card components.
* **Filters:** By Month (Mar, Apr, May, Jun) and By Theme (Stewardship, Laboratory Systems, Predictive Analytics, Governance).
* **Card Anatomy:** 
  * Week/Date Tag.
  * Bold Title.
  * Author attribution.
  * Two distinct download links/icons: [Full Brief PDF] and [1-Page Infographic].

### Page 3: Methodology & Engine (Data-to-Policy)
* **Purpose:** Explain *how* the intelligence is generated to build trust.
* **Content Sections:**
  * **Predictive Modeling:** Explanation of machine learning, Bayesian forecasting, and agent-based simulations (referencing Dr. Samson's work).
  * **The NIPAD Platform:** Feature a static mockup of the Nigeria Immunization Predictive Analytics Dashboard and explain its resource-optimization capabilities.
  * **GlobalPPS & WHONET:** Explain the standardized AMC/AMU surveillance data collection mechanisms.

### Page 4: Our Experts (Building Authority)
* **Purpose:** Showcase the credentials of the leadership team. Extract details directly from `GGHN STARR Expertises_Feb 2026.docx`.
* **Profiles:**
  * **Dr. Olawale A.:** Focus on Genomic AMR, Laboratory Systems Strengthening, and Data-to-Policy Translation (Fleming Fund experience).
  * **Dr. Samson A.:** Focus on Mathematical/Predictive Modeling, NIPAD development, and GlobalPPS implementation.
  * **Piringar Mercy Niyang:** Focus on One Health Governance, integrated surveillance systems, and AMR policy adaptation (GLASS, Africa CDC frameworks).

### Page 5: Engagement & Contact
* **Purpose:** Allow ministries to request technical assistance or data adaptations.
* **Form Fields:** Name, Title, Ministry/Organization, Country, Inquiry Type (Dropdown: Policy Support, Modeling Request, Lab Strengthening, Other), Message.

## 5. Developer Handoff Notes
* **Assets Location:** Logos and branding drafts are located in `../Logo & Brand/`. Source content for expert profiles is in `../Briefs/GGHN STARR Expertises_Feb 2026.docx`.
* **Accessibility:** Ensure all static charts have descriptive `alt` text for screen readers. Maintain WCAG AA contrast ratios (Teal on White, White on Navy).
* **SEO & Meta:** Include social sharing cards (Open Graph images) for every policy brief so they look professional when shared via WhatsApp or Twitter by officials.