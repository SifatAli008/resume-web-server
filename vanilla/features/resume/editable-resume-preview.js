import { resumeTemplateEditableVariant } from "./constants.js";
import { defaultResumeDraft, normalizeResumeDraft } from "./draft.js";
import { escapeHtml } from "./escape-html.js";
import { resumeIcon } from "./resume-icons.js";

/** Hide scrollbars but keep wheel/touch scroll if content exceeds max height */
const SCROLL_CHROME =
  "resize-none [field-sizing:content] scrollbar-none overflow-y-auto";
const EIN =
  "w-full border-0 border-b border-transparent bg-transparent px-0 py-0.5 outline-none ring-0 placeholder:text-zinc-400 focus:border-zinc-300 focus:bg-zinc-50/40 print:border-0 print:bg-transparent print:focus:bg-transparent";
const EIN_H1 = `${EIN} text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl`;
const EIN_TITLE = `${EIN} text-sm font-semibold uppercase tracking-wide text-zinc-600`;
const EIN_SM = `${EIN} text-sm text-zinc-800`;
const EIN_TX = `${EIN} ${SCROLL_CHROME} min-h-[3.25rem] max-h-[min(22rem,50vh)] w-full text-sm leading-relaxed text-zinc-800 sm:min-h-[3.5rem] print:max-h-none print:overflow-visible`;
/** Dark-column textareas: no light focus wash */
const EIN_DARK_FIELD =
  "w-full border-0 border-b border-transparent bg-transparent px-0 py-0.5 outline-none ring-0 text-zinc-100 placeholder:text-zinc-500 focus:border-white/35 focus:bg-white/5 print:border-0 print:bg-transparent print:focus:bg-transparent";
const EIN_TX_DARK = `${EIN_DARK_FIELD} ${SCROLL_CHROME} mt-2 min-h-24 max-h-[min(18rem,40vh)] w-full text-sm sm:min-h-[6rem] print:max-h-none print:overflow-visible`;
const EIN_NAVY_FIELD =
  "w-full border-0 border-b border-transparent bg-transparent px-0 py-0.5 outline-none ring-0 text-slate-200 placeholder:text-slate-500 focus:border-slate-600 focus:bg-slate-800/40 print:border-0 print:bg-transparent print:focus:bg-transparent";
const EIN_TX_NAVY = `${EIN_NAVY_FIELD} ${SCROLL_CHROME} mt-2 min-h-20 max-h-[min(18rem,40vh)] w-full text-sm sm:min-h-[5rem] print:max-h-none print:overflow-visible`;

const PH = {
  linkLabel: "Link label (e.g. LinkedIn, Portfolio)",
  linkUrl: "https://… full URL",
  bullet: "Impact line: action + scope + result",
  expStart: "Start (e.g. Jan 2020)",
  expEnd: "End or Present",
  expRole: "Job title",
  expCompany: "Company or team",
  eduStart: "Start year",
  eduEnd: "End year",
  eduDegree: "Degree, field, honors",
  eduSchool: "School or institution",
  email: "you@email.com",
  phone: "Phone (include country code if needed)",
  location: "City, State · or Remote",
  fullName: "Your full name (as on the resume)",
  title: "Professional headline · role and focus",
  summary: "2–4 sentences: strengths, impact, and what you want next.",
  skills: "One skill per line (e.g. TypeScript, Stakeholder communication)",
};
const BTN =
  "print:hidden inline-flex items-center gap-1 rounded-md border border-dashed border-zinc-400 px-2 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50";
const RM = "print:hidden text-xs font-medium text-red-700 hover:text-red-900";

const BTN_IC = `${BTN} [&>svg]:text-zinc-500`;
const PLUS = resumeIcon("plus", "h-3.5 w-3.5 shrink-0");
const BTN_SIDEBAR =
  "print:hidden inline-flex items-center gap-1 rounded-md border border-dashed border-white/50 bg-white/5 px-2 py-1.5 text-xs font-medium text-zinc-200 hover:bg-white/10 [&>svg]:text-zinc-400";

function summaryCard(inner) {
  return `<div class="mb-6 rounded-xl border border-stone-200/80 bg-white p-4 shadow-sm">${inner}</div>`;
}

function sec(title, accent = "text-blue-900", line = "bg-zinc-300", iconName = null) {
  const ic = iconName ? resumeIcon(iconName, `h-3.5 w-3.5 shrink-0 ${accent}`) : "";
  return `<div class="mb-2.5 flex items-center gap-2">
    <span class="flex min-w-0 items-center gap-1.5">${ic}<h2 class="shrink-0 text-[10px] font-bold uppercase tracking-[0.18em] ${accent}">${escapeHtml(title)}</h2></span>
    <div class="h-px min-w-[1rem] flex-1 ${line}"></div>
  </div>`;
}

function linkRows(draft) {
  return (draft.links || [])
    .map(
      (l, i) => `
    <div data-link-row="${i}" class="mb-2 flex flex-wrap items-end gap-2">
      <span class="flex shrink-0 items-center pb-0.5 text-zinc-400" title="Link">${resumeIcon("link", "h-4 w-4")}</span>
      <input data-lf="label" type="text" class="${EIN_SM} min-w-[6rem] flex-1" placeholder="${escapeHtml(PH.linkLabel)}" value="${escapeHtml(l.label)}" />
      <input data-lf="url" type="text" class="${EIN_SM} min-w-0 flex-[2]" placeholder="${escapeHtml(PH.linkUrl)}" value="${escapeHtml(l.url)}" />
      <button type="button" data-action="remove-link" data-i="${i}" class="${RM} ${(draft.links || []).length < 2 ? "hidden" : ""}">Remove</button>
    </div>`,
    )
    .join("");
}

function expJobs(draft) {
  return (draft.experience || [])
    .map((job, i) => {
      const bullets = (job.bullets || ["", "", ""]).concat(["", "", ""]).slice(0, 8);
      const bHtml = bullets
        .map(
          (b, bi) =>
            `<input data-bullet="${bi}" type="text" class="${EIN_SM} mb-1 block w-full" placeholder="${escapeHtml(PH.bullet)}" value="${escapeHtml(b)}" />`,
        )
        .join("");
      return `
      <div data-exp-job="${i}" class="mb-5 border-b border-zinc-100 pb-5 last:border-0">
        <div class="mb-2 flex flex-wrap items-center justify-between gap-2">
          <span class="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500">${resumeIcon("briefcase", "h-3.5 w-3.5 text-zinc-400")}Role ${i + 1}</span>
          <button type="button" data-action="remove-exp" data-i="${i}" class="${RM} ${(draft.experience || []).length < 2 ? "hidden" : ""}">Remove</button>
        </div>
        <div class="grid grid-cols-[6.5rem_1fr] gap-x-3 gap-y-1">
          <input data-exp-f="start" type="text" class="${EIN_SM} text-xs font-semibold text-zinc-500" placeholder="${escapeHtml(PH.expStart)}" value="${escapeHtml(job.start)}" />
          <input data-exp-f="role" type="text" class="${EIN_SM} font-bold text-zinc-900" placeholder="${escapeHtml(PH.expRole)}" value="${escapeHtml(job.role)}" />
          <input data-exp-f="end" type="text" class="${EIN_SM} text-xs font-semibold text-zinc-500" placeholder="${escapeHtml(PH.expEnd)}" value="${escapeHtml(job.end)}" />
          <input data-exp-f="company" type="text" class="${EIN_SM} text-sm italic text-zinc-600" placeholder="${escapeHtml(PH.expCompany)}" value="${escapeHtml(job.company)}" />
        </div>
        <div class="mt-2 pl-0">${bHtml}</div>
      </div>`;
    })
    .join("");
}

function eduRows(draft) {
  return (draft.education || [])
    .map((ed, i) => {
      return `
      <div data-edu-job="${i}" class="mb-4 border-b border-zinc-50 pb-4 last:border-0">
        <div class="mb-1.5 flex items-center justify-between gap-2">
          <span class="inline-flex items-center gap-1 text-xs font-medium text-zinc-500">${resumeIcon("academic", "h-3.5 w-3.5 text-zinc-400")}School ${i + 1}</span>
          <button type="button" data-action="remove-edu" data-i="${i}" class="${RM} ${(draft.education || []).length < 2 ? "hidden" : ""}">Remove</button>
        </div>
        <div class="grid grid-cols-[6.5rem_1fr] gap-x-3 gap-y-1">
        <input data-edu-f="start" type="text" class="${EIN_SM} text-xs font-semibold text-zinc-500" placeholder="${escapeHtml(PH.eduStart)}" value="${escapeHtml(ed.start)}" />
        <input data-edu-f="degree" type="text" class="${EIN_SM} font-bold text-zinc-900" placeholder="${escapeHtml(PH.eduDegree)}" value="${escapeHtml(ed.degree)}" />
        <input data-edu-f="end" type="text" class="${EIN_SM} text-xs font-semibold text-zinc-500" placeholder="${escapeHtml(PH.eduEnd)}" value="${escapeHtml(ed.end)}" />
        <input data-edu-f="school" type="text" class="${EIN_SM} text-sm text-zinc-600" placeholder="${escapeHtml(PH.eduSchool)}" value="${escapeHtml(ed.school)}" />
        </div>
      </div>`;
    })
    .join("");
}

function contactRow(draft, tone = "default") {
  const T = {
    default: {
      row: "mt-3 flex flex-col gap-2.5 text-sm text-zinc-700 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5 sm:gap-y-2",
      ic: "text-zinc-400",
      email: `${EIN_SM} min-w-0 flex-1 sm:min-w-[12rem]`,
      phone: `${EIN_SM} min-w-[7rem]`,
      loc: `${EIN_SM} min-w-0 flex-1 sm:min-w-[10rem]`,
    },
    onDark: {
      row: "mt-6 border-t border-white/20 pt-3 flex flex-col gap-2.5 text-sm",
      ic: "text-sky-400/90",
      email: `${EIN_SM} min-w-0 text-zinc-100 placeholder:text-zinc-500`,
      phone: `${EIN_SM} min-w-0 text-zinc-100 placeholder:text-zinc-500`,
      loc: `${EIN_SM} min-w-0 text-zinc-100 placeholder:text-zinc-500`,
    },
    banner: {
      row: "mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 bg-zinc-900 px-3 py-2.5 text-xs text-white",
      ic: "text-zinc-500",
      email: `${EIN} min-w-[10rem] flex-1 text-xs text-white placeholder:text-zinc-400`,
      phone: `${EIN} min-w-[8rem] text-xs text-white placeholder:text-zinc-400`,
      loc: `${EIN} min-w-[8rem] flex-1 text-xs text-white placeholder:text-zinc-400`,
    },
    compact: {
      row: "mt-3 flex flex-wrap justify-end gap-x-4 gap-y-2 text-xs text-zinc-600",
      ic: "text-zinc-400",
      email: `${EIN} max-w-[14rem] text-right text-xs`,
      phone: `${EIN} text-right text-xs`,
      loc: `${EIN} text-right text-xs`,
    },
    navyAside: {
      row: "mt-6 flex flex-col gap-2 border-t border-white/15 pt-3 text-sm",
      ic: "text-slate-400",
      email: `${EIN} text-sm text-slate-200 placeholder:text-slate-500`,
      phone: `${EIN} text-sm text-slate-200 placeholder:text-slate-500`,
      loc: `${EIN} text-sm text-slate-200 placeholder:text-slate-500`,
    },
  };
  const t = T[tone] || T.default;
  if (tone === "compact") {
    return `
    <div class="${t.row}">
      <span class="inline-flex shrink-0 items-center gap-1.5">${resumeIcon("mail", `h-3.5 w-3.5 shrink-0 ${t.ic}`)}<input data-f="email" type="text" class="${t.email}" placeholder="${escapeHtml(PH.email)}" value="${escapeHtml(draft.email)}" /></span>
      <span class="inline-flex shrink-0 items-center gap-1.5">${resumeIcon("phone", `h-3.5 w-3.5 shrink-0 ${t.ic}`)}<input data-f="phone" type="text" class="${t.phone}" placeholder="${escapeHtml(PH.phone)}" value="${escapeHtml(draft.phone)}" /></span>
      <span class="inline-flex shrink-0 items-center gap-1.5">${resumeIcon("map", `h-3.5 w-3.5 shrink-0 ${t.ic}`)}<input data-f="location" type="text" class="${t.loc}" placeholder="${escapeHtml(PH.location)}" value="${escapeHtml(draft.location)}" /></span>
    </div>`;
  }
  return `
    <div class="${t.row}">
      <span class="inline-flex min-w-0 max-w-full flex-1 items-center gap-2 sm:min-w-[12rem]">${resumeIcon("mail", `h-4 w-4 shrink-0 ${t.ic}`)}<input data-f="email" type="email" class="${t.email}" placeholder="${escapeHtml(PH.email)}" value="${escapeHtml(draft.email)}" /></span>
      <span class="inline-flex max-w-full items-center gap-2">${resumeIcon("phone", `h-4 w-4 shrink-0 ${t.ic}`)}<input data-f="phone" type="text" class="${t.phone}" placeholder="${escapeHtml(PH.phone)}" value="${escapeHtml(draft.phone)}" /></span>
      <span class="inline-flex min-w-0 max-w-full flex-1 items-center gap-2">${resumeIcon("map", `h-4 w-4 shrink-0 ${t.ic}`)}<input data-f="location" type="text" class="${t.loc}" placeholder="${escapeHtml(PH.location)}" value="${escapeHtml(draft.location)}" /></span>
    </div>`;
}

function bandBar(label, iconName) {
  const bar =
    "flex items-center justify-center gap-2 bg-emerald-800 py-1.5 text-center text-[10px] font-bold uppercase tracking-widest text-white";
  return `<div class="${bar}">${resumeIcon(iconName, "h-3.5 w-3.5 shrink-0 text-emerald-100")}<span>${escapeHtml(label)}</span></div>`;
}

function buildClassic(draft, serif) {
  const article = `resume-preview-article mx-auto max-w-3xl rounded-xl border border-stone-200/80 bg-stone-50 p-5 text-left text-stone-900 antialiased shadow-sm sm:p-7${serif ? " font-serif" : ""}`;
  const nameCls = `${EIN} font-serif text-2xl font-semibold tracking-tight text-stone-900 sm:text-[1.65rem]`;
  const titleCls = `${EIN} mt-1 text-[11px] font-semibold uppercase tracking-[0.26em] text-amber-900/85`;
  const sumInner = `<textarea data-f="summary" class="${EIN_TX} w-full" placeholder="${escapeHtml(PH.summary)}">${escapeHtml(draft.summary)}</textarea>`;
  return `
  <article id="resume-print-root" class="${article}">
    <header class="mb-6 border-b-2 border-amber-900/20 pb-4 pt-1">
      <input data-f="fullName" type="text" class="${nameCls}" placeholder="${escapeHtml(PH.fullName)}" value="${escapeHtml(draft.fullName)}" />
      <input data-f="title" type="text" class="${titleCls}" placeholder="${escapeHtml(PH.title)}" value="${escapeHtml(draft.title)}" />
      ${contactRow(draft)}
    </header>
    ${sec("Links", "text-amber-900", "bg-amber-200/70", "link")}
    <div class="mb-6">${linkRows(draft)}<button type="button" data-action="add-link" class="${BTN_IC}">${PLUS}Add link</button></div>
    ${sec("Professional summary", "text-amber-950", "bg-amber-200/80", "document")}
    ${summaryCard(sumInner)}
    ${sec("Experience", "text-amber-950", "bg-amber-200/80", "briefcase")}
    <div class="mb-6">${expJobs(draft)}<button type="button" data-action="add-exp" class="${BTN_IC}">${PLUS}Add role</button></div>
    ${sec("Education", "text-amber-950", "bg-amber-200/80", "academic")}
    <div class="mb-6">${eduRows(draft)}<button type="button" data-action="add-edu" class="${BTN_IC}">${PLUS}Add education</button></div>
    ${sec("Skills", "text-amber-950", "bg-amber-200/80", "sparkles")}
    <textarea data-f="skills" class="${EIN_TX} w-full" placeholder="${escapeHtml(PH.skills)}">${escapeHtml(draft.skills)}</textarea>
  </article>`;
}

function buildBands(draft) {
  const box = "border border-t-0 border-emerald-900/10 bg-white/90 px-4 py-3";
  const head = "mb-5 rounded-t-lg border border-b-0 border-emerald-900/10 bg-gradient-to-br from-emerald-50/90 to-white px-4 pb-3 pt-3";
  return `
  <article id="resume-print-root" class="resume-preview-article mx-auto max-w-3xl rounded-xl bg-emerald-50/30 p-3 text-left antialiased ring-1 ring-emerald-900/10 sm:p-4">
    <header class="${head}">
      <input data-f="fullName" type="text" class="${EIN_H1} text-emerald-950" placeholder="${escapeHtml(PH.fullName)}" value="${escapeHtml(draft.fullName)}" />
      <input data-f="title" type="text" class="${EIN_TITLE} text-emerald-800" placeholder="${escapeHtml(PH.title)}" value="${escapeHtml(draft.title)}" />
      ${contactRow(draft)}
    </header>
    <section class="mb-5">${bandBar("Professional profile", "document")}<div class="${box}"><textarea data-f="summary" class="${EIN_TX} w-full" placeholder="${escapeHtml(PH.summary)}">${escapeHtml(draft.summary)}</textarea></div></section>
    <section class="mb-5">${bandBar("Links", "link")}<div class="${box}">${linkRows(draft)}<button type="button" data-action="add-link" class="${BTN_IC}">${PLUS}Add link</button></div></section>
    <section class="mb-5">${bandBar("Experience", "briefcase")}<div class="${box}">${expJobs(draft)}<button type="button" data-action="add-exp" class="${BTN_IC}">${PLUS}Add role</button></div></section>
    <section class="mb-5">${bandBar("Education", "academic")}<div class="${box}">${eduRows(draft)}<button type="button" data-action="add-edu" class="${BTN_IC}">${PLUS}Add education</button></div></section>
    <section class="mb-5">${bandBar("Skills", "sparkles")}<div class="${box}"><textarea data-f="skills" class="${EIN_TX} w-full" placeholder="${escapeHtml(PH.skills)}">${escapeHtml(draft.skills)}</textarea></div></section>
  </article>`;
}

function buildBanner(draft) {
  const head =
    "rounded-t-2xl border border-b-0 border-sky-900/10 bg-gradient-to-br from-sky-50/90 via-white to-white px-4 pb-4 pt-4 sm:px-6";
  const nameSz = `${EIN} text-xl font-bold uppercase tracking-tight text-slate-900 sm:text-2xl`;
  const sum = summaryCard(
    `<textarea data-f="summary" class="${EIN_TX} mt-3 w-full max-w-3xl" rows="3" placeholder="${escapeHtml(PH.summary)}">${escapeHtml(draft.summary)}</textarea>`,
  );
  const body = "mt-6 grid gap-8 rounded-b-2xl border border-t-0 border-sky-900/10 bg-white px-4 pb-6 pt-2 sm:grid-cols-2 sm:px-6";
  return `
  <article id="resume-print-root" class="resume-preview-article mx-auto max-w-4xl rounded-2xl bg-sky-50/20 p-2 text-left antialiased ring-1 ring-sky-900/10 sm:p-3">
    <header class="${head}">
      <input data-f="fullName" type="text" class="${nameSz}" placeholder="${escapeHtml(PH.fullName)}" value="${escapeHtml(draft.fullName)}" />
      <input data-f="title" type="text" class="${EIN_SM} mt-1" placeholder="${escapeHtml(PH.title)}" value="${escapeHtml(draft.title)}" />
      ${sum}
    </header>
    ${contactRow(draft, "banner")}
    <div class="${body}">
      <div>
        ${sec("Experience", "text-zinc-900", "bg-zinc-900", "briefcase")}
        ${expJobs(draft)}<button type="button" data-action="add-exp" class="${BTN_IC}">${PLUS}Add role</button>
        ${sec("Education", "text-zinc-900", "bg-zinc-900", "academic")}
        ${eduRows(draft)}<button type="button" data-action="add-edu" class="${BTN_IC}">${PLUS}Add education</button>
      </div>
      <div>
        ${sec("Links", "text-zinc-900", "bg-zinc-900", "link")}
        ${linkRows(draft)}<button type="button" data-action="add-link" class="${BTN_IC}">${PLUS}Add link</button>
        ${sec("Skills", "text-zinc-900", "bg-zinc-900", "sparkles")}
        <textarea data-f="skills" class="${EIN_TX} w-full" placeholder="${escapeHtml(PH.skills)}">${escapeHtml(draft.skills)}</textarea>
      </div>
    </div>
  </article>`;
}

function buildSidebar(draft) {
  const sum = summaryCard(`<textarea data-f="summary" class="${EIN_TX} w-full" rows="5" placeholder="${escapeHtml(PH.summary)}">${escapeHtml(draft.summary)}</textarea>`);
  return `
  <article id="resume-print-root" class="resume-preview-article flex min-h-0 flex-col text-left sm:flex-row print:flex-row">
    <aside class="w-full shrink-0 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 p-6 text-white sm:w-72 print:w-[30%]">
      <input data-f="fullName" type="text" class="${EIN} text-2xl font-bold text-white placeholder:text-zinc-500" placeholder="${escapeHtml(PH.fullName)}" value="${escapeHtml(draft.fullName)}" />
      <input data-f="title" type="text" class="${EIN} mt-2 text-xs font-semibold uppercase tracking-wider text-sky-300 placeholder:text-sky-500/70" placeholder="${escapeHtml(PH.title)}" value="${escapeHtml(draft.title)}" />
      ${contactRow(draft, "onDark")}
      ${sec("Links", "text-white", "bg-white/20", "link")}
      <div class="mb-4 text-sm">${linkRows(draft)}<button type="button" data-action="add-link" class="${BTN_SIDEBAR}">${PLUS}Add link</button></div>
      ${sec("Skills", "text-white", "bg-white/20", "sparkles")}
      <textarea data-f="skills" class="${EIN_TX_DARK} w-full" placeholder="${escapeHtml(PH.skills)}">${escapeHtml(draft.skills)}</textarea>
    </aside>
    <div class="min-w-0 flex-1 bg-white p-6 sm:bg-stone-50/40 sm:p-8 print:p-6">
      ${sec("Professional summary", "text-emerald-900", "bg-emerald-200", "document")}
      ${sum}
      ${sec("Experience", "text-emerald-900", "bg-emerald-200", "briefcase")}
      <div class="mb-6">${expJobs(draft)}<button type="button" data-action="add-exp" class="${BTN_IC}">${PLUS}Add role</button></div>
      ${sec("Education", "text-emerald-900", "bg-emerald-200", "academic")}
      <div>${eduRows(draft)}<button type="button" data-action="add-edu" class="${BTN_IC}">${PLUS}Add education</button></div>
    </div>
  </article>`;
}

function buildSplit(draft) {
  const art =
    "resume-preview-article mx-auto max-w-4xl border border-orange-200/60 bg-gradient-to-br from-orange-50/50 via-white to-amber-50/30 text-left shadow-md";
  const head = "border-b border-orange-200/70 bg-white/70 px-5 py-4 sm:px-8";
  const nameCls = `${EIN} text-2xl font-bold text-zinc-950 sm:text-[1.6rem]`;
  const sum = summaryCard(`<textarea data-f="summary" class="${EIN_TX} w-full" rows="5" placeholder="${escapeHtml(PH.summary)}">${escapeHtml(draft.summary)}</textarea>`);
  return `
  <article id="resume-print-root" class="${art}">
    <header class="${head}">
      <input data-f="fullName" type="text" class="${nameCls}" placeholder="${escapeHtml(PH.fullName)}" value="${escapeHtml(draft.fullName)}" />
      <input data-f="title" type="text" class="${EIN} mt-1 text-xs font-bold uppercase tracking-[0.2em] text-amber-900" placeholder="${escapeHtml(PH.title)}" value="${escapeHtml(draft.title)}" />
      ${contactRow(draft, "compact")}
    </header>
    <div class="grid sm:grid-cols-[1fr_200px]">
      <div class="border-zinc-100 p-6 sm:border-r sm:px-8 sm:py-6">
        ${sec("Summary", "text-amber-900", "bg-amber-200", "document")}
        ${sum}
        ${sec("Experience", "text-amber-900", "bg-amber-200", "briefcase")}
        <div class="mb-6">${expJobs(draft)}<button type="button" data-action="add-exp" class="${BTN_IC}">${PLUS}Add role</button></div>
        ${sec("Education", "text-amber-900", "bg-amber-200", "academic")}
        <div>${eduRows(draft)}<button type="button" data-action="add-edu" class="${BTN_IC}">${PLUS}Add education</button></div>
      </div>
      <aside class="border-t border-amber-100/80 bg-amber-50/70 p-6 sm:border-t-0">
        ${sec("Links", "text-amber-900", "bg-amber-200", "link")}
        ${linkRows(draft)}<button type="button" data-action="add-link" class="${BTN_IC}">${PLUS}Add link</button>
        ${sec("Skills", "text-amber-900", "bg-amber-200", "sparkles")}
        <textarea data-f="skills" class="${EIN_TX} w-full" rows="8" placeholder="${escapeHtml(PH.skills)}">${escapeHtml(draft.skills)}</textarea>
      </aside>
    </div>
  </article>`;
}

function buildNavy(draft) {
  const sum = summaryCard(`<textarea data-f="summary" class="${EIN_TX} w-full" rows="5" placeholder="${escapeHtml(PH.summary)}">${escapeHtml(draft.summary)}</textarea>`);
  return `
  <article id="resume-print-root" class="resume-preview-article flex min-h-0 flex-col text-left sm:flex-row print:flex-row">
    <div class="min-w-0 flex-1 bg-slate-50/80 p-6 sm:p-8 print:p-6">
      ${sec("Profile", "text-sky-900", "bg-sky-200", "document")}
      ${sum}
      ${sec("Experience", "text-sky-900", "bg-sky-200", "briefcase")}
      <div class="mb-6">${expJobs(draft)}<button type="button" data-action="add-exp" class="${BTN_IC}">${PLUS}Add role</button></div>
      ${sec("Education", "text-sky-900", "bg-sky-200", "academic")}
      <div class="mb-6">${eduRows(draft)}<button type="button" data-action="add-edu" class="${BTN_IC}">${PLUS}Add education</button></div>
      ${sec("Links", "text-sky-900", "bg-sky-200", "link")}
      ${linkRows(draft)}<button type="button" data-action="add-link" class="${BTN_IC}">${PLUS}Add link</button>
    </div>
    <aside class="w-full shrink-0 bg-slate-900 p-6 text-white sm:w-72 print:w-[32%]">
      <input data-f="fullName" type="text" class="${EIN} text-2xl font-bold text-white" placeholder="${escapeHtml(PH.fullName)}" value="${escapeHtml(draft.fullName)}" />
      <input data-f="title" type="text" class="${EIN} mt-2 text-sm text-slate-300" placeholder="${escapeHtml(PH.title)}" value="${escapeHtml(draft.title)}" />
      ${contactRow(draft, "navyAside")}
      <p class="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">${resumeIcon("sparkles", "h-3.5 w-3.5 text-slate-500")}Skills</p>
      <textarea data-f="skills" class="${EIN_TX_NAVY} w-full" placeholder="${escapeHtml(PH.skills)}">${escapeHtml(draft.skills)}</textarea>
    </aside>
  </article>`;
}

function buildLavender(draft) {
  const art =
    "resume-preview-article mx-auto grid max-w-4xl grid-cols-1 rounded-xl bg-gradient-to-b from-violet-50/40 to-white text-left ring-1 ring-violet-200/50 sm:grid-cols-[1fr_200px]";
  const head = "border-b border-violet-100 bg-white/80 px-6 py-5 sm:col-span-2 sm:px-8";
  const nameCls = `${EIN} font-serif text-2xl font-semibold text-violet-950 sm:text-3xl`;
  const sum = summaryCard(`<textarea data-f="summary" class="${EIN_TX} w-full" rows="5" placeholder="${escapeHtml(PH.summary)}">${escapeHtml(draft.summary)}</textarea>`);
  return `
  <article id="resume-print-root" class="${art}">
    <header class="${head}">
      <input data-f="fullName" type="text" class="${nameCls}" placeholder="${escapeHtml(PH.fullName)}" value="${escapeHtml(draft.fullName)}" />
      <input data-f="title" type="text" class="${EIN_SM} mt-1" placeholder="${escapeHtml(PH.title)}" value="${escapeHtml(draft.title)}" />
      ${contactRow(draft)}
    </header>
    <div class="border-violet-50 bg-white p-6 sm:border-r sm:px-8 sm:py-6">
      ${sec("Profile", "text-violet-900", "bg-violet-200", "document")}
      ${sum}
      ${sec("Experience", "text-violet-900", "bg-violet-200", "briefcase")}
      <div class="mb-6">${expJobs(draft)}<button type="button" data-action="add-exp" class="${BTN_IC}">${PLUS}Add role</button></div>
      ${sec("Education", "text-violet-900", "bg-violet-200", "academic")}
      <div>${eduRows(draft)}<button type="button" data-action="add-edu" class="${BTN_IC}">${PLUS}Add education</button></div>
    </div>
    <aside class="border-t border-violet-100 bg-violet-50 p-6 sm:border-t-0 sm:py-6">
      ${sec("Links", "text-violet-900", "bg-violet-200", "link")}
      ${linkRows(draft)}<button type="button" data-action="add-link" class="${BTN_IC}">${PLUS}Add link</button>
      ${sec("Skills", "text-violet-900", "bg-violet-200", "sparkles")}
      <textarea data-f="skills" class="${EIN_TX} w-full" rows="8" placeholder="${escapeHtml(PH.skills)}">${escapeHtml(draft.skills)}</textarea>
    </aside>
  </article>`;
}

export function buildEditableResumeHtml(draft, templateId) {
  const v = resumeTemplateEditableVariant(templateId);
  if (v === "sidebar") return buildSidebar(draft);
  if (v === "split") return buildSplit(draft);
  if (v === "bands") return buildBands(draft);
  if (v === "banner") return buildBanner(draft);
  if (v === "navy") return buildNavy(draft);
  if (v === "lavender") return buildLavender(draft);
  if (v === "classicSerif") return buildClassic(draft, true);
  return buildClassic(draft, false);
}

export function readEditableDraftFromRoot(root, templateId) {
  const get = (sel) => root.querySelector(sel)?.value ?? "";
  const links = [...root.querySelectorAll("[data-link-row]")].map((row) => ({
    label: row.querySelector('[data-lf="label"]')?.value ?? "",
    url: row.querySelector('[data-lf="url"]')?.value ?? "",
  }));
  const expWraps = [...root.querySelectorAll("[data-exp-job]")].sort((a, b) => Number(a.getAttribute("data-exp-job")) - Number(b.getAttribute("data-exp-job")));
  const experience = expWraps.map((w) => {
    const bullets = [...w.querySelectorAll("[data-bullet]")].map((inp) => inp.value ?? "");
    return {
      role: w.querySelector('[data-exp-f="role"]')?.value ?? "",
      company: w.querySelector('[data-exp-f="company"]')?.value ?? "",
      start: w.querySelector('[data-exp-f="start"]')?.value ?? "",
      end: w.querySelector('[data-exp-f="end"]')?.value ?? "",
      bullets: bullets.length ? bullets : [""],
    };
  });
  const eduWraps = [...root.querySelectorAll("[data-edu-job]")].sort((a, b) => Number(a.getAttribute("data-edu-job")) - Number(b.getAttribute("data-edu-job")));
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
    summary: get('[data-f="summary"]'),
    skills: get('[data-f="skills"]'),
    links: links.length ? links : fb.links,
    experience: experience.length ? experience : fb.experience,
    education: education.length ? education : fb.education,
  });
}

export function mountResumeEditablePreview(host, ctx) {
  const { getDraft, setDraft, onPersist, getTemplateId } = ctx;

  function remount() {
    host.innerHTML = buildEditableResumeHtml(getDraft(), getTemplateId());
  }

  function onInput() {
    const next = readEditableDraftFromRoot(host, getTemplateId());
    setDraft(() => next);
    onPersist();
  }

  function onClick(e) {
    const t = e.target.closest("[data-action]");
    if (!t) return;
    const draft = getDraft();
    const action = t.getAttribute("data-action");
    if (action === "add-exp") {
      draft.experience.push({ company: "", role: "", start: "", end: "", bullets: ["", "", ""] });
      setDraft(() => normalizeResumeDraft(draft));
      remount();
      onPersist();
    } else if (action === "remove-exp") {
      const i = Number(t.getAttribute("data-i"));
      if (draft.experience.length < 2) return;
      draft.experience.splice(i, 1);
      setDraft(() => normalizeResumeDraft(draft));
      remount();
      onPersist();
    } else if (action === "add-edu") {
      draft.education.push({ school: "", degree: "", start: "", end: "" });
      setDraft(() => normalizeResumeDraft(draft));
      remount();
      onPersist();
    } else if (action === "remove-edu") {
      const i = Number(t.getAttribute("data-i"));
      if (draft.education.length < 2) return;
      draft.education.splice(i, 1);
      setDraft(() => normalizeResumeDraft(draft));
      remount();
      onPersist();
    } else if (action === "add-link") {
      draft.links.push({ label: "", url: "" });
      setDraft(() => normalizeResumeDraft(draft));
      remount();
      onPersist();
    } else if (action === "remove-link") {
      const i = Number(t.getAttribute("data-i"));
      if (draft.links.length < 2) return;
      draft.links.splice(i, 1);
      setDraft(() => normalizeResumeDraft(draft));
      remount();
      onPersist();
    }
  }

  host.addEventListener("input", onInput);
  host.addEventListener("click", onClick, { capture: true });

  remount();
  return { remount };
}
