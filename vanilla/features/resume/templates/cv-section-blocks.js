import { CV_PH } from "./cv-placeholders.js";
import { escapeHtml } from "../escape-html.js";
import { CV_SPACE, sec, photoSlot } from "./cv-shared-ui.js";
import { linksDisplay, linksEditor } from "./cv-links-ui.js";
import { renderSkillsVisual, skillsEditorBlock } from "./cv-skills-ui.js";
import { ADD_LINK_BTN, contactInputs } from "./cv-headers.js";
import { EIN_DARK, EIN_DATE, EIN_NAME_SIDEBAR, EIN_SM, EIN_TX, EIN_TX_DARK, BTN, RM } from "./cv-editor-styles.js";
import { resumeIcon } from "../resume-icons.js";

const PLUS = resumeIcon("plus", "h-3.5 w-3.5");

export function sidebarLinksBlock(draft, ui, dark, editable = true) {
  if (ui.linksZone !== "sidebar") return "";
  if (editable) {
    const btn = dark
      ? `<button type="button" data-action="add-link" class="${BTN} border-white/40 text-zinc-200">${PLUS}Add link</button>`
      : ADD_LINK_BTN;
    return linksEditor(draft, ui, { dark, addBtn: btn, inputCls: EIN_SM, inputClsDark: EIN_DARK });
  }
  return linksDisplay(draft, ui, { dark });
}

export function railLinksBlock(draft, ui, editable = true) {
  if (ui.linksZone !== "rail") return "";
  if (editable) {
    return `${sec("Links", ui)}${linksEditor(draft, ui, { addBtn: ADD_LINK_BTN, inputCls: EIN_SM, inputClsDark: EIN_DARK })}`;
  }
  return `${sec("Links", ui)}${linksDisplay(draft, ui)}`;
}

export function expRows(draft, slice = null) {
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
      <div data-exp-job="${idx}" class="cv-exp-row cv-avoid-break ${CV_SPACE.item} border-b border-[#e4e4e7] last:border-0">
        <div class="print:hidden mb-1 flex justify-between text-xs text-zinc-500">
          <span>Role ${idx + 1}</span>
          <button type="button" data-action="remove-exp" data-i="${idx}" class="${RM} ${(draft.experience || []).length < 2 ? "hidden" : ""}">Remove</button>
        </div>
        <div class="${CV_SPACE.gridDate}">
          <input data-exp-f="start" class="${EIN_DATE} text-[11px]" placeholder="${escapeHtml(CV_PH.expStart)}" value="${escapeHtml(job.start)}" />
          <input data-exp-f="role" class="${EIN_SM} font-semibold text-zinc-950" placeholder="${escapeHtml(CV_PH.expRole)}" value="${escapeHtml(job.role)}" />
          <input data-exp-f="end" class="${EIN_DATE} text-[11px]" placeholder="${escapeHtml(CV_PH.expEnd)}" value="${escapeHtml(job.end)}" />
          <input data-exp-f="company" class="${EIN_SM} text-[#52525b]" placeholder="${escapeHtml(CV_PH.expCompany)}" value="${escapeHtml(job.company)}" />
        </div>
        <div class="mt-2 ${CV_SPACE.gridDate}"><div class="col-start-2">${bHtml}</div></div>
      </div>`;
    })
    .join("");
}

export function projRows(draft) {
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
      <div data-proj-row="${i}" class="cv-proj-row mb-4 border-b border-zinc-50 pb-4">
        <div class="print:hidden mb-1 flex justify-between text-xs text-zinc-500">
          <span>Project ${i + 1}</span>
          <button type="button" data-action="remove-proj" data-i="${i}" class="${RM} ${(draft.projects || []).length < 2 ? "hidden" : ""}">Remove</button>
        </div>
        <input data-proj-f="name" class="${EIN_SM} font-semibold text-zinc-950" placeholder="${escapeHtml(CV_PH.projName)}" value="${escapeHtml(p.name)}" />
        <input data-proj-f="context" class="${EIN_SM} mt-1 text-zinc-600" placeholder="${escapeHtml(CV_PH.projContext)}" value="${escapeHtml(p.context)}" />
        <div class="mt-1 grid grid-cols-2 gap-2">
          <input data-proj-f="start" class="${EIN_SM} text-[11px] text-zinc-500 tabular-nums" placeholder="${escapeHtml(CV_PH.projStart)}" value="${escapeHtml(p.start)}" />
          <input data-proj-f="end" class="${EIN_SM} text-[11px] text-zinc-500 tabular-nums" placeholder="${escapeHtml(CV_PH.projEnd)}" value="${escapeHtml(p.end)}" />
        </div>
        <div class="mt-2">${bHtml}</div>
      </div>`;
    })
    .join("");
}

export function eduRows(draft) {
  return (draft.education || [])
    .map(
      (ed, i) => `
      <div data-edu-job="${i}" class="cv-edu-row cv-avoid-break mb-3 ${CV_SPACE.gridDate}">
        <input data-edu-f="start" class="${EIN_SM} text-[11px] text-zinc-500 tabular-nums" placeholder="${escapeHtml(CV_PH.eduStart)}" value="${escapeHtml(ed.start)}" />
        <input data-edu-f="degree" class="${EIN_SM} font-semibold text-zinc-950" placeholder="${escapeHtml(CV_PH.eduDegree)}" value="${escapeHtml(ed.degree)}" />
        <input data-edu-f="end" class="${EIN_SM} text-[11px] text-zinc-500 tabular-nums" placeholder="${escapeHtml(CV_PH.eduEnd)}" value="${escapeHtml(ed.end)}" />
        <input data-edu-f="school" class="${EIN_SM} text-zinc-600" placeholder="${escapeHtml(CV_PH.eduSchool)}" value="${escapeHtml(ed.school)}" />
      </div>`,
    )
    .join("");
}

export function sidebarAside(draft, ui, tplId, editableLinks = true, { invoiceShell = false } = {}) {
  const billTo = invoiceShell ? `<p class="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-sky-300/90">Contact</p>` : "";
  return `
  <aside class="cv-sidebar cv-bill-to w-full shrink-0 p-5 sm:w-[30%] sm:min-w-[11rem] sm:max-w-[32%] print:w-[30%] ${ui.sidebar}">
    ${billTo}
    <div class="mb-4 flex justify-center">${photoSlot(draft, ui, { dark: true, context: "sidebar" })}</div>
    <input data-f="fullName" type="text" class="${EIN_NAME_SIDEBAR}" placeholder="${escapeHtml(CV_PH.fullName)}" value="${escapeHtml(draft.fullName)}" />
    <input data-f="title" type="text" class="${EIN_DARK} mt-1 block text-[11px] font-semibold uppercase tracking-wider opacity-80" placeholder="${escapeHtml(CV_PH.title)}" value="${escapeHtml(draft.title)}" />
    <div class="mt-4 border-t border-white/15 pt-3">${contactInputs(draft, ui, true)}</div>
    <div class="mt-3">${sidebarLinksBlock(draft, ui, true, editableLinks)}</div>
    ${blockSkillsSidebar(draft, ui, tplId, editableLinks)}
    ${sec("Languages", ui, { dark: true })}
    ${
      editableLinks
        ? `<textarea data-f="languages" class="${EIN_TX_DARK} mt-1" placeholder="${escapeHtml(CV_PH.languages)}">${escapeHtml(draft.languages)}</textarea>`
        : `<div class="mt-1 text-[13px] leading-[1.45] text-zinc-300/90 whitespace-pre-wrap">${escapeHtml(draft.languages || CV_PH.languages)}</div>`
    }
  </aside>`;
}

export function splitRail(draft, ui, tplId, editableLinks = true, { invoiceShell = false } = {}) {
  const railLabel = invoiceShell
    ? `<p class="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Skills &amp; contact</p>`
    : "";
  const skillsBlock = editableLinks
    ? skillsEditorBlock(draft, ui, tplId, { textareaCls: EIN_TX, rows: 5 })
    : `<div class="cv-skills-preview" data-skills-preview data-tpl="${tplId}">${renderSkillsVisual(draft.skills, ui, { tplId })}</div>`;
  const langBlock = editableLinks
    ? `<textarea data-f="languages" class="${EIN_TX} mt-2" rows="4" placeholder="${escapeHtml(CV_PH.languages)}">${escapeHtml(draft.languages)}</textarea>`
    : `<div class="mt-2 text-[13px] leading-[1.45] text-[#52525b] whitespace-pre-wrap">${escapeHtml(draft.languages || CV_PH.languages)}</div>`;
  return `
  <aside class="cv-rail cv-rail-split w-full shrink-0 border-l p-4 text-[12px] sm:w-[11.5rem] sm:max-w-[11.5rem] print:w-[11.5rem] ${ui.rail || "bg-zinc-50 border-zinc-200"}">
    ${railLabel}
    ${sec("Skills", ui)}
    ${skillsBlock}
    ${sec("Languages", ui)}
    ${langBlock}
    ${railLinksBlock(draft, ui, editableLinks)}
  </aside>`;
}

export function blockSummary(draft, ui) {
  return `${sec("Professional Summary", ui)}<textarea data-f="summary" class="${EIN_TX}" placeholder="${escapeHtml(CV_PH.summary)}">${escapeHtml(draft.summary)}</textarea>`;
}

export function blockSkillsMain(draft, ui, tplId) {
  return `${sec("Core Competencies", ui)}${skillsEditorBlock(draft, ui, tplId, { textareaCls: `${EIN_TX} mb-2`, rows: 5 })}`;
}

export function blockSkillsSidebar(draft, ui, tplId, editableLinks = true) {
  if (editableLinks) {
    return `${sec("Skills", ui, { dark: true })}${skillsEditorBlock(draft, ui, tplId, { dark: true, textareaCls: EIN_TX_DARK, rows: 5 })}`;
  }
  const preview = renderSkillsVisual(draft.skills, ui, { dark: true, tplId });
  return `${sec("Skills", ui, { dark: true })}<div class="cv-skills-preview" data-skills-preview data-tpl="${tplId}">${preview}</div>`;
}

export function blockExp(draft, ui, slice, label) {
  const title = label || "Professional Experience";
  return `${sec(title, ui)}${expRows(draft, slice)}<button type="button" data-action="add-exp" class="${BTN}">${PLUS}Add role</button>`;
}

export function blockProj(draft, ui) {
  return `${sec("Projects & Research", ui)}${projRows(draft)}<button type="button" data-action="add-proj" class="${BTN}">${PLUS}Add project</button>`;
}

export function blockEdu(draft, ui) {
  return `${sec("Education", ui)}${eduRows(draft)}<button type="button" data-action="add-edu" class="${BTN}">${PLUS}Add education</button>`;
}

export function blockCerts(draft, ui) {
  return `${sec("Certifications & Licenses", ui)}<textarea data-f="certifications" class="${EIN_TX}" placeholder="${escapeHtml(CV_PH.certifications)}">${escapeHtml(draft.certifications)}</textarea>`;
}

export function blockLang(draft, ui) {
  return `${sec("Languages", ui)}<textarea data-f="languages" class="${EIN_TX}" placeholder="${escapeHtml(CV_PH.languages)}">${escapeHtml(draft.languages)}</textarea>`;
}
