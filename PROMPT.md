# Resume template playbook — Define · Improve · Polish

Use with **[RESUME-WORKFLOW.md](./RESUME-WORKFLOW.md)** for system architecture. This file is the **per-template** checklist (like invoice `PROMPT.md` §5–16), converted for **resume_fluvo_1 … resume_fluvo_20**.

---

## 1. Three phases (always in order)

| Phase | When | Outcome |
|-------|------|---------|
| **Define** | Before code | Written spec: template ID, colors, layout family, **zones**, every field mapped to `ResumeDraft` |
| **Improve** | Structure | Tokens + layout wired; shared blocks only; one draft read/write path; static + editable stay in sync |
| **Polish** | Quality | Spacing, contrast, section hierarchy, print/embed/PDF tests, edge fixtures, no overflow / broken skills |

Do **not** skip Define. Do **not** polish before structure is correct.

---

## 2. Layout zones (resume, not invoice)

Map your design onto these **zones**. Page 1–3 distribution is fixed unless you add a new layout family in `cv-editable-multipage.js`.

| Zone | ResumeDraft fields | Typical placement |
|------|-------------------|-------------------|
| **Header** | `fullName`, `title`, `email`, `phone`, `location`, `links` (if `linksZone: header`) | Page 1 top — `headerStandard` / `ribbon` / `banner` / `compact` / `serif` |
| **Photo** | `showPhoto`, `photoUrl` | Header or sidebar; `photoSlot()` + `cv-has-photo` / `cv-no-photo` |
| **Summary** | `summary` | Page 1 main column |
| **Skills** | `skills` (string → parsed chips/bars) | Main column and/or sidebar/rail; `skillsStyle` per template |
| **Experience** | `experience[]` — `role`, `company`, `start`, `end`, `bullets[]` | Page 1 (first 2 jobs), page 2 (continued) |
| **Projects** | `projects[]` | Page 2 |
| **Education** | `education[]` | Page 3 |
| **Certifications** | `certifications` | Page 3 |
| **Languages** | `languages` | Page 3 and/or sidebar/rail |
| **Links (canonical editor)** | `links[]` | **Only once** — `[data-links-editor]` on page 1; sidebars use `linksDisplay` |

**Print root:** `#resume-print-root` on `<article class="cv-document cv-tpl-{N} {fontClass}">`.  
**Pages:** `<section class="cv-page">` × 3 (A4).

---

## 3. ResumeDraft field map (contract)

Source: `vanilla/features/resume/draft.js` — keep **backward compatible**.

```ts
// Conceptual shape (implementation is plain JS)
type ResumeDraft = {
  templateId: string;           // resume_fluvo_1 … resume_fluvo_20
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  showPhoto: boolean;
  photoUrl: string;
  links: { label: string; url: string }[];  // max 6, deduped
  summary: string;
  experience: {
    company: string;
    role: string;
    start: string;
    end: string;
    bullets: string[];
  }[];
  projects: {
    name: string;
    context: string;
    start: string;
    end: string;
    bullets: string[];
  }[];
  education: {
    school: string;
    degree: string;
    start: string;
    end: string;
  }[];
  skills: string;              // multiline; · or comma separated
  certifications: string;
  languages: string;
};
```

**Hydration (same order as invoice `invoiceData`):**

1. `?draft=<base64url>` (`draft-url.js`)
2. `#__resume_draft__` script JSON
3. `window.__resumeDraft`
4. `CustomEvent` **`resumeData`** with `detail: ResumeDraft`
5. Builder only: `localStorage` key `resume-web-server:draft:v3`

**Read/write in editor:** `readEditableMultipageDraft(root, templateId)` — do not duplicate field parsers per template.

---

## 4. Vanilla file map (invoice → resume)

| Invoice (React) | Resume (vanilla) |
|-----------------|------------------|
| `invoice_fluvo_X/*-header.tsx` | `pickHeader()` variants in `cv-editable-multipage.js` + `ui.header` in `cv-template-ui.js` |
| `*-table.tsx` | `expRows()`, `projRows()`, `eduRows()` in `cv-editable-multipage.js` |
| `*-totals.tsx` | N/A — no money; use **skills visual** (`cv-skills-ui.js`) |
| `*-signature.tsx` | Optional photo block / sidebar identity (`cv-shared-ui.js`) |
| `*-calculations.ts` | `cv-skills-ui.js` (`parseSkills`, `skillBarPct`), page split in `distributePages` / layout renderers |
| `*.module.css` | `cv-template-tokens.js` + `resume-print.css` (`.cv-tpl-N`, `.cv-font-*`) |
| `useInvoiceTemplateState()` | `resolveInitialDraft()` + `mountResumeEditablePreview` + `readEditableMultipageDraft()` |
| `constants.ts` | `vanilla/features/resume/constants.js` |
| `invoice-template-renderer.tsx` | `resume-template-renderer.js` + `cv-multipage-core.js` |

**Per-template folder (minimal):**

```
vanilla/features/resume/templates/resume_fluvo_X/
└── template.js    → export renderResumeFluvoXTemplate(d) { return renderCvTemplate(d, X); }
```

**Real customization for template X** (Define phase outputs):

1. `cv-template-tokens.js` — entry `[X]`: `fontClass`, colors, `skillsStyle`, `sidebar`/`rail`/`page`
2. `cv-template-ui.js` — `LAYOUT[X]`: `layout`, `header`, `section`
3. `resume-print.css` — `.cv-tpl-X` accents
4. If new layout family: add renderer in `cv-editable-multipage.js` **and** branch in `cv-multipage-core.js`

Reference templates for structure: **resume_fluvo_8 (Berlin, bands)** and **resume_fluvo_9 (Manhattan, banner)**.

---

## 5. DEFINE phase — spec template (fill before coding)

### 5.1 Spec sheet (copy per template)

```markdown
## resume_fluvo_X — [City name]

**Template ID:** resume_fluvo_X  
**Layout family:** classic | sidebar-left | sidebar-right | split-right | ribbon | timeline | magazine | bands | banner | serif | swiss | academic  
**Header variant:** standard | sidebar | ribbon | compact | banner | serif  
**Section style:** ruled | minimal | boxed | band | double  

### Colors (Tailwind static classes only)
- Primary / h2: text-_______
- Rule / line: bg-_______
- Ribbon (if any): bg-_______
- Page frame: (border / gradient / ring) _______
- Sidebar/rail (if any): _______
- iconContact / iconLink / iconSection: _______

### Typography
- fontClass: cv-font-_______ (see resume-print.css)
- Photo frame: rounded-_______

### Skills
- skillsStyle: pills | pills-dark | grouped | outline | grid | cards | bars | … (see cv-skills-ui.js SKILLS_STYLE_BY_TEMPLATE)

### Zones (which page / column)
| Zone | Page | Column |
|------|------|--------|
| Header | 1 | main / sidebar |
| Summary | 1 | |
| Skills | 1 | main / sidebar / rail |
| Experience (×2) | 1 | |
| Experience cont. | 2 | |
| Projects | 2 | |
| Education | 3 | |
| Certs / Languages | 3 | |
| Links editor | 1 only | header / sidebar / rail |

### ResumeDraft mapping
- [ ] fullName, title → header
- [ ] email, phone, location → contact row with icons
- [ ] links → single data-links-editor zone
- [ ] summary, skills, experience, projects, education, certifications, languages
- [ ] showPhoto / photoUrl → photoSlot + defaults (cv-defaults.js if photo-friendly)

### ATS / print
- [ ] Real text in inputs (editor) / text nodes (static)
- [ ] No content clipped at A4 bottom
- [ ] print:hidden on toolbar, photo editor, add/remove buttons
```

### 5.2 Register template

- [ ] `constants.js` — `RESUME_TEMPLATE_IDS`, `RESUME_TEMPLATES` description
- [ ] `cv-template-tokens.js` — `TEMPLATE_TOKENS[X]`
- [ ] `cv-template-ui.js` — `LAYOUT[X]`
- [ ] `resume-print.css` — `.cv-tpl-X`
- [ ] `resume_fluvo_X/template.js` — `renderCvTemplate(draft, X)`
- [ ] `resume-template-renderer.js` — `RENDERERS.resume_fluvo_X`
- [ ] `cv-multipage-core.js` — `CV_THEMES[X]` if new accent/layout label needed

---

## 6. IMPROVE phase — structure

- [ ] **No duplicate draft logic** — use `readEditableMultipageDraft` / `normalizeResumeDraft` only
- [ ] **No duplicate link rows** on pages 2–3 — `linksDisplay` in sidebars/rails
- [ ] **Shared blocks** — `sec()`, `photoSlot`, `skillsEditorBlock`, `renderSkillsVisual` from `cv-*-ui.js`
- [ ] **Static ≡ editable** — same `getTemplateUi(X)` tokens; static path `renderCvTemplate`, editor `buildEditableMultipageCv`
- [ ] **Skills math** in `cv-skills-ui.js` only (`parseSkills`, `skillMeta`, style switch) — not inline in template
- [ ] **Page split** — use existing `renderClassic` / `renderSidebarLeft` / …; don’t fork 3-page logic per template unless adding a layout family

---

## 7. POLISH phase — quality

### 7.1 Visual

- [ ] Section spacing consistent (`CV_SPACE` in `cv-shared-ui.js`)
- [ ] Date column aligned (`grid-cols-[7rem_minmax(0,1fr)]` on experience/education)
- [ ] Skills readable in editor + print (preview visible when printing, textarea hidden)
- [ ] Sidebar contrast (light text on dark sidebar; icons use `iconSection` dark variant)
- [ ] Name/title hierarchy clear (H1 > title > body)
- [ ] `tabular-nums` on dates where applicable

### 7.2 Print & embed

- [ ] `print:bg-white` on pages; `print:shadow-none` on shell
- [ ] `print:hidden` on `#rf-preview-shell` chrome, photo editor, dashed buttons
- [ ] `#resume-print-root` contains exactly 3 `.cv-page` sections
- [ ] `embed=pdf`: no inputs; `#pdf-ready[data-ready="1"]` fires after render
- [ ] `embed=app`: viewport fit, no horizontal scroll

### 7.3 Tests (must run)

| Test | URL / command |
|------|----------------|
| Builder | `GET /resume/resume_fluvo_X` |
| Draft URL | `GET /resume/resume_fluvo_X?draft=<base64url>` |
| PDF shell | `GET /resume/resume_fluvo_X?embed=pdf&draft=...` |
| App embed | `GET /resume/resume_fluvo_X?embed=app&draft=...` |
| Static API | `POST /render/resume/resume_fluvo_X/static` + JSON body |
| Server PDF | `POST /render/resume/resume_fluvo_X/pdf` + JSON body |
| Smoke | `npm run test:static-render` |

**Fixtures:**

- `vanilla/fixtures/pdf/resume-sample.json` — minimal happy path
- `vanilla/fixtures/pdf/resume-long.json` — stress: many jobs, long bullets, long skills (create if missing)

**Edge cases:**

- [ ] Empty sections show placeholders (`CV_PH`), not blank gaps
- [ ] 1 experience row / 1 project — layout stable
- [ ] Long employer name / URL — wraps, no horizontal overflow
- [ ] Skills: one line vs many lines vs category line `Backend: React, Node`
- [ ] Photo off vs on; template switch respects `applyTemplatePhotoDefaults(..., "load" | "switch")`
- [ ] No `NaN` in skill bars; empty skills → empty state, not broken HTML

---

## 8. Copy-paste AI prompt (fill in X and design notes)

```
TASK: Define, implement, or polish resume template resume_fluvo_X in resume-web-server.

Read PROMPT.md (this file) sections 5–7 and RESUME-WORKFLOW.md.
Reference resume_fluvo_8 (Berlin, bands) or resume_fluvo_9 (Manhattan, banner) for layout patterns.

DEFINE:
  Write spec (colors, layout family, zones, skillsStyle). Update cv-template-tokens.js [X],
  cv-template-ui.js LAYOUT[X], resume-print.css .cv-tpl-X, resume_fluvo_X/template.js,
  constants.js + resume-template-renderer.js + CV_THEMES[X] if needed.

IMPROVE:
  Use shared cv-shared-ui / cv-skills-ui / cv-links-ui only. No duplicate draft parsing.
  Editable: buildEditableMultipageCv. Static: renderCvTemplate. Same getTemplateUi(X).

POLISH:
  Spacing, section icons, skills preview on print, sidebar contrast, print:hidden on dev UI.
  Test:
  - GET /resume/resume_fluvo_X
  - GET /resume/resume_fluvo_X?embed=pdf&draft=...
  - GET /resume/resume_fluvo_X?embed=app&draft=...
  - POST /render/resume/resume_fluvo_X/static
  - POST /render/resume/resume_fluvo_X/pdf with vanilla/fixtures/pdf/resume-sample.json

RULES:
  Minimal diff. Backward-compatible ResumeDraft. Editor keeps <input>/<textarea> for PDF clone.
  Keep #resume-print-root. Single [data-links-editor] on page 1. Static Tailwind classes only.

DESIGN NOTES:
  Primary #_______ / Tailwind text-_______
  Style: _______ (corporate | editorial | academic | …)
  Reference: _______ (Behance / LinkedIn / competitor CV)
```

---

## 9. Polish checklist (all must pass)

- [ ] Token row in `cv-template-tokens.js` + `LAYOUT` in `cv-template-ui.js`
- [ ] `.cv-font-*` + `.cv-tpl-X` in `resume-print.css`
- [ ] `resume_fluvo_X/template.js` + `resume-template-renderer.js` entry
- [ ] Draft hydration: `?draft=`, `resumeData` event, `readEditableMultipageDraft`
- [ ] Article: `max-w` / full bleed per layout; `print:shadow-none` on preview shell
- [ ] `tabular-nums` on date columns
- [ ] PDF: `embed=pdf`, Print button, `POST .../pdf` returns valid PDF
- [ ] Static: `POST .../static` returns HTML with `#resume-print-root` and no `<input>`
- [ ] Edge: minimal draft, long text, many experience rows, photo on/off
- [ ] `npm run build:css` after new Tailwind classes
- [ ] No `motion.div` typos; grep `vanilla/` before commit
- [ ] `npm run test:resume` (static smoke + 20-template checklist)

---

## 10. Calculation & parsing rules (resume)

Unlike invoice tax math, resume **derived data** lives here:

| Rule | Module | Behavior |
|------|--------|----------|
| Skills tokens | `cv-skills-ui.js` | Split on newline; within line split on `·` `,` `;` |
| Skill icon/color | `skillMeta(name)` | Keyword rules (code, cloud, database, …) |
| Skill bar % | `skillBarPct(index, total)` | Deterministic placeholder bars when style uses bars |
| Page 1 jobs | `cv-editable-multipage` / `distributePages` | `experience.slice(0, 2)` |
| Page 2 jobs | same | `experience.slice(2)` |
| Links cap | `draft.js` `normalizeLinks` | Max 6, dedupe label+url |
| Bullets cap | `normalizeBullets` | Up to 12 per job |
| Photo default | `cv-defaults.js` | Templates 2,4,7,10,14,18,20 — `switch` vs `load` |

**Do not** invent totals or percentages in copy — only skill **visual** bars use synthetic %.

---

## 11. Filled example — resume_fluvo_9 (Manhattan)

**DEFINE (already in repo):**

| Key | Value |
|-----|--------|
| ID | `resume_fluvo_9` |
| Layout | `banner` — contact strip + standard header |
| Section | `ruled` |
| Colors | zinc executive — `text-zinc-900`, ribbon `bg-zinc-900` |
| fontClass | `cv-font-manhattan` |
| skillsStyle | `minimal-row` |
| linksZone | `header` |
| photoDefault | yes (banner layout) |

**IMPROVE:** Uses `renderBanner` + `renderClassic` page split; no local draft fork.

**POLISH tests:**

```bash
npm run dev
# Browser: http://localhost:3000/resume/resume_fluvo_9

npm run test:static-render
curl.exe -X POST http://localhost:3000/render/resume/resume_fluvo_9/static \
  -H "Content-Type: application/json" \
  -d @vanilla/fixtures/pdf/resume-sample.json
```

---

## 12. Invoice → resume phase mapping

| Invoice phase | Resume phase |
|---------------|--------------|
| Spec: parties, line items, tax | Spec: header, experience, skills zones |
| `*-calculations.ts` | `cv-skills-ui.js` + page distribution |
| `useInvoiceTemplateState()` | `resolveInitialDraft` + `mountResumeEditablePreview` |
| Grand total emphasis | Name + title + section `sec()` hierarchy |
| `invoice-120-items.json` | `resume-long.json` (stress fixture) |
| `[data-invoice-pdf-root]` | `#resume-print-root` |
| `/invoice/invoice_fluvo_X` | `/resume/resume_fluvo_X` |

---

## 13. Creating `resume-long.json` (stress fixture)

Add `vanilla/fixtures/pdf/resume-long.json` with:

- 8+ `experience` entries (only first slices show on page 1; rest on page 2)
- 4+ `projects` with 4 bullets each
- `skills` string ≥ 40 lines / 80 tokens
- Long `summary` (500+ chars)
- Long `fullName` / `company` / URLs in links

Use for manual overflow check and optional `POST .../pdf` load test.

---

## 14. When to add a new layout family

Only if the spec cannot be expressed with existing families:

1. Add `RENDERERS.myLayout` in `cv-editable-multipage.js`
2. Mirror in `renderMultipageCv` in `cv-multipage-core.js`
3. Document in `RESUME_TEMPLATES` description
4. Add one reference template number in `LAYOUT`

Otherwise, change **tokens + CSS** only — fastest path, least regression risk.
