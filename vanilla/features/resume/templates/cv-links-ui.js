import { CV_PH } from "./cv-placeholders.js";
import { escapeHtml } from "../escape-html.js";
import { resumeIcon } from "../resume-icons.js";

const MAX_LINKS = 6;

/** Infer icon + accent from link label (LinkedIn, GitHub, etc.). */
export function linkVisual(label, ui, dark = false) {
  const l = String(label || "").toLowerCase();
  const base = ui.iconLink || (dark ? "text-sky-300" : "text-blue-600");
  if (l.includes("linkedin")) return { icon: "link", cls: dark ? "text-sky-300" : "text-[#0A66C2]" };
  if (l.includes("github")) return { icon: "link", cls: dark ? "text-zinc-200" : "text-zinc-800" };
  if (l.includes("orcid")) return { icon: "academic", cls: dark ? "text-emerald-300" : "text-emerald-700" };
  if (l.includes("portfolio") || l.includes("website")) return { icon: "globe", cls: base };
  if (l.includes("research")) return { icon: "academic", cls: base };
  return { icon: "link", cls: base };
}

/** Editable links — render once per CV (page 1 canonical zone). */
export function linksEditor(draft, ui, { dark = false, addBtn = "", inputCls = "", inputClsDark = "" } = {}) {
  const cls = dark ? inputClsDark || inputCls : inputCls;
  const rows = (draft.links || []).slice(0, MAX_LINKS);
  const inner = rows
    .map((l, i) => {
      const { icon, cls: ic } = linkVisual(l.label, ui, dark);
      return `
    <div data-link-row="${i}" class="cv-link-row mb-1.5 flex flex-wrap items-center gap-2">
      <span class="cv-link-icon shrink-0" aria-hidden="true">${resumeIcon(icon, `h-4 w-4 shrink-0 ${ic}`)}</span>
      <input data-lf="label" class="${cls} min-w-20 flex-1" placeholder="${escapeHtml(CV_PH.linkLabel)}" value="${escapeHtml(l.label)}" />
      <input data-lf="url" class="${cls} min-w-0 flex-2" placeholder="${escapeHtml(CV_PH.linkUrl)}" value="${escapeHtml(l.url)}" />
      <button type="button" data-action="remove-link" data-i="${i}" class="cv-link-remove print:hidden text-xs text-red-600 hover:text-red-800 ${rows.length < 2 ? "hidden" : ""}">Remove</button>
    </div>`;
    })
    .join("");
  return `<div class="cv-links-editor" data-links-editor>${inner}${addBtn}</div>`;
}

/** Read-only link list for repeated sidebars / pages 2–3 (no duplicate inputs). */
export function linksDisplay(draft, ui, { dark = false } = {}) {
  const rows = (draft.links || []).filter((l) => String(l.label || "").trim() || String(l.url || "").trim());
  if (!rows.length) {
    return `<div class="cv-links-display space-y-1 text-[12px] ${dark ? "text-zinc-400" : "text-zinc-400 italic"}">${escapeHtml(CV_PH.linkLabel)}</div>`;
  }
  const textCls = dark ? "text-zinc-200" : "text-zinc-700";
  return `<div class="cv-links-display space-y-1.5" data-links-display>
    ${rows
      .map((l) => {
        const { icon, cls: ic } = linkVisual(l.label, ui, dark);
        const label = String(l.label || "").trim() || CV_PH.linkLabel;
        const url = String(l.url || "").trim();
        return `<p class="flex items-center gap-2 text-[12px] ${textCls}">
          ${resumeIcon(icon, `h-3.5 w-3.5 shrink-0 ${ic}`)}
          <span class="font-medium ${ic}">${escapeHtml(label)}</span>
          ${url ? `<span class="truncate opacity-80">${escapeHtml(url)}</span>` : ""}
        </p>`;
      })
      .join("")}
  </div>`;
}

export function readLinksFromRoot(root) {
  const editor = root.querySelector("[data-links-editor]");
  const scope = editor || root;
  const seen = new Set();
  const out = [];
  for (const row of scope.querySelectorAll("[data-link-row]")) {
    const i = row.getAttribute("data-link-row");
    if (seen.has(i)) continue;
    seen.add(i);
    out.push({
      label: row.querySelector('[data-lf="label"]')?.value ?? "",
      url: row.querySelector('[data-lf="url"]')?.value ?? "",
    });
  }
  return out.length ? out.slice(0, MAX_LINKS) : null;
}
