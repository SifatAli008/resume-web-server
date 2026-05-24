# Resume V2 — Greenfield Generation Specification

**Status:** Authoritative art-direction for a **new** template system.  
**Do not** port, extend, or mirror legacy `vanilla/features/resume/templates/cv-*`, `resume_fluvo_*`, or Tailwind-class-token patterns.  
**Output of this document:** One master generation prompt + twenty template DNA blocks. A downstream generator produces **React/TSX + token CSS only** from this spec.

---

## Part 0 — Master generation prompt (copy verbatim to code generator)

```
You are building Resume V2 for a production resume-builder SaaS.

SCOPE
- Create exactly 20 templates: resume_01 … resume_20.
- Per template deliver:
  1) src/templates/resume_XX/ResumeXX.tsx — self-contained React component
  2) src/templates/resume_XX/resume-XX.tokens.css — accent + layout tokens ONLY
- No shared layout components between templates except a thin typed ResumeData interface and optional SvgIcon map (no visual reuse).
- No TODOs, no lorem ipsum, no placeholder companies, no missing sections.
- Use the SAMPLE_RESUME dataset below verbatim (field values may be localized but must stay realistic).

TECH STACK
- React 18+ / TypeScript strict
- CSS Modules OR scoped class names prefixed cv-tpl-XX-
- Print-first: screen preview == print output (minus .builder-ui, .photo-bar, .no-print)

ROUTES
- Builder: /resume?template=resume_XX
- Deep link: /resume/resume_XX (same builder shell, template locked from path)
- Dedicated shell (invoice zones): /resume/resume_XX with embed modes pdf|app unchanged

DATA CONTRACT (ResumeData)
- fullName, title, email, phone, location
- summary (2–4 sentences, achievement-led)
- experience[2]: { role, company, location?, start, end, bullets[3–4 each] }
- education[1]: { degree, school, start, end, details? }
- skills: string[4+] OR structured list rendered per skills variant
- projects[2]: { name, context, start?, end?, bullets[2–3] }
- certifications, languages (non-empty strings)
- links[0–3]: { label, url }
- showPhoto: boolean (template default overrides on first load)
- photoUrl?: string

LOCKED GLOBAL CSS (identical in every tokens file IMPORT or shared base.css)
:root {
  --cv-sz-name: 1.75rem;
  --cv-wt-name: 800;
  --cv-tr-name: -0.025em;
  --cv-sz-role: 0.9rem;
  --cv-wt-role: 400;
  --cv-tr-role: 0.01em;
  --cv-sz-body: 14px;
  --cv-lh-body: 1.45;
  --cv-sz-section: 10px;
  --cv-sz-date: 12px;
  --cv-sz-meta: 10px;
  --cv-col-date: 7rem;
  --cv-gap-date: 1.25rem;
  --cv-gap-sec: 1.75rem;
  --cv-gap-blk: 1.25rem;
  --cv-gap-row: 1rem;
  --cv-text-1: #18181b;
  --cv-text-2: #52525b;
  --cv-text-3: #a1a1aa;
  --cv-bdr-m: #e4e4e7;
  --cv-bdr-s: #a1a1aa;
  --cv-pad-v: 14mm;
  --cv-pad-h: 16mm;
  --cv-pad-b: 16mm;
}
Templates 12 and 19 ONLY override:
  --cv-pad-v: 15mm; --cv-pad-h: 17mm;

ACCENT TOKENS (per-template CSS file ONLY — never hex in TSX)
--cv-a50 … --cv-a800 (8-step ramp)
--cv-icon-sec (section icon color, usually --cv-a600)

@page { size: A4; margin: var(--cv-pad-v) var(--cv-pad-h); }
Max 3 pages. Page wrapper: .cv-page { width: 210mm; min-height: 297mm; box-sizing: border-box; }
Page break: .cv-page + .cv-page { break-before: page; }

PRINT
* { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
@media print {
  .builder-ui, .photo-bar, .no-print { display: none !important; }
  [data-sidebar-gradient] { background: var(--cv-a800) !important; background-image: none !important; }
}
.cv-row { break-inside: avoid; }
.cv-sec-title { break-after: avoid; }
NO animations, transitions, hover effects inside .cv-page.

SECTION TITLES — implement exactly ONE variant per template (see per-template spec):
- ruled: flex row, 14×14 SVG icon, uppercase label, flex-grow 1px line in --cv-bdr-m
- minimal: uppercase letter-spacing 0.2em, no rule, weight 600
- boxed: 3px left border var(--cv-a500), padding-left 0.75rem
- band: full-width bar background var(--cv-a100), padding 0.35rem 0.6rem
- double: border-top + border-bottom 1px var(--cv-bdr-s), padding 0.4rem 0

ICONS (inline SVG only, 14×14, stroke=currentColor, fill=none):
document | sparkles | cpu | briefcase | folder | academic-cap | certificate | globe | link

DATE GRID (any timeline/table layout):
display: grid;
grid-template-columns: var(--cv-col-date) 1fr;
column-gap: var(--cv-gap-date);
Dates: white-space: nowrap; font-size: var(--cv-sz-date); color: var(--cv-text-2); font-variant-numeric: tabular-nums;

INVOICE ZONE ORDER (mandatory DOM order for dedicated / invoice shell):
1. .cv-meta-row — Email · Phone · Location · Title (dot separators)
2. .cv-masthead — “Curriculum Vitae” label + name uppercase
3. .cv-profile — summary
4. .cv-exp-table — experience (continued pages may use .cv-exp-table-continued)
5. .cv-sidebar-rail — ONLY if layout has rail/sidebar
6. .cv-totals-footer — Education · Certifications · Languages

PHOTO
- Markup always present: .cv-photo-slot
- Visibility controlled by template default + data.showPhoto
- ON: 02,04,07,10,14,18,20 | OFF: all others
- Shapes: round | sq | rounded-sm
- Sizes: sm 64px | md 72px | lg 80px
- Fallback: initials on var(--cv-a100), text var(--cv-a800), border 2px solid var(--cv-a200)

SKILLS — implement assigned variant exactly (see per-template); never mix variants.

QUALITY BAR
Spacing discipline, optical alignment, print readability, ATS-safe headings (real text, no images of text), no decorative-only glyphs in body copy.

For each resume_XX, read its DNA block in RESUME-V2-GENERATION-SPEC.md Part 2 before writing files.
```

---

## Part 1 — Shared sample dataset (all templates)

Use this content in every generated template (editable in builder; static render uses same defaults).

| Field | Value |
|-------|--------|
| fullName | Elena Vasquez |
| title | Senior Product Engineer |
| email | elena.vasquez@email.com |
| phone | +1 415 555 0142 |
| location | San Francisco, CA |
| summary | Product engineer with nine years shipping B2B platforms and developer tools. Led cross-functional delivery from discovery through production, improving activation by 34% and cutting incident volume by half. Comfortable owning architecture decisions, mentoring engineers, and partnering with design on complex workflows. |
| **Experience 1** | **Staff Software Engineer** · Northline Systems · 2021 – Present · Built observability and release automation for 40+ microservices; reduced mean time to recovery from 47 minutes to 19. · Drove API versioning strategy adopted by three product lines, eliminating breaking changes for enterprise clients. · Mentored a team of six; two promotions to senior level within 18 months. |
| **Experience 2** | **Senior Software Engineer** · Meridian Analytics · 2017 – 2021 · Delivered customer-facing reporting module used by 12,000 accounts; improved query performance 3× via indexing and caching. · Introduced contract tests between frontend and backend, cutting regression bugs in release week by 60%. |
| **Education** | **M.S. Computer Science** · State University · 2015 – 2017 · Thesis: distributed tracing for event-driven systems |
| **Skills** | TypeScript · React · Node.js · PostgreSQL · System design · Technical leadership |
| **Project 1** | **OpenTelemetry Workshop Kit** — Internal training platform · 2023 · Self-paced labs and sandboxes for 200+ engineers; adopted as onboarding standard. |
| **Project 2** | **Customer Health Dashboard** — Product analytics · 2020 · Unified churn signals; referenced weekly by customer success leadership. |
| certifications | AWS Solutions Architect – Associate · Certified Kubernetes Administrator |
| languages | English (native) · Spanish (professional) |
| links | github.com/elena-vasquez · linkedin.com/in/elenavasquez |

---

## Part 2 — Template registry overview

| ID | Name | Layout archetype | Section title | Skills | Photo |
|----|------|------------------|---------------|--------|-------|
| resume_01 | Atlas | Swiss single-column | minimal | plain-row | OFF |
| resume_02 | Meridian | Corporate split sidebar 27% | ruled | pills | ON md round |
| resume_03 | Monograph | Minimal monochrome dense | minimal | outline | OFF |
| resume_04 | Harbor | Split right rail 30% | boxed | grid-2col | ON lg sq |
| resume_05 | Pulse | Left timeline spine | ruled | progress-bars | OFF |
| resume_06 | Studio | Magazine 2-col hero | band | card-tiles | OFF |
| resume_07 | Northwind | Enterprise dark sidebar 26% | double | pills-dark | ON md rounded-sm |
| resume_08 | Foundry | Horizontal section bands | band | tags-band | OFF |
| resume_09 | Summit | Executive banner strip | minimal | dot-scale | OFF |
| resume_10 | Ledger | Invoice table + right rail 24% | ruled | sky-chips | ON lg round |
| resume_11 | Archive | Academic boxed blocks | boxed | academic-list | OFF |
| resume_12 | Commons | Centered formal serif | double | serif-blocks | OFF |
| resume_13 | Signal | Asymmetric startup | ruled | rose-tiles | OFF |
| resume_14 | Beacon | Modular card grid | band | compact-dark | ON sm round |
| resume_15 | Gridline | 12-column Swiss grid | minimal | cyan-stack | OFF |
| resume_16 | Press | Newspaper multi-column | ruled | swiss-dense | OFF |
| resume_17 | Vertex | Brutalist rules | boxed | slate-list | OFF |
| resume_18 | Prism | Offset masthead magazine | band | mag-cols | ON md rounded-sm |
| resume_19 | Senate | Luxury centered serif | double | underline | OFF |
| resume_20 | Citadel | Dense consulting sidebar 22% | minimal | grad-dark | ON sm sq |

**Formal serif padding:** resume_12, resume_19 only.

---

## Part 3 — Per-template DNA (10 deliverables each)

---

### resume_01 — Atlas

1. **Template Name:** Atlas  
2. **Design Direction:** Swiss editorial — neutral, grid-disciplined, maximum whitespace, single column. Reference: Swiss International Style posters, Linear docs density.  
3. **Section Title Variant:** minimal  
4. **Skills Variant:** plain-row — skills as inline list separated by middots, wrap naturally, no chips.  
5. **Photo Variant:** OFF (slot hidden with `visibility:hidden` + `height:0` in print, present in DOM)  
6. **Layout Description:** One column, 100% width. Masthead: name left, role right on same baseline grid. Meta row single line under name. Sections stack: Summary → Experience (date grid) → Projects → Skills → Education → Certifications → Languages → Links. No sidebar. Page 2–3: experience continuation then projects/education split if overflow.  
7. **Accent Palette Strategy:** Cool slate ramp; `--cv-a500` for minimal section labels only; body stays `--cv-text-1`.  
8. **Print Optimization Notes:** No gradients. Section gaps strictly `--cv-gap-sec`. Keep experience rows `break-inside: avoid`.  
9. **Component Architecture Notes:** `Resume01.tsx` exports `Resume01({ data, pageIndex })` or single component with three `.cv-page` siblings; date rows use shared `CvDateRow` local function inside file only.  
10. **Token CSS Strategy:** `--cv-a50:#f4f4f5` through `--cv-a800:#27272a`; `--cv-icon-sec: var(--cv-a600)`.

---

### resume_02 — Meridian

1. **Template Name:** Meridian  
2. **Design Direction:** Corporate ATS — conservative, recruiter-scannable, left contact rail. Reference: Stripe corporate PDFs.  
3. **Section Title Variant:** ruled  
4. **Skills Variant:** pills — filled `--cv-a100` background, `--cv-a800` text, 4px radius.  
5. **Photo Variant:** ON — md, round, top of sidebar.  
6. **Layout Description:** CSS grid `27% | 73%`. Left: photo, contact, skills, languages, links. Right: invoice zones 1–4 then footer education/certs on page 3. Main column meta+masthead+profile+exp-table. Sidebar never repeats on page 2–3 except `linksDisplay` read-only strip optional — prefer full-width continuation for experience only.  
7. **Accent Palette Strategy:** Deep blue ramp; sidebar solid `--cv-a800` (gradient on screen, solid print).  
8. **Print Optimization Notes:** Sidebar text white; ensure contrast ≥ 4.5:1. Photo hidden if `showPhoto` false.  
9. **Component Architecture Notes:** `data-sidebar-gradient` on rail; `invoiceShell` prop toggles meta-row density.  
10. **Token CSS Strategy:** Blue ramp; `--cv-icon-sec: var(--cv-a200)` on dark sidebar.

---

### resume_03 — Monograph

1. **Template Name:** Monograph  
2. **Design Direction:** Minimal monochrome — black/white only, accent used sparingly for rules. Reference: Notion executive one-pagers.  
3. **Section Title Variant:** minimal  
4. **Skills Variant:** outline — 1px border `--cv-a400`, transparent fill.  
5. **Photo Variant:** OFF  
6. **Layout Description:** Single column, tighter `--cv-gap-blk` (still ≥ 1.25rem). Name full width; horizontal hairline under masthead. Experience uses compact date grid; projects as single block with smaller subheads. Maximum content per page — target 2.5 pages before break.  
7. **Accent Palette Strategy:** Zinc-only ramp; accent only on borders.  
8. **Print Optimization Notes:** Pure grayscale-friendly; test ATS extraction order matches visual order.  
9. **Component Architecture Notes:** No icons on contact line — text only for ATS purity optional toggle via `atsStrict` class.  
10. **Token CSS Strategy:** Monochrome zinc ramp.

---

### resume_04 — Harbor

1. **Template Name:** Harbor  
2. **Design Direction:** Split layout — narrative left, strengths right. Reference: Framer portfolio resumes.  
3. **Section Title Variant:** boxed  
4. **Skills Variant:** grid-2col — two-column skill cells with subtle `--cv-a50` fill.  
5. **Photo Variant:** ON — lg, sq, top-right rail.  
6. **Layout Description:** Main 70% left: zones 1–4. Right rail 30%: photo, skills grid, languages, certifications. Rail background `--cv-a50`. Experience table in main only.  
7. **Accent Palette Strategy:** Indigo ramp; rail tint `--cv-a50`.  
8. **Print Optimization Notes:** Rail border-left 1px `--cv-bdr-m`; avoid gradient.  
9. **Component Architecture Notes:** Right rail sticky within page 1 only; pages 2–3 main full width.  
10. **Token CSS Strategy:** Indigo family tokens.

---

### resume_05 — Pulse

1. **Template Name:** Pulse  
2. **Design Direction:** Timeline — vertical spine, modern tech. Reference: Awwwards CV timelines.  
3. **Section Title Variant:** ruled  
4. **Skills Variant:** progress-bars — label + bar 100% width, fill width mapped 70–92% deterministic from skill string hash.  
5. **Photo Variant:** OFF  
6. **Layout Description:** Left padding 12px; 4px spine `--cv-a500` running through experience + projects. Date grid with spine dot markers. Skills below summary page 1.  
7. **Accent Palette Strategy:** Violet ramp; spine `--cv-a500`.  
8. **Print Optimization Notes:** Spine color solid; dots 6px circle.  
9. **Component Architecture Notes:** `CvTimelineSpine` inline component per file.  
10. **Token CSS Strategy:** Violet ramp.

---

### resume_06 — Studio

1. **Template Name:** Studio  
2. **Design Direction:** Magazine — dual-column hero, creative but restrained. Reference: Behance editorial CVs.  
3. **Section Title Variant:** band  
4. **Skills Variant:** card-tiles — 2×3 grid cards with title + subtle border.  
5. **Photo Variant:** OFF  
6. **Layout Description:** Row 1: name + role spanning full width. Row 2: summary 58% | skills cards 42%. Below: full-width experience banded sections alternating `--cv-a50` / white rows. Projects in two columns page 2.  
7. **Accent Palette Strategy:** Purple accent; bands use `--cv-a100`.  
8. **Print Optimization Notes:** Band titles need `print-color-adjust: exact`.  
9. **Component Architecture Notes:** `band` section headers only on major sections.  
10. **Token CSS Strategy:** Purple ramp.

---

### resume_07 — Northwind

1. **Template Name:** Northwind  
2. **Design Direction:** Enterprise consulting — dark sidebar, trusted, dense. Reference: McKinsey/BCG public bio PDFs (layout only).  
3. **Section Title Variant:** double  
4. **Skills Variant:** pills-dark — pills on `--cv-a800` sidebar with `--cv-a100` text.  
5. **Photo Variant:** ON — md, rounded-sm.  
6. **Layout Description:** Sidebar 26% dark; main 74%. Double-rule section titles in main. Invoice order in main column; sidebar holds photo, skills, links, languages.  
7. **Accent Palette Strategy:** Teal-green ramp on dark sidebar.  
8. **Print Optimization Notes:** Sidebar → solid `--cv-a800`.  
9. **Component Architecture Notes:** White main text on dark rail for labels only; body stays dark-on-white in main.  
10. **Token CSS Strategy:** Teal deep ramp.

---

### resume_08 — Foundry

1. **Template Name:** Foundry  
2. **Design Direction:** Engineering bands — horizontal stripes per section. Reference: GitHub engineering README aesthetic.  
3. **Section Title Variant:** band  
4. **Skills Variant:** tags-band — skills in full-width tag strip under band header.  
5. **Photo Variant:** OFF  
6. **Layout Description:** Each section wrapped in `.cv-band` with `--cv-a100` background full bleed within page padding. Experience entries white inner cards. No sidebar.  
7. **Accent Palette Strategy:** Emerald engineering green.  
8. **Print Optimization Notes:** Bands must not split across pages — move whole band to next page if needed.  
9. **Component Architecture Notes:** Band wrapper includes section content atomically.  
10. **Token CSS Strategy:** Emerald ramp.

---

### resume_09 — Summit

1. **Template Name:** Summit  
2. **Design Direction:** Executive formal — top contact banner, centered authority. Reference: Fortune 500 officer bios.  
3. **Section Title Variant:** minimal  
4. **Skills Variant:** dot-scale — skills with 5-dot proficiency, filled dots `--cv-a600`.  
5. **Photo Variant:** OFF  
6. **Layout Description:** Full-width banner `--cv-a800` with white meta text (zones 1–2 compressed). Body single column below. Experience as prose blocks with bold company lines, dates right-aligned in 7rem column.  
7. **Accent Palette Strategy:** Charcoal/zinc executive neutrals.  
8. **Print Optimization Notes:** Banner solid fill; no gradient.  
9. **Component Architecture Notes:** Masthead inside banner; name uppercase white.  
10. **Token CSS Strategy:** Zinc dark ramp.

---

### resume_10 — Ledger

1. **Template Name:** Ledger  
2. **Design Direction:** Invoice-like enterprise — table experience, right rail. Reference: premium invoice SaaS (Fluvo 10 structure) rebuilt clean.  
3. **Section Title Variant:** ruled  
4. **Skills Variant:** sky-chips — light chips on white, border `--cv-a200`.  
5. **Photo Variant:** ON — lg, round, top of right rail 24%.  
6. **Layout Description:** Strict invoice zone order. Experience as HTML table: Date | Role/Company | Bullets. Right rail: photo, skills, languages. Footer block education/certs/lang.  
7. **Accent Palette Strategy:** Sky/slate professional.  
8. **Print Optimization Notes:** Table headers repeat; `thead { display: table-header-group; }`.  
9. **Component Architecture Notes:** `cv-exp-table` semantic `<table>` for ATS.  
10. **Token CSS Strategy:** Sky ramp.

---

### resume_11 — Archive

1. **Template Name:** Archive  
2. **Design Direction:** Academic CV — research-forward, boxed sections. Reference: university faculty CVs.  
3. **Section Title Variant:** boxed  
4. **Skills Variant:** academic-list — numbered list, hanging indent 1.5rem.  
5. **Photo Variant:** OFF  
6. **Layout Description:** Page 1: summary box, education early (after profile), then experience, projects, publications-style projects formatting. Certifications + languages in footer grid.  
7. **Accent Palette Strategy:** Teal scholarly.  
8. **Print Optimization Notes:** Box borders 1px `--cv-bdr-m`; padding 1rem inside boxes.  
9. **Component Architecture Notes:** Education before experience (academic convention).  
10. **Token CSS Strategy:** Teal muted ramp.

---

### resume_12 — Commons

1. **Template Name:** Commons  
2. **Design Direction:** Luxury serif formal — centered, restrained elegance. Reference: high-end law firm associate CVs.  
3. **Section Title Variant:** double  
4. **Skills Variant:** serif-blocks — skills in serif small caps blocks, 2 columns.  
5. **Photo Variant:** OFF  
6. **Layout Description:** Centered masthead (name, role, meta). Body single column max-width 148mm centered. **Padding:** 15mm / 17mm. Font stack: serif for name + section titles; sans for body.  
7. **Accent Palette Strategy:** Slate warm gray.  
8. **Print Optimization Notes:** Formal padding overrides; avoid orphans on name block.  
9. **Component Architecture Notes:** `font-family` via token `--cv-font-serif`.  
10. **Token CSS Strategy:** Slate + serif variables.

---

### resume_13 — Signal

1. **Template Name:** Signal  
2. **Design Direction:** Startup profile — asymmetric margins, energetic. Reference: Y Combinator founder one-pagers.  
3. **Section Title Variant:** ruled  
4. **Skills Variant:** rose-tiles — rose-tinted tiles, 3-column grid.  
5. **Photo Variant:** OFF  
6. **Layout Description:** Name offset left 0; role indented 12%. Summary full bleed with left accent 6px `--cv-a500`. Experience standard grid; projects side-by-side 48/48.  
7. **Accent Palette Strategy:** Rose/coral startup accent.  
8. **Print Optimization Notes:** Accent bar must print exact.  
9. **Component Architecture Notes:** Asymmetric padding-left on summary only.  
10. **Token CSS Strategy:** Rose ramp.

---

### resume_14 — Beacon

1. **Template Name:** Beacon  
2. **Design Direction:** Creative technologist — modular cards. Reference: Dribbble UX engineer resumes.  
3. **Section Title Variant:** band  
4. **Skills Variant:** compact-dark — compact pills on dark card background.  
5. **Photo Variant:** ON — sm, round.  
6. **Layout Description:** Page 1 grid 2×2 cards: Profile | Skills (dark card) | Photo+Links | Highlights. Page 2+ experience cards each job in bordered card.  
7. **Accent Palette Strategy:** Slate + electric blue accent.  
8. **Print Optimization Notes:** Card shadows removed in print; borders only.  
9. **Component Architecture Notes:** Each card `break-inside: avoid`.  
10. **Token CSS Strategy:** Slate/blue dual tokens.

---

### resume_15 — Gridline

1. **Template Name:** Gridline  
2. **Design Direction:** 12-column Swiss grid — modular, invisible grid. Reference: Josef Müller-Brockmann grids.  
3. **Section Title Variant:** minimal  
4. **Skills Variant:** cyan-stack — vertical stack with left cyan bar 3px per skill.  
5. **Photo Variant:** OFF  
6. **Layout Description:** CSS grid 12 columns; name spans 8 cols, meta 4 cols; summary spans 8, skills stack 4 cols. Experience rows span 12 with date in cols 1–3.  
7. **Accent Palette Strategy:** Cyan system accent.  
8. **Print Optimization Notes:** Grid gaps 8px; align to baseline 4px.  
9. **Component Architecture Notes:** Column spans documented in CSS comments.  
10. **Token CSS Strategy:** Cyan ramp.

---

### resume_16 — Press

1. **Template Name:** Press  
2. **Design Direction:** Newspaper-inspired — multi-column body. Reference: NYT mini profiles.  
3. **Section Title Variant:** ruled  
4. **Skills Variant:** swiss-dense — dense comma-separated columns (3 cols), small caps header.  
5. **Photo Variant:** OFF  
6. **Layout Description:** Masthead full width rule 2px. Summary in 2 columns 35/65. Experience single column; projects on page 2 in 2 columns. Skills in footer 3-column dense block.  
7. **Accent Palette Strategy:** Orange ink accent (editorial).  
8. **Print Optimization Notes:** Column rule 1px between summary cols.  
9. **Component Architecture Notes:** `column-count` for summary only.  
10. **Token CSS Strategy:** Orange editorial ramp.

---

### resume_17 — Vertex

1. **Template Name:** Vertex  
2. **Design Direction:** Brutalist — heavy rules, stark hierarchy. Reference: brutalist web typography posters.  
3. **Section Title Variant:** boxed  
4. **Skills Variant:** slate-list — bold skill name + en-dash + short descriptor line.  
5. **Photo Variant:** OFF  
6. **Layout Description:** Thick top border 6px `--cv-a800`. Section titles boxed 3px left + ALL CAPS. Experience rows separated by 2px horizontal rules full bleed.  
7. **Accent Palette Strategy:** Near-black + white only.  
8. **Print Optimization Notes:** Rules must be exact color.  
9. **Component Architecture Notes:** No rounded corners anywhere.  
10. **Token CSS Strategy:** High-contrast zinc/black.

---

### resume_18 — Prism

1. **Template Name:** Prism  
2. **Design Direction:** Asymmetric magazine — offset masthead, creative. Reference: Framer marketing team CVs.  
3. **Section Title Variant:** band  
4. **Skills Variant:** mag-cols — skills in 2 magazine columns with small caps lead-ins.  
5. **Photo Variant:** ON — md, rounded-sm.  
6. **Layout Description:** Masthead offset right 15%; photo top-left overlapping masthead by 8px (z-index). Fuchsia tint page 1 background `--cv-a50` only top third.  
7. **Accent Palette Strategy:** Fuchsia editorial.  
8. **Print Optimization Notes:** Background tint prints exact on page 1 only.  
9. **Component Architecture Notes:** Overlap via grid layering, not negative margin > 12px.  
10. **Token CSS Strategy:** Fuchsia ramp.

---

### resume_19 — Senate

1. **Template Name:** Senate  
2. **Design Direction:** Executive luxury serif — centered, board-ready. Reference: Notion + classic diplomacy CV.  
3. **Section Title Variant:** double  
4. **Skills Variant:** underline — skill text with underline offset 3px `--cv-a400`.  
5. **Photo Variant:** OFF  
6. **Layout Description:** Centered column 160mm. Double rules between all major sections. **Padding:** 15mm / 17mm. Name serif 1.75rem; body sans.  
7. **Accent Palette Strategy:** Warm zinc/gold undertone in `--cv-a600`.  
8. **Print Optimization Notes:** Formal padding; widows avoided on section titles.  
9. **Component Architecture Notes:** Links centered footer.  
10. **Token CSS Strategy:** Warm zinc + gold accent token.

---

### resume_20 — Citadel

1. **Template Name:** Citadel  
2. **Design Direction:** Dense enterprise consulting — narrow sidebar, maximum signal. Reference: Deloitte digital CV density.  
3. **Section Title Variant:** minimal  
4. **Skills Variant:** grad-dark — skill chips on gradient sidebar (print solid `--cv-a700`).  
5. **Photo Variant:** ON — sm, sq.  
6. **Layout Description:** Sidebar 22% (narrowest of all templates). Main 78% with tight row gaps still respecting `--cv-gap-row`. Invoice zones in main; sidebar photo top, skills grad-dark, links.  
7. **Accent Palette Strategy:** Rose/wine enterprise.  
8. **Print Optimization Notes:** Highest density — verify 3-page max with sample data.  
9. **Component Architecture Notes:** Smallest photo; sidebar typography 12px.  
10. **Token CSS Strategy:** Rose deep ramp.

---

## Part 4 — Skills variant implementation briefs

Each variant must be implemented once, exactly as described, in its assigned template only.

| Variant | Visual spec | ATS note |
|---------|-------------|----------|
| plain-row | Inline middot-separated text | Excellent |
| pills | Rounded rect fill a100 | Good |
| pills-dark | Pills on dark bg | Good |
| outline | 1px border, no fill | Excellent |
| grid-2col | 2-col cell grid | Good |
| card-tiles | Bordered cards 2×3 | Fair — keep text in DOM |
| progress-bars | Label + horizontal bar | Fair — include text label |
| tags-band | Full-width wrap tags | Good |
| dot-scale | 5 dots + label | Fair — duplicate label text |
| sky-chips | Light chip border | Good |
| academic-list | Numbered list | Excellent |
| serif-blocks | 2-col small caps | Good |
| rose-tiles | 3-col tinted tiles | Good |
| compact-dark | Small pills on #27272a card | Good |
| cyan-stack | Row + left bar | Excellent |
| swiss-dense | 3-col comma lists | Excellent |
| slate-list | Term — descriptor | Excellent |
| mag-cols | 2-col magazine | Good |
| underline | Text + underline | Excellent |
| grad-dark | Chips on sidebar gradient | Good |

---

## Part 5 — Layout uniqueness matrix (anti-duplication)

| Template | Sidebar width | Masthead | Experience structure | Page-1 unique element |
|----------|---------------|----------|----------------------|------------------------|
| 01 | none | inline name/role | date grid | Swiss whitespace |
| 02 | 27% left | main | date grid | dark rail |
| 03 | none | hairline | compact grid | monochrome |
| 04 | 30% right | main | date grid | skills grid rail |
| 05 | none | standard | timeline spine | violet spine |
| 06 | none | magazine split | banded rows | 58/42 hero |
| 07 | 26% left | main | date grid | double rules |
| 08 | none | standard | banded sections | horizontal bands |
| 09 | none | banner top | executive grid | dark banner |
| 10 | 24% right | main | HTML table | invoice table |
| 11 | none | standard | boxed | education first |
| 12 | none | centered | date grid | serif centered |
| 13 | none | asymmetric | date grid | rose summary bar |
| 14 | card grid | card masthead | card jobs | 2×2 modules |
| 15 | none | 12-col grid | 12-col rows | Müller grid |
| 16 | none | newspaper | columns | 2-col summary |
| 17 | none | brutal top rule | ruled rows | 6px top border |
| 18 | overlap | offset right | date grid | tint + overlap photo |
| 19 | none | centered serif | date grid | gold accents |
| 20 | 22% left | main | dense grid | narrowest rail |

No two templates may share the same tuple: `(sidebar width, masthead type, experience structure)`.

---

## Part 6 — File tree for generator

```
src/
  resume/
    types.ts                 # ResumeData interface
    icons.tsx                # 9 inline SVGs, 14×14
    sample-resume.ts         # Part 1 dataset
    base-print.css           # locked :root + @page + print rules
  templates/
    resume_01/
      Resume01.tsx
      resume-01.tokens.css
    …
    resume_20/
      Resume20.tsx
      resume-20.tokens.css
```

---

## Part 7 — Acceptance checklist (per template)

- [ ] Renders 3 pages max with sample data  
- [ ] All invoice zones present in order when `invoiceShell={true}`  
- [ ] No hex in TSX (grep `#[0-9a-f]` in tsx)  
- [ ] Date column exactly 7rem, no wrap  
- [ ] Typography variables match locked scale  
- [ ] Photo default matches ON/OFF table  
- [ ] Section title variant matches spec  
- [ ] Skills variant matches spec  
- [ ] Print: no motion; gradients → solid  
- [ ] `npm run test:resume-v2` (to be added) passes  

---

## Part 8 — Migration note (human)

Legacy IDs `resume_fluvo_1…20` may 301 redirect to `resume_01…20` after V2 ships. Do not merge codebases; replace renderer registry wholesale when implementing.

---

*Document version: 1.0 — greenfield, no legacy Fluvo art direction.*
