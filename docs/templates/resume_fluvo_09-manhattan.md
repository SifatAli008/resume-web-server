# DEFINE — resume_fluvo_9 (Manhattan)

| Field | Value |
|-------|--------|
| **Template ID** | `resume_fluvo_9` |
| **Layout** | `banner` |
| **Header** | `banner` (zinc contact strip + name block) |
| **Section** | `ruled` |
| **fontClass** | `cv-font-manhattan` |
| **skillsStyle** | `minimal-row` |
| **linksZone** | `header` |
| **photoDefault** | yes |

## Colors

- Banner strip: `bg-zinc-900`, white text, mail/phone/map icons
- Body: zinc executive neutrals
- Section rules: `text-zinc-900` / `bg-zinc-500`

## Zones

| Zone | Page | Placement |
|------|------|-----------|
| Banner contact strip | 1–3 | Top repeat per page |
| Name + title + photo | 1–3 | Below strip |
| Links (editor) | 1 | Main, once |
| Summary, experience | 1 | Main |
| Experience cont., projects | 2 | Main |
| Education, skills, certs, langs | 3 | Main |

## ResumeDraft

- Banner fields: `email`, `phone`, `location` in strip inputs
- `fullName`, `title` in header block
- Stress: `vanilla/fixtures/pdf/resume-long.json` (this template)

## Polish tests

- `GET /resume/resume_fluvo_9`
- `GET /resume/resume_fluvo_9?embed=pdf&draft=...`
- `POST /render/resume/resume_fluvo_9/pdf` + `resume-long.json`
