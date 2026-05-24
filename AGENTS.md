# Resume Web Server — agent rules

Read **[RESUME-WORKFLOW.md](./RESUME-WORKFLOW.md)** before changing resume templates, draft shape, or print layout. For new or redesigned templates, follow **[PROMPT.md](./PROMPT.md)** (Define → Improve → Polish).

**Primary app:** `vanilla/` (not `src/`). Run `npm run dev` and `npm run build:css` after Tailwind class changes.

**Templates:** `resume_fluvo_1` … `resume_fluvo_20` in `vanilla/features/resume/constants.js`. Live editor: `cv-editable-multipage.js`. Static HTML: `cv-multipage-core.js`. Per-template tokens: `cv-template-tokens.js`.

**APIs:** `POST /render/resume/:templateId/static` and `.../pdf`. **Embeds:** `embed=app|thumb|pdf`. **Draft URL:** `?draft=base64url` via `draft-url.js`.
