import { CV_PH, hasText } from "./cv-placeholders.js";
import { DEFAULT_CV_PHOTO_URL } from "./cv-defaults.js";
import { sectionIconFor } from "./cv-template-ui.js";
import { escapeHtml } from "../escape-html.js";
import { resumeIcon } from "../resume-icons.js";

/** Consistent vertical rhythm (international CV standard) */
export const CV_SPACE = {
  section: "mb-7 last:mb-0",
  block: "mb-5",
  item: "mb-4 pb-4 last:mb-0 last:border-0 last:pb-0",
  gridDate: "grid grid-cols-[7rem_minmax(0,1fr)] gap-x-5 gap-y-1.5",
};

export function articlePhotoClass(draft) {
  return draft.showPhoto ? "cv-has-photo" : "cv-no-photo";
}

/** Editor-only: toggle + URL (screen); hidden in print — shown on every template */
export function photoEditorBar(draft, ui = {}) {
  const checked = draft.showPhoto ? "checked" : "";
  const recommended = ui.photoDefault
    ? `<p class="mt-1.5 text-[11px] font-medium text-blue-800">Recommended for this template (common in EU, Middle East, and Asia).</p>`
    : "";
  return `
  <div class="cv-photo-editor print:hidden mb-4 rounded-lg border border-dashed border-blue-200 bg-blue-50/50 px-3 py-2.5" data-photo-editor>
    <label class="flex cursor-pointer items-start gap-2 text-xs text-zinc-700">
      ${resumeIcon("camera", "h-4 w-4 shrink-0 text-blue-600 mt-0.5")}
      <input type="checkbox" data-f="showPhoto" class="mt-0.5" ${checked} />
      <span><strong class="font-medium text-zinc-900">Include profile photo</strong> — ${escapeHtml(CV_PH.photoHint)}</span>
    </label>
    ${recommended}
    <input data-f="photoUrl" type="url" class="mt-2 block w-full border-0 border-b border-zinc-200 bg-transparent py-1 text-sm text-zinc-800 placeholder:text-zinc-400 focus:border-zinc-400" placeholder="${escapeHtml(CV_PH.photoUrl)}" value="${escapeHtml(draft.photoUrl || "")}" />
  </div>`;
}

function photoInner(draft, ui, dark) {
  const url = String(draft.photoUrl || "").trim() || (draft.showPhoto ? DEFAULT_CV_PHOTO_URL : "");
  const frame = ui.photoFrame || "rounded-md";
  const ring = dark ? "border-white/25" : "border-zinc-200";
  const bg = dark ? "bg-white/10" : "bg-zinc-100";
  const ph = dark ? "text-zinc-500" : "text-zinc-400";
  if (url) {
    return `<img src="${escapeHtml(url)}" alt="" class="cv-photo-img h-full w-full object-cover object-center" data-photo-img />`;
  }
  return `<span class="flex h-full w-full items-center justify-center text-center text-[9px] font-medium uppercase leading-tight tracking-wide ${ph} px-1">${escapeHtml(CV_PH.photoUrl.split("—")[0].trim())}</span>`;
}

/** Profile photo frame — hidden via `.cv-no-photo .cv-photo-slot` when toggled off */
export function photoSlot(draft, ui, { dark = false, size = "md" } = {}) {
  const sz =
    size === "lg"
      ? "h-[5.5rem] w-[5.5rem]"
      : size === "sm"
        ? "h-[3.75rem] w-[3.75rem]"
        : "h-[4.5rem] w-[4.5rem]";
  const frame = ui.photoFrame || "rounded-md";
  const ring = dark ? "border-white/25" : "border-zinc-200";
  const bg = dark ? "bg-white/10" : "bg-zinc-100";
  return `
  <div class="cv-photo-slot shrink-0 ${sz} overflow-hidden ${frame} border ${ring} ${bg}" data-photo-slot>
    ${photoInner(draft, ui, dark)}
  </div>`;
}

function sectionIconEl(title, ui, dark = false) {
  const name = sectionIconFor(title);
  const ic = dark ? ui.iconSection || "text-sky-300" : ui.iconSection || ui.iconContact || "text-zinc-500";
  return resumeIcon(name, `h-4 w-4 shrink-0 ${ic}`);
}

export function sec(title, ui, { dark = false } = {}) {
  const { h2, line, section, ribbon } = ui;
  const icon = sectionIconEl(title, ui, dark);
  if (section === "band") {
    return `<div class="${CV_SPACE.block} ${ribbon} flex items-center gap-2 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white">${icon}${escapeHtml(title)}</div>`;
  }
  if (section === "boxed") {
    return `<h2 class="mb-3.5 flex items-center gap-2 border-l-[3px] border-current pl-3 text-[11px] font-bold uppercase tracking-[0.15em] ${h2}">${icon}${escapeHtml(title)}</h2>`;
  }
  if (section === "minimal") {
    const lbl = dark ? "text-white/55" : ui.h2 || "text-zinc-500";
    return `<h2 class="mb-2.5 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] ${lbl}">${icon}${escapeHtml(title)}</h2>`;
  }
  if (section === "double") {
    return `<div class="mb-4 flex items-center justify-center gap-2 border-b border-t-2 border-zinc-300 py-1.5 text-[10px] font-bold uppercase tracking-[0.24em] ${h2}">${icon}${escapeHtml(title)}</div>`;
  }
  return `<div class="mb-3.5 flex items-center gap-2.5">
    ${icon}
    <h2 class="shrink-0 text-[11px] font-semibold uppercase tracking-[0.14em] ${h2}">${escapeHtml(title)}</h2>
    <div class="h-px min-w-[2rem] flex-1 ${line}" aria-hidden="true"></div>
  </div>`;
}

export function sectionWrap(title, ui, inner) {
  return `<section class="${CV_SPACE.section} cv-avoid-break">${sec(title, ui)}${inner}</section>`;
}

export function pageShell(pageNum, body, tplId, ui) {
  return `
  <section class="cv-page cv-tpl-${tplId}-page ${ui.page || ""}" data-page="${pageNum}" aria-label="Page ${pageNum}">
    <div class="cv-page-body">${body}</div>
  </section>`;
}
