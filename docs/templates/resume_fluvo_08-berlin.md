# DEFINE — resume_fluvo_8 (Berlin)

| Field | Value |
|-------|--------|
| **Template ID** | `resume_fluvo_8` |
| **Layout** | `bands` |
| **Header** | `standard` |
| **Section** | `band` (emerald ribbon section headers) |
| **fontClass** | `cv-font-berlin` |
| **skillsStyle** | `tags-band` |
| **linksZone** | `header` |
| **photoDefault** | no |

## Colors

- Primary: emerald (`text-emerald-950`, `bg-emerald-700` bands)
- Page: outline emerald (`outline-emerald-300`)
- Icons: `text-emerald-700`

## Zones

| Zone | Page | Placement |
|------|------|-----------|
| Header + contact + links | 1 | Main |
| Summary | 1 | Main |
| Skills | 1 | Main (tags-band under ribbon) |
| Experience ×2 | 1 | Main |
| Experience cont. + Projects | 2 | Main |
| Education, certs, languages | 3 | Main |

## ResumeDraft

All fields via shared `cv-headers.js`, `cv-section-blocks.js`, `readEditableMultipageDraft`.

## Polish tests

- `GET /resume/resume_fluvo_8`
- `POST /render/resume/resume_fluvo_8/static` + `resume-sample.json`
- `npm run test:resume-checklist`
