import { CV_PH } from "./cv-placeholders.js";
import { escapeHtml } from "../escape-html.js";
import { resumeIcon } from "../resume-icons.js";
import { photoSlot } from "./cv-shared-ui.js";
import { linksEditor } from "./cv-links-ui.js";
import { EIN, EIN_DARK, EIN_H1, EIN_NAME_RIBBON, EIN_SM, EIN_TITLE, BTN } from "./cv-editor-styles.js";

const PLUS = resumeIcon("plus", "h-3.5 w-3.5");
export const ADD_LINK_BTN = `<button type="button" data-action="add-link" class="${BTN}">${PLUS}Add link</button>`;

export function contactInputs(draft, ui, dark = false) {
  const c = dark ? EIN_DARK : EIN_SM;
  const ic = ui.iconContact || (dark ? "text-sky-300" : "text-blue-600");
  const row = (icon, field, type, ph) => `
    <label class="mt-1.5 flex items-center gap-2 first:mt-0">
      ${resumeIcon(icon, `h-4 w-4 shrink-0 ${ic}`)}
      <input data-f="${field}" type="${type}" class="${c} min-w-0 flex-1" placeholder="${escapeHtml(ph)}" value="${escapeHtml(draft[field] || "")}" />
    </label>`;
  return `${row("mail", "email", "email", CV_PH.email)}${row("phone", "phone", "text", CV_PH.phone)}${row("map", "location", "text", CV_PH.location)}`;
}

/** Compact contact strip with icons (Manhattan banner). */
export function bannerContactStrip(draft, ui) {
  const ic = "text-zinc-300";
  const field = (icon, f, ph, wide = false) => `
    <span class="inline-flex items-center gap-1.5 align-middle">
      ${resumeIcon(icon, `h-3.5 w-3.5 shrink-0 ${ic}`)}
      <input data-f="${f}" class="${EIN} inline ${wide ? "min-w-[8rem]" : "min-w-[6rem]"} text-white placeholder:text-zinc-500" placeholder="${escapeHtml(ph)}" value="${escapeHtml(draft[f] || "")}" />
    </span>`;
  return `${field("mail", "email", CV_PH.email, true)}
    <span class="mx-2 opacity-40" aria-hidden="true">·</span>
    ${field("phone", "phone", CV_PH.phone)}
    <span class="mx-2 opacity-40" aria-hidden="true">·</span>
    ${field("map", "location", CV_PH.location, true)}`;
}

export function headerStandard(draft, ui) {
  return `
  <header class="cv-header-standard mb-6 border-b border-zinc-200 pb-5">
    <div class="flex items-start gap-4">
      ${photoSlot(draft, ui)}
      <div class="min-w-0 flex-1">
        <input data-f="fullName" type="text" class="${EIN_H1}" placeholder="${escapeHtml(CV_PH.fullName)}" value="${escapeHtml(draft.fullName)}" />
        <input data-f="title" type="text" class="${EIN_TITLE} mt-1 ${ui.h2}" placeholder="${escapeHtml(CV_PH.title)}" value="${escapeHtml(draft.title)}" />
        <div class="mt-2.5 flex flex-wrap gap-x-4 gap-y-1">${contactInputs(draft, ui)}</div>
      </div>
    </div>
  </header>`;
}

export function headerRibbon(draft, ui) {
  return `
  <header class="cv-header-ribbon mb-6 overflow-hidden rounded-sm">
    <div class="${ui.ribbon} flex items-center gap-4 px-4 py-4">
      ${photoSlot(draft, ui, { dark: true, size: "sm", context: "header" })}
      <div class="min-w-0 flex-1">
        <input data-f="fullName" type="text" class="${EIN_NAME_RIBBON}" placeholder="${escapeHtml(CV_PH.fullName)}" value="${escapeHtml(draft.fullName)}" />
        <input data-f="title" type="text" class="${EIN} mt-1 block text-sm text-white/90 placeholder:text-white/50" placeholder="${escapeHtml(CV_PH.title)}" value="${escapeHtml(draft.title)}" />
      </div>
    </div>
    <div class="border border-t-0 border-zinc-200 bg-zinc-50/80 px-4 py-2">${contactInputs(draft, ui)}</div>
  </header>`;
}

export function headerSerif(draft, ui) {
  return `
  <header class="cv-header-serif mb-6 border-b-2 border-zinc-900 pb-5 text-center">
    <div class="mb-3 flex justify-center">${photoSlot(draft, ui, { context: "serif" })}</div>
    <input data-f="fullName" type="text" class="${EIN_H1} mx-auto block max-w-lg text-center uppercase placeholder:text-zinc-400" placeholder="${escapeHtml(CV_PH.fullName)}" value="${escapeHtml(draft.fullName)}" />
    <input data-f="title" type="text" class="${EIN} mx-auto mt-2 block max-w-lg text-center text-xs uppercase tracking-[0.2em] text-zinc-600 placeholder:text-zinc-400" placeholder="${escapeHtml(CV_PH.title)}" value="${escapeHtml(draft.title)}" />
    <div class="mx-auto mt-3 max-w-md text-center">${contactInputs(draft, ui)}</div>
  </header>`;
}

export function headerCompact(draft, ui) {
  return `
  <header class="cv-header-compact mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
    <div class="flex min-w-0 flex-1 items-end gap-4">
      ${photoSlot(draft, ui, { size: "sm" })}
      <div class="min-w-0 flex-1">
      <input data-f="fullName" type="text" class="${EIN_H1} text-[1.75rem]" placeholder="${escapeHtml(CV_PH.fullName)}" value="${escapeHtml(draft.fullName)}" />
      <input data-f="title" type="text" class="${EIN} mt-0.5 block text-xs font-bold uppercase tracking-[0.18em] ${ui.h2}" placeholder="${escapeHtml(CV_PH.title)}" value="${escapeHtml(draft.title)}" />
      </div>
    </div>
    <div class="text-right text-[12px]">${contactInputs(draft, ui)}</div>
  </header>`;
}

export function headerBanner(draft, ui) {
  return `
  <div class="cv-banner-strip mb-4 bg-zinc-900 px-4 py-2.5 text-center text-[11px] text-white">
    ${bannerContactStrip(draft, ui)}
  </div>
  <header class="cv-header-banner mb-5 flex items-start gap-4">
    ${photoSlot(draft, ui)}
    <div class="min-w-0 flex-1">
      <input data-f="fullName" type="text" class="${EIN_H1} cv-name-emphasis" placeholder="${escapeHtml(CV_PH.fullName)}" value="${escapeHtml(draft.fullName)}" />
      <input data-f="title" type="text" class="${EIN_TITLE} mt-1 tracking-wide" placeholder="${escapeHtml(CV_PH.title)}" value="${escapeHtml(draft.title)}" />
    </div>
  </header>`;
}

export function headerLinks(draft, ui, dark = false) {
  if (ui.linksZone !== "header") return "";
  return linksEditor(draft, ui, {
    dark,
    addBtn: ADD_LINK_BTN,
    inputCls: EIN_SM,
    inputClsDark: EIN_DARK,
  });
}

export function pickHeader(draft, ui) {
  if (ui.header === "ribbon") return headerRibbon(draft, ui);
  if (ui.header === "serif") return headerSerif(draft, ui);
  if (ui.header === "compact") return headerCompact(draft, ui);
  if (ui.header === "banner") return headerBanner(draft, ui);
  return headerStandard(draft, ui);
}
