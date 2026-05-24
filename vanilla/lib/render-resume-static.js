import { normalizeResumeDraft } from "../features/resume/draft.js";
import { encodeResumeDraftBase64Url } from "../features/resume/draft-url.js";
import { normalizeTemplateId } from "../features/resume/constants.js";
import { preloadSsr, renderResumeV2StaticHTMLSync as v2HtmlSync } from "./render-resume-v2-static.js";

let ssrReady = false;

async function ensureSsr() {
  if (!ssrReady) {
    await preloadSsr();
    ssrReady = true;
  }
}

/**
 * Full HTML document for email / static preview (Resume V2 React SSR).
 */
export async function renderResumeStaticHTML(templateId, rawDraft, { baseUrl = "" } = {}) {
  await ensureSsr();
  const id = normalizeTemplateId(templateId);
  const draft = normalizeResumeDraft({ ...rawDraft, templateId: id });
  return v2HtmlSync(id, draft, { baseUrl });
}

export function resumePdfCaptureUrl(baseUrl, templateId, draft, { invoiceShell = false } = {}) {
  const encoded = encodeResumeDraftBase64Url(
    normalizeResumeDraft({ ...draft, templateId: normalizeTemplateId(templateId) }),
  );
  const id = normalizeTemplateId(templateId);
  const inv = invoiceShell ? "&invoice=1" : "";
  return `${baseUrl.replace(/\/$/, "")}/resume/${id}?embed=pdf&draft=${encoded}${inv}`;
}
