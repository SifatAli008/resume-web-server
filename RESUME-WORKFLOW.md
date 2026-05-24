# Resume Web Server — Full System Workflow (Text Reference)

Use this as documentation or as a **text-based prompt** when onboarding, designing features, or asking an AI to work in this repo.

**Per-template playbook (Define · Improve · Polish):** see **[PROMPT.md](./PROMPT.md)**.

---

## 1. What this repository is

**`resume-web-server`** is a **resume / CV builder** delivered as a lightweight static web app.

| Surface | Path | Purpose |
|--------|------|---------|
| **Vanilla app** (primary, wired in `package.json`) | `vanilla/` | Resume editor, 20 templates, local draft, browser print → PDF |
| **Experimental Next.js tree** (not started by npm scripts) | `src/app/` | Auth scaffold (`login`, `signup`); not connected to the resume builder |

Package name: `apps_web_server`. Stack: **Node HTTP static server**, **vanilla ES modules**, **Tailwind CSS v4** (CLI build), **Puppeteer** + **@sparticuz/chromium-min** for server PDF on Vercel/local.

---

## 2. High-level system flow

```
Browser (or embedded WebView)
        │
        ├─► GET /  → Home → link to Resume builder
        │
        ├─► GET /resume/resume_fluvo_N?draft=<base64url>&embed=app|thumb|pdf
        │         └── mountResumeView() → builder | app embed | static PDF shell
        │
        ├─► POST /render/resume/{templateId}/static  (JSON draft → HTML)
        │
        └─► POST /render/resume/{templateId}/pdf     (JSON draft → A4 PDF bytes)
                  └── Puppeteer opens embed=pdf URL → #pdf-ready → page.pdf()
```

**Core idea:** Resume **design** is HTML generated from JavaScript modules under `vanilla/features/resume/`. **Data** is a JSON **draft** persisted in `localStorage` (and optionally seeded from `?template=`). **Rendering** is always in-browser: editable multipage HTML for the builder; the same layout engine can produce read-only HTML via `renderCvTemplate()` for previews.

---

## 3. How to run

```bash
npm install
npm run build:css   # required after new Tailwind classes in JS/CSS
npm run dev         # http://localhost:3000 (vanilla/server.js)
```

**Routes (all served `index.html` for SPA paths):**

| Route | Behavior |
|-------|----------|
| `/` | Home — link to Resume builder |
| `/resume` | Resume builder (default template from draft) |
| `/resume/resume_fluvo_4` | Builder with template in path |
| `/resume?template=resume_fluvo_4` | Builder (query alias) |
| `/resume/resume_fluvo_1?draft=<base64url>` | Hydrate from encoded JSON |
| `/resume/resume_fluvo_1?embed=pdf&draft=...` | Puppeteer capture shell |
| `/resume/resume_fluvo_1?embed=app&draft=...` | Mobile WebView embed |
| `POST /render/resume/resume_fluvo_1/static` | Server HTML document |
| `POST /render/resume/resume_fluvo_1/pdf` | Server PDF bytes |

**Deploy (Vercel):** `vercel.json` rewrites `/`, `/resume`, `/resume/*` → `vanilla/index.html`; `outputDirectory` is `vanilla`.

---

## 4. View structure (vanilla SPA)

```
vanilla/
├── index.html              # Shell: Tailwind + resume-print.css
├── server.js               # Static file server + SPA fallback
└── app/
    ├── main.js             # Router: / vs /resume
    ├── tailwind.input.css
    ├── tailwind.generated.css
    └── resume-print.css    # A4 pages, 20 font families, per-template accents

vanilla/features/resume/
├── mount-resume-view.js    # Entry: builder vs embed=app|thumb|pdf
├── render-resume-app.js    # Toolbar, template select, print, reset
├── mount-resume-pdf-embed.js / mount-resume-app-embed.js
├── draft-url.js            # base64url ?draft= encode/decode
├── resolve-initial-draft.js
├── resume-embed.js         # embed modes, viewport fit, pdf-ready, FluvoResumeApp
├── editable-resume-preview.js  # Input listeners, remount, add/remove rows
├── draft.js                # ResumeDraft shape, localStorage v3
├── constants.js            # Template registry (resume_fluvo_1 … 20)
├── resume-template-renderer.js   # Static HTML entry (per fluvo_N)
├── resume-icons.js         # Inline SVG icons
vanilla/lib/
├── parse-resume-render-request.js
├── render-resume-static.js
├── render-resume-pdf.js
├── resume-render-handlers.js
└── resolve-resume-web-base-url.js
api/
├── render-resume-pdf.js    # Vercel serverless
└── render-resume-static.js
└── templates/
    ├── cv-editable-multipage.js  # **Primary** live editor HTML
    ├── cv-multipage-core.js      # **Static** read-only 3-page renderer
    ├── cv-template-ui.js         # Layout + merge tokens
    ├── cv-template-tokens.js     # Per-template font, color, icons, skillsStyle
    ├── cv-shared-ui.js           # sec(), photo, pageShell
    ├── cv-skills-ui.js           # 20 skill visual modes
    ├── cv-links-ui.js            # Links editor + display (dedupe fix)
    ├── cv-defaults.js            # Photo defaults per template
    ├── cv-placeholders.js        # International placeholder copy
    └── resume_fluvo_{N}/template.js  # Thin wrapper → renderCvTemplate(draft, N)
```

**Router (`app/main.js`):**

- `path === /resume` → `mountResumeApp()`
- else → home card linking to `/resume`

**Builder shell (`render-resume-app.js`):**

- Template `<select>` from `RESUME_TEMPLATES`
- **Print / Save PDF** → `window.print()`
- **Reset** → `defaultResumeDraft()` + clear storage
- Syncs `?template=` in URL when template changes

**Renderer chain (live editor):**

```
mountResumeApp
  └── mountResumeEditablePreview
        └── buildEditableMultipageCv(draft, templateId)
              └── layout renderer (classic | sidebar | split | …)
                    └── cv-shared-ui (headers, photo, pages)
                    └── cv-skills-ui / cv-links-ui
```

**Print capture root:** `#resume-print-root` on `<article class="cv-document cv-tpl-{N} cv-font-*">`. Each page: `<section class="cv-page">`.

---

## 5. Template design architecture

### Registry

`vanilla/features/resume/constants.js`:

- `RESUME_TEMPLATE_IDS` — `resume_fluvo_1` … `resume_fluvo_20`
- `isKnownResumeTemplateId(id)` — validation
- `RESUME_TEMPLATES` — labels + descriptions from `CV_THEMES`

`vanilla/features/resume/templates/cv-multipage-core.js` — `CV_THEMES[1..20]`: layout family, accent key, optional legacy sidebar hints.

### Per-template identity (`cv-template-tokens.js`)

Each template **1–20** has a unique bundle:

| Token | Example use |
|-------|-------------|
| `fontClass` | `cv-font-geneva`, `cv-font-barcelona` (mono) |
| `h2`, `line`, `ribbon`, `page` | Tailwind accent classes |
| `sidebar` / `rail` | Dark gradients, split columns |
| `iconContact`, `iconLink`, `iconSection` | Colored SVG icons |
| `photoFrame` | `rounded-full`, `rounded-none`, etc. |
| `skillsStyle` | pills, bars, grid, rose-tiles, … (see `cv-skills-ui.js`) |

Merged in `getTemplateUi(n)` (`cv-template-ui.js`) with **layout** metadata: `classic`, `sidebar-left`, `split-right`, `ribbon`, `timeline`, `magazine`, `bands`, `banner`, `serif`, `swiss`, `academic`.

### Template registry (single entry point)

All 20 templates are registered in **`resume-template-renderer.js`** → `renderCvTemplate(draft, n)` for static/PDF and **`buildEditableMultipageCv(draft, templateId)`** for the editor. There are no per-template `resume_fluvo_N/template.js` folders.

### Shared building blocks

| Module | Role |
|--------|------|
| `cv-shared-ui.js` | Section headers with icons (`sec()`), photo slot, A4 `pageShell`, photo toggle bar |
| `cv-skills-ui.js` | Parse skills text → chips/bars/grid; 20 visual styles; smart per-skill icons |
| `cv-links-ui.js` | Single `[data-links-editor]` on page 1; `linksDisplay` on repeated sidebars |
| `cv-placeholders.js` | ATS-friendly placeholder strings (`CV_PH`) |
| `cv-design-tokens.js` | Spacing scale (`CV_SPACE`), typography helpers |
| `cv-invoice-render.js` | Invoice-style dedicated pages (`/resume/resume_fluvo_N`) |

### Print CSS (`vanilla/app/resume-print.css`)

- `@page { size: A4 }`
- `.cv-page` — 210mm × 297mm, print page breaks
- `.cv-font-*` — 20 distinct font stacks
- `.cv-tpl-N` — per-template borders, sidebars, backgrounds
- Hide editor chrome: `.print:hidden`, textarea skills hidden when printing (show `.cv-skills-preview`)

---

## 6. Draft data model (contract)

Defined in `vanilla/features/resume/draft.js`. Storage key: **`resume-web-server:draft:v3`** (migrates from v1/v2).

**Top-level fields:**

| Field | Type | Notes |
|-------|------|--------|
| `templateId` | string | `resume_fluvo_1` … `resume_fluvo_20` |
| `fullName`, `title`, `email`, `phone`, `location` | string | Header / contact |
| `showPhoto`, `photoUrl` | bool, string | Toggle + URL; defaults from `cv-defaults.js` on template switch |
| `links` | `{ label, url }[]` | Max 6, deduped |
| `summary` | string | Professional summary |
| `experience` | job[] | `company`, `role`, `start`, `end`, `bullets[]` |
| `projects` | project[] | `name`, `context`, dates, `bullets[]` |
| `education` | edu[] | `school`, `degree`, `start`, `end` |
| `skills` | string | Multiline; parsed into visual chips per template |
| `certifications`, `languages` | string | Multiline blocks |

**How draft reaches the UI:**

1. **`loadResumeDraft()`** from `localStorage` on builder mount
2. **`?draft=<base64url>`** — `decodeResumeDraftBase64Url()` (`draft-url.js`)
3. **`#__resume_draft__`** script JSON or **`window.__resumeDraft`**
4. **`CustomEvent` `resumeData`** with `detail: ResumeDraft` (Puppeteer / host app)
5. **`/resume/resume_fluvo_N`** path or **`?template=`** sets `templateId`
6. Every `input` / checkbox → `readEditableMultipageDraft()` → `saveResumeDraft()`
7. **Reset** → `defaultResumeDraft()`

**Legacy template IDs** (auto-mapped): `resume_classic` → `resume_fluvo_1`, `resume_sidebar` → `resume_fluvo_2`, `resume_minimal` → `resume_fluvo_3`.

---

## 7. Three-page content distribution

Both `cv-editable-multipage.js` and `cv-multipage-core.js` use the same spread:

| Page | Typical content |
|------|-----------------|
| **1** | Header, summary, skills (main column), experience (first 2 roles) |
| **2** | Experience continued, projects & research |
| **3** | Education, certifications, languages (+ skills on split layouts if needed) |

**Layout families** change *where* blocks sit (sidebar vs rail vs full width), not the draft shape.

**Links rule:** Editable link inputs live only in **`[data-links-editor]`** on page 1. Sidebars/rails on pages 2–3 use **`linksDisplay`** (read-only) to avoid duplicate rows on save.

---

## 8. End-to-end workflows

### Workflow A — User builds a resume in the browser

1. Open `http://localhost:3000/resume`
2. `loadResumeDraft()` hydrates the form
3. `buildEditableMultipageCv()` renders 3 editable pages
4. User edits fields; skills textarea updates live preview via `refreshSkillsPreviews`
5. Draft auto-saves to `localStorage` on each change
6. **Print / Save PDF** → browser print dialog; `@page` A4; editor chrome hidden

### Workflow B — Switch template

1. User picks another template in `<select>`
2. `applyTemplatePhotoDefaults(draft, id, "switch")` may enable photo on photo-friendly templates
3. `editable.remount()` rebuilds HTML with new `getTemplateUi(n)` tokens
4. URL updates: `?template=resume_fluvo_N`

### Workflow C — Static HTML (read-only, no inputs)

1. Import `renderResumeHtml(templateId, draft)` from `resume-template-renderer.js`
2. Or `renderCvTemplate(draft, n)` from `cv-multipage-core.js`
3. Returns `<article id="resume-print-root">` with 3 pages, no toolbar — suitable for server-side HTML injection **if** you add an API later

### Workflow D — Mobile embed / server PDF

1. **Static HTML:** `POST /render/resume/resume_fluvo_1/static` with `{ "draft": { ... } }` → `renderResumeStaticHTML()` (no browser).
2. **Server PDF:** `POST /render/resume/resume_fluvo_1/pdf` → Puppeteer loads `/resume/resume_fluvo_1?embed=pdf&draft=...`, waits for `#resume-print-root` and `#pdf-ready[data-ready="1"]`, returns A4 PDF.
3. **App embed:** `/resume/{id}?embed=app&draft=...` → editable CV, `fitResumePreviewToViewport()`, `FluvoResumeApp` bridge.
4. **Thumbnail:** `embed=thumb` → read-only static render, no chrome.

Set **`RESUME_WEB_BASE_URL`** (or `INVOICE_WEB_BASE_URL`) in production so Puppeteer can reach the public app URL.

---

## 9. File map (mental model)

```
resume-web-server/
├── vanilla/                          # **Primary app**
│   ├── server.js
│   ├── index.html
│   ├── app/main.js, resume-print.css
│   └── features/resume/              # All resume logic
├── vercel.json                       # SPA rewrites → vanilla/
├── package.json                      # dev/start → vanilla/server.js
├── README.md                         # Quick start
├── RESUME-WORKFLOW.md                # This document
└── src/                              # Experimental Next (not in npm scripts)
    └── app/login, signup, page.tsx
```

---

## 10. Text-based prompt (copy/paste for AI or docs)

```
You are working on resume-web-server, a vanilla JS resume/CV builder with 20 templates (resume_fluvo_1 … resume_fluvo_20).

SYSTEM RULES:
- Template IDs must match vanilla/features/resume/constants.js (resume_fluvo_N).
- Primary UI path: /resume → render-resume-app.js → editable-resume-preview.js → buildEditableMultipageCv().
- Static HTML path: renderCvTemplate(draft, n) in cv-multipage-core.js (or resume_fluvo_N/template.js).
- Draft is ResumeDraft JSON in localStorage key resume-web-server:draft:v3.
- Draft fields: fullName, title, contact, links[], summary, experience[], projects[], education[], skills (string), certifications, languages, showPhoto, photoUrl.
- Visual identity per template: cv-template-tokens.js + getTemplateUi(n) in cv-template-ui.js.
- Section headers use sec() with icons from resume-icons.js (SECTION_ICON_BY_TITLE).
- Skills: cv-skills-ui.js — one skillsStyle per template; textarea hidden on print, .cv-skills-preview shown.
- Links: single [data-links-editor] on page 1; linksDisplay on repeated sidebars (no duplicate inputs).
- Photo: photoEditorBar + photoSlot; cv-has-photo / cv-no-photo on article; applyTemplatePhotoDefaults on load vs switch.
- Print: #resume-print-root, .cv-page sections, resume-print.css (@page A4, cv-font-*, cv-tpl-*).
- Run npm run build:css after adding Tailwind classes in JS.
- npm run dev serves vanilla/server.js on PORT (default 3000).
- Server PDF: POST /render/resume/:templateId/pdf; static: POST .../static.
- Draft URL: encodeResumeDraftBase64Url / ?draft= on /resume/:templateId.
- embed=pdf uses renderCvTemplate (no inputs); #pdf-ready marks capture readiness.

TEMPLATE DESIGN:
- Each resume_fluvo_N/template.js calls renderCvTemplate(draft, N).
- Layout family from CV_THEMES + cv-template-ui LAYOUT (classic, sidebar-left, split-right, …).
- 20 unique: fontClass, accent colors, icon colors, photoFrame, skillsStyle.
- Do not break draft backward compatibility; normalize in draft.js.

WHEN ADDING A FEATURE:
- Prefer extending cv-editable-multipage.js + cv-multipage-core.js together.
- Keep class strings static for Tailwind JIT (no dynamic class interpolation).
- Test print layout and template switch.
- Grep for motion.div typos — use plain div only.
```

---

## 11. Quick reference URLs

| Action | URL / method |
|--------|----------------|
| Home | `GET /` |
| Resume builder | `GET /resume` or `GET /resume/resume_fluvo_4` |
| Draft in URL | `GET /resume/resume_fluvo_4?draft=<base64url>` |
| App embed | `GET /resume/resume_fluvo_4?embed=app&draft=...` |
| PDF capture page | `GET /resume/resume_fluvo_4?embed=pdf&draft=...` |
| Server PDF | `POST /render/resume/resume_fluvo_4/pdf` + JSON |
| Server HTML | `POST /render/resume/resume_fluvo_4/static` + JSON |
| Browser PDF | **Print** button → Save as PDF |
| Local draft | `localStorage['resume-web-server:draft:v3']` |

---

## 12. Environment variables

| Variable | Purpose |
|----------|---------|
| `PORT` | HTTP port for `vanilla/server.js` (default `3000`) |
| `RESUME_WEB_BASE_URL` | Public base URL Puppeteer uses for `/resume/...?embed=pdf` |
| `VERCEL_URL` / `VERCEL_PROJECT_PRODUCTION_URL` | Auto-resolved base URL on Vercel |

---

## 13. Sample draft JSON

```json
{
  "templateId": "resume_fluvo_1",
  "fullName": "Alex Morgan",
  "title": "Senior Software Engineer",
  "email": "alex.morgan@example.com",
  "phone": "+1 555 010 2200",
  "location": "Berlin, Germany",
  "showPhoto": false,
  "photoUrl": "",
  "links": [
    { "label": "LinkedIn", "url": "https://linkedin.com/in/alexmorgan" },
    { "label": "GitHub", "url": "https://github.com/alexmorgan" }
  ],
  "summary": "Full-stack engineer with 10+ years building scalable web platforms and leading cross-functional delivery.",
  "skills": "TypeScript · React · Node.js · PostgreSQL · AWS · Kubernetes\nLeadership: mentoring, code review, stakeholder communication",
  "experience": [
    {
      "company": "Northwind Systems",
      "role": "Staff Engineer",
      "start": "2021-03",
      "end": "Present",
      "bullets": [
        "Led migration to event-driven architecture serving 2M daily active users.",
        "Reduced p95 API latency by 40% through query tuning and caching."
      ]
    }
  ],
  "projects": [
    {
      "name": "Open Metrics Kit",
      "context": "Open-source observability SDK",
      "start": "2023",
      "end": "2024",
      "bullets": ["1.2k GitHub stars; adopted by 3 partner teams."]
    }
  ],
  "education": [
    {
      "school": "Technical University of Munich",
      "degree": "M.Sc. Computer Science",
      "start": "2012",
      "end": "2014"
    }
  ],
  "certifications": "AWS Solutions Architect – Professional (2024)",
  "languages": "English (fluent) · German (professional) · French (basic)"
}
```

---

## 14. Template quick map (1–20)

| # | Name | Layout | Accent / notes |
|---|------|--------|----------------|
| 1 | Geneva | classic | Blue corporate |
| 2 | Cascade | sidebar-left | Emerald dark sidebar |
| 3 | Zurich | split-right | Amber rail |
| 4 | Oxford | ribbon | Indigo serif |
| 5 | Kyoto | timeline | Violet |
| 6 | Singapore | magazine | Purple |
| 7 | Oslo | sidebar-left | Teal Nordic |
| 8 | Berlin | bands | Emerald engineering |
| 9 | Manhattan | banner | Zinc executive |
| 10 | Sydney | sidebar-right | Sky / navy |
| 11 | Montreal | split-right | Violet serif |
| 12 | Cambridge | serif | Slate formal |
| 13 | Milan | classic | Rose editorial |
| 14 | Stockholm | sidebar-left | Cool slate |
| 15 | Toronto | split-right | Cyan |
| 16 | Barcelona | swiss | Orange mono |
| 17 | Melbourne | academic | Teal serif |
| 18 | Paris | magazine | Fuchsia |
| 19 | Vienna | serif | Zinc centered |
| 20 | Lisbon | sidebar-left | Rose wine sidebar |

---

## 15. Invoice → Resume concept mapping

If you know the old **invoice-web-server** doc, use this mapping:

| Invoice | Resume (this repo) |
|---------|-------------------|
| `invoice_fluvo_N` | `resume_fluvo_N` |
| `InvoiceDraft` | `ResumeDraft` (`draft.js`) |
| `useInvoiceDraft()` | `loadResumeDraft()` / `readEditableMultipageDraft()` |
| `/invoice/[templateId]` | `/resume?template=resume_fluvo_N` |
| `InvoiceTemplateRenderer` | `buildEditableMultipageCv` + `renderCvTemplate` |
| `POST .../pdf` (Puppeteer) | `POST /render/resume/:id/pdf` |
| `POST .../static` | `POST /render/resume/:id/static` |
| `embed=app` / Flutter bridge | `?embed=app`, `FluvoResumeApp.postMessage` |
| `data-invoice-pdf-root` | `#resume-print-root` |
| Line items / tax | Experience, projects, skills, education |
