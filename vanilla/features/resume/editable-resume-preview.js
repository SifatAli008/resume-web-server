import {
  buildEditableMultipageCv,
  readEditableMultipageDraft,
} from "./templates/cv-editable-multipage.js";
import {
  renderAlvaradoLangPreviewHtml,
  renderAlvaradoSkillsPreviewHtml,
} from "./templates/cv-alvarado-blocks.js";
import { normalizeTemplateId } from "./constants.js";
import { CV_PH } from "./templates/cv-placeholders.js";

function fillDraftPlaceholders(draft) {
  const fill = (v, ph) => (String(v || "").trim() ? v : ph);
  return {
    ...draft,
    fullName: fill(draft.fullName, CV_PH.fullName),
    title: fill(draft.title, CV_PH.title),
    email: fill(draft.email, CV_PH.email),
    phone: fill(draft.phone, CV_PH.phone),
    location: fill(draft.location, CV_PH.location),
    summary: fill(draft.summary, CV_PH.summary),
    certifications: fill(draft.certifications, CV_PH.certifications),
    languages: fill(draft.languages, CV_PH.languages),
    skills: fill(draft.skills, CV_PH.skills),
  };
}

export function buildEditableResumeHtml(draft) {
  const id = normalizeTemplateId(draft.templateId);
  return buildEditableMultipageCv(fillDraftPlaceholders(draft), id);
}

export function readEditableDraftFromRoot(root, templateId) {
  return readEditableMultipageDraft(root, normalizeTemplateId(templateId));
}

export async function mountResumeEditablePreview(previewEl, ctx) {
  const { getDraft, onDraftChange } = ctx;

  function paint() {
    const draft = getDraft();
    previewEl.innerHTML = buildEditableResumeHtml(draft);
  }

  function persist() {
    const draft = getDraft();
    const templateId = normalizeTemplateId(draft.templateId);
    const next = readEditableMultipageDraft(previewEl, templateId);
    onDraftChange?.({ ...next, templateId });
  }

  paint();

  previewEl.addEventListener("input", (e) => {
    const t = e.target;
    const tpl = previewEl.querySelector("[data-cv-template]")?.getAttribute("data-cv-template");
    if (tpl !== "6") {
      persist();
      return;
    }
    if (t.matches?.('[data-f="skills"]')) {
      const el = previewEl.querySelector("[data-skills-preview]");
      if (el) el.innerHTML = renderAlvaradoSkillsPreviewHtml(t.value);
    }
    if (t.matches?.('[data-f="languages"]')) {
      const el = previewEl.querySelector("[data-lang-preview]");
      if (el) el.innerHTML = renderAlvaradoLangPreviewHtml(t.value);
    }
    persist();
  });
  previewEl.addEventListener("change", persist);

  previewEl.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;
    const action = btn.getAttribute("data-action");
    const draft = getDraft();
    if (action === "add-exp") {
      draft.experience = [...(draft.experience || []), { company: "", role: "", start: "", end: "", bullets: ["", "", ""] }];
    } else if (action === "remove-exp") {
      const i = Number(btn.getAttribute("data-i"));
      draft.experience = (draft.experience || []).filter((_, j) => j !== i);
    } else if (action === "add-proj") {
      draft.projects = [...(draft.projects || []), { name: "", context: "", start: "", end: "", bullets: ["", ""] }];
    } else if (action === "remove-proj") {
      const i = Number(btn.getAttribute("data-i"));
      draft.projects = (draft.projects || []).filter((_, j) => j !== i);
    } else if (action === "add-edu") {
      draft.education = [...(draft.education || []), { school: "", degree: "", start: "", end: "", notes: "", bullets: ["", ""] }];
    } else if (action === "remove-edu") {
      const i = Number(btn.getAttribute("data-i"));
      draft.education = (draft.education || []).filter((_, j) => j !== i);
    } else if (action === "add-link") {
      draft.links = [...(draft.links || []), { label: "", url: "" }];
    }
    onDraftChange?.(draft);
    paint();
    persist();
  });

  return {
    remount() {
      paint();
    },
  };
}
