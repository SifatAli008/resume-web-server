import { CV_PH } from "./cv-placeholders.js";
import { escapeHtml } from "../escape-html.js";
import { resumeIcon } from "../resume-icons.js";
import { EIN, EIN_H1, EIN_SM, EIN_TX, BTN, RM } from "./cv-editor-styles.js";
import { skillsEditorBlock } from "./cv-skills-ui.js";

const PLUS = resumeIcon("plus", "h-3.5 w-3.5");

function secEstelle(title) {
  return `
  <div class="cv-estelle-sec-head mb-3 mt-6 first:mt-0">
    <h2 class="cv-section-h2 text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-900">${escapeHtml(title)}</h2>
    <div class="mt-2 h-px w-full bg-zinc-300" aria-hidden="true"></div>
  </div>`;
}

/** Centered header: uppercase name, title, icon contact row. */
export function headerEstelle(draft) {
  const contactField = (icon, field, ph) => `
    <span class="inline-flex items-center gap-1.5 align-middle">
      ${resumeIcon(icon, "h-3.5 w-3.5 shrink-0 text-zinc-800")}
      <input data-f="${field}" type="text" class="${EIN} inline min-w-[5rem] max-w-[14rem] text-center text-[11px] text-zinc-600 placeholder:text-zinc-400" placeholder="${escapeHtml(ph)}" value="${escapeHtml(draft[field] || "")}" />
    </span>`;

  return `
  <header class="cv-estelle-header mb-6 text-center">
    <input data-f="fullName" type="text" class="${EIN_H1} mx-auto block max-w-full text-center uppercase placeholder:normal-case placeholder:text-zinc-400" placeholder="${escapeHtml(CV_PH.fullName)}" value="${escapeHtml(draft.fullName)}" />
    <input data-f="title" type="text" class="${EIN} mx-auto mt-1 block max-w-full text-center text-[0.95rem] font-normal text-zinc-600 placeholder:text-zinc-400" placeholder="${escapeHtml(CV_PH.title)}" value="${escapeHtml(draft.title)}" />
    <div class="mx-auto mt-4 flex max-w-xl flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] text-zinc-600">
      ${contactField("phone", "phone", CV_PH.phone)}
      ${contactField("mail", "email", CV_PH.email)}
      ${contactField("map", "location", CV_PH.location)}
    </div>
    <div class="mx-auto mt-4 h-px max-w-full bg-zinc-300" aria-hidden="true"></div>
  </header>`;
}

function eduRowsEstelle(draft) {
  return (draft.education || [])
    .map((ed, i) => {
      const notes = ed.notes ?? "";
      return `
      <div data-edu-job="${i}" class="cv-edu-row cv-estelle-entry mb-5 last:mb-0">
        <div class="print:hidden mb-1 flex justify-end text-xs text-zinc-500">
          <button type="button" data-action="remove-edu" data-i="${i}" class="${RM} ${(draft.education || []).length < 2 ? "hidden" : ""}">Remove</button>
        </div>
        <div class="flex flex-wrap items-baseline justify-start gap-x-1 text-[11px] text-zinc-500">
          <input data-edu-f="school" class="${EIN_SM} inline min-w-[6rem] max-w-[14rem] text-[11px] text-zinc-500" placeholder="${escapeHtml(CV_PH.eduSchool)}" value="${escapeHtml(ed.school)}" />
          <span class="shrink-0 text-zinc-400" aria-hidden="true">|</span>
          <input data-edu-f="start" class="${EIN_SM} inline w-[3.5rem] text-[11px] tabular-nums text-zinc-500" placeholder="${escapeHtml(CV_PH.eduStart)}" value="${escapeHtml(ed.start)}" />
          <span class="shrink-0 text-zinc-400" aria-hidden="true">-</span>
          <input data-edu-f="end" class="${EIN_SM} inline w-[3.5rem] text-[11px] tabular-nums text-zinc-500" placeholder="${escapeHtml(CV_PH.eduEnd)}" value="${escapeHtml(ed.end)}" />
        </div>
        <input data-edu-f="degree" class="${EIN_SM} mt-1 block w-full font-bold text-zinc-900" placeholder="${escapeHtml(CV_PH.eduDegree)}" value="${escapeHtml(ed.degree)}" />
        <textarea data-edu-f="notes" class="${EIN_TX} mt-2 min-h-[3rem] text-[13px] leading-[1.5] text-zinc-600" rows="3" placeholder="Description or highlights">${escapeHtml(notes)}</textarea>
      </div>`;
    })
    .join("");
}

function expRowsEstelle(draft, slice = null) {
  const jobs = slice ? (draft.experience || []).slice(...slice) : draft.experience || [];
  return jobs
    .map((job, i) => {
      const idx = slice ? slice[0] + i : i;
      const desc = (job.bullets && job.bullets[0]) || "";
      return `
      <div data-exp-job="${idx}" class="cv-exp-row cv-estelle-entry mb-5 last:mb-0">
        <div class="print:hidden mb-1 flex justify-end text-xs text-zinc-500">
          <button type="button" data-action="remove-exp" data-i="${idx}" class="${RM} ${(draft.experience || []).length < 2 ? "hidden" : ""}">Remove</button>
        </div>
        <div class="flex flex-wrap items-baseline justify-start gap-x-1 text-[11px] text-zinc-500">
          <input data-exp-f="company" class="${EIN_SM} inline min-w-[6rem] max-w-[14rem] text-[11px] text-zinc-500" placeholder="${escapeHtml(CV_PH.expCompany)}" value="${escapeHtml(job.company)}" />
          <span class="shrink-0 text-zinc-400" aria-hidden="true">|</span>
          <input data-exp-f="start" class="${EIN_SM} inline w-[3.5rem] text-[11px] tabular-nums text-zinc-500" placeholder="${escapeHtml(CV_PH.expStart)}" value="${escapeHtml(job.start)}" />
          <span class="shrink-0 text-zinc-400" aria-hidden="true">-</span>
          <input data-exp-f="end" class="${EIN_SM} inline w-[3.5rem] text-[11px] tabular-nums text-zinc-500" placeholder="${escapeHtml(CV_PH.expEnd)}" value="${escapeHtml(job.end)}" />
        </div>
        <input data-exp-f="role" class="${EIN_SM} mt-1 block w-full font-bold text-zinc-900" placeholder="${escapeHtml(CV_PH.expRole)}" value="${escapeHtml(job.role)}" />
        <textarea data-exp-f="desc" class="${EIN_TX} mt-2 min-h-[3rem] text-[13px] leading-[1.5] text-zinc-600" rows="3" placeholder="${escapeHtml(CV_PH.bullet)}">${escapeHtml(desc)}</textarea>
      </div>`;
    })
    .join("");
}

export function blockAboutEstelle(draft) {
  return `<section class="cv-estelle-section cv-avoid-break">${secEstelle("About Me")}<textarea data-f="summary" class="${EIN_TX} text-[13px] leading-[1.55] text-zinc-600" rows="4" placeholder="${escapeHtml(CV_PH.summary)}">${escapeHtml(draft.summary)}</textarea></section>`;
}

export function blockEduEstelle(draft) {
  return `<section class="cv-estelle-section cv-avoid-break">${secEstelle("Education")}${eduRowsEstelle(draft)}<button type="button" data-action="add-edu" class="${BTN} mt-2">${PLUS}Add education</button></section>`;
}

export function blockExpEstelle(draft) {
  return `<section class="cv-estelle-section cv-avoid-break">${secEstelle("Work Experience")}${expRowsEstelle(draft)}<button type="button" data-action="add-exp" class="${BTN} mt-2">${PLUS}Add role</button></section>`;
}

export function blockSkillsEstelle(draft, ui, tplId) {
  return `<section class="cv-estelle-section cv-avoid-break">${secEstelle("Skills")}${skillsEditorBlock(draft, ui, tplId, { textareaCls: `${EIN_TX} mb-2 print:hidden`, rows: 4 })}</section>`;
}

export function renderEstellePage(draft, tplId, ui) {
  return `${headerEstelle(draft)}${blockAboutEstelle(draft)}${blockEduEstelle(draft)}${blockExpEstelle(draft)}${blockSkillsEstelle(draft, ui, tplId)}`;
}
