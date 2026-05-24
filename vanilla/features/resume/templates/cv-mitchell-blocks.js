import { CV_PH } from "./cv-placeholders.js";
import { escapeHtml } from "../escape-html.js";
import { EIN, EIN_H1, EIN_SM, EIN_TX, BTN, RM } from "./cv-editor-styles.js";
import { skillsEditorBlock } from "./cv-skills-ui.js";

const PLUS = `<span class="text-xs">+</span>`;

function hrMitchell() {
  return `<div class="cv-mitchell-rule my-4 h-px w-full bg-zinc-300" aria-hidden="true"></div>`;
}

function secMitchell(title) {
  return `<h2 class="cv-mitchell-sec-title cv-section-h2 m-0 text-[11px] font-bold uppercase tracking-[0.1em] text-zinc-900">${escapeHtml(title)}</h2>`;
}

function secBlock(title, inner) {
  return `<section class="cv-mitchell-section cv-avoid-break">${secMitchell(title)}${inner}${hrMitchell()}</section>`;
}

/** Name + two-line contact, then divider */
export function headerMitchell(draft) {
  const link = (draft.links && draft.links[0]) || { label: "", url: "" };
  const link2 = (draft.links && draft.links[1]) || { label: "", url: "" };
  return `
  <header class="cv-mitchell-header mb-0">
    <input data-f="fullName" type="text" class="${EIN_H1} block w-full text-[1.65rem] font-bold placeholder:text-zinc-400" placeholder="${escapeHtml(CV_PH.fullName)}" value="${escapeHtml(draft.fullName)}" />
    <div class="mt-2 space-y-1 text-[11px] leading-relaxed text-zinc-700">
      <div class="flex flex-wrap items-center gap-x-2 gap-y-1">
        <input data-f="phone" type="text" class="${EIN} inline min-w-[5rem] max-w-[10rem] text-[11px]" placeholder="${escapeHtml(CV_PH.phone)}" value="${escapeHtml(draft.phone)}" />
        <span class="text-zinc-400">·</span>
        <input data-f="email" type="text" class="${EIN} inline min-w-[5rem] max-w-[14rem] text-[11px]" placeholder="${escapeHtml(CV_PH.email)}" value="${escapeHtml(draft.email)}" />
        <span class="text-zinc-400">·</span>
        <input data-lf="url" data-link-row="0" class="${EIN} inline min-w-[5rem] flex-1 text-[11px]" placeholder="Portfolio / LinkedIn URL" value="${escapeHtml(link.url)}" />
        <input data-lf="label" data-link-row="0" type="hidden" value="${escapeHtml(link.label || "Portfolio")}" />
      </div>
      <div class="flex flex-wrap items-center gap-x-2">
        <input data-f="location" type="text" class="${EIN} inline min-w-[8rem] flex-1 text-[11px]" placeholder="${escapeHtml(CV_PH.location)}" value="${escapeHtml(draft.location)}" />
        <span class="text-zinc-400">·</span>
        <input data-lf="url" data-link-row="1" class="${EIN} inline min-w-[5rem] max-w-[12rem] text-[11px]" placeholder="Social / website" value="${escapeHtml(link2.url)}" />
        <input data-lf="label" data-link-row="1" type="hidden" value="${escapeHtml(link2.label || "Website")}" />
      </div>
    </div>
    ${hrMitchell()}
  </header>`;
}

function expRowsMitchell(draft) {
  return (draft.experience || [])
    .map((job, i) => {
      const desc = (job.bullets && job.bullets[0]) || "";
      return `
      <div data-exp-job="${i}" class="cv-exp-row cv-mitchell-entry mb-4 last:mb-0">
        <div class="print:hidden mb-1 flex justify-end text-xs text-zinc-500">
          <button type="button" data-action="remove-exp" data-i="${i}" class="${RM} ${(draft.experience || []).length < 2 ? "hidden" : ""}">Remove</button>
        </div>
        <div class="mb-1 flex items-baseline justify-between gap-3">
          <input data-exp-f="company" class="${EIN_SM} min-w-0 flex-1 text-[13px] font-bold text-zinc-900" placeholder="${escapeHtml(CV_PH.expCompany)}" value="${escapeHtml(job.company)}" />
          <div class="flex shrink-0 items-baseline gap-1 text-[13px] font-bold tabular-nums text-zinc-900">
            <input data-exp-f="start" class="${EIN_SM} w-[4.5rem] text-right font-bold tabular-nums" placeholder="${escapeHtml(CV_PH.expStart)}" value="${escapeHtml(job.start)}" />
            <span>-</span>
            <input data-exp-f="end" class="${EIN_SM} w-[4.5rem] font-bold tabular-nums" placeholder="${escapeHtml(CV_PH.expEnd)}" value="${escapeHtml(job.end)}" />
          </div>
        </div>
        <input data-exp-f="role" class="${EIN_SM} mb-1.5 block w-full text-[13px] font-bold text-zinc-900" placeholder="${escapeHtml(CV_PH.expRole)}" value="${escapeHtml(job.role)}" />
        <textarea data-exp-f="desc" class="${EIN_TX} min-h-[3rem] text-[13px] leading-[1.55] text-zinc-700" rows="3" placeholder="${escapeHtml(CV_PH.bullet)}">${escapeHtml(desc)}</textarea>
      </div>`;
    })
    .join("");
}

function eduRowsMitchell(draft) {
  return (draft.education || [])
    .map((ed, i) => `
      <div data-edu-job="${i}" class="cv-edu-row cv-mitchell-edu mb-3 last:mb-0">
        <div class="print:hidden mb-1 flex justify-end text-xs text-zinc-500">
          <button type="button" data-action="remove-edu" data-i="${i}" class="${RM} ${(draft.education || []).length < 2 ? "hidden" : ""}">Remove</button>
        </div>
        <input data-edu-f="degree" class="${EIN_SM} block w-full text-[13px] font-bold text-zinc-900" placeholder="${escapeHtml(CV_PH.eduDegree)}" value="${escapeHtml(ed.degree)}" />
        <input data-edu-f="school" class="${EIN_SM} mt-0.5 block w-full text-[13px] text-zinc-700" placeholder="${escapeHtml(CV_PH.eduSchool)}" value="${escapeHtml(ed.school)}" />
        <input data-edu-f="start" type="hidden" value="${escapeHtml(ed.start)}" />
        <input data-edu-f="end" type="hidden" value="${escapeHtml(ed.end)}" />
      </div>`)
    .join("");
}

function extracurricularRows(draft) {
  return (draft.projects || [])
    .map((p, i) => `
      <div data-proj-row="${i}" class="cv-mitchell-extra mb-3 last:mb-0">
        <div class="print:hidden mb-1 flex justify-end text-xs text-zinc-500">
          <button type="button" data-action="remove-proj" data-i="${i}" class="${RM} ${(draft.projects || []).length < 2 ? "hidden" : ""}">Remove</button>
        </div>
        <input data-proj-f="name" class="${EIN_SM} block w-full text-[13px] font-bold text-zinc-900" placeholder="Role / activity title" value="${escapeHtml(p.name)}" />
        <input data-proj-f="context" class="${EIN_SM} mt-0.5 block w-full text-[13px] text-zinc-700" placeholder="Organization / group" value="${escapeHtml(p.context)}" />
        <input data-proj-f="start" type="hidden" value="${escapeHtml(p.start)}" />
        <input data-proj-f="end" type="hidden" value="${escapeHtml(p.end)}" />
      </div>`)
    .join("");
}

export function blockObjectiveMitchell(draft) {
  return `
  <section class="cv-mitchell-section cv-avoid-break">
    <input data-f="title" type="text" class="${EIN} block w-full text-[11px] font-bold uppercase tracking-[0.1em] text-zinc-900 placeholder:font-bold placeholder:uppercase" placeholder="${escapeHtml(CV_PH.title)}" value="${escapeHtml(draft.title)}" />
    <textarea data-f="summary" class="${EIN_TX} mt-2 text-[13px] leading-[1.55] text-zinc-700" rows="4" placeholder="${escapeHtml(CV_PH.summary)}">${escapeHtml(draft.summary)}</textarea>
    ${hrMitchell()}
  </section>`;
}

export function blockCompetenciesMitchell(draft, ui, tplId) {
  return secBlock(
    "Key Competencies",
    skillsEditorBlock(draft, ui, tplId, { textareaCls: `${EIN_TX} mb-2 print:hidden`, rows: 4 }),
  );
}

export function blockExpMitchell(draft) {
  const inner = `${expRowsMitchell(draft)}<button type="button" data-action="add-exp" class="${BTN} mt-2">${PLUS} Add role</button>`;
  return secBlock("Professional Experience", inner);
}

export function blockBottomMitchell(draft) {
  const eduInner = `${eduRowsMitchell(draft)}<button type="button" data-action="add-edu" class="${BTN} mt-2">${PLUS} Add education</button>
    <div class="mt-4">
      <p class="mb-1 text-[12px] font-bold text-zinc-900">Certifications</p>
      <textarea data-f="certifications" class="${EIN_TX} min-h-[2.5rem] text-[13px] leading-[1.5] text-zinc-700" rows="2" placeholder="${escapeHtml(CV_PH.certifications)}">${escapeHtml(draft.certifications)}</textarea>
    </div>`;
  const extraInner = `${extracurricularRows(draft)}<button type="button" data-action="add-proj" class="${BTN} mt-2">${PLUS} Add activity</button>`;

  return `
  <section class="cv-mitchell-bottom cv-avoid-break">
    ${hrMitchell()}
    <div class="cv-mitchell-split grid grid-cols-2 gap-0">
      <div class="cv-mitchell-col-left min-w-0 pr-5">
        ${secMitchell("Education & Certifications")}
        <div class="mt-3">${eduInner}</div>
      </div>
      <div class="cv-mitchell-col-right min-w-0 border-l border-zinc-300 pl-5">
        ${secMitchell("Extracurricular Activities")}
        <div class="mt-3">${extraInner}</div>
      </div>
    </div>
  </section>`;
}

export function renderMitchellPage(draft, tplId, ui) {
  return `${headerMitchell(draft)}${blockObjectiveMitchell(draft)}${blockCompetenciesMitchell(draft, ui, tplId)}${blockExpMitchell(draft)}${blockBottomMitchell(draft)}`;
}
