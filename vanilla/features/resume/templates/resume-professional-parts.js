import { escapeHtml } from "../escape-html.js";
import { buildLinksHtml, contactBits, dateRange, nl2br } from "./shared-preview.js";

/** Deterministic “proficiency” width for skill bars (no random). */
export function skillBarPct(label, min = 52, max = 94) {
  let h = 0;
  const s = String(label);
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return min + (Math.abs(h) % (max - min + 1));
}

export function skillLinesFromDraft(draft) {
  return String(draft.skills || "")
    .split(/\n|,/)
    .map((x) => x.trim())
    .filter(Boolean)
    .slice(0, 14);
}

export function sectionHeader(title, titleClass, lineClass = "bg-zinc-300") {
  return `
    <div class="mb-3 flex min-w-0 items-center gap-3">
      <h2 class="shrink-0 text-[10px] font-bold uppercase tracking-[0.18em] ${titleClass}">${escapeHtml(title)}</h2>
      <div class="h-px min-w-0 flex-1 ${lineClass}"></div>
    </div>`;
}

export function experienceHtmlDatesLeft(draft, opts = {}) {
  const {
    dateClass = "text-xs font-semibold tabular-nums text-zinc-500",
    roleClass = "font-bold text-zinc-900",
    companyClass = "text-sm italic text-zinc-600",
    bulletClass = "text-sm text-zinc-700 leading-relaxed",
  } = opts;
  return (draft.experience || [])
    .map((job) => {
      const company = String(job.company || "").trim();
      const role = String(job.role || "").trim();
      const range = dateRange(job.start, job.end);
      const bullets = (job.bullets || [])
        .map((b) => String(b || "").trim())
        .filter(Boolean)
        .map((b) => `<li class="${bulletClass}">${escapeHtml(b)}</li>`)
        .join("");
      if (!company && !role && !bullets) return "";
      return `
        <div class="mb-5 grid grid-cols-[6.5rem_minmax(0,1fr)] gap-x-4 border-b border-zinc-100 pb-5 last:border-0">
          <div class="${dateClass}">${range || "—"}</div>
          <div class="min-w-0">
            <p class="${roleClass}">${escapeHtml(role || "Job title")}</p>
            <p class="${companyClass}">${escapeHtml(company || "Company")}</p>
            ${bullets ? `<ul class="mt-2 list-disc space-y-1 pl-4 marker:text-zinc-400">${bullets}</ul>` : ""}
          </div>
        </div>`;
    })
    .join("");
}

export function educationHtml(draft, opts = {}) {
  const {
    degreeClass = "font-bold text-zinc-900",
    metaClass = "text-sm text-zinc-600",
    dateClass = "text-xs font-semibold text-zinc-500",
  } = opts;
  return (draft.education || [])
    .map((ed) => {
      const school = String(ed.school || "").trim();
      const degree = String(ed.degree || "").trim();
      const range = dateRange(ed.start, ed.end);
      if (!school && !degree) return "";
      return `
        <div class="mb-4 grid grid-cols-[6.5rem_minmax(0,1fr)] gap-x-4">
          <div class="${dateClass}">${range || "—"}</div>
          <div class="min-w-0">
            <p class="${degreeClass}">${escapeHtml(degree || "Degree")}</p>
            <p class="${metaClass}">${escapeHtml(school || "Institution")}</p>
          </div>
        </div>`;
    })
    .join("");
}

export function skillsBarsHtml(lines, trackClass, fillClass, labelClass) {
  if (!lines.length) return "";
  return `
    <div class="space-y-3">
      ${lines
        .map((line) => {
          const pct = skillBarPct(line);
          return `
          <div>
            <div class="mb-1 flex justify-between gap-2">
              <span class="text-xs font-medium ${labelClass}">${escapeHtml(line)}</span>
            </div>
            <div class="h-1.5 w-full overflow-hidden rounded-full ${trackClass}">
              <div class="h-full rounded-full ${fillClass}" style="width:${pct}%"></div>
            </div>
          </div>`;
        })
        .join("")}
    </div>`;
}

export function skillsPillsHtml(lines, pillClass = "rounded-md bg-zinc-900 px-2.5 py-1 text-xs font-medium text-white") {
  if (!lines.length) return "";
  return `<div class="flex flex-wrap gap-2">${lines.map((l) => `<span class="${pillClass}">${escapeHtml(l)}</span>`).join("")}</div>`;
}

const ACCENTS = {
  blue: { h2: "text-blue-900", line: "bg-blue-200", anchor: "text-blue-800 underline decoration-blue-600/40 hover:text-blue-950", muted: "text-zinc-500", sep: "text-blue-200" },
  indigo: { h2: "text-indigo-900", line: "bg-indigo-200", anchor: "text-indigo-800 underline decoration-indigo-500/40 hover:text-indigo-950", muted: "text-zinc-500", sep: "text-indigo-200" },
  emerald: { h2: "text-emerald-900", line: "bg-emerald-200", anchor: "text-emerald-800 underline decoration-emerald-500/40 hover:text-emerald-950", muted: "text-zinc-500", sep: "text-emerald-200" },
  rose: { h2: "text-rose-900", line: "bg-rose-200", anchor: "text-rose-800 underline decoration-rose-400/40 hover:text-rose-950", muted: "text-zinc-500", sep: "text-rose-200" },
  amber: { h2: "text-amber-900", line: "bg-amber-200", anchor: "text-amber-900 underline decoration-amber-500/40 hover:text-amber-950", muted: "text-zinc-500", sep: "text-amber-200" },
  slate: { h2: "text-slate-800", line: "bg-slate-300", anchor: "text-slate-800 underline decoration-slate-400/50 hover:text-slate-950", muted: "text-slate-400", sep: "text-slate-300" },
  violet: { h2: "text-violet-900", line: "bg-violet-200", anchor: "text-violet-800 underline decoration-violet-400/50 hover:text-violet-950", muted: "text-zinc-500", sep: "text-violet-200" },
  cyan: { h2: "text-cyan-900", line: "bg-cyan-200", anchor: "text-cyan-800 underline decoration-cyan-500/40 hover:text-cyan-950", muted: "text-zinc-500", sep: "text-cyan-200" },
  orange: { h2: "text-orange-900", line: "bg-orange-200", anchor: "text-orange-800 underline decoration-orange-400/40 hover:text-orange-950", muted: "text-zinc-500", sep: "text-orange-200" },
  teal: { h2: "text-teal-900", line: "bg-teal-200", anchor: "text-teal-800 underline decoration-teal-500/40 hover:text-teal-950", muted: "text-zinc-500", sep: "text-teal-200" },
  purple: { h2: "text-purple-900", line: "bg-purple-200", anchor: "text-purple-800 underline decoration-purple-400/40 hover:text-purple-950", muted: "text-zinc-500", sep: "text-purple-200" },
  red: { h2: "text-red-900", line: "bg-red-200", anchor: "text-red-800 underline decoration-red-400/40 hover:text-red-950", muted: "text-zinc-500", sep: "text-red-200" },
  sky: { h2: "text-sky-900", line: "bg-sky-200", anchor: "text-sky-800 underline decoration-sky-500/40 hover:text-sky-950", muted: "text-zinc-500", sep: "text-sky-200" },
  lime: { h2: "text-lime-900", line: "bg-lime-200", anchor: "text-lime-900 underline decoration-lime-500/40 hover:text-lime-950", muted: "text-zinc-500", sep: "text-lime-300" },
  fuchsia: { h2: "text-fuchsia-900", line: "bg-fuchsia-200", anchor: "text-fuchsia-800 underline decoration-fuchsia-400/40 hover:text-fuchsia-950", muted: "text-zinc-500", sep: "text-fuchsia-200" },
  neutral: { h2: "text-neutral-800", line: "bg-neutral-300", anchor: "text-neutral-900 underline decoration-neutral-400 hover:text-black", muted: "text-neutral-500", sep: "text-neutral-300" },
};

export function accentKeyOr(accent, fallback = "blue") {
  return ACCENTS[accent] ? accent : fallback;
}

function linkPack(a) {
  return { anchor: a.anchor, muted: a.muted, sep: `${a.sep} select-none px-1` };
}

/** Single-column executive layout. */
export function renderLayoutClassicPro(draft, accent = "blue") {
  const a = ACCENTS[accentKeyOr(accent)];
  const links = buildLinksHtml(draft, linkPack(a));
  const bits = contactBits(draft);
  const skills = String(draft.skills || "").trim();
  const summary = String(draft.summary || "").trim();
  const lines = skillLinesFromDraft(draft);
  const exp = experienceHtmlDatesLeft(draft);
  const edu = educationHtml(draft);

  return `
    <article id="resume-print-root" class="resume-preview-article mx-auto max-w-3xl text-left text-zinc-900 antialiased">
      <header class="border-b-2 border-zinc-900 pb-5 mb-6">
        <h1 class="text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl">${escapeHtml(draft.fullName || "Your name")}</h1>
        <p class="mt-1 text-sm font-semibold uppercase tracking-wide text-zinc-600">${escapeHtml(draft.title || "Professional title")}</p>
        <div class="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-700">
          ${bits.length ? bits.map((c) => `<span>${escapeHtml(c)}</span>`).join(`<span class="text-zinc-300">|</span>`) : `<span class="text-zinc-400">Add contact details</span>`}
        </div>
        ${links ? `<div class="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm">${links}</div>` : ""}
      </header>
      ${summary ? `${sectionHeader("Professional summary", a.h2, a.line)}<p class="mb-7 text-sm leading-relaxed text-zinc-800">${nl2br(summary)}</p>` : ""}
      ${exp ? `${sectionHeader("Experience", a.h2, a.line)}<section class="mb-7">${exp}</section>` : ""}
      ${edu ? `${sectionHeader("Education", a.h2, a.line)}<section class="mb-7">${edu}</section>` : ""}
      ${
        skills
          ? `${sectionHeader("Skills", a.h2, a.line)}${lines.length ? skillsPillsHtml(lines) : `<p class="text-sm leading-relaxed text-zinc-700 whitespace-pre-wrap">${nl2br(skills)}</p>`}`
          : ""
      }
    </article>`;
}

/** Dark sidebar + main (Cascade / engineering style). */
export function renderLayoutSidebarPro(draft, opts) {
  const { sidebarBg = "bg-zinc-900", sidebarText = "text-white", accent = "emerald", rail = "border-zinc-700" } = opts;
  const a = ACCENTS[accentKeyOr(accent, "emerald")];
  const links = buildLinksHtml(draft, {
    anchor: "text-sky-200 underline decoration-sky-300/40 hover:text-white",
    muted: "text-zinc-400",
    sep: "text-zinc-500 select-none px-1",
  });
  const bits = contactBits(draft);
  const contactHtml = bits.length
    ? bits.map((c) => `<p class="text-sm text-zinc-300">${escapeHtml(c)}</p>`).join("")
    : `<p class="text-sm text-zinc-500">Add contact details</p>`;
  const lines = skillLinesFromDraft(draft);
  const skillsBlock = lines.length
    ? `${sectionHeader("Core skills", "text-white", "bg-white/20")}${skillsBarsHtml(lines, "bg-white/15", "bg-white", "text-zinc-200")}`
    : "";
  const summary = String(draft.summary || "").trim();
  const exp = experienceHtmlDatesLeft(draft);
  const edu = educationHtml(draft);

  return `
    <article id="resume-print-root" class="resume-preview-article flex min-h-0 flex-col text-left antialiased sm:flex-row sm:items-stretch print:flex-row">
      <aside class="w-full shrink-0 ${sidebarBg} p-6 ${sidebarText} sm:w-[32%] sm:max-w-[220px] sm:border-r ${rail} print:w-[30%]">
        <h1 class="text-2xl font-bold leading-tight tracking-tight">${escapeHtml(draft.fullName || "Your name")}</h1>
        <p class="mt-2 text-xs font-semibold uppercase tracking-wider text-sky-300/90">${escapeHtml(draft.title || "Professional title")}</p>
        <div class="mt-6">${sectionHeader("Contact", "text-white", "bg-white/25")}</div>
        <div class="mt-2 space-y-1">${contactHtml}</div>
        ${links ? `<div class="mt-4 text-sm">${links}</div>` : ""}
        ${skillsBlock ? `<div class="mt-8">${skillsBlock}</div>` : ""}
      </aside>
      <div class="min-w-0 flex-1 bg-white p-6 sm:p-8 print:p-6">
        ${summary ? `${sectionHeader("Professional summary", a.h2, a.line)}<p class="mb-7 text-sm leading-relaxed text-zinc-800">${nl2br(summary)}</p>` : ""}
        ${exp ? `${sectionHeader("Experience", a.h2, a.line)}<section class="mb-7">${exp}</section>` : ""}
        ${edu ? `${sectionHeader("Education", a.h2, a.line)}<section>${edu}</section>` : ""}
      </div>
    </article>`;
}

/** Gold-accent split: narrative + strengths column. */
export function renderLayoutSplitPro(draft, accent = "amber") {
  const a = ACCENTS[accentKeyOr(accent, "amber")];
  const links = buildLinksHtml(draft, linkPack(a));
  const bits = contactBits(draft);
  const lines = skillLinesFromDraft(draft);
  const summary = String(draft.summary || "").trim();
  const exp = experienceHtmlDatesLeft(draft);
  const edu = educationHtml(draft);
  const strengths = lines.slice(0, 5);

  return `
    <article id="resume-print-root" class="resume-preview-article mx-auto max-w-4xl border border-zinc-200 bg-white text-left antialiased shadow-sm">
      <header class="border-b border-zinc-200 px-6 pb-5 pt-6 sm:px-8">
        <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 class="text-3xl font-bold text-zinc-950">${escapeHtml(draft.fullName || "Your name")}</h1>
            <p class="mt-1 text-xs font-bold uppercase tracking-[0.2em] ${a.h2}">${escapeHtml(draft.title || "Professional title")}</p>
          </div>
          <div class="text-right text-xs text-zinc-600">
            ${bits.map((c) => `<div>${escapeHtml(c)}</div>`).join("")}
          </div>
        </div>
        ${links ? `<div class="mt-3 flex flex-wrap justify-end gap-x-3 text-xs">${links}</div>` : ""}
      </header>
      <div class="grid gap-0 sm:grid-cols-[1fr_220px]">
        <div class="border-zinc-100 p-6 sm:border-r sm:px-8 sm:py-7">
          ${summary ? `${sectionHeader("Summary", a.h2, a.line)}<p class="mb-7 text-sm leading-relaxed text-zinc-800">${nl2br(summary)}</p>` : ""}
          ${exp ? `${sectionHeader("Experience", a.h2, a.line)}<section class="mb-7">${exp}</section>` : ""}
          ${edu ? `${sectionHeader("Education", a.h2, a.line)}<section>${edu}</section>` : ""}
        </div>
        <div class="bg-amber-50/60 p-6 sm:py-7">
          ${sectionHeader("Core strengths", a.h2, a.line)}
          <ul class="space-y-3 text-sm text-zinc-800">
            ${strengths.length ? strengths.map((s) => `<li class="flex gap-2"><span class="mt-1.5 size-1.5 shrink-0 rounded-full bg-amber-600"></span><span>${escapeHtml(s)}</span></li>`).join("") : `<li class="text-zinc-500">Add skills (one per line)</li>`}
          </ul>
          ${lines.length > 5 ? `<div class="mt-6">${skillsBarsHtml(lines.slice(5), "bg-amber-200/60", "bg-amber-700", "text-zinc-800")}</div>` : ""}
        </div>
      </div>
    </article>`;
}

/** Green section-bar bands (engineering CV style). */
export function renderLayoutGreenBarsPro(draft) {
  const em = ACCENTS.emerald;
  const links = buildLinksHtml(draft, linkPack(em));
  const bits = contactBits(draft);
  const summary = String(draft.summary || "").trim();
  const exp = experienceHtmlDatesLeft(draft);
  const edu = educationHtml(draft);
  const lines = skillLinesFromDraft(draft);
  const bar = "bg-emerald-800 py-2 text-center text-xs font-bold uppercase tracking-widest text-white";

  const block = (title, inner) =>
    inner ? `<section class="mb-6"><div class="${bar}">${escapeHtml(title)}</div><div class="border border-t-0 border-zinc-200 px-4 py-4">${inner}</div></section>` : "";

  return `
    <article id="resume-print-root" class="resume-preview-article mx-auto max-w-3xl text-left text-zinc-900 antialiased">
      <header class="mb-6 border-b-2 border-emerald-800 pb-4">
        <h1 class="text-3xl font-bold text-emerald-950">${escapeHtml(draft.fullName || "Your name")}</h1>
        <p class="mt-1 text-sm font-medium text-emerald-800">${escapeHtml(draft.title || "Professional title")}</p>
        <p class="mt-3 text-sm text-zinc-700">${bits.map((c) => escapeHtml(c)).join(" · ") || "Contact details"}</p>
        ${links ? `<div class="mt-2 text-sm">${links}</div>` : ""}
      </header>
      ${block("Professional profile", summary ? `<p class="text-sm leading-relaxed text-zinc-800">${nl2br(summary)}</p>` : "")}
      ${block("Core skills", lines.length ? skillsPillsHtml(lines, "rounded bg-emerald-900 px-2 py-0.5 text-xs font-medium text-white") : "")}
      ${block("Experience", exp)}
      ${block("Education", edu)}
    </article>`;
}

/** Black contact banner + two-column body. */
export function renderLayoutBannerSplitPro(draft) {
  const n = ACCENTS.neutral;
  const links = buildLinksHtml(draft, linkPack(n));
  const bits = contactBits(draft);
  const summary = String(draft.summary || "").trim();
  const exp = experienceHtmlDatesLeft(draft);
  const edu = educationHtml(draft);
  const lines = skillLinesFromDraft(draft);

  return `
    <article id="resume-print-root" class="resume-preview-article mx-auto max-w-4xl text-left text-zinc-900 antialiased">
      <header class="px-1 pt-2">
        <h1 class="text-2xl font-bold uppercase tracking-tight text-zinc-950 sm:text-3xl">${escapeHtml(draft.fullName || "Your name")}</h1>
        <p class="mt-1 text-sm text-zinc-700">${escapeHtml(draft.title || "Professional title")}</p>
        ${summary ? `<p class="mt-4 max-w-3xl text-sm leading-relaxed text-zinc-800">${nl2br(summary)}</p>` : ""}
      </header>
      <div class="mt-5 flex flex-wrap items-center justify-around gap-3 bg-zinc-900 px-4 py-3 text-xs text-white">
        ${bits.length ? bits.map((c) => `<span class="inline-flex items-center gap-1.5"><span class="opacity-60">▪</span>${escapeHtml(c)}</span>`).join("") : `<span>Add contact details</span>`}
      </div>
      ${links ? `<div class="mt-2 text-center text-xs">${links}</div>` : ""}
      <div class="mt-6 grid gap-8 sm:grid-cols-[2fr_1fr]">
        <div>
          ${sectionHeader("Experience", "text-zinc-900", "bg-zinc-900")}
          <div class="mt-2">${exp || `<p class="text-sm text-zinc-500">Add experience</p>`}</div>
          ${sectionHeader("Education", "text-zinc-900", "bg-zinc-900")}
          <div class="mt-2">${edu}</div>
        </div>
        <div>
          ${sectionHeader("Skills", "text-zinc-900", "bg-zinc-900")}
          <div class="mt-2">${lines.length ? skillsPillsHtml(lines) : `<p class="text-sm text-zinc-500">Add skills</p>`}</div>
        </div>
      </div>
    </article>`;
}

/** Navy two-column: light main + navy rail (electrical / industrial style). */
export function renderLayoutNavyRailPro(draft) {
  const a = ACCENTS.sky;
  const links = buildLinksHtml(draft, {
    anchor: "text-sky-200 underline decoration-sky-300/40 hover:text-white",
    muted: "text-slate-400",
    sep: "text-slate-500 select-none px-1",
  });
  const bits = contactBits(draft);
  const lines = skillLinesFromDraft(draft);
  const summary = String(draft.summary || "").trim();
  const exp = experienceHtmlDatesLeft(draft);
  const edu = educationHtml(draft);

  return `
    <article id="resume-print-root" class="resume-preview-article flex min-h-0 flex-col text-left antialiased sm:flex-row print:flex-row">
      <div class="min-w-0 flex-1 bg-white p-6 sm:p-8 sm:pr-10 print:p-6">
        ${summary ? `<p class="mb-7 text-sm leading-relaxed text-zinc-800">${nl2br(summary)}</p>` : ""}
        ${exp ? `${sectionHeader("Work history", a.h2, a.line)}<section class="mb-7">${exp}</section>` : ""}
        ${edu ? `${sectionHeader("Education", a.h2, a.line)}<section>${edu}</section>` : ""}
      </div>
      <aside class="w-full shrink-0 bg-slate-900 p-6 text-white sm:w-[34%] sm:max-w-[240px] print:w-[32%]">
        <h1 class="text-2xl font-bold">${escapeHtml(draft.fullName || "Your name")}</h1>
        <p class="mt-2 text-sm text-slate-300">${escapeHtml(draft.title || "Professional title")}</p>
        <div class="mt-6 border-t border-white/15 pt-4 text-sm">
          ${bits.map((c) => `<p class="text-slate-200">${escapeHtml(c)}</p>`).join("")}
        </div>
        ${links ? `<div class="mt-4 text-sm">${links}</div>` : ""}
        ${lines.length ? `<div class="mt-8"><p class="text-xs font-bold uppercase tracking-wider text-slate-400">Skills</p><ul class="mt-2 list-disc space-y-1 pl-4 text-sm text-slate-200">${lines.map((l) => `<li>${escapeHtml(l)}</li>`).join("")}</ul></div>` : ""}
      </aside>
    </article>`;
}

/** Lavender sidebar (entry-level engineer style). */
export function renderLayoutLavenderSidebarPro(draft) {
  const a = ACCENTS.violet;
  const links = buildLinksHtml(draft, linkPack(a));
  const bits = contactBits(draft);
  const lines = skillLinesFromDraft(draft);
  const summary = String(draft.summary || "").trim();
  const exp = experienceHtmlDatesLeft(draft, { roleClass: "font-bold text-violet-950", companyClass: "text-sm text-violet-900/80" });
  const edu = educationHtml(draft);

  return `
    <article id="resume-print-root" class="resume-preview-article mx-auto grid max-w-4xl grid-cols-1 text-left antialiased sm:grid-cols-[1fr_220px]">
      <header class="border-b border-violet-100 bg-white px-6 py-5 sm:col-span-2 sm:px-8">
        <h1 class="text-2xl font-bold text-violet-950 sm:text-3xl">${escapeHtml(draft.fullName || "Your name")}</h1>
        <p class="mt-1 text-sm text-zinc-600">${escapeHtml(draft.title || "Professional title")}</p>
        <p class="mt-3 text-xs text-zinc-600">${bits.map((c) => escapeHtml(c)).join(" · ")}</p>
        ${links ? `<div class="mt-2 text-xs">${links}</div>` : ""}
      </header>
      <div class="min-w-0 border-violet-50 bg-white p-6 sm:border-r sm:px-8 sm:py-6">
        ${summary ? `${sectionHeader("Profile", a.h2, a.line)}<p class="mb-6 text-sm text-zinc-800">${nl2br(summary)}</p>` : ""}
        ${exp ? `${sectionHeader("Work experience", a.h2, a.line)}<section class="mb-6">${exp}</section>` : ""}
        ${edu ? `${sectionHeader("Education", a.h2, a.line)}<section>${edu}</section>` : ""}
      </div>
      <aside class="border-t border-violet-100 bg-violet-50 p-6 sm:border-t-0 sm:py-6">
        ${lines.length ? `${sectionHeader("Skills", a.h2, a.line)}<p class="text-sm leading-relaxed text-zinc-800">${lines.map((l) => escapeHtml(l)).join(" · ")}</p>` : `<p class="text-sm text-zinc-500">Add skills</p>`}
      </aside>
    </article>`;
}

/** Formal single column serif (traditional engineering). */
export function renderLayoutFormalSerifPro(draft, accent = "slate") {
  const a = ACCENTS[accentKeyOr(accent, "slate")];
  const links = buildLinksHtml(draft, linkPack(a));
  const bits = contactBits(draft);
  const summary = String(draft.summary || "").trim();
  const exp = (draft.experience || [])
    .map((job) => {
      const company = String(job.company || "").trim();
      const role = String(job.role || "").trim();
      const range = dateRange(job.start, job.end);
      const bullets = (job.bullets || [])
        .map((b) => String(b || "").trim())
        .filter(Boolean)
        .map((b) => `<li class="text-sm leading-relaxed text-zinc-800">${escapeHtml(b)}</li>`)
        .join("");
      if (!company && !role && !bullets) return "";
      return `
        <div class="mb-6">
          <div class="flex flex-wrap items-baseline justify-between gap-2 border-b border-zinc-300 pb-1">
            <p class="text-sm font-bold uppercase tracking-wide text-zinc-900">${escapeHtml(role || "Role")}</p>
            ${range ? `<p class="text-xs text-zinc-600">${range}</p>` : ""}
          </div>
          <p class="mt-1 text-sm italic text-zinc-700">${escapeHtml(company || "Company")}</p>
          ${bullets ? `<ul class="mt-2 list-disc space-y-1 pl-5">${bullets}</ul>` : ""}
        </div>`;
    })
    .join("");
  const edu = educationHtml(draft);
  const lines = skillLinesFromDraft(draft);

  return `
    <article id="resume-print-root" class="resume-preview-article mx-auto max-w-3xl text-left font-serif text-zinc-900 antialiased">
      <header class="border-b border-zinc-900 pb-4 text-center">
        <h1 class="text-3xl font-bold uppercase tracking-wide text-zinc-950">${escapeHtml(draft.fullName || "Your name")}</h1>
        <p class="mt-2 text-sm uppercase tracking-widest text-zinc-600">${escapeHtml(draft.title || "Professional title")}</p>
        <p class="mt-3 text-sm text-zinc-700">${bits.map((c) => escapeHtml(c)).join(" · ")}</p>
        ${links ? `<div class="mt-2 text-sm">${links}</div>` : ""}
      </header>
      ${summary ? `<div class="mt-6 border-y border-zinc-300 py-4 text-center"><p class="text-sm leading-relaxed text-zinc-800">${nl2br(summary)}</p></div>` : ""}
      ${exp ? `<div class="mt-6"><h2 class="mb-3 text-center text-xs font-bold uppercase tracking-[0.25em] text-zinc-800">Professional experience</h2><div class="border-t border-zinc-900 pt-3">${exp}</div></div>` : ""}
      ${edu ? `<div class="mt-6">${sectionHeader("Education", a.h2, a.line)}${edu}</div>` : ""}
      ${lines.length ? `<div class="mt-6">${sectionHeader("Technical profile", a.h2, a.line)}<p class="text-sm text-zinc-800">${lines.map((l) => escapeHtml(l)).join(" · ")}</p></div>` : ""}
    </article>`;
}
