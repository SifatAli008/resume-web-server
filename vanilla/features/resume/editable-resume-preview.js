import {
  buildEditableMultipageCv,
  readEditableMultipageDraft,
} from "./templates/cv-editable-multipage.js";
import { refreshSkillsPreviews } from "./templates/cv-skills-ui.js";
import { getTemplateUi } from "./templates/cv-template-ui.js";
import { normalizeResumeDraft } from "./draft.js";

export function buildEditableResumeHtml(draft, templateId) {
  return buildEditableMultipageCv(draft, templateId);
}

export function readEditableDraftFromRoot(root, templateId) {
  return readEditableMultipageDraft(root, templateId);
}

export function mountResumeEditablePreview(host, ctx) {
  const { getDraft, setDraft, onPersist, getTemplateId } = ctx;

  function remount() {
    host.innerHTML = buildEditableResumeHtml(getDraft(), getTemplateId());
  }

  function onInput(e) {
    const next = readEditableDraftFromRoot(host, getTemplateId());
    setDraft(() => next);
    const article = host.querySelector("#resume-print-root");
    if (article) {
      article.classList.toggle("cv-has-photo", Boolean(next.showPhoto));
      article.classList.toggle("cv-no-photo", !next.showPhoto);
    }
    if (e?.target?.matches?.('[data-f="skills"]')) {
      refreshSkillsPreviews(host, next, getTemplateUi);
    }
    onPersist();
  }

  function onClick(e) {
    const t = e.target.closest("[data-action]");
    if (!t) return;
    const draft = getDraft();
    const action = t.getAttribute("data-action");
    if (action === "add-exp") {
      draft.experience.push({ company: "", role: "", start: "", end: "", bullets: ["", "", ""] });
      setDraft(() => normalizeResumeDraft(draft));
      remount();
      onPersist();
    } else if (action === "remove-exp") {
      const i = Number(t.getAttribute("data-i"));
      if (draft.experience.length < 2) return;
      draft.experience.splice(i, 1);
      setDraft(() => normalizeResumeDraft(draft));
      remount();
      onPersist();
    } else if (action === "add-edu") {
      draft.education.push({ school: "", degree: "", start: "", end: "" });
      setDraft(() => normalizeResumeDraft(draft));
      remount();
      onPersist();
    } else if (action === "remove-edu") {
      const i = Number(t.getAttribute("data-i"));
      if (draft.education.length < 2) return;
      draft.education.splice(i, 1);
      setDraft(() => normalizeResumeDraft(draft));
      remount();
      onPersist();
    } else if (action === "add-link") {
      draft.links.push({ label: "", url: "" });
      setDraft(() => normalizeResumeDraft(draft));
      remount();
      onPersist();
    } else if (action === "remove-link") {
      const i = Number(t.getAttribute("data-i"));
      if (draft.links.length < 2) return;
      draft.links.splice(i, 1);
      setDraft(() => normalizeResumeDraft(draft));
      remount();
      onPersist();
    } else if (action === "add-proj") {
      draft.projects.push({ name: "", context: "", start: "", end: "", bullets: ["", ""] });
      setDraft(() => normalizeResumeDraft(draft));
      remount();
      onPersist();
    } else if (action === "remove-proj") {
      const i = Number(t.getAttribute("data-i"));
      if (draft.projects.length < 2) return;
      draft.projects.splice(i, 1);
      setDraft(() => normalizeResumeDraft(draft));
      remount();
      onPersist();
    }
  }

  host.addEventListener("input", onInput);
  host.addEventListener("click", onClick, { capture: true });

  remount();
  return { remount };
}
