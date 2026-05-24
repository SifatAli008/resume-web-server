# Resume Web Server

Local-first **resume builder**: draft in the browser and export with your system print dialog (Save as PDF).

**Full system workflow (onboarding, architecture, AI prompt):** see [RESUME-WORKFLOW.md](./RESUME-WORKFLOW.md).

## What runs by default

The app you start with `npm run dev` is the **vanilla** single-page app under `vanilla/`, not the experimental `src/` tree (that folder is not wired in this package’s scripts).

## Features

- **Resume builder** (`/resume`, `/resume/resume_01` … `resume_20`): **20 Resume V2 templates** (React + print CSS). Legacy `resume_fluvo_N` URLs still resolve. **Print → Save as PDF** in the browser.
- **Draft in URL:** `?draft=<base64url-json>` for sharing or server render.
- **API:** `POST /render/resume/{templateId}/static` (HTML) and `POST /render/resume/{templateId}/pdf` (Puppeteer A4 PDF).
- **Embeds:** `?embed=app` (mobile WebView), `embed=thumb`, `embed=pdf` (server capture).

See [RESUME-WORKFLOW.md](./RESUME-WORKFLOW.md) for full architecture and [PROMPT.md](./PROMPT.md) for the per-template Define / Improve / Polish playbook.

## Tech stack

- Node HTTP static server: `vanilla/server.js`
- UI: vanilla ES modules + Tailwind CSS v4 (CLI build)

## Getting started

1. Install dependencies: `npm install`
2. Build assets: `npm run build` (Tailwind + Resume V2 React bundles)
3. Start the server: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000) — use **Resume builder** or open `/resume` directly.

## Scripts

- `npm run dev` / `npm start` — run `vanilla/server.js` (default port `3000`, override with `PORT`).
- `npm run build` — Tailwind + `npm run build:resume-v2` (SSR/client bundles → `vanilla/dist/`).
- `npm run build:resume-v2` — compile React templates → `vanilla/dist/resume-v2-*.mjs` + `vanilla/app/resume-v2-print.css`.
- `npm run test:resume` — build V2 + static smoke + all 20 template SSR checks.
- `npm run build:css` — same as the Tailwind step in `build`.
- `npm run test:static-render` — smoke test static HTML renderer.

## API (local or Vercel)

```bash
curl -X POST http://localhost:3000/render/resume/resume_01/static \
  -H "Content-Type: application/json" \
  -d @vanilla/fixtures/pdf/resume-sample.json

curl -X POST http://localhost:3000/render/resume/resume_01/pdf \
  -H "Content-Type: application/json" \
  -d @vanilla/fixtures/pdf/resume-sample.json \
  --output resume.pdf
```

Set `RESUME_WEB_BASE_URL` in production when generating PDFs (Puppeteer must reach your deployed `/resume/...?embed=pdf` URL).

## License

MIT
