import {
  DEFAULT_RESUME_TEMPLATE_ID,
  RESUME_TEMPLATES,
  isKnownResumeTemplateId,
  normalizeTemplateId,
} from "./constants.js";
import { defaultResumeDraft, loadResumeDraft, normalizeResumeDraft, saveResumeDraft } from "./draft.js";
import { applyTemplatePhotoDefaults } from "./templates/cv-defaults.js";
import { escapeHtml } from "./escape-html.js";
import { mountResumeEditablePreview } from "./editable-resume-preview.js";

export async function mountResumeApp(app, options = {}) {
  const { initialDraft, pathTemplateId, persistDraft = true } = options;
  const params = new URLSearchParams(window.location.search);
  const fromUrl = params.get("template") || pathTemplateId;

  let draft = initialDraft
    ? normalizeResumeDraft(initialDraft)
    : normalizeResumeDraft(loadResumeDraft());

  if (fromUrl && isKnownResumeTemplateId(fromUrl)) {
    draft = normalizeResumeDraft({ ...draft, templateId: normalizeTemplateId(fromUrl) });
    if (persistDraft) saveResumeDraft(draft);
  }
  draft = applyTemplatePhotoDefaults(draft, draft.templateId, "load");

  const root = document.createElement("div");
  root.className = "mx-auto max-w-4xl px-4 pb-16 pt-6";
  root.innerHTML = `
    <div class="print:hidden mb-4 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-zinc-900">Resume builder</h1>
        <p class="mt-1 max-w-xl text-sm text-zinc-600">Edit your resume below, then print to PDF.</p>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <label class="sr-only" for="rf-template">Template</label>
        <select id="rf-template" class="max-h-60 min-w-[min(100%,18rem)] max-w-xs overflow-y-auto rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-800 shadow-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900/20">
          ${RESUME_TEMPLATES.map(
            (t) => `<option value="${escapeHtml(t.id)}">${escapeHtml(t.label)}</option>`,
          ).join("")}
        </select>
        <a href="/" class="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50">Home</a>
        <button type="button" id="resume-print-btn" class="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800">Print / Save PDF</button>
        <button type="button" id="resume-reset-btn" class="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50">Reset</button>
      </div>
    </div>
    <div id="rf-preview-shell" class="overflow-x-auto rounded-xl border border-zinc-200 bg-zinc-200/80 p-3 shadow-md sm:p-4 print:border-0 print:bg-white print:p-0 print:shadow-none">
      <div id="rf-preview" class="mx-auto max-w-[210mm]"></div>
    </div>
  `;
  app.appendChild(root);

  const previewEl = root.querySelector("#rf-preview");

  const editable = await mountResumeEditablePreview(previewEl, {
    getDraft: () => draft,
    onDraftChange: (next) => {
      draft = normalizeResumeDraft(next);
      if (persistDraft) saveResumeDraft(draft);
    },
  });

  const templateSelect = root.querySelector("#rf-template");
  if (templateSelect) {
    templateSelect.value = isKnownResumeTemplateId(draft.templateId) ? draft.templateId : DEFAULT_RESUME_TEMPLATE_ID;
    templateSelect.addEventListener("change", () => {
      const v = templateSelect.value;
      draft.templateId = isKnownResumeTemplateId(v) ? v : DEFAULT_RESUME_TEMPLATE_ID;
      draft = applyTemplatePhotoDefaults(draft, draft.templateId, "switch");
      saveResumeDraft(draft);
      editable.remount();
      syncTemplateUrl();
    });
  }

  function syncTemplateUrl() {
    const id = draft.templateId;
    const url = new URL(window.location.href);
    if (isKnownResumeTemplateId(id) && id !== DEFAULT_RESUME_TEMPLATE_ID) {
      url.pathname = `/resume/${id}`;
      url.searchParams.delete("template");
    } else {
      url.pathname = "/resume";
      url.searchParams.delete("template");
    }
    window.history.replaceState({}, "", url.pathname + url.search + url.hash);
  }

  syncTemplateUrl();

  root.querySelector("#resume-print-btn")?.addEventListener("click", () => window.print());
  root.querySelector("#resume-reset-btn")?.addEventListener("click", () => {
    if (!window.confirm("Clear your resume draft in this browser?")) return;
    draft = defaultResumeDraft();
    saveResumeDraft(draft);
    if (templateSelect) templateSelect.value = DEFAULT_RESUME_TEMPLATE_ID;
    editable.remount();
    syncTemplateUrl();
  });
}
