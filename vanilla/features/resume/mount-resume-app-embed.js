import { mountResumeEditablePreview } from "./editable-resume-preview.js";
import { encodeResumeDraftBase64Url } from "./draft-url.js";
import { applyTemplatePhotoDefaults } from "./templates/cv-defaults.js";
import {
  fitResumePreviewToViewport,
  lockEmbedViewport,
  postResumePdfToApp,
  scheduleEmbedFit,
} from "./resume-embed.js";
import { normalizeResumeDraft } from "./draft.js";

/** Flutter / mobile WebView: editable CV, viewport fit, optional PDF postMessage. */
export function mountResumeAppEmbed(app, initialDraft) {
  let draft = applyTemplatePhotoDefaults(normalizeResumeDraft(initialDraft), initialDraft.templateId, "load");

  lockEmbedViewport();
  document.body.style.overflow = "hidden";
  document.documentElement.style.overflow = "hidden";

  app.replaceChildren();
  const shell = document.createElement("div");
  shell.id = "rf-preview-shell";
  shell.className = "mx-auto overflow-x-hidden bg-white";
  shell.innerHTML = `<div id="rf-preview"></div>`;
  app.appendChild(shell);

  const previewEl = shell.querySelector("#rf-preview");

  const editable = mountResumeEditablePreview(previewEl, {
    getDraft: () => draft,
    setDraft: (fn) => {
      draft = fn(draft);
    },
    onPersist: () => {
      try {
        globalThis.__resumeDraft = draft;
      } catch {
        /* ignore */
      }
    },
    getTemplateId: () => draft.templateId,
  });

  const remountAndFit = () => {
    editable.remount();
    requestAnimationFrame(() => fitResumePreviewToViewport(shell));
  };

  remountAndFit();
  scheduleEmbedFit(() => fitResumePreviewToViewport(shell));

  window.addEventListener("resumeData", (e) => {
    const next = e?.detail;
    if (!next || typeof next !== "object") return;
    draft = applyTemplatePhotoDefaults(normalizeResumeDraft(next), next.templateId, "load");
    remountAndFit();
  });

  window.addEventListener("resize", () => fitResumePreviewToViewport(shell));

  /** Host can call window.FluvoResumeApp.requestPdf() */
  globalThis.FluvoResumeApp = {
    getDraft: () => draft,
    getDraftEncoded: () => encodeResumeDraftBase64Url(draft),
    requestPdf: () => {
      window.print();
      return false;
    },
    postPdfBase64: (b64, name) => postResumePdfToApp(b64, name),
  };
}
