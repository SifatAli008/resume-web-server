import { getResumeEmbedMode, parseTemplateIdFromPath, applyEmbedHtmlAttrs } from "./resume-embed.js";
import { resolveInitialDraft } from "./resolve-initial-draft.js";
import { mountResumeApp } from "./render-resume-app.js";
import { mountResumeAppEmbed } from "./mount-resume-app-embed.js";
import { mountResumePdfEmbed, mountResumeThumbEmbed } from "./mount-resume-pdf-embed.js";
import { saveResumeDraft } from "./draft.js";

/**
 * Single entry for /resume and /resume/:templateId (builder + embed modes).
 */
export function mountResumeView(app) {
  const params = new URLSearchParams(window.location.search);
  const pathTemplateId = parseTemplateIdFromPath(window.location.pathname);
  const embedMode = getResumeEmbedMode(params);
  const templateQuery = params.get("template");

  applyEmbedHtmlAttrs(embedMode);

  const draft = resolveInitialDraft({
    params,
    pathTemplateId,
    embedMode,
    templateQuery,
  });

  if (embedMode === "pdf") {
    document.title = "Resume PDF · Resume Web Server";
    mountResumePdfEmbed(app, draft);
    return;
  }

  if (embedMode === "thumb") {
    document.title = "Resume · Resume Web Server";
    mountResumeThumbEmbed(app, draft);
    return;
  }

  if (embedMode === "app") {
    document.title = "Resume · App embed";
    mountResumeAppEmbed(app, draft);
    return;
  }

  document.title = "Resume builder · Resume Web Server";
  void mountResumeApp(app, { initialDraft: draft, pathTemplateId, persistDraft: true });
}

/** Persist template from path/query on first builder load. */
export function bootstrapResumeDraftFromUrl() {
  const params = new URLSearchParams(window.location.search);
  if (getResumeEmbedMode(params)) return;
  const pathTemplateId = parseTemplateIdFromPath(window.location.pathname);
  const templateQuery = params.get("template");
  if (!pathTemplateId && !templateQuery && !params.get("draft")) return;
  const draft = resolveInitialDraft({
    params,
    pathTemplateId,
    embedMode: null,
    templateQuery,
  });
  saveResumeDraft(draft);
}
