import { CV_PH } from "./cv-placeholders.js";
import { escapeHtml } from "../escape-html.js";
import { EIN, EIN_H1, EIN_SM, EIN_TX, BTN, RM } from "./cv-editor-styles.js";

const PLUS = `<span class="text-xs">+</span>`;

function contactDot() {
  return `<span class="mx-2 shrink-0 text-zinc-500" aria-hidden="true">•</span>`;
}

function ruleSchumacher() {
  return `<hr class="cv-schumacher-rule" aria-hidden="true" />`;
}

function secSchumacher(title) {
  return `<h2 class="cv-schumacher-sec cv-section-h2 mb-3 text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-900">${escapeHtml(title)}</h2>`;
}

/** Centered caps header + two-line contact */
export function headerSchumacher(draft) {
  const website = (draft.links && draft.links[0]) || { label: "", url: "" };
  return `
  <header class="cv-schumacher-header text-center">
    <input data-f="fullName" type="text" class="${EIN_H1} cv-schumacher-name mx-auto block w-full text-center text-[1.5rem] font-bold uppercase tracking-[0.14em] text-zinc-900 placeholder:normal-case placeholder:tracking-normal" placeholder="${escapeHtml(CV_PH.fullName)}" value="${escapeHtml(draft.fullName)}" />
    <input data-f="title" type="text" class="${EIN} mx-auto mt-2 block w-full text-center text-[0.85rem] font-bold uppercase tracking-[0.12em] text-zinc-900 placeholder:normal-case placeholder:font-normal" placeholder="${escapeHtml(CV_PH.title)}" value="${escapeHtml(draft.title)}" />
    <div class="cv-schumacher-contact mt-3 text-[11px] text-zinc-800">
      <div class="cv-schumacher-contact-row">
        <input data-f="location" type="text" class="${EIN_SM} cv-schumacher-contact-field" placeholder="${escapeHtml(CV_PH.location)}" value="${escapeHtml(draft.location)}" />
        ${contactDot()}
        <input data-f="phone" type="text" class="${EIN_SM} cv-schumacher-contact-field" placeholder="${escapeHtml(CV_PH.phone)}" value="${escapeHtml(draft.phone)}" />
        ${contactDot()}
        <input data-f="email" type="text" class="${EIN_SM} cv-schumacher-contact-field" placeholder="${escapeHtml(CV_PH.email)}" value="${escapeHtml(draft.email)}" />
        ${contactDot()}
        <input data-lf="url" data-link-row="0" class="${EIN_SM} cv-schumacher-contact-field" placeholder="Website URL" value="${escapeHtml(website.url)}" />
        <input data-lf="label" data-link-row="0" type="hidden" value="${escapeHtml(website.label || "Website")}" />
      </div>
    </div>
  </header>`;
}

function bulletInputs(dataAttr, bullets, ph) {
  const items = (bullets || ["", "", ""]).concat(["", ""]).slice(0, 8);
  return `<ul class="cv-schumacher-bullets m-0 mt-2 list-disc space-y-1.5 pl-5 text-[12px] leading-[1.55] text-zinc-800">${items
    .map(
      (b, bi) =>
        `<li><input ${dataAttr}="${bi}" class="${EIN_SM} w-full text-[12px]" placeholder="${escapeHtml(ph)}" value="${escapeHtml(b)}" /></li>`,
    )
    .join("")}</ul>`;
}

function expRowsSchumacher(draft) {
  return (draft.experience || [])
    .map((job, i) => {
      const bullets = job.bullets || ["", "", ""];
      return `
      <div data-exp-job="${i}" class="cv-exp-row cv-schumacher-entry mb-5 last:mb-0">
        <button type="button" data-action="remove-exp" data-i="${i}" class="${RM} cv-schumacher-remove print:hidden ${(draft.experience || []).length < 2 ? "hidden" : ""}">Remove</button>
        <div class="cv-schumacher-exp-head">
          <input data-exp-f="role" class="${EIN_SM} cv-schumacher-role text-[12px] font-bold text-zinc-900" placeholder="${escapeHtml(CV_PH.expRole)}" value="${escapeHtml(job.role)}" />
          <div class="cv-schumacher-exp-dates text-[12px] text-zinc-800">
            <input data-exp-f="start" class="${EIN_SM} inline w-[5.5rem] text-right tabular-nums" placeholder="${escapeHtml(CV_PH.expStart)}" value="${escapeHtml(job.start)}" />
            <span class="mx-1 text-zinc-500">–</span>
            <input data-exp-f="end" class="${EIN_SM} inline w-[5.5rem] tabular-nums" placeholder="${escapeHtml(CV_PH.expEnd)}" value="${escapeHtml(job.end)}" />
          </div>
        </div>
        <input data-exp-f="company" type="hidden" value="${escapeHtml(job.company)}" />
        ${bulletInputs("data-bullet", bullets, CV_PH.bullet)}
      </div>`;
    })
    .join("");
}

function eduRowsSchumacher(draft) {
  return (draft.education || [])
    .map((ed, i) => {
      return `
      <div data-edu-job="${i}" class="cv-edu-row cv-schumacher-edu mb-4 last:mb-0">
        <button type="button" data-action="remove-edu" data-i="${i}" class="${RM} cv-schumacher-remove print:hidden ${(draft.education || []).length < 2 ? "hidden" : ""}">Remove</button>
        <input data-edu-f="degree" class="${EIN_SM} block w-full text-[12px] font-bold text-zinc-900" placeholder="${escapeHtml(CV_PH.eduDegree)}" value="${escapeHtml(ed.degree)}" />
        <div class="mt-1 flex items-baseline gap-1.5 pl-4 text-[12px] text-zinc-800">
          <span aria-hidden="true">•</span>
          <span>Graduated:</span>
          <input data-edu-f="end" class="${EIN_SM} inline min-w-[5rem] flex-1 text-[12px]" placeholder="June, 2017" value="${escapeHtml(ed.end)}" />
        </div>
        <input data-edu-f="school" type="hidden" value="${escapeHtml(ed.school)}" />
        <input data-edu-f="start" type="hidden" value="${escapeHtml(ed.start)}" />
      </div>`;
    })
    .join("");
}

export function renderSchumacherPage(draft) {
  return `
  <div class="cv-schumacher-frame">
    ${headerSchumacher(draft)}
    ${ruleSchumacher()}
    <section class="cv-schumacher-section cv-avoid-break">
      ${secSchumacher("Summary")}
      <textarea data-f="summary" class="${EIN_TX} text-[12px] leading-[1.65] text-zinc-800" rows="5" placeholder="${escapeHtml(CV_PH.summary)}">${escapeHtml(draft.summary)}</textarea>
    </section>
    ${ruleSchumacher()}
    <section class="cv-schumacher-section cv-avoid-break">
      ${secSchumacher("Work Experience")}
      ${expRowsSchumacher(draft)}
      <button type="button" data-action="add-exp" class="${BTN} mt-2">${PLUS} Add role</button>
    </section>
    ${ruleSchumacher()}
    <section class="cv-schumacher-section cv-avoid-break">
      ${secSchumacher("Education")}
      ${eduRowsSchumacher(draft)}
      <button type="button" data-action="add-edu" class="${BTN} mt-2">${PLUS} Add education</button>
    </section>
  </div>`;
}
