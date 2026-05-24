import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { normalizeResumeDraft } from "../features/resume/draft.js";
import { encodeResumeDraftBase64Url } from "../features/resume/draft-url.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
let ssrModule;

async function loadSsr() {
  if (!ssrModule) {
    const p = path.join(__dirname, "../dist/resume-v2-ssr.mjs");
    ssrModule = await import(pathToFileURL(p).href);
  }
  return ssrModule;
}

function mapTemplateId(templateId) {
  const fluvo = /^resume_fluvo_(\d+)$/.exec(String(templateId || ""));
  if (fluvo) return `resume_${fluvo[1].padStart(2, "0")}`;
  return String(templateId || "resume_01");
}

export async function renderResumeV2StaticHTML(templateId, rawDraft, { baseUrl = "" } = {}) {
  const id = mapTemplateId(templateId);
  const draft = normalizeResumeDraft({ ...rawDraft, templateId: id });
  const { renderResumeV2Markup } = await loadSsr();
  const body = renderResumeV2Markup(draft, { editable: false, useSampleFill: true });
  const origin = baseUrl ? String(baseUrl).replace(/\/$/, "") : "";

  const css = origin
    ? `<link rel="stylesheet" href="${origin}/app/resume-v2-print.css" />`
    : `<link rel="stylesheet" href="/app/resume-v2-print.css" />`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Resume — ${id}</title>
  ${css}
</head>
<body class="bg-white text-zinc-900 antialiased">
  ${body}
  <div id="pdf-ready" data-ready="1" hidden aria-hidden="true"></div>
</body>
</html>`;
}

/** Sync wrapper when SSR bundle already loaded. */
export function renderResumeV2StaticHTMLSync(templateId, rawDraft, opts) {
  const id = mapTemplateId(templateId);
  const draft = normalizeResumeDraft({ ...rawDraft, templateId: id });
  if (!ssrModule) throw new Error("V2 SSR not loaded; call renderResumeV2StaticHTML or preloadSsr()");
  const body = ssrModule.renderResumeV2Markup(draft, { editable: false, useSampleFill: true });
  const origin = opts?.baseUrl ? String(opts.baseUrl).replace(/\/$/, "") : "";
  const css = origin
    ? `<link rel="stylesheet" href="${origin}/app/resume-v2-print.css" />`
    : `<link rel="stylesheet" href="/app/resume-v2-print.css" />`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Resume — ${id}</title>
  ${css}
</head>
<body class="bg-white text-zinc-900 antialiased">
  ${body}
  <div id="pdf-ready" data-ready="1" hidden aria-hidden="true"></div>
</body>
</html>`;
}

export async function preloadSsr() {
  await loadSsr();
}

export function resumeV2PdfCaptureUrl(baseUrl, templateId, draft) {
  const encoded = encodeResumeDraftBase64Url(
    normalizeResumeDraft({ ...draft, templateId: mapTemplateId(templateId) }),
  );
  const id = mapTemplateId(templateId);
  return `${baseUrl.replace(/\/$/, "")}/resume/${id}?embed=pdf&draft=${encoded}`;
}
