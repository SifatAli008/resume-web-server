import {
  DEFAULT_RESUME_TEMPLATE_ID,
  RESUME_TEMPLATES,
  isKnownResumeTemplateId,
} from "./constants.js";
import { defaultResumeDraft, loadResumeDraft, normalizeResumeDraft, saveResumeDraft } from "./draft.js";
import { escapeHtml } from "./escape-html.js";
import { mountResumeEditablePreview } from "./editable-resume-preview.js";

export function mountResumeApp(app) {
  const params = new URLSearchParams(window.location.search);
  const fromUrl = params.get("template");
  let draft = normalizeResumeDraft(loadResumeDraft());
  if (fromUrl && isKnownResumeTemplateId(fromUrl)) {
    draft = normalizeResumeDraft({ ...draft, templateId: fromUrl });
    saveResumeDraft(draft);
  }

  const root = document.createElement("div");
  root.className = "mx-auto max-w-4xl px-4 pb-16 pt-6";
  root.innerHTML = `
    <div class="print:hidden mb-4 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-zinc-900">Resume builder</h1>
        <p class="mt-1 max-w-xl text-sm text-zinc-600">Edit directly in the layout below. Every template uses the same refined typography and surfaces. Changes save in this browser; use print to export PDF.</p>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <label class="sr-only" for="rf-template">Template</label>
        <select id="rf-template" class="max-h-60 min-w-[min(100%,18rem)] max-w-xs overflow-y-auto scrollbar-none rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-800 shadow-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900/20">
          ${RESUME_TEMPLATES.map(
            (t) =>
              `<option value="${escapeHtml(t.id)}">${escapeHtml(t.label)} — ${escapeHtml(t.description)}</option>`,
          ).join("")}
        </select>
        <a href="/" class="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50">Home</a>
        <button type="button" id="resume-print-btn" class="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800">Print / Save PDF</button>
        <button type="button" id="resume-reset-btn" class="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50">Reset</button>
      </div>
    </div>
    <div class="lg:sticky lg:top-6 lg:self-start">
      <p class="print:hidden mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">Template & edit</p>
      <div id="rf-preview-shell" class="overflow-x-hidden rounded-xl border border-zinc-200 bg-white p-4 shadow-md sm:p-6 print:border-0 print:shadow-none print:p-0">
        <div id="rf-preview"></div>
      </div>
    </div>
  `;
  app.appendChild(root);

  const previewEl = root.querySelector("#rf-preview");

  function setDraft(fn) {
    draft = fn(draft);
  }

  const editable = mountResumeEditablePreview(previewEl, {
    getDraft: () => draft,
    setDraft,
    onPersist: () => saveResumeDraft(draft),
    getTemplateId: () => draft.templateId,
  });

  const templateSelect = root.querySelector("#rf-template");
  if (templateSelect) {
    templateSelect.value = isKnownResumeTemplateId(draft.templateId) ? draft.templateId : DEFAULT_RESUME_TEMPLATE_ID;
    templateSelect.addEventListener("change", () => {
      const v = templateSelect.value;
      draft.templateId = isKnownResumeTemplateId(v) ? v : DEFAULT_RESUME_TEMPLATE_ID;
      saveResumeDraft(draft);
      editable.remount();
      syncTemplateUrl();
    });
  }

  function syncTemplateUrl() {
    const id = draft.templateId;
    const url = new URL(window.location.href);
    if (isKnownResumeTemplateId(id) && id !== DEFAULT_RESUME_TEMPLATE_ID) {
      url.searchParams.set("template", id);
    } else {
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
