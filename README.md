# Resume Web Server

Local-first **resume builder**: draft in the browser and export with your system print dialog (Save as PDF).

## What runs by default

The app you start with `npm run dev` is the **vanilla** single-page app under `vanilla/`, not the experimental `src/` tree (that folder is not wired in this package’s scripts).

## Features

- **Resume builder** (`/resume`): **20 industry-style templates** (`resume_fluvo_1`–`20`): ruled section headers, date-aligned experience/education grids, skill **tags** and **proficiency bars** (from skills text, one entry per line), dark sidebars, gold split columns, green band headers, black contact banner layouts, and formal serif options. See `vanilla/features/resume/templates/resume-professional-parts.js`. Toolbar or `/resume?template=resume_fluvo_N`. Legacy ids still migrate. **Print → Save as PDF**.

## Tech stack

- Node HTTP static server: `vanilla/server.js`
- UI: vanilla ES modules + Tailwind CSS v4 (CLI build)

## Getting started

1. Install dependencies: `npm install`
2. Build CSS (required after class changes in new files): `npm run build:css`
3. Start the server: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000) — use **Resume builder** or open `/resume` directly.

## Scripts

- `npm run dev` / `npm start` — run `vanilla/server.js` (default port `3000`, override with `PORT`).
- `npm run build` — compile Tailwind (`vanilla/app/tailwind.input.css` → `vanilla/app/tailwind.generated.css`).
- `npm run build:css` — same as the Tailwind step in `build`.

## License

MIT
