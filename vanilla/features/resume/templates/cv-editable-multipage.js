import { CV_PH } from "./cv-placeholders.js";
import { getTemplateUi } from "./cv-template-ui.js";
import {
  articlePhotoClass,
  pageShell,
  photoEditorBar,
  photoSlot,
  sec,
} from "./cv-shared-ui.js";
import { linksDisplay, linksEditor, readLinksFromRoot } from "./cv-links-ui.js";
import { renderSkillsVisual, skillsEditorBlock } from "./cv-skills-ui.js";
import { escapeHtml } from "../escape-html.js";
import { defaultResumeDraft, normalizeResumeDraft } from "../draft.js";
import { resumeIcon } from "../resume-icons.js";

const SCROLL = "resize-none [field-sizing:content] scrollbar-none overflow-y-auto";
const EIN =
  "w-full border-0 border-b border-transparent bg-transparent px-0 py-0.5 outline-none ring-0 placeholder:text-zinc-400 focus:border-zinc-300 focus:bg-zinc-50/40 print:border-0 print:bg-transparent";
const EIN_DARK =
  "w-full border-0 border-b border-transparent bg-transparent px-0 py-0.5 outline-none ring-0 text-zinc-100 placeholder:text-zinc-500 focus:border-white/30 focus:bg-white/5 print:border-0 print:bg-transparent";
const EIN_H1 = `${EIN} text-[1.65rem] font-bold leading-tight text-zinc-950`;
const EIN_TITLE = `${EIN} text-[14px] font-medium text-zinc-600`;
const EIN_SM = `${EIN} text-[13px] text-zinc-800`;
const EIN_TX = `${EIN} ${SCROLL} min-h-[4rem] max-h-[min(20rem,45vh)] w-full text-[13px] leading-[1.55] print:max-h-none print:overflow-visible`;
const EIN_TX_DARK = `${EIN_DARK} ${SCROLL} min-h-[3rem] max-h-[min(16rem,40vh)] w-full text-[13px] leading-[1.55] print:max-h-none print:overflow-visible`;
const BTN =
  "print:hidden inline-flex items-center gap-1 rounded border border-dashed border-zinc-400 px-2 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-50";
const RM = "print:hidden text-xs text-red-700 hover:text-red-900";
const PLUS = resumeIcon("plus", "h-3.5 w-3.5");

function tplNum(templateId) {
  const m = /^resume_fluvo_(\d+)$/.exec(String(templateId || ""));
  return m ? Number(m[1]) : 1;
}

const ADD_LINK_BTN = `<button type="button" data-action="add-link" class="${BTN}">${PLUS}Add link</button>`;

function headerLinks(draft, ui, dark = false) {
  if (ui.linksZone !== "header") return "";
  return linksEditor(draft, ui, {
    dark,
    addBtn: ADD_LINK_BTN,
    inputCls: EIN_SM,
    inputClsDark: EIN_DARK,
  });
}

function sidebarLinksBlock(draft, ui, dark, editable = true) {
  if (ui.linksZone !== "sidebar") return "";
  if (editable) {
    const btn = dark
      ? `<button type="button" data-action="add-link" class="${BTN} border-white/40 text-zinc-200">${PLUS}Add link</button>`
      : ADD_LINK_BTN;
    return linksEditor(draft, ui, { dark, addBtn: btn, inputCls: EIN_SM, inputClsDark: EIN_DARK });
  }
  return linksDisplay(draft, ui, { dark });
}

function railLinksBlock(draft, ui, editable = true) {
  if (ui.linksZone !== "rail") return "";
  if (editable) {
    return `${sec("Links", ui)}${linksEditor(draft, ui, { addBtn: ADD_LINK_BTN, inputCls: EIN_SM, inputClsDark: EIN_DARK })}`;
  }
  return `${sec("Links", ui)}${linksDisplay(draft, ui)}`;
}

function expRows(draft, slice = null) {
  const jobs = slice ? (draft.experience || []).slice(...slice) : draft.experience || [];
  return jobs
    .map((job, i) => {
      const idx = slice ? slice[0] + i : i;
      const bullets = (job.bullets || ["", "", ""]).concat(["", ""]).slice(0, 6);
      const bHtml = bullets
        .map(
          (b, bi) =>
            `<input data-bullet="${bi}" class="${EIN_SM} mb-1 block w-full" placeholder="${escapeHtml(CV_PH.bullet)}" value="${escapeHtml(b)}" />`,
        )
        .join("");
      return `
      <div data-exp-job="${idx}" class="mb-4 border-b border-zinc-100/80 pb-4 last:border-0">
        <div class="print:hidden mb-1 flex justify-between text-xs text-zinc-500">
          <span>Role ${idx + 1}</span>
          <button type="button" data-action="remove-exp" data-i="${idx}" class="${RM} ${(draft.experience || []).length < 2 ? "hidden" : ""}">Remove</button>
        </div>
        <div class="grid grid-cols-[6.75rem_1fr] gap-x-4 gap-y-1">
          <input data-exp-f="start" class="${EIN_SM} text-[11px] text-zinc-500 tabular-nums" placeholder="${escapeHtml(CV_PH.expStart)}" value="${escapeHtml(job.start)}" />
          <input data-exp-f="role" class="${EIN_SM} font-semibold text-zinc-950" placeholder="${escapeHtml(CV_PH.expRole)}" value="${escapeHtml(job.role)}" />
          <input data-exp-f="end" class="${EIN_SM} text-[11px] text-zinc-500 tabular-nums" placeholder="${escapeHtml(CV_PH.expEnd)}" value="${escapeHtml(job.end)}" />
          <input data-exp-f="company" class="${EIN_SM} text-zinc-600" placeholder="${escapeHtml(CV_PH.expCompany)}" value="${escapeHtml(job.company)}" />
        </div>
        <div class="mt-2 grid grid-cols-[6.75rem_1fr]"><div class="col-start-2">${bHtml}</div></div>
      </div>`;
    })
    .join("");
}

function projRows(draft) {
  return (draft.projects || [])
    .map((p, i) => {
      const bullets = (p.bullets || ["", ""]).concat([""]).slice(0, 4);
      const bHtml = bullets
        .map(
          (b, bi) =>
            `<input data-proj-bullet="${bi}" class="${EIN_SM} mb-1 block w-full" placeholder="${escapeHtml(CV_PH.bullet)}" value="${escapeHtml(b)}" />`,
        )
        .join("");
      return `
      <div data-proj-row="${i}" class="mb-4 border-b border-zinc-50 pb-4">
        <div class="print:hidden mb-1 flex justify-between text-xs text-zinc-500">
          <span>Project ${i + 1}</span>
          <button type="button" data-action="remove-proj" data-i="${i}" class="${RM} ${(draft.projects || []).length < 2 ? "hidden" : ""}">Remove</button>
        </div>
        <input data-proj-f="name" class="${EIN_SM} font-semibold text-zinc-950" placeholder="${escapeHtml(CV_PH.projName)}" value="${escapeHtml(p.name)}" />
        <input data-proj-f="context" class="${EIN_SM} mt-1 text-zinc-600" placeholder="${escapeHtml(CV_PH.projContext)}" value="${escapeHtml(p.context)}" />
        <div class="mt-1 grid grid-cols-2 gap-2">
          <input data-proj-f="start" class="${EIN_SM} text-[11px] text-zinc-500" placeholder="${escapeHtml(CV_PH.projStart)}" value="${escapeHtml(p.start)}" />
          <input data-proj-f="end" class="${EIN_SM} text-[11px] text-zinc-500" placeholder="${escapeHtml(CV_PH.projEnd)}" value="${escapeHtml(p.end)}" />
        </div>
        <div class="mt-2">${bHtml}</div>
      </div>`;
    })
    .join("");
}

function eduRows(draft) {
  return (draft.education || [])
    .map(
      (ed, i) => `
      <div data-edu-job="${i}" class="mb-3 grid grid-cols-[6.75rem_1fr] gap-x-4 gap-y-1">
        <input data-edu-f="start" class="${EIN_SM} text-[11px] text-zinc-500" placeholder="${escapeHtml(CV_PH.eduStart)}" value="${escapeHtml(ed.start)}" />
        <input data-edu-f="degree" class="${EIN_SM} font-semibold" placeholder="${escapeHtml(CV_PH.eduDegree)}" value="${escapeHtml(ed.degree)}" />
        <input data-edu-f="end" class="${EIN_SM} text-[11px] text-zinc-500" placeholder="${escapeHtml(CV_PH.eduEnd)}" value="${escapeHtml(ed.end)}" />
        <input data-edu-f="school" class="${EIN_SM} text-zinc-600" placeholder="${escapeHtml(CV_PH.eduSchool)}" value="${escapeHtml(ed.school)}" />
      </div>`,
    )
    .join("");
}

function contactInputs(draft, ui, dark = false) {
  const c = dark ? EIN_DARK : EIN_SM;
  const ic = ui.iconContact || (dark ? "text-sky-300" : "text-blue-600");
  const row = (icon, field, type, ph) => `
    <label class="mt-1.5 flex items-center gap-2 first:mt-0">
      ${resumeIcon(icon, `h-4 w-4 shrink-0 ${ic}`)}
      <input data-f="${field}" type="${type}" class="${c} min-w-0 flex-1" placeholder="${escapeHtml(ph)}" value="${escapeHtml(draft[field] || "")}" />
    </label>`;
  return `${row("mail", "email", "email", CV_PH.email)}${row("phone", "phone", "text", CV_PH.phone)}${row("map", "location", "text", CV_PH.location)}`;
}

function headerStandard(draft, ui) {
  return `
  <header class="mb-6 border-b border-zinc-200 pb-5">
    <div class="flex items-start gap-4">
      ${photoSlot(draft, ui)}
      <div class="min-w-0 flex-1">
        <input data-f="fullName" type="text" class="${EIN_H1}" placeholder="${escapeHtml(CV_PH.fullName)}" value="${escapeHtml(draft.fullName)}" />
        <input data-f="title" type="text" class="${EIN_TITLE} mt-1 ${ui.h2}" placeholder="${escapeHtml(CV_PH.title)}" value="${escapeHtml(draft.title)}" />
        <div class="mt-2.5 flex flex-wrap gap-x-4 gap-y-1">${contactInputs(draft, ui)}</div>
        <div class="mt-2">${headerLinks(draft, ui)}</div>
      </div>
    </div>
  </header>`;
}

function headerRibbon(draft, ui) {
  return `
  <header class="mb-6 overflow-hidden rounded-sm">
    <div class="${ui.ribbon} flex items-center gap-4 px-4 py-4">
      ${photoSlot(draft, ui, { dark: true, size: "sm" })}
      <div class="min-w-0 flex-1">
        <input data-f="fullName" type="text" class="${EIN} text-[1.6rem] font-bold text-white placeholder:text-white/50" placeholder="${escapeHtml(CV_PH.fullName)}" value="${escapeHtml(draft.fullName)}" />
        <input data-f="title" type="text" class="${EIN} mt-1 block text-sm text-white/90 placeholder:text-white/50" placeholder="${escapeHtml(CV_PH.title)}" value="${escapeHtml(draft.title)}" />
      </div>
    </div>
    <div class="border border-t-0 border-zinc-200 bg-zinc-50/80 px-4 py-2">${contactInputs(draft, ui)}</div>
    <div class="px-4 py-2">${headerLinks(draft, ui)}</div>
  </header>`;
}

function headerSerif(draft, ui) {
  return `
  <header class="mb-6 border-b-2 border-zinc-900 pb-5 text-center">
    <div class="mb-3 flex justify-center">${photoSlot(draft, ui, { size: "lg" })}</div>
    <input data-f="fullName" type="text" class="${EIN} mx-auto block max-w-lg text-center text-[1.5rem] font-bold uppercase tracking-wide text-zinc-950 placeholder:text-zinc-400" placeholder="${escapeHtml(CV_PH.fullName)}" value="${escapeHtml(draft.fullName)}" />
    <input data-f="title" type="text" class="${EIN} mx-auto mt-2 block max-w-lg text-center text-xs uppercase tracking-[0.2em] text-zinc-600 placeholder:text-zinc-400" placeholder="${escapeHtml(CV_PH.title)}" value="${escapeHtml(draft.title)}" />
    <div class="mx-auto mt-3 max-w-md text-center">${contactInputs(draft, ui)}</div>
    <div class="mt-2">${headerLinks(draft, ui)}</div>
  </header>`;
}

function headerCompact(draft, ui) {
  return `
  <header class="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
    <div class="flex min-w-0 flex-1 items-end gap-4">
      ${photoSlot(draft, ui, { size: "sm" })}
      <div class="min-w-0 flex-1">
      <input data-f="fullName" type="text" class="${EIN} text-xl font-bold text-zinc-950" placeholder="${escapeHtml(CV_PH.fullName)}" value="${escapeHtml(draft.fullName)}" />
      <input data-f="title" type="text" class="${EIN} mt-0.5 block text-xs font-bold uppercase tracking-[0.18em] ${ui.h2}" placeholder="${escapeHtml(CV_PH.title)}" value="${escapeHtml(draft.title)}" />
      </div>
    </div>
    <div class="text-right text-[12px]">${contactInputs(draft, ui)}</div>
  </header>
  <div class="mb-5">${headerLinks(draft, ui)}</div>`;
}

function headerBanner(draft, ui) {
  return `
  <div class="mb-4 bg-zinc-900 px-4 py-2.5 text-center text-[11px] text-white">
    <input data-f="email" class="${EIN} inline min-w-[8rem] text-white placeholder:text-zinc-500" placeholder="${escapeHtml(CV_PH.email)}" value="${escapeHtml(draft.email)}" />
    <span class="mx-2 opacity-40">·</span>
    <input data-f="phone" class="${EIN} inline min-w-[6rem] text-white placeholder:text-zinc-500" placeholder="${escapeHtml(CV_PH.phone)}" value="${escapeHtml(draft.phone)}" />
    <span class="mx-2 opacity-40">·</span>
    <input data-f="location" class="${EIN} inline min-w-[8rem] text-white placeholder:text-zinc-500" placeholder="${escapeHtml(CV_PH.location)}" value="${escapeHtml(draft.location)}" />
  </div>
  <header class="mb-5 flex items-start gap-4">
    ${photoSlot(draft, ui)}
    <div class="min-w-0 flex-1">
      <input data-f="fullName" type="text" class="${EIN_H1}" placeholder="${escapeHtml(CV_PH.fullName)}" value="${escapeHtml(draft.fullName)}" />
      <input data-f="title" type="text" class="${EIN_TITLE} mt-1" placeholder="${escapeHtml(CV_PH.title)}" value="${escapeHtml(draft.title)}" />
    </div>
  </header>`;
}

function pickHeader(draft, ui) {
  if (ui.header === "ribbon") return headerRibbon(draft, ui);
  if (ui.header === "serif") return headerSerif(draft, ui);
  if (ui.header === "compact") return headerCompact(draft, ui);
  if (ui.header === "banner") return headerBanner(draft, ui);
  return headerStandard(draft, ui);
}

function sidebarAside(draft, ui, tplId, editableLinks = true) {
  return `
  <aside class="cv-sidebar w-full shrink-0 p-5 sm:w-[30%] sm:max-w-[220px] print:w-[28%] ${ui.sidebar}">
    <div class="mb-4 flex justify-center">${photoSlot(draft, ui, { dark: true, size: "md" })}</div>
    <input data-f="fullName" type="text" class="${EIN_DARK} text-xl font-bold" placeholder="${escapeHtml(CV_PH.fullName)}" value="${escapeHtml(draft.fullName)}" />
    <input data-f="title" type="text" class="${EIN_DARK} mt-1 block text-[11px] font-semibold uppercase tracking-wider opacity-80" placeholder="${escapeHtml(CV_PH.title)}" value="${escapeHtml(draft.title)}" />
    <div class="mt-4 border-t border-white/15 pt-3">${contactInputs(draft, ui, true)}</div>
    <div class="mt-3">${sidebarLinksBlock(draft, ui, true, editableLinks)}</div>
    ${blockSkillsSidebar(draft, ui, tplId, editableLinks)}
    ${sec("Languages", ui, { dark: true })}
    <textarea data-f="languages" class="${EIN_TX_DARK} mt-1" placeholder="${escapeHtml(CV_PH.languages)}">${escapeHtml(draft.languages)}</textarea>
  </aside>`;
}

function splitRail(draft, ui, tplId, editableLinks = true) {
  const skillsBlock = editableLinks
    ? skillsEditorBlock(draft, ui, tplId, { textareaCls: EIN_TX, rows: 5 })
    : `<div class="cv-skills-preview" data-skills-preview data-tpl="${tplId}">${renderSkillsVisual(draft.skills, ui, { tplId })}</div>`;
  return `
  <aside class="border-l p-4 text-[12px] ${ui.rail || "bg-zinc-50 border-zinc-200"}">
    ${sec("Skills", ui)}
    ${skillsBlock}
    ${sec("Languages", ui)}
    <textarea data-f="languages" class="${EIN_TX} mt-2" rows="4" placeholder="${escapeHtml(CV_PH.languages)}">${escapeHtml(draft.languages)}</textarea>
    ${railLinksBlock(draft, ui, editableLinks)}
  </aside>`;
}

function blockSummary(draft, ui) {
  return `${sec("Professional Summary", ui)}<textarea data-f="summary" class="${EIN_TX}" placeholder="${escapeHtml(CV_PH.summary)}">${escapeHtml(draft.summary)}</textarea>`;
}

function blockSkillsMain(draft, ui, tplId) {
  return `${sec("Core Competencies", ui)}${skillsEditorBlock(draft, ui, tplId, { textareaCls: `${EIN_TX} mb-2`, rows: 5 })}`;
}

function blockSkillsSidebar(draft, ui, tplId, editableLinks = true) {
  if (editableLinks) {
    return `${sec("Skills", ui, { dark: true })}${skillsEditorBlock(draft, ui, tplId, { dark: true, textareaCls: EIN_TX_DARK, rows: 5 })}`;
  }
  const preview = renderSkillsVisual(draft.skills, ui, { dark: true, tplId });
  return `${sec("Skills", ui, { dark: true })}<div class="cv-skills-preview" data-skills-preview data-tpl="${tplId}">${preview}</div>`;
}

function blockExp(draft, ui, slice, label) {
  const title = label || "Professional Experience";
  return `${sec(title, ui)}${expRows(draft, slice)}<button type="button" data-action="add-exp" class="${BTN}">${PLUS}Add role</button>`;
}

function blockProj(draft, ui) {
  return `${sec("Projects & Research", ui)}${projRows(draft)}<button type="button" data-action="add-proj" class="${BTN}">${PLUS}Add project</button>`;
}

function blockEdu(draft, ui) {
  return `${sec("Education", ui)}${eduRows(draft)}<button type="button" data-action="add-edu" class="${BTN}">${PLUS}Add education</button>`;
}

function blockCerts(draft, ui) {
  return `${sec("Certifications & Licenses", ui)}<textarea data-f="certifications" class="${EIN_TX}" placeholder="${escapeHtml(CV_PH.certifications)}">${escapeHtml(draft.certifications)}</textarea>`;
}

function blockLang(draft, ui) {
  return `${sec("Languages", ui)}<textarea data-f="languages" class="${EIN_TX}" placeholder="${escapeHtml(CV_PH.languages)}">${escapeHtml(draft.languages)}</textarea>`;
}

function wrapSpreadLeft(side, main) {
  return `<div class="cv-spread flex min-h-0 flex-col sm:flex-row print:flex-row">${side}<div class="min-w-0 flex-1 p-5 sm:p-6">${main}</div></div>`;
}

function wrapSpreadRight(main, side) {
  return `<div class="cv-spread flex min-h-0 flex-col sm:flex-row print:flex-row"><div class="min-w-0 flex-1 p-5 sm:p-6">${main}</div>${side}</div>`;
}

function wrapSplit(main, rail) {
  return `<div class="grid min-h-0 grid-cols-1 sm:grid-cols-[1fr_11.5rem]">${main}${rail}</div>`;
}

function renderClassic(draft, tplId, ui) {
  const p1 = `${pickHeader(draft, ui)}${blockSummary(draft, ui)}${blockSkillsMain(draft, ui, tplId)}${blockExp(draft, ui, [0, 2])}`;
  const p2 = `${blockExp(draft, ui, [2], "Experience (continued)")}${blockProj(draft, ui)}`;
  const p3 = `${blockEdu(draft, ui)}${blockCerts(draft, ui)}${blockLang(draft, ui)}`;
  return pageShell(1, p1, tplId, ui) + pageShell(2, p2, tplId, ui) + pageShell(3, p3, tplId, ui);
}

function renderSidebarLeft(draft, tplId, ui) {
  const sideEdit = sidebarAside(draft, ui, tplId, true);
  const sideView = sidebarAside(draft, ui, tplId, false);
  const p1 = `${blockSummary(draft, ui)}${blockExp(draft, ui, [0, 2])}`;
  const p2 = `${blockExp(draft, ui, [2], "Experience (continued)")}${blockProj(draft, ui)}`;
  const p3 = `${blockEdu(draft, ui)}${blockCerts(draft, ui)}`;
  return (
    pageShell(1, wrapSpreadLeft(sideEdit, p1), tplId, ui) +
    pageShell(2, wrapSpreadLeft(sideView, p2), tplId, ui) +
    pageShell(3, wrapSpreadLeft(sideView, p3), tplId, ui)
  );
}

function renderSidebarRight(draft, tplId, ui) {
  const sideEdit = sidebarAside(draft, ui, tplId, true);
  const sideView = sidebarAside(draft, ui, tplId, false);
  const p1 = `${pickHeader(draft, ui)}${blockSummary(draft, ui)}${blockExp(draft, ui, [0, 2])}`;
  const p2 = `${blockExp(draft, ui, [2], "Experience (continued)")}${blockProj(draft, ui)}`;
  const p3 = `${blockEdu(draft, ui)}${blockCerts(draft, ui)}`;
  return (
    pageShell(1, wrapSpreadRight(p1, sideEdit), tplId, ui) +
    pageShell(2, wrapSpreadRight(p2, sideView), tplId, ui) +
    pageShell(3, wrapSpreadRight(p3, sideView), tplId, ui)
  );
}

function renderSplitRight(draft, tplId, ui) {
  const railEdit = splitRail(draft, ui, tplId, true);
  const railView = splitRail(draft, ui, tplId, false);
  const p1 = wrapSplit(`${pickHeader(draft, ui)}<div class="p-5">${blockSummary(draft, ui)}${blockExp(draft, ui, [0, 2])}</div>`, railEdit);
  const p2 = wrapSplit(`<div class="p-5">${blockExp(draft, ui, [2], "Experience (continued)")}${blockProj(draft, ui)}</div>`, railView);
  const p3 = wrapSplit(`<div class="p-5">${blockEdu(draft, ui)}${blockCerts(draft, ui)}</div>`, railView);
  return pageShell(1, p1, tplId, ui) + pageShell(2, p2, tplId, ui) + pageShell(3, p3, tplId, ui);
}

function wrapTimeline(inner, ui) {
  const border = (ui.line || "bg-violet-300").replace(/^bg-/, "border-");
  return `<div class="border-l-2 ${border} pl-5 ml-0.5">${inner}</div>`;
}

function renderTimeline(draft, tplId, ui) {
  const p1 = wrapTimeline(`${pickHeader(draft, ui)}${blockSummary(draft, ui)}${blockSkillsMain(draft, ui, tplId)}${blockExp(draft, ui, [0, 2])}`, ui);
  const p2 = wrapTimeline(`${blockExp(draft, ui, [2], "Experience (continued)")}${blockProj(draft, ui)}`, ui);
  const p3 = wrapTimeline(`${blockEdu(draft, ui)}${blockCerts(draft, ui)}${blockLang(draft, ui)}`, ui);
  return pageShell(1, p1, tplId, ui) + pageShell(2, p2, tplId, ui) + pageShell(3, p3, tplId, ui);
}

function renderAcademic(draft, tplId, ui) {
  const p1 = `${pickHeader(draft, ui)}${blockSummary(draft, ui)}${blockExp(draft, ui, [0, 2])}`;
  const p2 = `${blockExp(draft, ui, [2], "Experience (continued)")}${blockProj(draft, ui)}${blockSkillsMain(draft, ui, tplId)}`;
  const p3 = `${blockEdu(draft, ui)}${blockCerts(draft, ui)}${blockLang(draft, ui)}`;
  return pageShell(1, p1, tplId, ui) + pageShell(2, p2, tplId, ui) + pageShell(3, p3, tplId, ui);
}

function renderBands(draft, tplId, ui) {
  return renderClassic(draft, tplId, { ...ui, section: "band" });
}

function renderBanner(draft, tplId, ui) {
  const top = headerBanner(draft, ui);
  const linksOnce = headerLinks(draft, ui);
  const p1 = `${top}${linksOnce}${blockSummary(draft, ui)}${blockExp(draft, ui, [0, 2])}`;
  const p2 = `${top}${blockExp(draft, ui, [2], "Experience (continued)")}${blockProj(draft, ui)}`;
  const p3 = `${top}${blockEdu(draft, ui)}${blockSkillsMain(draft, ui, tplId)}${blockCerts(draft, ui)}${blockLang(draft, ui)}`;
  return pageShell(1, p1, tplId, ui) + pageShell(2, p2, tplId, ui) + pageShell(3, p3, tplId, ui);
}

function renderSerif(draft, tplId, ui) {
  const p1 = `${headerSerif(draft, ui)}${blockSummary(draft, ui)}${blockExp(draft, ui, [0, 2])}`;
  const p2 = `${blockExp(draft, ui, [2], "Experience (continued)")}${blockProj(draft, ui)}`;
  const p3 = `${blockEdu(draft, ui)}${blockSkillsMain(draft, ui, tplId)}${blockCerts(draft, ui)}${blockLang(draft, ui)}`;
  return pageShell(1, p1, tplId, ui) + pageShell(2, p2, tplId, ui) + pageShell(3, p3, tplId, ui);
}

function renderMagazine(draft, tplId, ui) {
  const p1 = `${pickHeader(draft, ui)}<div class="mb-4 grid gap-6 sm:grid-cols-2">${blockSummary(draft, ui)}${blockSkillsMain(draft, ui, tplId)}</div>${blockExp(draft, ui, [0, 2])}`;
  const p2 = `${blockExp(draft, ui, [2], "Experience (continued)")}${blockProj(draft, ui)}`;
  const p3 = `${blockEdu(draft, ui)}${blockCerts(draft, ui)}${blockLang(draft, ui)}`;
  return pageShell(1, p1, tplId, ui) + pageShell(2, p2, tplId, ui) + pageShell(3, p3, tplId, ui);
}

const RENDERERS = {
  classic: renderClassic,
  "sidebar-left": renderSidebarLeft,
  "sidebar-right": renderSidebarRight,
  "split-right": renderSplitRight,
  ribbon: (d, id, ui) => renderClassic(d, id, { ...ui, header: "ribbon" }),
  bands: renderBands,
  banner: renderBanner,
  serif: renderSerif,
  timeline: renderTimeline,
  magazine: renderMagazine,
  swiss: (d, id, ui) => renderClassic(d, id, { ...ui, section: "minimal", header: "compact" }),
  academic: renderAcademic,
};

export function buildEditableMultipageCv(draft, templateId) {
  const tplId = tplNum(templateId);
  const ui = getTemplateUi(tplId);
  const render = RENDERERS[ui.layout] || renderClassic;
  const pages = render(draft, tplId, ui);
  return `<article id="resume-print-root" class="resume-preview-article cv-document cv-tpl-${tplId} ${ui.fontClass || ""} ${articlePhotoClass(draft)} mx-auto text-zinc-900 antialiased" data-cv-template="${tplId}">${photoEditorBar(draft, ui)}${pages}</article>`;
}

export function readEditableMultipageDraft(root, templateId) {
  const get = (sel) => root.querySelector(sel)?.value ?? "";
  const readLinks = readLinksFromRoot(root);
  const links = readLinks ?? [];
  const expWraps = [...root.querySelectorAll("[data-exp-job]")].sort(
    (a, b) => Number(a.getAttribute("data-exp-job")) - Number(b.getAttribute("data-exp-job")),
  );
  const experience = expWraps.map((w) => ({
    role: w.querySelector('[data-exp-f="role"]')?.value ?? "",
    company: w.querySelector('[data-exp-f="company"]')?.value ?? "",
    start: w.querySelector('[data-exp-f="start"]')?.value ?? "",
    end: w.querySelector('[data-exp-f="end"]')?.value ?? "",
    bullets: [...w.querySelectorAll("[data-bullet]")].map((inp) => inp.value ?? ""),
  }));
  const projWraps = [...root.querySelectorAll("[data-proj-row]")].sort(
    (a, b) => Number(a.getAttribute("data-proj-row")) - Number(b.getAttribute("data-proj-row")),
  );
  const projects = projWraps.map((w) => ({
    name: w.querySelector('[data-proj-f="name"]')?.value ?? "",
    context: w.querySelector('[data-proj-f="context"]')?.value ?? "",
    start: w.querySelector('[data-proj-f="start"]')?.value ?? "",
    end: w.querySelector('[data-proj-f="end"]')?.value ?? "",
    bullets: [...w.querySelectorAll("[data-proj-bullet]")].map((inp) => inp.value ?? ""),
  }));
  const eduWraps = [...root.querySelectorAll("[data-edu-job]")].sort(
    (a, b) => Number(a.getAttribute("data-edu-job")) - Number(b.getAttribute("data-edu-job")),
  );
  const education = eduWraps.map((w) => ({
    school: w.querySelector('[data-edu-f="school"]')?.value ?? "",
    degree: w.querySelector('[data-edu-f="degree"]')?.value ?? "",
    start: w.querySelector('[data-edu-f="start"]')?.value ?? "",
    end: w.querySelector('[data-edu-f="end"]')?.value ?? "",
  }));

  const fb = defaultResumeDraft();
  return normalizeResumeDraft({
    templateId,
    fullName: get('[data-f="fullName"]'),
    title: get('[data-f="title"]'),
    email: get('[data-f="email"]'),
    phone: get('[data-f="phone"]'),
    location: get('[data-f="location"]'),
    showPhoto: root.querySelector('[data-f="showPhoto"]')?.checked ?? false,
    photoUrl: get('[data-f="photoUrl"]'),
    summary: get('[data-f="summary"]'),
    skills: get('[data-f="skills"]'),
    certifications: get('[data-f="certifications"]'),
    languages: get('[data-f="languages"]'),
    links: links.length ? links : fb.links,
    experience: experience.length ? experience : fb.experience,
    projects: projects.length ? projects : fb.projects,
    education: education.length ? education : fb.education,
  });
}
