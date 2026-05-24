import { CV_PH } from "./cv-placeholders.js";
import { escapeHtml } from "../escape-html.js";
import { resumeIcon } from "../resume-icons.js";
import { EIN, EIN_H1, EIN_SM, EIN_TX, BTN, RM } from "./cv-editor-styles.js";
import { skillsEditorBlock } from "./cv-skills-ui.js";

const PLUS = `<span class="text-xs">+</span>`;

function secSanchez(title) {
  return `<h2 class="cv-sanchez-sec-title cv-section-h2 mb-2 mt-5 text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-900 first:mt-0">${escapeHtml(title)}</h2>`;
}

const EIN_LIGHT =
  "w-full border-0 border-b border-transparent bg-transparent px-0 py-0.5 outline-none ring-0 text-[12px] leading-snug text-white placeholder:text-white/50 focus:border-white/40 focus:bg-white/5 print:border-0 print:bg-transparent";

/** Banner header with gold name + white contact row (bg from ui.ribbon). */
export function headerSanchez(draft, ui = {}) {
  const headerBg = ui.ribbon || "bg-[#1a2744]";
  const contact = (icon, field, ph) => `
    <span class="inline-flex items-center gap-1.5">
      ${resumeIcon(icon, "h-3.5 w-3.5 shrink-0 text-white/90")}
      <input data-f="${field}" type="text" class="${EIN_LIGHT} inline min-w-[5rem] max-w-[11rem] text-center" placeholder="${escapeHtml(ph)}" value="${escapeHtml(draft[field] || "")}" />
    </span>`;

  return `
  <header class="cv-sanchez-header ${headerBg} -mx-[16mm] -mt-[14mm] mb-6 px-[16mm] pb-5 pt-8 text-center print:mx-0 print:mt-0">
    <input data-f="fullName" type="text" class="${EIN_H1} cv-sanchez-name mx-auto block max-w-full text-center text-[1.55rem] font-bold uppercase tracking-[0.08em] text-[#d4c4a8] placeholder:normal-case placeholder:text-white/40" placeholder="${escapeHtml(CV_PH.fullName)}" value="${escapeHtml(draft.fullName)}" />
    <input data-f="title" type="text" class="${EIN_LIGHT} mx-auto mt-1 block max-w-full text-center text-[0.95rem] font-bold text-white" placeholder="${escapeHtml(CV_PH.title)}" value="${escapeHtml(draft.title)}" />
    <div class="mx-auto mt-4 flex max-w-lg flex-wrap items-center justify-center gap-x-5 gap-y-2">
      ${contact("phone", "phone", CV_PH.phone)}
      ${contact("mail", "email", CV_PH.email)}
      ${contact("map", "location", CV_PH.location)}
    </div>
  </header>`;
}

function bulletInputs(dataAttr, bullets, ph) {
  const items = (bullets || ["", ""]).concat(["", ""]).slice(0, 6);
  return `<ul class="cv-sanchez-bullets m-0 mt-1.5 list-none space-y-1 p-0">${items
    .map(
      (b, bi) =>
        `<li class="flex gap-2 text-[13px] leading-[1.5] text-zinc-700"><span class="mt-[0.4rem] h-1 w-1 shrink-0 rounded-full bg-zinc-800" aria-hidden="true"></span><input ${dataAttr}="${bi}" class="${EIN_SM} min-w-0 flex-1" placeholder="${escapeHtml(ph)}" value="${escapeHtml(b)}" /></li>`,
    )
    .join("")}</ul>`;
}

function expRowsSanchez(draft) {
  return (draft.experience || [])
    .map((job, i) => {
      const bullets = job.bullets || ["", "", ""];
      return `
      <div data-exp-job="${i}" class="cv-exp-row cv-sanchez-entry mb-4 last:mb-0">
        <div class="print:hidden mb-1 flex justify-end text-xs text-zinc-500">
          <button type="button" data-action="remove-exp" data-i="${i}" class="${RM} ${(draft.experience || []).length < 2 ? "hidden" : ""}">Remove</button>
        </div>
        <div class="mb-1 flex items-baseline justify-between gap-3">
          <div class="min-w-0 flex-1 text-[13px] font-bold text-zinc-900">
            <input data-exp-f="role" class="${EIN_SM} inline min-w-[4rem] max-w-[45%] font-bold" placeholder="${escapeHtml(CV_PH.expRole)}" value="${escapeHtml(job.role)}" />
            <span class="font-bold">, </span>
            <input data-exp-f="company" class="${EIN_SM} inline min-w-[4rem] font-bold" placeholder="${escapeHtml(CV_PH.expCompany)}" value="${escapeHtml(job.company)}" />
          </div>
          <div class="flex shrink-0 items-baseline gap-1 text-[12px] font-bold tabular-nums text-zinc-900">
            <input data-exp-f="start" class="${EIN_SM} w-[4.5rem] text-right font-bold tabular-nums" placeholder="${escapeHtml(CV_PH.expStart)}" value="${escapeHtml(job.start)}" />
            <span>–</span>
            <input data-exp-f="end" class="${EIN_SM} w-[4.5rem] font-bold tabular-nums" placeholder="${escapeHtml(CV_PH.expEnd)}" value="${escapeHtml(job.end)}" />
          </div>
        </div>
        ${bulletInputs("data-bullet", bullets, CV_PH.bullet)}
      </div>`;
    })
    .join("");
}

function eduRowsSanchez(draft) {
  return (draft.education || [])
    .map((ed, i) => {
      const bullets = (ed.bullets && ed.bullets.length) ? ed.bullets : ["", ""];
      return `
      <div data-edu-job="${i}" class="cv-edu-row cv-sanchez-edu mb-4 last:mb-0">
        <div class="print:hidden mb-1 flex justify-end text-xs text-zinc-500">
          <button type="button" data-action="remove-edu" data-i="${i}" class="${RM} ${(draft.education || []).length < 2 ? "hidden" : ""}">Remove</button>
        </div>
        <input data-edu-f="degree" class="${EIN_SM} block w-full text-[13px] font-bold text-zinc-900" placeholder="${escapeHtml(CV_PH.eduDegree)}" value="${escapeHtml(ed.degree)}" />
        <div class="mt-0.5 flex flex-wrap items-baseline gap-x-1 text-[13px] text-zinc-700">
          <input data-edu-f="school" class="${EIN_SM} inline min-w-[5rem] font-normal" placeholder="${escapeHtml(CV_PH.eduSchool)}" value="${escapeHtml(ed.school)}" />
          <span class="text-zinc-400">·</span>
          <input data-edu-f="start" class="${EIN_SM} inline w-[3rem] tabular-nums" placeholder="${escapeHtml(CV_PH.eduStart)}" value="${escapeHtml(ed.start)}" />
          <span class="text-zinc-400">-</span>
          <input data-edu-f="end" class="${EIN_SM} inline w-[3rem] tabular-nums" placeholder="${escapeHtml(CV_PH.eduEnd)}" value="${escapeHtml(ed.end)}" />
        </div>
        ${bulletInputs("data-edu-bullet", bullets, "Major, GPA, or details")}
      </div>`;
    })
    .join("");
}

function refRowsSanchez(draft) {
  const refs = draft.references || [];
  return refs
    .map(
      (ref, i) => `
      <div data-ref-row="${i}" class="cv-sanchez-ref min-w-0">
        <input data-ref-f="name" class="${EIN_SM} block w-full text-[13px] font-bold text-zinc-900" placeholder="Reference name" value="${escapeHtml(ref.name || "")}" />
        <input data-ref-f="title" class="${EIN_SM} mt-0.5 block w-full text-[12px] text-zinc-700" placeholder="Company / title" value="${escapeHtml(ref.title || "")}" />
        <input data-ref-f="phone" class="${EIN_SM} mt-1 block w-full text-[12px] text-zinc-600" placeholder="Phone" value="${escapeHtml(ref.phone || "")}" />
        <input data-ref-f="email" class="${EIN_SM} mt-0.5 block w-full text-[12px] text-zinc-600" placeholder="Email" value="${escapeHtml(ref.email || "")}" />
      </div>`,
    )
    .join("");
}

export function blockSummarySanchez(draft) {
  return `<section class="cv-sanchez-section cv-avoid-break">${secSanchez("Summary")}<textarea data-f="summary" class="${EIN_TX} text-[13px] leading-[1.55] text-zinc-700" rows="4" placeholder="${escapeHtml(CV_PH.summary)}">${escapeHtml(draft.summary)}</textarea></section>`;
}

export function blockExpSanchez(draft) {
  return `<section class="cv-sanchez-section cv-avoid-break">${secSanchez("Work Experience")}${expRowsSanchez(draft)}<button type="button" data-action="add-exp" class="${BTN} mt-2">${PLUS} Add role</button></section>`;
}

export function blockEduSkillsSanchez(draft, ui, tplId) {
  return `
  <section class="cv-sanchez-section cv-avoid-break">
    <div class="cv-sanchez-split grid grid-cols-2 gap-6">
      <div class="min-w-0">
        ${secSanchez("Education")}
        ${eduRowsSanchez(draft)}
        <button type="button" data-action="add-edu" class="${BTN} mt-2">${PLUS} Add education</button>
      </div>
      <div class="min-w-0">
        ${secSanchez("Key Skills")}
        ${skillsEditorBlock(draft, ui, tplId, { textareaCls: `${EIN_TX} mb-2 print:hidden`, rows: 5 })}
      </div>
    </div>
  </section>`;
}

export function blockReferencesSanchez(draft) {
  return `
  <section class="cv-sanchez-section cv-avoid-break">
    ${secSanchez("References")}
    <div class="cv-sanchez-refs grid grid-cols-2 gap-6">${refRowsSanchez(draft)}</div>
  </section>`;
}

export function renderSanchezPage(draft, tplId, ui) {
  return `${headerSanchez(draft, ui)}${blockSummarySanchez(draft)}${blockExpSanchez(draft)}${blockEduSkillsSanchez(draft, ui, tplId)}${blockReferencesSanchez(draft)}`;
}
