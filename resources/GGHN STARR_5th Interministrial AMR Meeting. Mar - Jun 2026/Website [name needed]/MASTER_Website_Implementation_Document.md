# GGHN STARR: Master Website Implementation & Data Analysis Document

This document represents a comprehensive, file-by-file extraction of the `GGHN STARR` repository. It consolidates the predefined wireframes, branding guides, launch strategies, expert profiles, and policy brief titles into a single, actionable specification for an AI Developer Agent to build the website.

## 1. Official Visual Branding Guide
*(Sourced from: `Website [name needed]\Proposed website for policy briefs\Visual Branding Guide.docx`)*

A strong visual identity ensures credibility and recognition among Ministries of Health, Africa CDC, WHO AFRO, and other stakeholders.

* **Primary Colors:**
  * **Deep Blue (`#003B73`):** Trust, authority.
  * **Emerald Green (`#0F8A5F`):** One Health, sustainability.
* **Secondary Colors:**
  * **Gold (`#F2A900`):** Urgency, policy action.
  * **Slate Gray (`#4A4A4A`):** Neutrality, professionalism.
  * **White (`#FFFFFF`):** Clarity, readability.
* **Typography System:**
  * **Headings:** `Montserrat` (Bold, modern, authoritative).
  * **Body Text:** `Source Sans Pro` (Clean, readable).
  * **Data/Dashboards:** `Roboto Mono` (Clarity for numbers).
* **Imagery & Iconography:**
  * Simple, line-based icons for: Human health, Animal health, Environment, Data & analytics, Governance, Financing, Labs, Digital systems.
  * High-resolution photography of labs, health workers, farmers, and environmental monitoring. Clean, minimalistic maps/infographics.

## 2. Global Project Context & Launch Strategy
*(Sourced from: `Launch Announcement...` and `Launch Strategy...`)*

* **Core Mission:** "Accelerating AMR Policy Into Practice Across Africa: Evidence. Advocacy. Action."
* **Primary Objective:** Provide actionable, forward-looking intelligence (machine learning, SEIR models, etc.) to strengthen national AMR responses leading up to the **5th Inter-Ministerial Conference on Health & AMR (June 28, 2026)**.
* **Target Audience:** Ministers, Permanent Secretaries, Directors-General, Technical Leads.
* **Launch Phasing:**
  * **Phase 1 (Pre-Launch):** Soft briefings with Ministries of Health, Agriculture, Environment, Africa CDC, WHO AFRO, FAO & WOAH, Fleming Fund.
  * **Phase 2 (Official Launch):** Hybrid Event (Ministry of Health + GUCGHPI), keynote from Africa CDC/WHO, press release.
  * **Phase 3 & 4 (Post-Launch/Institutionalization):** Webinars, policy dialogues, integration into National AMR governance structures.

## 3. Official 13-Page Website Architecture & Content Plan
*(Sourced from: `Full Website wireframe (Page by page layout).docx` and `Content Plan for each page.docx`)*

### PAGE 1 - Homepage
* **Hero Banner:** 
  * Large headline: "Accelerating AMR Policy Into Practice Across Africa"
  * Subtext: Evidence. Advocacy. Action.
  * CTA buttons: "Read Latest Brief" | "Explore Country Dashboards"
* **Key Stats Strip:** Rotating AMR statistics (deaths, resistance rates, economic impact).
* **Featured Weekly Brief:** Thumbnail + summary + "Read More".
* **Three Quick Access Tiles:** Policy Action Toolkit, One Health Knowledge Hub, Events & Webinars.
* **Partner Logos:** Ministries, GUCGHPI, Fleming Fund, Africa CDC, WHO AFRO.
* **Newsletter Signup:** "Stay informed with weekly AMR policy insights."

### PAGE 2 - About the Platform
* **Mission & Vision:** (300-word statement).
* **The Problem:** 200-word explanation of the AMR policy–practice gap.
* **Theory of Change:** A graphic diagram detailing the "How We Work" methodology.
* **Expertise (Sourced from `GGHN STARR Expertises_Feb 2026.docx`):**
  * **Dr. Olawale A.:** Genomic Surveillance, AMR Laboratory Systems (Fleming Fund Rwanda Advisor).
  * **Dr. Samson A.:** Mathematical & Predictive Modeling, Developer of the NIPAD dashboard (R/Shiny), GlobalPPS implementations.
  * **Piringar Mercy Niyang:** One Health Governance, Systems Strengthening, Digital Integration (GLASS/Africa CDC frameworks).

### PAGE 3 - Policy Brief Series (The Library)
* **Layout:** Interactive timeline. Each brief is a card with Title, 150-word summary, Key messages, "Download PDF", and "How to Apply This Brief".
* **The 15 Actual Briefs (Sourced from `Mercy_s Briefs\Drafts for review`):**
  1. Multi Country PEA (Outline)
  2. Why countries struggle with AMR
  3. The political economy of AMR in Africa
  4. Global impact of funding shifts
  5. A threat to health & national security
  6. Domestic Budgets, Donor Leverage & Sustainability
  7. Strengthening One Health Governance for AMR
  8. Achieving Intra and Integrated AMR/AMU Surveillance
  9. Optimizing & maximizing local laboratory systems
  10. Stewardship & IPC - Cost effective interventions
  11. Livestock, Food Safety, Food Security & Trade
  12. Environmental AMR - The Missing Pillar in National Plans
  13. Digital Transformation for AMR - AI, Interoperability & Real Time Data
  14. Post Shock Political-Economic Conditions
  15. Key Messages for the 5th Global AMR Conference

### PAGE 4 - Country Dashboards
* **Layout:** Dropdown menu of countries.
* **Sections:** 200-word overview, Governance scorecard, Financing landscape, Lab & surveillance capacity, Veterinary & environmental indicators, Digital health interoperability, Priority actions (Downloadable profile).

### PAGE 5 - One Health Knowledge Hub
* **Subpages:** Human Health, Animal Health, Environment, Food Safety, Cross-Sectoral Governance.
* **Content:** SOPs, Toolkits, Training modules, Case studies, Regulatory templates.

### PAGE 6 - Policy Action Toolkit
* **Content:** 10 High-Impact AMR Interventions, Domestic Financing Models, Regulatory Enforcement Roadmap, Data-Sharing Agreement Templates, National AMR Scorecard Template.

### PAGE 7 - Advocacy & Communications Center
* **Content:** Infographics (Sourced from `Policy brief infographics_FF Rwanda` folder), Social media cards, Campaign materials, Videos & animations, "AMR in the News".

### PAGE 8 - Research & Evidence Library
* **Features:** Searchable database, Filters (year, sector, country). Peer-reviewed articles, WHO/FAO/WOAH guidelines, National AMR reports.

### PAGE 9 - Events & Learning
* **Sections:** Upcoming webinars, Regional workshops, Policy roundtables, Fellowship opportunities, Past event recordings.

### PAGE 10 - Community of Practice Forum
* **Features:** Discussion boards, Country working groups, Ask-an-expert sessions, Shared tools repository.

### PAGE 11 - Monitoring & Accountability Dashboard
* **Purpose:** Track progress on AMR policy implementation. (RAG scoring, Trend graphs).
* **Indicators:** NAP implementation, Domestic financing, Lab accreditation, Stewardship committee functionality, Environmental AMR coverage.

### PAGE 12 - Partner Portal
* **Features:** Mapping of AMR projects, Funding opportunities, Shared M&E frameworks, Secure document exchange.

### PAGE 13 - Contact & Engagement
* **Includes:** Contact form, Partnership inquiries, Feedback form, Newsletter signup.

---
## Handoff Instructions for Development Agent
1. **Repository Target:** Use the exact folder structure above.
2. **Assets:** Extract image assets from `Logo drafts/` and `Policy brief infographics_FF Rwanda/`. Use the PDF samples in `Website sample 1/` for layout inspiration.
3. **Typography Injection:** Import `Montserrat`, `Source Sans Pro`, and `Roboto Mono` via Google Fonts.
4. **Color Mapping (Tailwind):** Map `#003B73` as `primary`, `#0F8A5F` as `secondary`, `#F2A900` as `accent`, and `#4A4A4A` as `neutral-gray`.