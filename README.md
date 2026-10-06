# RareBridge Frontend — Product and Design Handoff

This README describes the current RareBridge frontend as a product and design system, including its purpose, page inventory, wording, visual language, interaction patterns, data assumptions, and known gaps. Use it as a baseline when planning an improved frontend. It documents the implementation as it exists; marketing claims and sample content listed here are not independently verified.

## 1. Product at a glance

**RareBridge** is presented as a family-centered rare-disease information and support platform. Its intended audience includes people and families affected by rare conditions, caregivers, healthcare specialists, researchers, and advocates.

The current frontend groups the experience around:

1. **Disease information** — a searchable library and disease-specific detail pages.
2. **Specialists** — source-listed specialist records associated with diseases.
3. **Research** — research and clinical-trial content associated with conditions.
4. **Community** — support resources, stories, and discussion concepts.
5. **About and account screens** — mission, team, sign-in, and sign-up presentations.

The intended voice is warm, accessible, reassuring, and hopeful, while discussing clinical information in plain language. The visual identity uses a RareBridge logo, zebra imagery/mascot, simple medical and research icons, and a navy/champagne/ivory palette.

### Important product boundary

The frontend is an educational and navigation experience, **not a medical provider or a substitute for diagnosis or treatment**. A disease page includes a medical disclaimer. An improved version should make this boundary easy to find, avoid implying individualized medical advice, and distinguish sourced medical information from platform navigation or community content.

## 2. Navigation and application structure

The application is a single-page React interface. The central `App.tsx` stores the active view and selected disease in local component state. Navigation changes views without changing a conventional URL route.

### Main navigation

Desktop top navigation:

- Home
- About
- Explore Diseases
- Research
- Specialists
- Community
- Sign In

Mobile bottom navigation:

- Home
- Diseases
- Research
- Specialists
- Community

The mobile top bar also has a menu control. A disease detail screen is entered by selecting a disease from the library and has a back action to the directory. Sign Up is reached from Sign In rather than the main nav.

**Redesign consideration:** the desktop navigation is hidden below the `lg` breakpoint while the bottom navigation is hidden at `md`; widths between those breakpoints may have neither navigation pattern. The page state is also not reflected in a URL, so refresh, deep links, and browser history do not map reliably to a selected view/disease.

## 3. Page and content inventory

This section records the current page purpose and representative visible wording. Quotes are examples of current copy, not approved brand language.

### Home

**Purpose:** introduce RareBridge, route users to the primary areas, and feature conditions.

**Hero carousel:** three automatically advancing slides (six-second interval) with previous/next and pause/play controls.

- Tag: “A Warm Safe Place for Rare Families”
- Headline: “Understanding rare conditions with clarity, care & hope.”
- Supporting copy describes plain-language medical guides, specialist directories, family support, children, parents, and caregivers.
- Second slide: “Plain-Language Medical Education” / “Simplifying complex genetic reports into everyday guidance.”
- Third slide: “Caregiver & Family Network” / “Connecting parents & caregivers through real experience.”
- Primary actions: “Browse Disease Library” and “Join Caregiver Community.”
- Hero imagery currently uses zebra/book, child/zebra, and family-themed artwork.

**Other sections:**

- Four impact-stat tiles with the claims “7,000+ Rare Conditions,” “2,400+ Verified Specialists,” “850+ Research Trials,” and “120K+ Families Supported.”
- Four product cards: Disease Library, Find Specialists, Research & Trials, Caregiver Community.
- Featured Rare Diseases, based on the first three items in the loaded list.
- Family/caregiver story banner, “You Are Not Alone,” and family-oriented copy.
- Zebra assistant launch/teaser content and additional calls to explore platform sections.

**Data/copy caution:** the impact numbers, “verified/world-class/top” expert language, and family impact claims are embedded in the UI and are not demonstrated by the frontend data source. Verify them or replace them with factual, sourced metrics before redesign launch.

### Disease directory

**Purpose:** search and browse disease records and open a disease detail.

- Heading: “Rare Disease Library & Medical Guides”
- Supporting text currently claims “7,000+ conditions” and mentions symptoms, genetic causes, approved treatments, and active-trial updates.
- Search placeholder: “Search by condition name, symptom, or ORPHA code...”
- Category filters: All, Genetic, Neurological, Metabolic, Autoimmune.
- Status selector: All Status, Active Research, Approved Treatment, Support Available.
- Shows a result count, responsive condition cards, loading placeholders, empty state, reset action, and pagination.
- The current category/status options are static frontend values and may not match each API record’s actual categories or evidence.
- A side card currently has been updated to “Source-Based Disease Information” and “Explore Condition Records.”

### Disease detail

**Purpose:** show the selected condition using the information available in its API record. Tabs are conditional: a tab is shown only when its relevant content exists. Quick links navigate to existing tabs.

Potential tabs and content:

- **Overview**
- **Types & Symptoms** (or Symptoms when there is no structured section hierarchy)
- **Causes & Risk Factors**
- **Types** when types exist separately
- **Diagnosis**
- **Treatment & Management**
- **Living with [condition]**
- **Community**
- **FAQs**
- **Facts vs. Myths**
- **Specialists**
- **Sources & Links**

Detail content may include source headings, paragraphs, lists, links, nested sections, community resources, treatment/trial records, FAQ accordions, fact/myth pairs, specialist cards, disease metadata, and a PDF guide action. Source links should be retained, and only supported content should be rendered. A raw/unclassified-content area is intended to preserve information that could not be mapped.

### Research

**Purpose:** surface research programs, registries, and clinical-trial information by condition.

- Heading: “Rare Disease Research & Trial Updates”
- Current copy promotes gene replacement, enzyme replacement, trial milestones, and “Hope Through Science.”
- Focus tabs: All Programs, Gene Therapies, Enzyme Replacement, CRISPR & RNA, Clinical Registries.
- Program cards are opened into a details modal; a section also provides a “Summarize Research Paper” action.
- Current interface shows “Updated September 2026.”

**Data caution:** parts of this screen currently use fixed focus labels, trial-phase labels derived from list position, and fallback organizations/claims when a condition has no research object. The “850+ Active Trials” and “updated” wording must be treated as unverified until connected to a reliable, dated source. Do not present synthesized phase/status information as a real trial.

### Specialists

**Purpose:** browse specialist records with a source-established disease relationship.

- Heading: “Specialists by condition”
- Search checks specialist name, profession, organization, specialization/expertise, location, disease, and publication text.
- A record’s disease association comes from the disease row that contains its specialist entry; the UI must not infer associations from specialty text.
- Exact duplicate records are suppressed and malformed source records are logged.
- Records show only available source fields: name, profession, expertise, organization, location, and links/details.
- A shared avatar component displays an explicitly supplied HTTPS photo URL if one exists; otherwise it shows a neutral “no verified photo available” person icon.
- List pagination shows nine records per page with Previous/Next and a visible range/count. Changing search resets to page one.
- API failures produce an explicit unavailable message and retry action.

### Community

**Purpose:** present ways for people and families to connect and find peer resources.

Current concepts include:

- Parent Support Circles
- Caregiver Wellness Guides
- Family Research Advocates
- Moderated Forums
- Family & Caregiver Voices
- Recent Discussions
- “Start New Topic”

The hero copy includes “You Are Never Alone On Your Rare Journey” and “Join Parent Support Circle.” Cards can open informational modals, member stories have like controls, and discussion/topic UI is presented.

**Content caution:** feature descriptions, weekly/mentoring/moderation/confidentiality claims, testimonials, names, reply counts, and external stock-photo avatars are static frontend content, not demonstrated live community data. They must be verified or clearly labeled as sample content before public use. The disease-specific community resources sourced from disease records are a separate data set and should not be conflated with these generic promotional cards.

### About

**Purpose:** communicate mission, values, and team identity.

- Hero label: “Our Purpose & Mission”
- Headline: “Connecting Knowledge, Families & Care”
- Copy emphasizes replacing medical jargon with plain-language guidance and connecting families with specialists and community.
- CTA buttons: “Browse Conditions” and “Join Support Community.”
- Values: Family-Centered Care, Medical Integrity, Supportive Community, Hope & Research Progress.
- “Our Dedicated Team” displays names, roles, biographies, and local team images, with a profile modal.

Claims such as “certified genetic research,” “real-time updates,” “40+ medical centers,” and professional review are present in current copy/data and require substantiation before being represented as facts.

### Sign In and Sign Up

**Sign In**

- Heading: “Sign In To Your Care Portal”
- Email and password fields; “Remember me”; “Forgot password?” (no recovery flow is connected)
- Role selector: Parent / Caregiver or Specialist / Researcher.
- CTA: “Sign In to Account”; link to account creation.
- Current submit behavior prevents form submission and navigates to Home. It is a visual/demo flow, not connected authentication.

**Sign Up**

- Heading: “Create Your Free Account”
- Full name, email, and password fields.
- Same Parent / Caregiver and Specialist / Researcher role selector.
- CTA: “Create Free Account”; link to Sign In.
- Current submit behavior navigates to Home without creating an account.

**Redesign consideration:** if account flows remain in scope, design pending, validation, success, failure, privacy, and password-recovery states along with the static forms. Remove privacy/security guarantees that are not backed by real infrastructure.

## 4. Visual identity and design tokens

### Current palette

The base palette is declared in `src/styles/theme.css`; many pages also use direct hex utilities.

| Role | Current color | Typical use |
|---|---|---|
| Deep navy / primary | `#112250` | Main headings, primary buttons, foreground text, dark footer |
| Muted blue | `#3B507D` | Secondary text, links, icons, accents |
| Champagne / pale taupe | `#E7E2CE` | Borders, badges, dividers, highlights |
| Warm neutral surface | `#F5F4F0` | Inputs and muted surfaces |
| White | `#FFFFFF` | Cards, form surfaces, inverse text |
| Page canvas | `#F8F7F2` | Shared shell background |
| Zebra stripe linework | `#C9CECD` / `#E0E3E1` | Low-contrast decorative background texture |
| Soft border gray | `#D9D5C8` / `#E3E0D7` | Specialist card/search boundaries |
| Destructive | `#D4183D` | Clear/reset or error emphasis |
| Success/chart green | `#10B981` | Semantic/status and chart use |
| Gold/chart amber | `#F59E0B` | Accents and chart use |
| Purple/chart violet | `#8B5CF6` | Decorative/chart use |

Components commonly use rounded-xl cards and rounded-lg controls; thin champagne borders; navy buttons; simple line icons; generous but inconsistent section spacing; and motion on card entry, hover, carousel changes, and modals.

**Theme note:** `theme.css` maps literal color utilities to shared variables. The blue accent and opacity variants were aligned with their corresponding palette values; computed styles should still be checked when adding new utility colors. A global legacy shadow reset remains, so card depth is applied to the shared content-card treatment rather than relying on arbitrary Tailwind shadow classes.

### Typography

The current intended hierarchy is:

- **Headings:** Nunito, using a close-set, balanced heading treatment.
- **Body and controls:** Inter, with a system sans-serif fallback.
- **Callouts/badges:** Inter as well, to keep the interface to two type families.
- **Icons:** Lucide React line icons; Material icon fonts remain available to the shared icon helper.

Font assets are loaded once in `index.html`. Tiny 10–11px interface text is normalized to at least 12px, and `text-xs` copy is raised to 13px for readability. The existing text-size preference still scales the root font size. Keep typography restrained and editorial rather than using display effects or futuristic letterforms.

Interactive motion is kept short and low-amplitude for cards, buttons, and view transitions; the app-level motion configuration follows the operating system's reduced-motion preference.

### Brand motifs and imagery

- RareBridge wordmark/logo variations are present (`logo.png`, `logo-transparent.png`, `logo-clean.png`, `logo-icon.png`, `logo-icon-fullbridge.png`).
- Zebra mascot, edelweiss-flower ornament, wavy lines, and selected decorative animations are used across the interface.
- The application shell now uses a static, low-contrast zebra-stripe texture (`public/zebra-stripe-pattern.svg`) rather than the animated particle/grid backdrop; content cards and navigation surfaces use restrained neutral overlays for readability.
- Landing-page and community/story areas include family, child, and zebra imagery.
- About page uses local team portraits.
- Specialist profiles must not use unrelated portrait imagery; current shared avatar behavior uses a neutral person icon unless a source-backed photo URL exists.
- Disease detail pages are information-first and should not use generic disease stock photography.

An improved design should choose which motifs are meaningful brand signatures and use them selectively. The global decorative pattern/particles can compete with dense clinical text and reduce perceived clinical trust; consider limiting decoration to landing/brand moments and keeping data pages calm.

## 5. Interaction and accessibility inventory

Current reusable interaction patterns include:

- Desktop nav with active underline, mobile nav/menu, Escape-to-close mobile menu.
- Persistent text-size preference with default (100%), larger (112.5%), and largest (125%) values in local storage.
- Disease directory search, category/status filters, result count, reset, empty state, pagination.
- Disease detail conditional tabs, quick links, accordions, structured subsection rendering, external links, and PDF export.
- Specialist search, paginated results, explicit API error/retry state, details modal, consistent avatar fallback.
- Research focus pills and detail modal.
- Community cards/modals, story likes, discussion controls.
- Sign-in/sign-up role toggle and form controls (presentation only).
- Footer email form (local success state only; not a subscription integration).
- Text-size state is stored in local storage and supports default (100%), larger (112.5%), and largest (125%) scaling. The current shell does not expose a working text-size selector, so this preference is not currently user-adjustable through the visible interface.
- Reduced-motion CSS rule in `index.html`.
- Focus/keyboard affordances exist on some, but not all, controls; interactive cards and buttons should be audited for consistent keyboard semantics, visible focus, accessible names, and dialog focus handling.

**Known gaps for a redesign:**

- `AIAssistant` contains canned response logic, but its floating launcher is commented out; an assistant panel is therefore not currently discoverable through that component.
- Global cursor, particle, and sound effects may be distracting, expensive, or inaccessible; respect reduced-motion settings and provide opt-outs for nonessential audio/motion.
- The desktop-to-mobile navigation breakpoint gap should be corrected.
- Search buttons that do not add behavior, dead links/actions, non-functional forms, and placeholder UI should be removed or connected to real services.
- Ensure long disease names, source URLs, specialist expertise, and clinical text wrap on small viewports without horizontal overflow.

## 6. Frontend data and technical shape

### Key files

```text
src/
  app/
    App.tsx                         View state, shared shell, text-size preference
    data.ts                         UI adapters and local fallback disease fixtures
    components/
      common/Visuals.tsx            Mascot, doodles, background, assistant, visual effects
      common/SpecialistAvatar.tsx   Explicit profile-photo-or-placeholder behavior
      layout/Navbar.tsx             Desktop/mobile header navigation
      layout/MobileNav.tsx          Bottom navigation
      layout/Footer.tsx             Newsletter presentation, navigation, footer copy
      ui/                           Reusable Radix/shadcn-style UI primitives
    pages/
      HomePage.tsx
      DirectoryPage.tsx
      DiseasePage.tsx
      ResearchPage.tsx
      SpecialistsPage.tsx
      CommunityPage.tsx
      AboutPage.tsx
      SignInPage.tsx
      SignUpPage.tsx
    services/api.service.ts         Typed API client and disease/specialist shapes
    utils/                          Animation, links, PDF generation
  styles/
    globals.css
    tailwind.css
    theme.css
```

### Disease source flow

The intended clinical data flow is:

```text
Google Sheet source
  → backend fetch and parse
  → normalized disease API model
  → frontend API service
  → UI adapter in data.ts
  → directory / disease detail / research / specialist pages
```

The Sheet is intended as the source of truth. Structured disease pages should preserve source headings, order, lists, links, and specialist associations. Specialist membership in the directory comes from the specialist entries attached to each disease record, not a guessed specialty-to-disease mapping.

The frontend currently requests diseases separately from more than one page/component. The backend has an in-memory five-minute disease cache, but there is no global frontend query/cache layer documented here. A future design implementation should centralize request state and avoid duplicated loads while retaining explicit error states.

### Fallback and trust boundaries

`data.ts` contains local fallback disease fixtures with example content. Some page-level copy, metrics, research cards, community stories/discussions, and interaction responses are also hardcoded. The existence of such content does not mean it is live, source-verified, medically reviewed, current, or user-generated.

Treat all content as belonging to one of these clear states:

1. **Source record** — linked to a disease/source record, show provenance where appropriate.
2. **Verified editorial content** — review owner/date/source should be available.
3. **Demonstration/sample content** — visibly labeled in non-production or removed.
4. **Missing/failed content** — show a useful empty/error state; do not replace it with an invented specialist, trial, metric, or medical fact.

## 7. Brand voice and current wording patterns

### Recurring language

- “plain-language,” “clear,” “family-centered,” “caregiver,” “support,” “hope,” “research,” “rare families,” and “you are never alone.”
- CTA wording includes “Browse Disease Library,” “Browse Conditions,” “View All Conditions,” “Find Experts,” “Browse Active Trials,” “Join Caregiver Community,” “Join Parent Support Circle,” “Explore Circle,” “Create Free Account,” and “Sign In to Account.”
- Labels use title case in headings and buttons, while some interface elements use all-caps eyebrow labels such as “KNOWLEDGE BASE” or “COMMUNITY RESOURCES.”

### Voice principles to preserve, improve, or verify

- Prefer plain language, short sentences, compassionate wording, and non-stigmatizing condition/person language.
- Do not use fear-based urgency or promise a cure, access to care, or improved outcomes.
- Label uncertainty and source dates; distinguish education from medical advice.
- Remove unsupported superlatives (“world-class,” “leading,” “top”), “verified/certified” language, and numeric impact claims unless substantiated.
- Avoid implying that the platform offers real consultations, clinical trial eligibility, secure patient records, moderated support, or professional review unless those services actually exist.
- Never fabricate a user story, clinician profile, research stage, clinical trial, statistic, or affiliation.

## 8. Redesign priorities

1. **Trust first:** separate sourced health information from marketing and prototype content; show source and update details; make medical limitations easy to understand.
2. **Information architecture:** make search, disease details, research, and specialists clear routes. Keep quick links tied to existing disease sections.
3. **Readable clinical layouts:** use calm backgrounds, strong heading hierarchy, constrained reading widths, generous line height, and scannable lists/accordions.
4. **Consistent design tokens:** consolidate font families, font sizes, colors, border/shadow/radius values, focus rings, spacing, and breakpoints.
5. **Responsive behavior:** test phone, tablet, laptop, and wide screens; ensure global navigation is always available and content never overflows horizontally.
6. **Real data states:** loading, no results, source missing, stale information, API error, and retry states should be explicit and accessible.
7. **Accessible interactions:** semantic buttons/links, keyboard navigation, dialog focus management, visible focus, non-color status communication, reduced motion, and useful image alt text.
8. **De-emphasize decoration:** retain recognizable RareBridge branding but prevent zebra backgrounds, floating particles, sound, gradients, and oversized illustrations from competing with medical text.
9. **Remove inert flows:** connect account, newsletter, research summary, community, and assistant controls to real services, or label/hide them as prototypes.
10. **Validate content:** audit all visible copy against owners/sources before carrying numeric claims, testimonials, affiliations, or safety assertions into the redesign.

## 9. Running and building the frontend

### Prerequisites

- Node.js 18 or newer.
- npm (or pnpm if the project is configured to use it).

### Local development

```bash
npm install
npm run dev
```

Vite normally serves the frontend at `http://localhost:5173`.

### Production build

```bash
npm run build
```

The build output is written to `dist/`. The frontend package currently has no dedicated lint or test script in `package.json`.

### API configuration

The API base URL comes from `VITE_API_URL`. If unset, the client uses same-origin relative endpoints such as `/diseases`. Set it to the backend base URL for a separate local backend, and configure backend CORS to allow the dev server origin. Do not place credentials or secrets in frontend environment variables.

## 10. Technology

- React 18 and TypeScript.
- Vite.
- Tailwind CSS 4 via the Vite plugin, plus project CSS and literal utility classes.
- Radix UI-backed/shadcn-style UI components.
- Framer Motion (`framer-motion`) animations.
- Lucide React icons.
- Additional dependencies include MUI/Emotion, React Router, React Hook Form, charts, PDF generation, and other UI helpers; not every dependency is necessarily used on every page.

## 11. Reference files

- Application shell and view navigation: `src/app/App.tsx`
- Brand content and fallback records: `src/app/data.ts`
- API client and normalized frontend interfaces: `src/app/services/api.service.ts`
- Main design tokens and utility compatibility rules: `src/styles/theme.css`
- Document metadata, initial typography and reduced-motion rule: `index.html`
- Global animation utilities: `src/styles/globals.css`
