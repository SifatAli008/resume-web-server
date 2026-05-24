import { CV_PH } from "./cv-placeholders.js";
import { escapeHtml } from "../escape-html.js";
import { EIN, EIN_H1, EIN_SM, EIN_TX, BTN, RM } from "./cv-editor-styles.js";

const PLUS = `<span class="text-xs">+</span>`;

function secAlvarado(title) {
  return `<h2 class="cv-alvarado-sec-title cv-section-h2 mb-2.5 mt-5 text-[11px] font-bold uppercase tracking-[0.08em] text-zinc-900 first:mt-0">${escapeHtml(title)}:</h2>`;
}

function contactSep() {
  return `<span class="mx-2 shrink-0 text-zinc-400" aria-hidden="true">|</span>`;
}

function parseSkillLines(text) {
  return String(text || "")
    .split(/\n/)
    .flatMap((line) => {
      const trimmed = line.trim();
      if (!trimmed) return [];
      const colon = trimmed.indexOf(":");
      const payload = colon > 0 && colon < 32 ? trimmed.slice(colon + 1) : trimmed;
      return payload
        .split(/\s*[·•|,;]\s*/)
        .map((s) => s.trim())
        .filter(Boolean);
    })
    .slice(0, 16);
}

function parseLangLines(text) {
  return String(text || "")
    .split(/\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, 8);
}

function bulletList(items, ph) {
  const rows = (items.length ? items : [ph]).slice(0, 12);
  return `<ul class="cv-alvarado-bullets m-0 list-none space-y-1.5 p-0">${rows
    .map(
      (line) =>
        `<li class="flex gap-2.5 text-[12px] leading-[1.45] text-zinc-800"><span class="mt-[0.4rem] h-[5px] w-[5px] shrink-0 rounded-full bg-zinc-700" aria-hidden="true"></span><span>${escapeHtml(line)}</span></li>`,
    )
    .join("")}</ul>`;
}

function bulletInputs(dataAttr, bullets, ph) {
  const items = (bullets || ["", ""]).concat(["", ""]).slice(0, 6);
  return `<ul class="cv-alvarado-bullets m-0 list-none space-y-1.5 p-0">${items
    .map(
      (b, bi) =>
        `<li class="flex gap-2.5 text-[12px] leading-[1.45] text-zinc-800"><span class="mt-[0.4rem] h-[5px] w-[5px] shrink-0 rounded-full bg-zinc-700" aria-hidden="true"></span><input ${dataAttr}="${bi}" class="${EIN_SM} min-w-0 flex-1 text-[12px]" placeholder="${escapeHtml(ph)}" value="${escapeHtml(b)}" /></li>`,
    )
    .join("")}</ul>`;
}

/** Full-width header: name, title, contact row */
export function headerAlvarado(draft) {
  const website = (draft.links && draft.links[0]) || { label: "", url: "" };
  return `
  <header class="cv-alvarado-header pb-5 pt-1">
    <input data-f="fullName" type="text" class="${EIN_H1} cv-alvarado-name block w-full text-[1.75rem] font-bold leading-tight text-zinc-900 placeholder:text-zinc-400" placeholder="${escapeHtml(CV_PH.fullName)}" value="${escapeHtml(draft.fullName)}" />
    <input data-f="title" type="text" class="${EIN} mt-1.5 block w-full text-[0.92rem] font-normal text-zinc-800 placeholder:text-zinc-400" placeholder="${escapeHtml(CV_PH.title)}" value="${escapeHtml(draft.title)}" />
    <div class="mt-2.5 flex flex-wrap items-center text-[11px] text-zinc-700">
      <input data-f="location" type="text" class="${EIN} inline min-w-[5rem] max-w-[14rem] text-[11px]" placeholder="${escapeHtml(CV_PH.location)}" value="${escapeHtml(draft.location)}" />
      ${contactSep()}
      <input data-f="email" type="text" class="${EIN} inline min-w-[5rem] max-w-[14rem] text-[11px]" placeholder="${escapeHtml(CV_PH.email)}" value="${escapeHtml(draft.email)}" />
      ${contactSep()}
      <input data-lf="url" data-link-row="0" class="${EIN} inline min-w-[6rem] flex-1 text-[11px]" placeholder="Website URL" value="${escapeHtml(website.url)}" />
      <input data-lf="label" data-link-row="0" type="hidden" value="${escapeHtml(website.label || "Website")}" />
    </div>
  </header>`;
}

function eduRowsAlvarado(draft) {
  return (draft.education || [])
    .map((ed, i) => {
      return `
      <div data-edu-job="${i}" class="cv-edu-row cv-alvarado-edu mb-5 last:mb-0">
        <button type="button" data-action="remove-edu" data-i="${i}" class="${RM} cv-alvarado-remove print:hidden ${(draft.education || []).length < 2 ? "hidden" : ""}">Remove</button>
        <input data-edu-f="school" class="${EIN_SM} block w-full text-[12px] font-bold uppercase leading-snug" placeholder="${escapeHtml(CV_PH.eduSchool)}" value="${escapeHtml(ed.school)}" />
        <div class="cv-alvarado-edu-dates mt-0.5 flex items-baseline gap-0.5 text-[12px] font-bold tabular-nums text-zinc-900">
          <input data-edu-f="start" class="${EIN_SM} w-[2.75rem] font-bold tabular-nums" placeholder="${escapeHtml(CV_PH.eduStart)}" value="${escapeHtml(ed.start)}" />
          <span>-</span>
          <input data-edu-f="end" class="${EIN_SM} w-[2.75rem] font-bold tabular-nums" placeholder="${escapeHtml(CV_PH.eduEnd)}" value="${escapeHtml(ed.end)}" />
        </div>
        <input data-edu-f="degree" class="${EIN_SM} mt-0.5 block w-full text-[12px] italic text-zinc-700" placeholder="${escapeHtml(CV_PH.eduDegree)}" value="${escapeHtml(ed.degree)}" />
      </div>`;
    })
    .join("");
}

function expRowsAlvarado(draft) {
  return (draft.experience || [])
    .map((job, i) => {
      const bullets = job.bullets || ["", "", ""];
      return `
      <div data-exp-job="${i}" class="cv-exp-row cv-alvarado-entry mb-5 last:mb-0">
        <button type="button" data-action="remove-exp" data-i="${i}" class="${RM} cv-alvarado-remove print:hidden ${(draft.experience || []).length < 2 ? "hidden" : ""}">Remove</button>
        <div class="cv-alvarado-exp-head mb-0.5">
          <input data-exp-f="role" class="${EIN_SM} cv-alvarado-role text-[12px] font-bold uppercase" placeholder="${escapeHtml(CV_PH.expRole)}" value="${escapeHtml(job.role)}" />
          <div class="cv-alvarado-exp-dates">
            <input data-exp-f="start" class="${EIN_SM} font-bold tabular-nums" placeholder="${escapeHtml(CV_PH.expStart)}" value="${escapeHtml(job.start)}" />
            <span>-</span>
            <input data-exp-f="end" class="${EIN_SM} font-bold uppercase tabular-nums" placeholder="${escapeHtml(CV_PH.expEnd)}" value="${escapeHtml(job.end)}" />
          </div>
        </div>
        <input data-exp-f="company" class="${EIN_SM} mb-2 block w-full text-[12px] text-zinc-800" placeholder="${escapeHtml(CV_PH.expCompany)}" value="${escapeHtml(job.company)}" />
        ${bulletInputs("data-bullet", bullets, CV_PH.bullet)}
      </div>`;
    })
    .join("");
}

function refRowsAlvarado(draft) {
  return (draft.references || [])
    .map(
      (ref, i) => `
      <div data-ref-row="${i}" class="cv-alvarado-ref min-w-0">
        <input data-ref-f="name" class="${EIN_SM} block w-full text-[12px] font-bold uppercase" placeholder="Reference name" value="${escapeHtml(ref.name || "")}" />
        <input data-ref-f="title" class="${EIN_SM} mt-1 block w-full text-[12px] text-zinc-700" placeholder="Company / title" value="${escapeHtml(ref.title || "")}" />
        <p class="mt-2 text-[11px] leading-snug text-zinc-800">
          <span class="font-bold">Phone:</span>
          <input data-ref-f="phone" class="${EIN_SM} ml-1 inline min-w-[5rem] text-[11px]" placeholder="Phone" value="${escapeHtml(ref.phone || "")}" />
        </p>
        <p class="mt-0.5 text-[11px] leading-snug text-zinc-800">
          <span class="font-bold">Email:</span>
          <input data-ref-f="email" class="${EIN_SM} ml-1 inline min-w-[5rem] text-[11px]" placeholder="Email" value="${escapeHtml(ref.email || "")}" />
        </p>
      </div>`,
    )
    .join("");
}

function blockSkillsAlvarado(draft) {
  const skillLines = parseSkillLines(draft.skills);
  const fallback = parseSkillLines(CV_PH.skills);
  return `
    ${secAlvarado("Skills")}
    <textarea data-f="skills" class="${EIN_TX} cv-alvarado-skills-input mb-2 text-[12px] print:hidden" rows="4" placeholder="${escapeHtml(CV_PH.skills)}">${escapeHtml(draft.skills)}</textarea>
    <div class="cv-alvarado-skills-preview" data-skills-preview>${bulletList(skillLines, fallback[0] || "Skill")}</div>`;
}

function blockLanguagesAlvarado(draft) {
  const langLines = parseLangLines(draft.languages);
  const fallback = parseLangLines(CV_PH.languages);
  return `
    ${secAlvarado("Language")}
    <textarea data-f="languages" class="${EIN_TX} cv-alvarado-lang-input mb-2 text-[12px] print:hidden" rows="3" placeholder="${escapeHtml(CV_PH.languages)}">${escapeHtml(draft.languages)}</textarea>
    <div class="cv-alvarado-lang-preview" data-lang-preview>${bulletList(langLines.length ? langLines : fallback, fallback[0])}</div>`;
}

export function renderAlvaradoSkillsPreviewHtml(skillsText) {
  const skillLines = parseSkillLines(skillsText);
  const fallback = parseSkillLines(CV_PH.skills);
  return bulletList(skillLines, fallback[0] || "Skill");
}

export function renderAlvaradoLangPreviewHtml(langText) {
  const langLines = parseLangLines(langText);
  const fallback = parseLangLines(CV_PH.languages);
  return bulletList(langLines.length ? langLines : fallback, fallback[0]);
}

function sidebarAlvarado(draft) {
  return `
  <aside class="cv-alvarado-sidebar min-w-0">
    <section class="cv-alvarado-section cv-avoid-break">
      ${secAlvarado("Education")}
      ${eduRowsAlvarado(draft)}
      <button type="button" data-action="add-edu" class="${BTN} mt-2">${PLUS} Add education</button>
    </section>
    <section class="cv-alvarado-section cv-avoid-break cv-alvarado-edit-skills">
      ${blockSkillsAlvarado(draft)}
    </section>
    <section class="cv-alvarado-section cv-avoid-break cv-alvarado-edit-lang">
      ${blockLanguagesAlvarado(draft)}
    </section>
  </aside>`;
}

function mainAlvarado(draft) {
  return `
  <div class="cv-alvarado-main min-w-0">
    <section class="cv-alvarado-section cv-avoid-break">
      ${secAlvarado("Summary")}
      <textarea data-f="summary" class="${EIN_TX} text-[12px] leading-[1.6] text-zinc-800" rows="4" placeholder="${escapeHtml(CV_PH.summary)}">${escapeHtml(draft.summary)}</textarea>
    </section>
    <section class="cv-alvarado-section cv-avoid-break">
      ${secAlvarado("Experience")}
      ${expRowsAlvarado(draft)}
      <button type="button" data-action="add-exp" class="${BTN} mt-2">${PLUS} Add role</button>
    </section>
    <section class="cv-alvarado-section cv-avoid-break">
      ${secAlvarado("References")}
      <div class="cv-alvarado-refs">${refRowsAlvarado(draft)}</div>
    </section>
  </div>`;
}

export function renderAlvaradoPage(draft) {
  return `
  <div class="cv-alvarado-frame">
    ${headerAlvarado(draft)}
    <div class="cv-alvarado-body">${sidebarAlvarado(draft)}${mainAlvarado(draft)}</div>
  </div>`;
}
