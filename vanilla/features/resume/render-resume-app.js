import {
  isKnownResumeTemplateId,
  normalizeTemplateId,
} from "./constants.js";
import { loadResumeDraft, normalizeResumeDraft, saveResumeDraft } from "./draft.js";
import { applyTemplatePhotoDefaults } from "./templates/cv-defaults.js";
import { mountResumeEditablePreview } from "./editable-resume-preview.js";

export async function mountResumeApp(app, options = {}) {
  const { initialDraft, pathTemplateId, persistDraft = true } = options;
  const params = new URLSearchParams(window.location.search);
  const fromUrl = params.get("template") || pathTemplateId;
  const normalizedFromUrl = fromUrl ? normalizeTemplateId(fromUrl) : null;

  let draft = initialDraft
    ? normalizeResumeDraft(initialDraft)
    : normalizeResumeDraft(loadResumeDraft());

  if (normalizedFromUrl && isKnownResumeTemplateId(normalizedFromUrl)) {
    draft = normalizeResumeDraft({ ...draft, templateId: normalizedFromUrl });
    if (persistDraft) saveResumeDraft(draft);
  }
  draft = applyTemplatePhotoDefaults(draft, draft.templateId, "load");

  const root = document.createElement("div");
  root.className = "resume-builder-root";
  root.innerHTML = `
    <div id="rf-preview-shell" class="rf-preview-shell">
      <div id="rf-preview"></div>
    </div>
  `;
  app.appendChild(root);

  const previewEl = root.querySelector("#rf-preview");

  await mountResumeEditablePreview(previewEl, {
    getDraft: () => draft,
    onDraftChange: (next) => {
      draft = normalizeResumeDraft(next);
      if (persistDraft) saveResumeDraft(draft);
    },
  });

  syncTemplateUrl();

  function syncTemplateUrl() {
    const id = draft.templateId;
    const url = new URL(window.location.href);
    if (isKnownResumeTemplateId(id)) {
      url.pathname = `/resume/${id}`;
      url.searchParams.delete("template");
    } else {
      url.pathname = "/resume";
      url.searchParams.delete("template");
    }
    window.history.replaceState({}, "", url.pathname + url.search + url.hash);
  }
}
