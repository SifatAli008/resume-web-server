/**
 * Invoice-style document zones (mirrors invoice_fluvo_10 page structure).
 * Meta row → parties → line-item table → footer totals.
 */
import { CV_PH } from "./cv-placeholders.js";
import { escapeHtml } from "../escape-html.js";
import { EIN_DATE, EIN_H1, EIN_SM, EIN_TX, BTN, RM } from "./cv-editor-styles.js";
import { resumeIcon } from "../resume-icons.js";

const PLUS = resumeIcon("plus", "h-3.5 w-3.5");

/** INVOICE # / DATE / DUE / PO → resume meta fields */
export function cvMetaRow(draft, ui) {
  const lbl = "text-[10px] font-bold uppercase tracking-[0.14em] text-[#52525b]";
  const cell = (label, field, type = "text", ph) => `
    <div class="min-w-0">
      <p class="${lbl} cv-meta-label">${escapeHtml(label)}</p>
      <input data-f="${field}" type="${type}" class="${EIN_SM} cv-meta-value mt-0.5 w-full text-[12px] font-normal" placeholder="${escapeHtml(ph)}" value="${escapeHtml(draft[field] || "")}" />
    </div>`;
  return `
  <div class="cv-meta-row mb-[1.75rem] grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4 print:grid-cols-4">
    ${cell("Email", "email", "email", CV_PH.email)}
    ${cell("Phone", "phone", "text", CV_PH.phone)}
    ${cell("Location", "location", "text", CV_PH.location)}
    ${cell("Job title", "title", "text", CV_PH.title)}
  </div>`;
}

/** Large document title (like # INVOICE) */
export function cvDocumentTitle(draft) {
  return `
  <div class="cv-doc-title mb-4 border-b-2 border-zinc-900 pb-3">
    <p class="text-[10px] font-bold uppercase tracking-[0.28em] text-zinc-500">Curriculum Vitae</p>
    <input data-f="fullName" type="text" class="${EIN_H1} mt-1 w-full uppercase" placeholder="${escapeHtml(CV_PH.fullName)}" value="${escapeHtml(draft.fullName)}" />
  </div>`;
}

/** Serif layouts — centered document title */
export function cvDocumentTitleSerif(draft) {
  return `
  <div class="cv-doc-title cv-doc-title-serif mb-5 text-center">
    <p class="text-[10px] font-bold uppercase tracking-[0.28em] text-zinc-500">Curriculum Vitae</p>
    <input data-f="fullName" type="text" class="${EIN_H1} mt-2 w-full text-center" placeholder="${escapeHtml(CV_PH.fullName)}" value="${escapeHtml(draft.fullName)}" />
    <div class="mx-auto mt-2 h-px w-16 bg-zinc-400"></div>
  </div>`;
}

/** From — professional summary */
export function cvFromBlock(draft, ui) {
  return `
  <div class="cv-from-block mb-[1.25rem]">
    <p class="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] ${ui.h2 || "text-zinc-800"}">Professional profile</p>
    <textarea data-f="summary" class="${EIN_TX} min-h-[5rem]" placeholder="${escapeHtml(CV_PH.summary)}">${escapeHtml(draft.summary)}</textarea>
  </div>`;
}

/** Experience as invoice line-item table */
export function cvExperienceTable(draft, slice = null, ui, sectionTitle = "Professional experience") {
  const jobs = slice ? (draft.experience || []).slice(...slice) : draft.experience || [];
  const head = `
    <thead>
      <tr class="border-b-2 border-zinc-800 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-700">
        <th class="pb-2 pr-3 w-[7rem]">Period</th>
        <th class="pb-2 pr-3 min-w-[8rem]">Role &amp; organization</th>
        <th class="pb-2">Highlights</th>
      </tr>
    </thead>`;
  const rows = jobs
    .map((job, i) => {
      const idx = slice ? slice[0] + i : i;
      const bullets = (job.bullets || ["", "", ""]).concat(["", ""]).slice(0, 6);
      const bHtml = bullets
        .map(
          (b, bi) =>
            `<input data-bullet="${bi}" class="${EIN_SM} mb-1 block w-full border-0 border-b border-zinc-100 py-0.5" placeholder="${escapeHtml(CV_PH.bullet)}" value="${escapeHtml(b)}" />`,
        )
        .join("");
      return `
      <tr data-exp-job="${idx}" class="cv-exp-table-row cv-avoid-break border-b border-[#e4e4e7] align-top">
        <td class="w-[7rem] py-3 pr-3 tabular-nums text-[11px] text-[#52525b]">
          <div class="print:hidden mb-1 text-[10px] text-[#a1a1aa]">#${idx + 1}</div>
          <input data-exp-f="start" class="${EIN_DATE} mb-1 block w-full text-[11px]" placeholder="${escapeHtml(CV_PH.expStart)}" value="${escapeHtml(job.start)}" />
          <input data-exp-f="end" class="${EIN_DATE} block w-full text-[11px]" placeholder="${escapeHtml(CV_PH.expEnd)}" value="${escapeHtml(job.end)}" />
        </td>
        <td class="py-3 pr-3">
          <input data-exp-f="role" class="${EIN_SM} font-semibold text-zinc-950" placeholder="${escapeHtml(CV_PH.expRole)}" value="${escapeHtml(job.role)}" />
          <input data-exp-f="company" class="${EIN_SM} mt-1 text-zinc-600" placeholder="${escapeHtml(CV_PH.expCompany)}" value="${escapeHtml(job.company)}" />
        </td>
        <td class="py-3">
          <div class="print:hidden mb-1 flex justify-end">
            <button type="button" data-action="remove-exp" data-i="${idx}" class="${RM} ${(draft.experience || []).length < 2 ? "hidden" : ""}">Remove</button>
          </div>
          ${bHtml}
        </td>
      </tr>`;
    })
    .join("");
  return `
  <div class="cv-exp-table-wrap mb-6 overflow-x-auto">
    <p class="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] ${ui.h2 || "text-zinc-800"}">${escapeHtml(sectionTitle)}</p>
    <table class="cv-exp-table w-full min-w-[32rem] border-collapse">
      ${head}
      <tbody>${rows}</tbody>
    </table>
    <button type="button" data-action="add-exp" class="${BTN} mt-2">${PLUS}Add role</button>
  </div>`;
}

/** Totals-style footer (education, certs, languages) */
export function cvTotalsFooter(draft, ui) {
  return `
  <div class="cv-totals-footer mt-6 border-t-2 border-zinc-800 pt-4">
    <div class="grid gap-4 sm:grid-cols-3">
      <div>
        <p class="mb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#52525b]">Education</p>
        <div class="text-[12px] text-zinc-800">${escapeHtml((draft.education?.[0]?.degree || "") + (draft.education?.[0]?.school ? ` · ${draft.education[0].school}` : "") || CV_PH.eduDegree)}</div>
      </div>
      <div>
        <p class="mb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#52525b]">Certifications</p>
        <textarea data-f="certifications" class="${EIN_TX} min-h-[2.5rem] text-[12px]" rows="2" placeholder="${escapeHtml(CV_PH.certifications)}">${escapeHtml(draft.certifications)}</textarea>
      </div>
      <div>
        <p class="mb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#52525b]">Languages</p>
        <textarea data-f="languages" class="${EIN_TX} min-h-[2.5rem] text-[12px]" rows="2" placeholder="${escapeHtml(CV_PH.languages)}">${escapeHtml(draft.languages)}</textarea>
      </div>
    </div>
  </div>`;
}
