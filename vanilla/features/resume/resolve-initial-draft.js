import { DEFAULT_RESUME_TEMPLATE_ID, isKnownResumeTemplateId, normalizeTemplateId } from "./constants.js";
import { decodeResumeDraftBase64Url } from "./draft-url.js";
import { defaultResumeDraft, loadResumeDraft, normalizeResumeDraft } from "./draft.js";

function draftFromScriptTag() {
  const el = document.getElementById("__resume_draft__");
  if (!el?.textContent?.trim()) return null;
  try {
    return JSON.parse(el.textContent);
  } catch {
    return null;
  }
}

function draftFromWindow() {
  if (globalThis.__resumeDraft && typeof globalThis.__resumeDraft === "object") {
    return globalThis.__resumeDraft;
  }
  return null;
}

function draftFromQuery(params) {
  const raw = params.get("draft");
  if (!raw) return null;
  return decodeResumeDraftBase64Url(raw);
}

/**
 * Resolve draft for current page (builder vs embed).
 * @param {{ params: URLSearchParams, pathTemplateId: string|null, embedMode: string|null, templateQuery: string|null }} opts
 */
export function resolveInitialDraft({ params, pathTemplateId, embedMode, templateQuery }) {
  const fromEmbed =
    draftFromScriptTag() || draftFromWindow() || draftFromQuery(params);

  let draft;
  if (fromEmbed) {
    draft = normalizeResumeDraft(fromEmbed);
  } else if (embedMode) {
    draft = defaultResumeDraft();
  } else {
    draft = loadResumeDraft();
  }

  const pathTpl = pathTemplateId ? normalizeTemplateId(pathTemplateId) : null;
  const queryTpl = templateQuery ? normalizeTemplateId(templateQuery) : null;

  const tpl =
    (pathTpl && isKnownResumeTemplateId(pathTpl) && pathTpl) ||
    (queryTpl && isKnownResumeTemplateId(queryTpl) && queryTpl) ||
    (isKnownResumeTemplateId(draft.templateId) ? normalizeTemplateId(draft.templateId) : DEFAULT_RESUME_TEMPLATE_ID);

  return normalizeResumeDraft({ ...draft, templateId: tpl });
}
