import { escapeHtml } from "../escape-html.js";
import { buildLinksHtml, contactBits, dateRange, nl2br } from "./shared-preview.js";
import { CV_PH, hasText } from "./cv-placeholders.js";
import { CV_SPACE } from "./cv-design-tokens.js";
import { articlePhotoClass, photoSlot, sec } from "./cv-shared-ui.js";
import { resumeIcon } from "../resume-icons.js";
import { getTemplateUi } from "./cv-template-ui.js";
import { renderSkillsVisual } from "./cv-skills-ui.js";

/** @typedef {'classic'|'sidebar-left'|'sidebar-right'|'split-right'|'ribbon'|'bands'|'banner'|'serif'|'swiss'|'magazine'|'timeline'|'mono'|'academic'} CvLayoutKind */

/**
 * @typedef {object} CvTheme
 * @property {number} id
 * @property {string} name
 * @property {CvLayoutKind} layout
 * @property {string} accent — tailwind color key
 * @property {string} [font] — sans | serif | mono
 * @property {string} [sidebarBg]
 * @property {string} [rail]
 * @property {string} [ribbon]
 */

const ACCENT = {
  blue: { h2: "text-blue-900", line: "bg-blue-300", dot: "bg-blue-600", ribbon: "bg-blue-900", pill: "bg-blue-50 text-blue-950 border-blue-200" },
  indigo: { h2: "text-indigo-900", line: "bg-indigo-300", dot: "bg-indigo-600", ribbon: "bg-indigo-900", pill: "bg-indigo-50 text-indigo-950 border-indigo-200" },
  violet: { h2: "text-violet-900", line: "bg-violet-300", dot: "bg-violet-600", ribbon: "bg-violet-900", pill: "bg-violet-50 text-violet-950 border-violet-200" },
  purple: { h2: "text-purple-900", line: "bg-purple-300", dot: "bg-purple-600", ribbon: "bg-purple-900", pill: "bg-purple-50 text-purple-950 border-purple-200" },
  emerald: { h2: "text-emerald-900", line: "bg-emerald-300", dot: "bg-emerald-600", ribbon: "bg-emerald-900", pill: "bg-emerald-50 text-emerald-950 border-emerald-200" },
  teal: { h2: "text-teal-900", line: "bg-teal-300", dot: "bg-teal-600", ribbon: "bg-teal-900", pill: "bg-teal-50 text-teal-950 border-teal-200" },
  cyan: { h2: "text-cyan-900", line: "bg-cyan-300", dot: "bg-cyan-600", ribbon: "bg-cyan-900", pill: "bg-cyan-50 text-cyan-950 border-cyan-200" },
  sky: { h2: "text-sky-900", line: "bg-sky-300", dot: "bg-sky-600", ribbon: "bg-sky-900", pill: "bg-sky-50 text-sky-950 border-sky-200" },
  amber: { h2: "text-amber-900", line: "bg-amber-300", dot: "bg-amber-600", ribbon: "bg-amber-900", pill: "bg-amber-50 text-amber-950 border-amber-200" },
  orange: { h2: "text-orange-900", line: "bg-orange-300", dot: "bg-orange-600", ribbon: "bg-orange-900", pill: "bg-orange-50 text-orange-950 border-orange-200" },
  rose: { h2: "text-rose-900", line: "bg-rose-300", dot: "bg-rose-600", ribbon: "bg-rose-900", pill: "bg-rose-50 text-rose-950 border-rose-200" },
  red: { h2: "text-red-900", line: "bg-red-300", dot: "bg-red-600", ribbon: "bg-red-900", pill: "bg-red-50 text-red-950 border-red-200" },
  slate: { h2: "text-slate-800", line: "bg-slate-300", dot: "bg-slate-700", ribbon: "bg-slate-900", pill: "bg-slate-50 text-slate-900 border-slate-200" },
  zinc: { h2: "text-zinc-800", line: "bg-zinc-300", dot: "bg-zinc-700", ribbon: "bg-zinc-900", pill: "bg-zinc-50 text-zinc-900 border-zinc-200" },
  fuchsia: { h2: "text-fuchsia-900", line: "bg-fuchsia-300", dot: "bg-fuchsia-600", ribbon: "bg-fuchsia-900", pill: "bg-fuchsia-50 text-fuchsia-950 border-fuchsia-200" },
  lime: { h2: "text-lime-900", line: "bg-lime-300", dot: "bg-lime-600", ribbon: "bg-lime-900", pill: "bg-lime-50 text-lime-950 border-lime-200" },
};

export const CV_THEMES = [
  null,
  { id: 1, name: "Geneva", layout: "classic", accent: "blue", font: "sans" },
  { id: 2, name: "Cascade", layout: "sidebar-left", accent: "emerald", font: "sans", sidebarBg: "bg-zinc-950", rail: "border-zinc-800" },
  { id: 3, name: "Zurich", layout: "split-right", accent: "amber", font: "sans" },
  { id: 4, name: "Oxford", layout: "ribbon", accent: "indigo", font: "serif" },
  { id: 5, name: "Kyoto", layout: "timeline", accent: "violet", font: "sans" },
  { id: 6, name: "Singapore", layout: "magazine", accent: "purple", font: "sans" },
  { id: 7, name: "Oslo", layout: "sidebar-left", accent: "teal", font: "sans", sidebarBg: "bg-emerald-950", rail: "border-emerald-800" },
  { id: 8, name: "Berlin", layout: "bands", accent: "emerald", font: "sans" },
  { id: 9, name: "Manhattan", layout: "banner", accent: "zinc", font: "sans" },
  { id: 10, name: "Sydney", layout: "sidebar-right", accent: "sky", font: "sans", sidebarBg: "bg-slate-900", rail: "border-slate-700" },
  { id: 11, name: "Montreal", layout: "split-right", accent: "violet", font: "serif" },
  { id: 12, name: "Cambridge", layout: "serif", accent: "slate", font: "serif" },
  { id: 13, name: "Milan", layout: "classic", accent: "rose", font: "sans" },
  { id: 14, name: "Stockholm", layout: "sidebar-left", accent: "sky", font: "sans", sidebarBg: "bg-slate-950", rail: "border-slate-800" },
  { id: 15, name: "Toronto", layout: "split-right", accent: "cyan", font: "sans" },
  { id: 16, name: "Barcelona", layout: "swiss", accent: "orange", font: "sans" },
  { id: 17, name: "Melbourne", layout: "academic", accent: "teal", font: "serif" },
  { id: 18, name: "Paris", layout: "magazine", accent: "fuchsia", font: "serif" },
  { id: 19, name: "Vienna", layout: "serif", accent: "zinc", font: "serif" },
  { id: 20, name: "Lisbon", layout: "sidebar-left", accent: "rose", font: "sans", sidebarBg: "bg-rose-950", rail: "border-rose-900" },
];

export function getCvTheme(n) {
  return CV_THEMES[n] || CV_THEMES[1];
}

function a(theme) {
  return ACCENT[theme.accent] || ACCENT.blue;
}

function fontClass(theme) {
  if (theme.font === "serif") return "font-serif";
  if (theme.font === "mono") return "font-mono";
  return "font-sans";
}

/** Show placeholder when empty (static render). */
export function cvText(value, placeholder, className = "text-[13px] leading-[1.55] text-zinc-800") {
  const v = String(value ?? "").trim();
  if (v) return `<span class="${className}">${escapeHtml(v)}</span>`;
  return `<span class="${className} text-zinc-400 italic">${escapeHtml(placeholder)}</span>`;
}

export function sectionHead(title, theme, style = "ruled") {
  const ac = a(theme);
  if (style === "band") {
    return `<div class="mb-3 ${ac.ribbon} px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white">${escapeHtml(title)}</div>`;
  }
  if (style === "boxed") {
    return `<h2 class="mb-3 border-l-4 ${ac.dot.replace("bg-", "border-")} pl-3 text-[11px] font-bold uppercase tracking-[0.16em] ${ac.h2}">${escapeHtml(title)}</h2>`;
  }
  if (style === "minimal") {
    return `<h2 class="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">${escapeHtml(title)}</h2>`;
  }
  return `
    <div class="mb-3 flex items-center gap-3">
      <h2 class="shrink-0 text-[11px] font-semibold uppercase tracking-[0.14em] ${ac.h2}">${escapeHtml(title)}</h2>
      <div class="h-px min-w-0 flex-1 ${ac.line}" aria-hidden="true"></div>
    </div>`;
}

export function cvPage(pageNum, inner, draft, theme) {
  const tplId = theme?.id ?? 1;
  const ui = getTemplateUi(tplId);
  return `
    <section class="cv-page cv-tpl-${tplId}-page ${ui.page || ""}" data-page="${pageNum}" aria-label="Page ${pageNum}">
      <div class="cv-page-body min-h-0 flex-1">${inner}</div>
    </section>`;
}

export function distributePages(draft) {
  const exp = Array.isArray(draft.experience) ? draft.experience : [];
  const projects = Array.isArray(draft.projects) ? draft.projects : [];
  const p1Exp = exp.slice(0, 2);
  const p2Exp = exp.slice(2);
  return { p1Exp, p2Exp, projects };
}

function linkPack(theme) {
  const ac = a(theme);
  return {
    anchor: `${ac.h2.replace("text-", "text-")} underline decoration-current/30`,
    muted: "text-zinc-400 italic",
    sep: "text-zinc-300 select-none px-1",
  };
}

function experienceHtml(jobs, theme, opts = {}) {
  const ac = a(theme);
  return jobs
    .map((job) => {
      const company = String(job.company || "").trim();
      const role = String(job.role || "").trim();
      const range = dateRange(job.start, job.end);
      const bullets = (job.bullets || [])
        .map((b) => String(b || "").trim())
        .filter(Boolean)
        .map((b) => `<li class="text-[13px] leading-[1.55] text-zinc-700">${escapeHtml(b)}</li>`)
        .join("");
      if (!company && !role && !bullets) return "";
      return `
        <article class="cv-exp-row cv-avoid-break mb-[1rem] grid grid-cols-[7rem_minmax(0,1fr)] gap-x-[1.25rem] border-b border-[#e4e4e7] pb-[1rem] last:border-0">
          <time class="pt-0.5 text-[11px] font-medium tabular-nums leading-snug text-zinc-500">${range || cvText("", CV_PH.expStart, "text-[11px] text-zinc-400 italic")}</time>
          <div class="min-w-0">
            <h3 class="text-[14px] font-semibold leading-snug text-zinc-950">${role ? escapeHtml(role) : `<span class="text-zinc-400 italic">${escapeHtml(CV_PH.expRole)}</span>`}</h3>
            <p class="mt-0.5 text-[12px] text-zinc-600">${company ? escapeHtml(company) : `<span class="italic text-zinc-400">${escapeHtml(CV_PH.expCompany)}</span>`}</p>
            ${bullets ? `<ul class="mt-2 list-disc space-y-1 pl-[1.1rem] marker:text-zinc-400">${bullets}</ul>` : `<p class="mt-2 text-[12px] italic text-zinc-400">${escapeHtml(CV_PH.bullet)}</p>`}
          </div>
        </article>`;
    })
    .join("");
}

function projectsHtml(projects, theme) {
  return projects
    .map((p) => {
      const name = String(p.name || "").trim();
      const ctx = String(p.context || "").trim();
      const range = dateRange(p.start, p.end);
      const bullets = (p.bullets || [])
        .map((b) => String(b || "").trim())
        .filter(Boolean)
        .map((b) => `<li class="text-[13px] leading-[1.55] text-zinc-700">${escapeHtml(b)}</li>`)
        .join("");
      if (!name && !ctx && !bullets) return "";
      return `
        <article class="cv-avoid-break mb-4">
          <div class="flex flex-wrap items-baseline justify-between gap-2">
            <h3 class="text-[14px] font-semibold text-zinc-950">${name ? escapeHtml(name) : `<span class="italic text-zinc-400">${escapeHtml(CV_PH.projName)}</span>`}</h3>
            ${range ? `<span class="text-[11px] tabular-nums text-zinc-500">${range}</span>` : ""}
          </div>
          <p class="mt-0.5 text-[12px] text-zinc-600">${ctx ? escapeHtml(ctx) : `<span class="italic text-zinc-400">${escapeHtml(CV_PH.projContext)}</span>`}</p>
          ${bullets ? `<ul class="mt-2 list-disc space-y-1 pl-[1.1rem]">${bullets}</ul>` : ""}
        </article>`;
    })
    .join("");
}

function educationHtml(draft, theme) {
  return (draft.education || [])
    .map((ed) => {
      const school = String(ed.school || "").trim();
      const degree = String(ed.degree || "").trim();
      const range = dateRange(ed.start, ed.end);
      if (!school && !degree) return "";
      return `
        <div class="cv-avoid-break mb-3 grid grid-cols-[7rem_minmax(0,1fr)] gap-x-[1.25rem]">
          <time class="text-[11px] font-medium tabular-nums text-zinc-500">${range || "—"}</time>
          <div>
            <p class="text-[14px] font-semibold text-zinc-950">${degree ? escapeHtml(degree) : `<span class="italic text-zinc-400">${escapeHtml(CV_PH.eduDegree)}</span>`}</p>
            <p class="mt-0.5 text-[12px] text-zinc-600">${school ? escapeHtml(school) : `<span class="italic text-zinc-400">${escapeHtml(CV_PH.eduSchool)}</span>`}</p>
          </div>
        </div>`;
    })
    .join("");
}

function multilineBlock(text, placeholder) {
  const t = String(text || "").trim();
  if (!t) return `<p class="text-[13px] italic leading-[1.55] text-zinc-400">${escapeHtml(placeholder)}</p>`;
  return `<div class="space-y-1.5 text-[13px] leading-[1.55] text-zinc-800">${t.split(/\n/).map((line) => `<p>${escapeHtml(line.trim())}</p>`).join("")}</div>`;
}

function headerStandard(draft, theme) {
  const ac = a(theme);
  const ui = getTemplateUi(theme.id);
  const bits = contactBits(draft);
  const links = ui.linksZone === "header" ? buildLinksHtml(draft, linkPack(theme)) : "";
  const contact = bits.length
    ? bits.map((c) => `<span>${escapeHtml(c)}</span>`).join(`<span class="text-zinc-300" aria-hidden="true">·</span>`)
    : `<span class="text-zinc-400 italic">${escapeHtml(`${CV_PH.email} · ${CV_PH.phone}`)}</span>`;

  return `
    <header class="cv-avoid-break mb-6 border-b border-zinc-200 pb-5">
      <div class="flex items-start gap-4">
        ${photoSlot(draft, ui)}
        <div class="min-w-0 flex-1">
          <h1 class="cv-name-emphasis text-[1.75rem] font-extrabold leading-tight tracking-[-0.025em] text-zinc-950">${hasText(draft.fullName) ? escapeHtml(draft.fullName) : `<span class="text-zinc-400 italic">${escapeHtml(CV_PH.fullName)}</span>`}</h1>
          <p class="mt-1 text-[0.95rem] font-normal tracking-[0.01em] text-[#52525b]">${hasText(draft.title) ? escapeHtml(draft.title) : `<span class="italic text-zinc-400">${escapeHtml(CV_PH.title)}</span>`}</p>
          <p class="mt-2.5 flex flex-wrap gap-x-2 gap-y-1 text-[12px] text-zinc-700">${contact}</p>
          ${links ? `<p class="mt-1.5 text-[12px]">${links}</p>` : `<p class="mt-1.5 text-[12px] italic text-zinc-400">${escapeHtml(CV_PH.linkLabel)}: ${escapeHtml(CV_PH.linkUrl)}</p>`}
        </div>
      </div>
    </header>`;
}

function headerRibbon(draft, theme) {
  const ac = a(theme);
  const ui = getTemplateUi(theme.id);
  const bits = contactBits(draft);
  return `
    <header class="cv-avoid-break mb-6 overflow-hidden rounded-sm">
      <div class="${ac.ribbon} flex items-center gap-4 px-4 py-4 text-white">
        ${photoSlot(draft, ui, { dark: true, size: "sm" })}
        <div class="min-w-0 flex-1">
          <h1 class="text-[1.6rem] font-bold leading-tight">${hasText(draft.fullName) ? escapeHtml(draft.fullName) : escapeHtml(CV_PH.fullName)}</h1>
          <p class="mt-1 text-sm text-white/85">${hasText(draft.title) ? escapeHtml(draft.title) : escapeHtml(CV_PH.title)}</p>
        </div>
      </div>
      <p class="border border-t-0 border-zinc-200 bg-zinc-50/80 px-4 py-2 text-[11px] text-zinc-700">${bits.map((c) => escapeHtml(c)).join(" · ") || `${CV_PH.email} · ${CV_PH.phone} · ${CV_PH.location}`}</p>
    </header>`;
}

function headerSerif(draft, theme) {
  const ui = getTemplateUi(theme.id);
  return `
    <header class="cv-avoid-break mb-6 border-b-2 border-zinc-900 pb-5 text-center">
      <div class="mb-3 flex justify-center">${photoSlot(draft, ui, { size: "lg" })}</div>
      <h1 class="cv-name-emphasis text-[1.75rem] font-extrabold uppercase tracking-[-0.025em] text-zinc-950">${hasText(draft.fullName) ? escapeHtml(draft.fullName) : escapeHtml(CV_PH.fullName)}</h1>
      <p class="mt-2 text-[0.95rem] font-normal tracking-[0.01em] text-[#52525b]">${hasText(draft.title) ? escapeHtml(draft.title) : escapeHtml(CV_PH.title)}</p>
      <p class="mt-3 text-[12px] text-zinc-700">${contactBits(draft).map((c) => escapeHtml(c)).join(" · ") || escapeHtml(`${CV_PH.email} · ${CV_PH.location}`)}</p>
    </header>`;
}

function headerCompact(draft, theme) {
  const ui = getTemplateUi(theme.id);
  const ac = a(theme);
  return `
    <header class="cv-header-compact cv-avoid-break mb-6 flex flex-col justify-between gap-3 border-b border-zinc-200 pb-5 sm:flex-row sm:items-end">
      <div class="flex min-w-0 flex-1 items-end gap-4">
        ${photoSlot(draft, ui, { size: "sm", context: "header" })}
        <div class="min-w-0 flex-1">
          <h1 class="cv-name-emphasis text-[1.75rem] font-extrabold leading-tight tracking-[-0.025em] text-zinc-950">${hasText(draft.fullName) ? escapeHtml(draft.fullName) : escapeHtml(CV_PH.fullName)}</h1>
          <p class="mt-0.5 text-xs font-bold uppercase tracking-[0.18em] ${ac.h2}">${hasText(draft.title) ? escapeHtml(draft.title) : escapeHtml(CV_PH.title)}</p>
        </div>
      </div>
      <div class="text-right text-[12px] text-zinc-700">${contactLines(draft, ui)}</div>
    </header>`;
}

function headerBannerStatic(draft, theme) {
  const ui = getTemplateUi(theme.id);
  const bits = contactBits(draft);
  const strip = `<div class="cv-banner-strip mb-4 bg-zinc-900 px-4 py-2.5 text-center text-[11px] text-white print:bg-zinc-900">${bits.map((c) => escapeHtml(c)).join(" · ") || escapeHtml(CV_PH.email)}</div>`;
  return `${strip}
  <header class="cv-header-banner cv-avoid-break mb-5 flex items-start gap-4">
    ${photoSlot(draft, ui, { context: "header" })}
    <div class="min-w-0 flex-1">
      <h1 class="cv-name-emphasis text-[1.75rem] font-extrabold tracking-[-0.025em] text-zinc-950">${hasText(draft.fullName) ? escapeHtml(draft.fullName) : escapeHtml(CV_PH.fullName)}</h1>
      <p class="mt-1 text-[0.95rem] font-normal tracking-[0.01em] text-[#52525b]">${hasText(draft.title) ? escapeHtml(draft.title) : escapeHtml(CV_PH.title)}</p>
    </div>
  </header>`;
}

function pickHeader(draft, theme) {
  const ui = getTemplateUi(theme.id);
  if (ui.header === "banner" || theme.layout === "banner") return headerBannerStatic(draft, theme);
  if (ui.header === "ribbon" || theme.layout === "ribbon") return headerRibbon(draft, theme);
  if (ui.header === "serif" || theme.layout === "serif") return headerSerif(draft, theme);
  if (ui.header === "compact") return headerCompact(draft, theme);
  return headerStandard(draft, theme);
}

function skillsVisualHtml(draft, theme, dark = false) {
  const ui = getTemplateUi(theme.id);
  const skills = String(draft.skills || "").trim();
  if (!skills) {
    return `<p class="text-[13px] italic leading-[1.55] text-zinc-400">${escapeHtml(CV_PH.skills.split("\n")[0])}</p>`;
  }
  return renderSkillsVisual(skills, ui, { dark, tplId: theme.id });
}

function contactLines(draft, ui, dark = false) {
  const ic = ui.iconContact || (dark ? "text-sky-300" : "text-blue-600");
  const row = (icon, text, ph) => {
    const val = String(text || "").trim();
    const body = val ? escapeHtml(val) : `<span class="italic opacity-60">${escapeHtml(ph)}</span>`;
    return `<p class="flex items-center gap-2">${resumeIcon(icon, `h-3.5 w-3.5 shrink-0 ${ic}`)}<span>${body}</span></p>`;
  };
  return `${row("mail", draft.email, CV_PH.email)}${row("phone", draft.phone, CV_PH.phone)}${row("map", draft.location, CV_PH.location)}`;
}

function blockSection(title, inner, theme) {
  if (!inner) return "";
  const ui = getTemplateUi(theme.id);
  return `<section class="${CV_SPACE.section} cv-avoid-break">${sec(title, ui)}${inner}</section>`;
}

function page1Body(draft, theme, p1Exp) {
  const summary = String(draft.summary || "").trim();
  const skills = String(draft.skills || "").trim();
  let html = pickHeader(draft, theme);
  html += blockSection(
    "Professional Summary",
    summary ? `<p class="text-[13px] leading-[1.55] text-zinc-800">${nl2br(summary)}</p>` : multilineBlock("", CV_PH.summary),
    theme,
  );
  if (skills && theme.layout !== "split-right") {
    html += blockSection("Core Competencies", skillsVisualHtml(draft, theme), theme);
  }
  html += blockSection(
    "Professional Experience",
    experienceHtml(p1Exp, theme) || `<p class="text-[13px] italic text-zinc-400">${escapeHtml(CV_PH.expRole)} — ${escapeHtml(CV_PH.expCompany)}</p>`,
    theme,
  );
  return html;
}

function page2Body(draft, theme, p2Exp, projects) {
  let html = "";
  if (p2Exp.length) {
    html += blockSection("Professional Experience (continued)", experienceHtml(p2Exp, theme), theme);
  }
  html += blockSection(
    "Projects & Research",
    projectsHtml(projects, theme) || `<p class="text-[13px] italic text-zinc-400">${escapeHtml(CV_PH.projName)}</p>`,
    theme,
  );
  return html;
}

function page3Body(draft, theme) {
  const skills = String(draft.skills || "").trim();
  let html = blockSection("Education", educationHtml(draft, theme) || `<p class="italic text-zinc-400 text-[13px]">${escapeHtml(CV_PH.eduDegree)}</p>`, theme);
  html += blockSection("Certifications & Licenses", multilineBlock(draft.certifications, CV_PH.certifications), theme);
  html += blockSection("Languages", multilineBlock(draft.languages, CV_PH.languages), theme);
  if (skills && theme.layout !== "split-right") {
    html += blockSection("Additional Skills", skillsVisualHtml(draft, theme), theme);
  }
  return html;
}

function splitRailStatic(draft, theme) {
  const ui = getTemplateUi(theme.id);
  const railCls = ui.rail || "border-l border-zinc-200 bg-zinc-50/60";
  const links = ui.linksZone === "rail" ? buildLinksHtml(draft, linkPack(theme)) : "";
  let html = `<aside class="cv-rail cv-rail-split border-l p-4 text-[12px] print:w-[11.5rem] ${railCls}">`;
  html += blockSection("Skills", skillsVisualHtml(draft, theme), theme);
  html += blockSection("Languages", multilineBlock(draft.languages, CV_PH.languages), theme);
  if (links) html += blockSection("Links", links, theme);
  html += `</aside>`;
  return html;
}

function wrapSidebar(leftHtml, mainHtml, theme, side = "left") {
  const ui = getTemplateUi(theme.id);
  const aside = `<aside class="cv-sidebar w-[30%] shrink-0 p-5 text-white print:w-[28%] ${ui.sidebar || theme.sidebarBg || "bg-zinc-950"}">${leftHtml}</aside>`;
  const main = `<div class="min-w-0 flex-1 bg-white p-5 sm:p-6 print:p-5">${mainHtml}</div>`;
  return side === "left"
    ? `<div class="cv-spread flex min-h-0 flex-col sm:flex-row print:flex-row">${aside}${main}</div>`
    : `<div class="cv-spread flex min-h-0 flex-col sm:flex-row print:flex-row">${main}${aside}</div>`;
}

function sidebarContent(draft, theme) {
  const ui = getTemplateUi(theme.id);
  const links = buildLinksHtml(draft, {
    anchor: "text-sky-200 underline",
    muted: "text-zinc-500 italic",
    sep: "text-zinc-600",
  });
  return `
    <div class="mb-4 flex justify-center">${photoSlot(draft, ui, { dark: true, context: "sidebar" })}</div>
    <h1 class="cv-name-emphasis text-[1.75rem] font-extrabold leading-tight tracking-[-0.025em]">${hasText(draft.fullName) ? escapeHtml(draft.fullName) : escapeHtml(CV_PH.fullName)}</h1>
    <p class="mt-1.5 text-[0.95rem] font-normal tracking-[0.01em] text-white/80">${hasText(draft.title) ? escapeHtml(draft.title) : escapeHtml(CV_PH.title)}</p>
    <div class="mt-5 space-y-1 border-t border-white/15 pt-4 text-[12px] text-zinc-300">
      ${contactLines(draft, ui, true)}
    </div>
    ${links ? `<div class="mt-4 text-[12px]">${links}</div>` : ""}
    ${sec("Skills", ui, { dark: true })}
    ${skillsVisualHtml(draft, theme, true)}
    ${sec("Languages", ui, { dark: true })}
    ${multilineBlock(draft.languages, CV_PH.languages)}`;
}

/** Main 3-page CV renderer for all 20 themes */
export function renderMultipageCv(draft, themeId) {
  const theme = getCvTheme(themeId);
  const { p1Exp, p2Exp, projects } = distributePages(draft);
  const ac = a(theme);
  const ui = getTemplateUi(theme.id);
  const fc = ui.fontClass || fontClass(theme);
  const p1 = page1Body(draft, theme, p1Exp);
  const p2 = page2Body(draft, theme, p2Exp, projects);
  const p3 = page3Body(draft, theme);

  let pages = "";

  if (theme.layout === "sidebar-left" || theme.layout === "sidebar-right") {
    const side = sidebarContent(draft, theme);
    const sidePos = theme.layout === "sidebar-right" ? "right" : "left";
    const main1 = sidePos === "left" ? p1.replace(pickHeader(draft, theme), "") : p1;
    pages =
      cvPage(1, wrapSidebar(side, main1, theme, sidePos), draft, theme) +
      cvPage(2, wrapSidebar(side, p2, theme, sidePos), draft, theme) +
      cvPage(3, wrapSidebar(side, p3, theme, sidePos), draft, theme);
  } else if (theme.layout === "split-right") {
    const rail = splitRailStatic(draft, theme);
    const grid = (body) =>
      `<div class="cv-split-grid grid gap-0 sm:grid-cols-[1fr_11.5rem] print:grid-cols-[1fr_11.5rem]"><div class="min-w-0 p-5 print:p-5">${body}</div>${rail}</div>`;
    pages = cvPage(1, grid(p1), draft, theme) + cvPage(2, grid(p2), draft, theme) + cvPage(3, grid(p3), draft, theme);
  } else if (theme.layout === "banner") {
    pages = cvPage(1, p1, draft, theme) + cvPage(2, p2, draft, theme) + cvPage(3, p3, draft, theme);
  } else if (theme.layout === "timeline") {
    const ac = a(theme);
    const tl = (html) => `<div class="cv-timeline-accent border-l-4 ${ac.line.replace("bg-", "border-")} pl-4">${html}</div>`;
    pages =
      cvPage(1, tl(p1), draft, theme) + cvPage(2, tl(p2), draft, theme) + cvPage(3, tl(p3), draft, theme);
  } else if (theme.layout === "magazine") {
    const ui = getTemplateUi(theme.id);
    const summary = String(draft.summary || "").trim();
    const skills = String(draft.skills || "").trim();
    const header = pickHeader(draft, theme);
    const links = ui.linksZone === "header" ? blockSection("Links", buildLinksHtml(draft, linkPack(theme)), theme) : "";
    const magP1 = `${header}${links}<div class="mb-[1.25rem] grid gap-6 sm:grid-cols-2 cv-magazine-paris">${blockSection("Professional Summary", summary ? `<p class="text-[14px] leading-[1.45] text-zinc-800">${nl2br(summary)}</p>` : multilineBlock("", CV_PH.summary), theme)}${skills ? blockSection("Core Competencies", skillsVisualHtml(draft, theme), theme) : ""}</div>${blockSection("Professional Experience", experienceHtml(p1Exp, theme), theme)}`;
    pages = cvPage(1, magP1, draft, theme) + cvPage(2, p2, draft, theme) + cvPage(3, p3, draft, theme);
  } else if (theme.layout === "swiss") {
    const swiss = (html) => `<div class="cv-swiss-wrap max-w-none">${html}</div>`;
    pages = cvPage(1, swiss(p1), draft, theme) + cvPage(2, swiss(p2), draft, theme) + cvPage(3, swiss(p3), draft, theme);
  } else {
    pages = cvPage(1, p1, draft, theme) + cvPage(2, p2, draft, theme) + cvPage(3, p3, draft, theme);
  }

  return `
    <article id="resume-print-root" class="resume-preview-article cv-document cv-tpl-${theme.id} ${fc} ${articlePhotoClass(draft)} mx-auto text-zinc-900 antialiased" data-cv-template="${theme.id}">
      ${pages}
    </article>`;
}

export function renderCvTemplate(draft, n) {
  return renderMultipageCv(draft, n);
}
