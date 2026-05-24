import { CV_PH } from "./cv-placeholders.js";
import { escapeHtml } from "../escape-html.js";
import { resumeIcon } from "../resume-icons.js";
import { EIN, EIN_H1, EIN_SM, EIN_TX, BTN, RM } from "./cv-editor-styles.js";
import { skillsEditorBlock } from "./cv-skills-ui.js";

const PLUS = resumeIcon("plus", "h-3.5 w-3.5");

function secGallego(title) {
  return `
  <div class="cv-gallego-sec-head mb-3 mt-5 first:mt-0">
    <div class="cv-gallego-pill w-full rounded-full bg-[#e8e8e8] px-5 py-2">
      <h2 class="cv-section-h2 m-0 text-[13px] font-bold uppercase italic tracking-[0.06em] text-zinc-900">${escapeHtml(title)}</h2>
    </div>
  </div>`;
}

function contactSep() {
  return `<span class="mx-2 shrink-0 text-zinc-400" aria-hidden="true">|</span>`;
}

/** Left-aligned header: name, title, location | email | website */
export function headerGallego(draft) {
  const website = (draft.links && draft.links[0]) || { label: "", url: "" };
  return `
  <header class="cv-gallego-header mb-5">
    <input data-f="fullName" type="text" class="${EIN_H1} block w-full uppercase placeholder:normal-case placeholder:text-zinc-400" placeholder="${escapeHtml(CV_PH.fullName)}" value="${escapeHtml(draft.fullName)}" />
    <input data-f="title" type="text" class="${EIN} mt-1 block w-full text-[0.9rem] font-bold uppercase tracking-[0.06em] text-zinc-900 placeholder:normal-case placeholder:font-normal placeholder:text-zinc-400" placeholder="${escapeHtml(CV_PH.title)}" value="${escapeHtml(draft.title)}" />
    <div class="mt-2 flex flex-wrap items-center text-[11px] text-zinc-700">
      <input data-f="location" type="text" class="${EIN} inline min-w-[5rem] max-w-[12rem] text-[11px] text-zinc-700" placeholder="${escapeHtml(CV_PH.location)}" value="${escapeHtml(draft.location)}" />
      ${contactSep()}
      <input data-f="email" type="text" class="${EIN} inline min-w-[5rem] max-w-[14rem] text-[11px] text-zinc-700" placeholder="${escapeHtml(CV_PH.email)}" value="${escapeHtml(draft.email)}" />
      ${contactSep()}
      <span class="inline-flex min-w-0 flex-1 items-center gap-1">
        <input data-lf="url" data-link-row="0" class="${EIN} min-w-[6rem] flex-1 text-[11px] text-zinc-700" placeholder="Website URL" value="${escapeHtml(website.url)}" />
      </span>
      <input data-lf="label" data-link-row="0" type="hidden" value="${escapeHtml(website.label || "Website")}" />
    </div>
  </header>`;
}

function bulletInputs(dataAttr, bullets, ph) {
  const items = (bullets || ["", ""]).concat(["", ""]).slice(0, 6);
  return `<ul class="cv-gallego-bullets m-0 list-none space-y-1 p-0">${items
    .map(
      (b, bi) =>
        `<li class="flex gap-2 text-[13px] leading-[1.5] text-zinc-700"><span class="mt-[0.35rem] h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-800" aria-hidden="true"></span><input ${dataAttr}="${bi}" class="${EIN_SM} min-w-0 flex-1" placeholder="${escapeHtml(ph)}" value="${escapeHtml(b)}" /></li>`,
    )
    .join("")}</ul>`;
}

function expRowsGallego(draft) {
  return (draft.experience || [])
    .map((job, i) => {
      const bullets = job.bullets || ["", "", ""];
      return `
      <div data-exp-job="${i}" class="cv-exp-row cv-gallego-entry mb-4 last:mb-0">
        <div class="print:hidden mb-1 flex justify-end text-xs text-zinc-500">
          <button type="button" data-action="remove-exp" data-i="${i}" class="${RM} ${(draft.experience || []).length < 2 ? "hidden" : ""}">Remove</button>
        </div>
        <div class="mb-1.5 flex items-baseline justify-between gap-3">
          <div class="min-w-0 flex-1 text-[13px] font-bold text-zinc-900">
            <input data-exp-f="role" class="${EIN_SM} inline min-w-[4rem] max-w-[40%] font-bold" placeholder="${escapeHtml(CV_PH.expRole)}" value="${escapeHtml(job.role)}" />
            <span class="font-bold text-zinc-700"> at </span>
            <input data-exp-f="company" class="${EIN_SM} inline min-w-[4rem] font-bold" placeholder="${escapeHtml(CV_PH.expCompany)}" value="${escapeHtml(job.company)}" />
          </div>
          <div class="flex shrink-0 items-baseline gap-1 text-[13px] font-bold tabular-nums text-zinc-900">
            <input data-exp-f="start" class="${EIN_SM} w-[4.5rem] text-right font-bold tabular-nums" placeholder="${escapeHtml(CV_PH.expStart)}" value="${escapeHtml(job.start)}" />
            <span class="font-bold">-</span>
            <input data-exp-f="end" class="${EIN_SM} w-[4.5rem] font-bold tabular-nums" placeholder="${escapeHtml(CV_PH.expEnd)}" value="${escapeHtml(job.end)}" />
          </div>
        </div>
        ${bulletInputs("data-bullet", bullets, CV_PH.bullet)}
      </div>`;
    })
    .join("");
}

function eduRowsGallego(draft) {
  return (draft.education || [])
    .map((ed, i) => {
      const bullets = (ed.bullets && ed.bullets.length) ? ed.bullets : (ed.notes ? [ed.notes, ""] : ["", ""]);
      return `
      <div data-edu-job="${i}" class="cv-edu-row cv-gallego-entry mb-4 last:mb-0">
        <div class="print:hidden mb-1 flex justify-end text-xs text-zinc-500">
          <button type="button" data-action="remove-edu" data-i="${i}" class="${RM} ${(draft.education || []).length < 2 ? "hidden" : ""}">Remove</button>
        </div>
        <div class="mb-1 flex items-baseline justify-between gap-3">
          <input data-edu-f="degree" class="${EIN_SM} min-w-0 flex-1 text-[13px] font-bold text-zinc-900" placeholder="${escapeHtml(CV_PH.eduDegree)}" value="${escapeHtml(ed.degree)}" />
          <div class="flex shrink-0 items-baseline gap-1 text-[13px] font-bold tabular-nums text-zinc-900">
            <input data-edu-f="start" class="${EIN_SM} w-[4.5rem] text-right font-bold tabular-nums" placeholder="${escapeHtml(CV_PH.eduStart)}" value="${escapeHtml(ed.start)}" />
            <span class="font-bold">-</span>
            <input data-edu-f="end" class="${EIN_SM} w-[4.5rem] font-bold tabular-nums" placeholder="${escapeHtml(CV_PH.eduEnd)}" value="${escapeHtml(ed.end)}" />
          </div>
        </div>
        <input data-edu-f="school" class="${EIN_SM} mb-1.5 block w-full text-[13px] text-zinc-700" placeholder="${escapeHtml(CV_PH.eduSchool)}" value="${escapeHtml(ed.school)}" />
        ${bulletInputs("data-edu-bullet", bullets, "Major, thesis, or highlights")}
      </div>`;
    })
    .join("");
}

export function blockSummaryGallego(draft) {
  return `<section class="cv-gallego-section cv-avoid-break">${secGallego("Summary")}<textarea data-f="summary" class="${EIN_TX} text-[13px] leading-[1.55] text-zinc-700" rows="4" placeholder="${escapeHtml(CV_PH.summary)}">${escapeHtml(draft.summary)}</textarea></section>`;
}

export function blockSkillsGallego(draft, ui, tplId) {
  return `<section class="cv-gallego-section cv-avoid-break">${secGallego("Technical Skills")}${skillsEditorBlock(draft, ui, tplId, { textareaCls: `${EIN_TX} mb-2 print:hidden`, rows: 4 })}</section>`;
}

export function blockExpGallego(draft) {
  return `<section class="cv-gallego-section cv-avoid-break">${secGallego("Professional Experience")}${expRowsGallego(draft)}<button type="button" data-action="add-exp" class="${BTN} mt-2">${PLUS}Add role</button></section>`;
}

export function blockEduGallego(draft) {
  return `<section class="cv-gallego-section cv-avoid-break">${secGallego("Education")}${eduRowsGallego(draft)}<button type="button" data-action="add-edu" class="${BTN} mt-2">${PLUS}Add education</button></section>`;
}

export function blockAdditionalGallego(draft) {
  const awards = draft.awards ?? "";
  return `
  <section class="cv-gallego-section cv-avoid-break">
    ${secGallego("Additional Information")}
    <ul class="cv-gallego-additional m-0 list-none space-y-2 p-0 text-[13px] leading-[1.5] text-zinc-700">
      <li class="flex flex-wrap gap-1">
        <span class="font-bold text-zinc-900">Languages:</span>
        <input data-f="languages" class="${EIN} min-w-[8rem] flex-1" placeholder="${escapeHtml(CV_PH.languages.split("\n")[0])}" value="${escapeHtml(draft.languages)}" />
      </li>
      <li class="flex flex-wrap gap-1">
        <span class="font-bold text-zinc-900">Certifications:</span>
        <input data-f="certifications" class="${EIN} min-w-[8rem] flex-1" placeholder="${escapeHtml(CV_PH.certifications.split("\n")[0])}" value="${escapeHtml(draft.certifications)}" />
      </li>
      <li class="flex flex-wrap gap-1">
        <span class="font-bold text-zinc-900">Awards/Activities:</span>
        <input data-f="awards" class="${EIN} min-w-[8rem] flex-1" placeholder="Awards, activities, volunteer work" value="${escapeHtml(awards)}" />
      </li>
    </ul>
  </section>`;
}

export function renderGallegoPage(draft, tplId, ui) {
  return `${headerGallego(draft)}${blockSummaryGallego(draft)}${blockSkillsGallego(draft, ui, tplId)}${blockExpGallego(draft)}${blockEduGallego(draft)}${blockAdditionalGallego(draft)}`;
}
