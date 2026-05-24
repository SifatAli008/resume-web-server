import { CV_PH } from "./cv-placeholders.js";
import { escapeHtml } from "../escape-html.js";
import { resumeIcon } from "../resume-icons.js";

/** Deterministic proficiency width for skill bars (no random). */
export function skillBarPct(label, min = 52, max = 94) {
  let h = 0;
  const s = String(label ?? "");
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  const span = Math.max(1, max - min + 1);
  const pct = min + (Math.abs(h) % span);
  return Number.isFinite(pct) ? Math.min(100, Math.max(0, pct)) : min;
}

/** One visual style per template (1–20). */
export const SKILLS_STYLE_BY_TEMPLATE = [
  "",
  "pills", // 1 Estelle (legacy slot; uses bullet-cols via ui.skillsStyle)
  "plain-cols", // 2 Gallego
  "plain-cols", // 3 Mitchell
  "slate-list", // 4 Sanchez
  "slate-list", // 5 Sanchez Black
  "slate-list", // 6 Alvarado
  "plain-cols", // 7 Schumacher
  "tags-band", // 8 Berlin
  "minimal-row", // 9 Manhattan
  "sky-chips", // 10 Sydney
  "serif-blocks", // 11 Montreal
  "slate-list", // 12 Cambridge
  "rose-tiles", // 13 Milan
  "compact-dark", // 14 Stockholm
  "cyan-stack", // 15 Toronto
  "swiss-dense", // 16 Barcelona
  "academic", // 17 Melbourne
  "magazine-cols", // 18 Paris
  "underline", // 19 Vienna
  "gradient-dark", // 20 Lisbon
];

const ICON_RULES = [
  { re: /typescript|javascript|python|java|rust|golang|\bgo\b|c\+\+|c#|react|vue|angular|node\.?js|php|ruby|swift|kotlin/i, icon: "code", cls: "text-blue-600" },
  { re: /postgres|postgresql|mysql|redis|mongo|sql|database|dynamodb/i, icon: "database", cls: "text-indigo-600" },
  { re: /docker|kubernetes|k8s|aws|azure|gcp|cloud|terraform|ansible/i, icon: "cloud", cls: "text-sky-600" },
  { re: /graphql|rest|api|grpc|microservice/i, icon: "link", cls: "text-violet-600" },
  { re: /ci\/cd|devops|jenkins|github actions|gitlab|pipeline/i, icon: "wrench", cls: "text-orange-600" },
  { re: /opentelemetry|observability|monitoring|datadog|prometheus|grafana/i, icon: "chart", cls: "text-amber-600" },
  { re: /mentor|leadership|review|collaboration|stakeholder/i, icon: "users", cls: "text-emerald-600" },
  { re: /writ|documentation|technical writing|grant/i, icon: "pen", cls: "text-teal-600" },
  { re: /research|statistic|spss|r\b|matlab|lab method/i, icon: "beaker", cls: "text-fuchsia-600" },
  { re: /linux|bash|shell|terminal|cli/i, icon: "terminal", cls: "text-zinc-700" },
  { re: /machine learning|ml\b|ai\b|tensorflow|pytorch/i, icon: "cpu", cls: "text-purple-600" },
  { re: /agile|scrum|jira|project/i, icon: "briefcase", cls: "text-slate-600" },
  { re: /security|oauth|auth|encryption/i, icon: "certificate", cls: "text-rose-600" },
];

export function skillMeta(name, fallbackCls = "text-zinc-500") {
  const n = String(name || "").trim();
  for (const r of ICON_RULES) {
    if (r.re.test(n)) return { icon: r.icon, cls: r.cls };
  }
  return { icon: "sparkles", cls: fallbackCls };
}

/** Split line into category label + skill tokens. */
function parseLine(line) {
  const raw = String(line || "").trim();
  if (!raw) return { label: null, items: [] };
  const colon = raw.indexOf(":");
  if (colon > 0 && colon < 40) {
    return {
      label: raw.slice(0, colon).trim(),
      items: splitTokens(raw.slice(colon + 1)),
    };
  }
  return { label: null, items: splitTokens(raw) };
}

function splitTokens(s) {
  return String(s || "")
    .split(/\s*[·•|,;]\s*|\s{2,}/)
    .map((x) => x.trim())
    .filter(Boolean)
    .slice(0, 24);
}

export function parseSkills(raw) {
  const lines = String(raw || "")
    .split(/\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  const groups = lines.map(parseLine).filter((g) => g.label || g.items.length);
  const flat = groups.flatMap((g) => g.items);
  return { groups, flat };
}

const ACCENT_PILLS = {
  blue: { pill: "border border-blue-200 bg-blue-50 text-blue-950", pillSoft: "bg-blue-100 text-blue-900", label: "text-blue-800", bar: "bg-blue-100", barFill: "bg-blue-600", card: "border border-blue-100 bg-blue-50/60" },
  emerald: { pill: "border border-emerald-200 bg-emerald-50 text-emerald-950", pillSoft: "bg-emerald-100 text-emerald-900", label: "text-emerald-800", bar: "bg-emerald-100", barFill: "bg-emerald-600", card: "border border-emerald-100 bg-emerald-50/60" },
  indigo: { pill: "border border-indigo-200 bg-indigo-50 text-indigo-950", pillSoft: "bg-indigo-100 text-indigo-900", label: "text-indigo-800", bar: "bg-indigo-100", barFill: "bg-indigo-600", card: "border border-indigo-100 bg-indigo-50/60" },
  violet: { pill: "border border-violet-200 bg-violet-50 text-violet-950", pillSoft: "bg-violet-100 text-violet-900", label: "text-violet-800", bar: "bg-violet-100", barFill: "bg-violet-600", card: "border border-violet-100 bg-violet-50/60" },
  amber: { pill: "border border-amber-200 bg-amber-50 text-amber-950", pillSoft: "bg-amber-100 text-amber-900", label: "text-amber-800", bar: "bg-amber-100", barFill: "bg-amber-600", card: "border border-amber-100 bg-amber-50/60" },
  cyan: { pill: "border border-cyan-200 bg-cyan-50 text-cyan-950", pillSoft: "bg-cyan-100 text-cyan-900", label: "text-cyan-800", bar: "bg-cyan-100", barFill: "bg-cyan-600", card: "border border-cyan-100 bg-cyan-50/60" },
  teal: { pill: "border border-teal-200 bg-teal-50 text-teal-950", pillSoft: "bg-teal-100 text-teal-900", label: "text-teal-800", bar: "bg-teal-100", barFill: "bg-teal-600", card: "border border-teal-100 bg-teal-50/60" },
  rose: { pill: "border border-rose-200 bg-rose-50 text-rose-950", pillSoft: "bg-rose-100 text-rose-900", label: "text-rose-800", bar: "bg-rose-100", barFill: "bg-rose-600", card: "border border-rose-100 bg-rose-50/60" },
  sky: { pill: "border border-sky-200 bg-sky-50 text-sky-950", pillSoft: "bg-sky-100 text-sky-900", label: "text-sky-800", bar: "bg-sky-100", barFill: "bg-sky-600", card: "border border-sky-100 bg-sky-50/60" },
  purple: { pill: "border border-purple-200 bg-purple-50 text-purple-950", pillSoft: "bg-purple-100 text-purple-900", label: "text-purple-800", bar: "bg-purple-100", barFill: "bg-purple-600", card: "border border-purple-100 bg-purple-50/60" },
  orange: { pill: "border border-orange-200 bg-orange-50 text-orange-950", pillSoft: "bg-orange-100 text-orange-900", label: "text-orange-800", bar: "bg-orange-100", barFill: "bg-orange-600", card: "border border-orange-100 bg-orange-50/60" },
  fuchsia: { pill: "border border-fuchsia-200 bg-fuchsia-50 text-fuchsia-950", pillSoft: "bg-fuchsia-100 text-fuchsia-900", label: "text-fuchsia-800", bar: "bg-fuchsia-100", barFill: "bg-fuchsia-600", card: "border border-fuchsia-100 bg-fuchsia-50/60" },
  slate: { pill: "border border-slate-200 bg-slate-50 text-slate-950", pillSoft: "bg-slate-100 text-slate-900", label: "text-slate-800", bar: "bg-slate-100", barFill: "bg-slate-600", card: "border border-slate-100 bg-slate-50/60" },
  zinc: { pill: "border border-zinc-200 bg-zinc-50 text-zinc-950", pillSoft: "bg-zinc-100 text-zinc-900", label: "text-zinc-800", bar: "bg-zinc-100", barFill: "bg-zinc-600", card: "border border-zinc-100 bg-zinc-50/60" },
};

function accentHue(ui) {
  const h2 = String(ui.h2 || ui.iconContact || "");
  if (h2.includes("emerald")) return "emerald";
  if (h2.includes("indigo")) return "indigo";
  if (h2.includes("violet")) return "violet";
  if (h2.includes("amber")) return "amber";
  if (h2.includes("cyan")) return "cyan";
  if (h2.includes("teal")) return "teal";
  if (h2.includes("rose")) return "rose";
  if (h2.includes("sky")) return "sky";
  if (h2.includes("purple")) return "purple";
  if (h2.includes("orange")) return "orange";
  if (h2.includes("fuchsia")) return "fuchsia";
  if (h2.includes("slate")) return "slate";
  if (h2.includes("zinc")) return "zinc";
  return "blue";
}

function accent(ui, dark) {
  if (dark) {
    return {
      pill: "border border-white/20 bg-white/10 text-white",
      pillSoft: "bg-white/15 text-zinc-100",
      label: "text-white/60",
      icon: "text-sky-300",
      bar: "bg-white/20",
      barFill: "bg-sky-400",
      card: "border border-white/15 bg-white/5",
    };
  }
  return { icon: ui.iconContact || "text-blue-600", ...ACCENT_PILLS[accentHue(ui)] };
}

function itemChip(name, ui, dark, pillCls) {
  const { icon, cls } = skillMeta(name, ui.iconContact || "text-zinc-500");
  const iconCls = dark ? "text-sky-300" : cls;
  return `<span class="cv-skill-chip inline-flex items-center gap-1.5 ${pillCls}">
    ${resumeIcon(icon, `h-3.5 w-3.5 shrink-0 ${iconCls}`)}
    <span>${escapeHtml(name)}</span>
  </span>`;
}

function renderEmpty(ui, dark) {
  const cls = dark ? "text-zinc-500 italic" : "text-zinc-400 italic text-[13px]";
  return `<p class="${cls}">${escapeHtml(CV_PH.skills.split("\n")[0])}</p>`;
}

function renderPills(flat, ui, dark) {
  const a = accent(ui, dark);
  const pill = `${a.pill} rounded-full px-2.5 py-0.5 text-[11px] font-medium`;
  return `<div class="flex flex-wrap gap-2">${flat.map((n) => itemChip(n, ui, dark, pill)).join("")}</div>`;
}

function renderOutline(flat, ui) {
  const ic = ui.iconContact || "text-indigo-600";
  const pill = `ring-1 ring-current rounded px-2 py-0.5 text-[11px] font-medium text-zinc-800`;
  return `<div class="flex flex-wrap gap-2">${flat.map((n) => itemChip(n, { ...ui, iconContact: ic }, false, pill)).join("")}</div>`;
}

function renderGrouped(groups, ui, dark) {
  const a = accent(ui, dark);
  return `<div class="space-y-3">${groups
    .map((g) => {
      const pills = g.items.map((n) => itemChip(n, ui, dark, `${a.pillSoft} rounded-md px-2 py-0.5 text-[11px] font-medium`)).join("");
      return `<div>
        ${g.label ? `<p class="mb-1.5 text-[10px] font-bold uppercase tracking-wider ${a.label}">${escapeHtml(g.label)}</p>` : ""}
        <div class="flex flex-wrap gap-1.5">${pills}</div>
      </div>`;
    })
    .join("")}</div>`;
}

function renderGrid(flat, ui) {
  return `<div class="grid grid-cols-2 gap-2 [grid-template-columns:repeat(auto-fill,minmax(8rem,1fr))]">${flat
    .map((n) => {
      const { icon, cls } = skillMeta(n, ui.iconContact);
      return `<div class="flex items-center gap-2 rounded-lg border border-violet-100 bg-violet-50/50 px-2.5 py-2">
        ${resumeIcon(icon, `h-4 w-4 shrink-0 ${cls}`)}
        <span class="text-[11px] font-medium leading-tight text-zinc-800">${escapeHtml(n)}</span>
      </div>`;
    })
    .join("")}</div>`;
}

function renderCards(groups, ui) {
  const a = accent(ui, false);
  return `<div class="grid gap-2 sm:grid-cols-2">${groups
    .map((g) => {
      const inner = g.items
        .map((n) => {
          const { icon, cls } = skillMeta(n, ui.iconContact);
          return `<li class="flex items-center gap-2 text-[12px] text-zinc-700"><span class="shrink-0">${resumeIcon(icon, `h-3.5 w-3.5 ${cls}`)}</span>${escapeHtml(n)}</li>`;
        })
        .join("");
      return `<div class="rounded-lg ${a.card} p-3">
        ${g.label ? `<p class="mb-2 text-[10px] font-bold uppercase tracking-wide ${a.label}">${escapeHtml(g.label)}</p>` : ""}
        <ul class="space-y-1.5">${inner || `<li class="text-zinc-400 italic">—</li>`}</ul>
      </div>`;
    })
    .join("")}</div>`;
}

function renderBars(flat, ui, dark) {
  const a = accent(ui, dark);
  return `<div class="space-y-2.5">${flat
    .map((n) => {
      const { icon, cls } = skillMeta(n, dark ? "text-sky-300" : ui.iconContact);
      const pct = skillBarPct(n);
      return `<div>
        <div class="mb-1 flex items-center gap-2">
          ${resumeIcon(icon, `h-3.5 w-3.5 ${cls}`)}
          <span class="text-[11px] font-medium ${dark ? "text-zinc-200" : "text-zinc-800"}">${escapeHtml(n)}</span>
        </div>
        <div class="h-1.5 w-[100px] max-w-full overflow-hidden rounded-full ${a.bar}"><div class="h-full rounded-full ${a.barFill}" style="width:${pct}%"></div></div>
      </div>`;
    })
    .join("")}</div>`;
}

function renderTagsBand(groups, ui) {
  const ribbon = ui.ribbon || "bg-emerald-800";
  return groups
    .map((g) => {
      const tags = g.items
        .map((n) => {
          const { icon, cls } = skillMeta(n, "text-emerald-700");
          return `<span class="inline-flex items-center gap-1 rounded bg-white px-2 py-0.5 text-[10px] font-semibold text-emerald-950">${resumeIcon(icon, `h-3 w-3 ${cls}`)}${escapeHtml(n)}</span>`;
        })
        .join("");
      return `<div class="mb-2 overflow-hidden rounded-sm">
        ${g.label ? `<div class="${ribbon} px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-white">${escapeHtml(g.label)}</div>` : ""}
        <div class="flex flex-wrap gap-1.5 border border-t-0 border-emerald-100 bg-emerald-50/50 p-2">${tags}</div>
      </div>`;
    })
    .join("");
}

function renderMinimalRow(flat) {
  return `<p class="text-[12px] leading-relaxed text-[#18181b]">${flat.map((n) => escapeHtml(n)).join(", ")}</p>`;
}

function renderSkyChips(flat) {
  return `<div class="flex flex-wrap gap-1.5">${flat
    .map(
      (n) =>
        `<span class="rounded bg-sky-100 px-2.5 py-0.5 text-[11px] font-medium text-sky-800">${escapeHtml(n)}</span>`,
    )
    .join("")}</div>`;
}

function renderSerifBlocks(groups, ui) {
  return `<div class="space-y-3 font-serif">${groups
    .map(
      (g) => `<div class="border-b border-violet-200 pb-2">
      ${g.label ? `<p class="text-[11px] font-bold text-violet-900">${escapeHtml(g.label)}</p>` : ""}
      <p class="mt-1 text-[12px] leading-relaxed text-zinc-700">${g.items.map((n) => escapeHtml(n)).join('<span class="text-violet-300 mx-1.5">·</span>')}</p>
    </div>`,
    )
    .join("")}</div>`;
}

function renderSlateList(flat) {
  return `<ul class="list-disc space-y-1 pl-4 text-[12px] text-slate-600">${flat
    .map((n) => `<li class="break-inside-avoid">${escapeHtml(n)}</li>`)
    .join("")}</ul>`;
}

function renderRoseTiles(flat) {
  return `<div class="grid grid-cols-2 gap-2">${flat
    .map(
      (n) =>
        `<div class="rounded border border-rose-200 bg-rose-50 px-2 py-1.5 text-[11px] font-medium text-rose-950">${escapeHtml(n)}</div>`,
    )
    .join("")}</div>`;
}

function renderCompactDark(flat) {
  return `<div class="flex flex-wrap gap-1.5">${flat
    .map(
      (n) =>
        `<span class="rounded-full bg-zinc-700 px-2.5 py-0.5 text-[10px] font-medium text-zinc-100">${escapeHtml(n)}</span>`,
    )
    .join("")}</div>`;
}

function renderCyanStack(groups) {
  return `<div class="space-y-2">${groups
    .map((g) => {
      const row = g.items
        .map((n) => {
          const { icon, cls } = skillMeta(n, "text-cyan-700");
          return `<span class="flex items-center gap-1 text-[10px] text-cyan-950">${resumeIcon(icon, `h-3 w-3 ${cls}`)}${escapeHtml(n)}</span>`;
        })
        .join("");
      return `<div class="rounded border border-cyan-100 bg-white p-2">
        ${g.label ? `<p class="mb-1 text-[9px] font-bold uppercase text-cyan-800">${escapeHtml(g.label)}</p>` : ""}
        <div class="flex flex-col gap-1">${row}</div>
      </div>`;
    })
    .join("")}</div>`;
}

function renderSwissDense(flat) {
  return `<p class="font-mono text-[11px] leading-snug text-zinc-900">${flat.map((n) => escapeHtml(n)).join(" · ")}</p>`;
}

function renderAcademic(groups) {
  const items = groups.flatMap((g) => g.items);
  if (!items.length) return renderEmpty({ iconContact: "text-teal-700" }, false);
  return `<ol class="list-decimal space-y-1 pl-5 font-serif text-[12px] text-zinc-800">${items
    .map((n) => `<li class="break-inside-avoid pl-1">${escapeHtml(n)}</li>`)
    .join("")}</ol>`;
}

function renderMagazineCols(groups) {
  return `<div class="columns-2 gap-6">${groups
    .map((g) => {
      const lis = g.items
        .map((n) => {
          const { icon, cls } = skillMeta(n, "text-fuchsia-700");
          return `<li class="flex gap-2 text-[12px] text-zinc-700"><span>${resumeIcon(icon, `h-3.5 w-3.5 shrink-0 ${cls}`)}</span>${escapeHtml(n)}</li>`;
        })
        .join("");
      return `<div class="mb-4 break-inside-avoid">
        ${g.label ? `<h3 class="mb-1 text-[11px] font-bold uppercase text-fuchsia-900">${escapeHtml(g.label)}</h3>` : ""}
        <ul class="space-y-1">${lis}</ul>
      </div>`;
    })
    .join("")}</div>`;
}

function renderPlainCols(flat) {
  return `<div class="cv-skills-plain-cols grid grid-cols-3 gap-x-4 gap-y-1 text-[13px] leading-snug text-zinc-700">${flat
    .map((n) => `<div class="break-inside-avoid">${escapeHtml(n)}</div>`)
    .join("")}</div>`;
}

function renderBulletCols(flat) {
  return `<ul class="cv-skills-bullet-cols columns-3 gap-x-6 text-[13px] leading-relaxed text-zinc-700">${flat
    .map((n) => `<li class="mb-1.5 break-inside-avoid pl-1 list-disc marker:text-zinc-800">${escapeHtml(n)}</li>`)
    .join("")}</ul>`;
}

function renderUnderline(flat) {
  return `<div class="flex flex-wrap gap-3">${flat
    .map((n) => {
      const { icon, cls } = skillMeta(n, "text-zinc-600");
      return `<span class="inline-flex items-center gap-1.5 border-b-2 border-zinc-400 pb-0.5 text-[12px] font-medium text-zinc-800">${resumeIcon(icon, `h-3.5 w-3.5 ${cls}`)}${escapeHtml(n)}</span>`;
    })
    .join("")}</div>`;
}

function renderGradientDark(flat) {
  return `<div class="flex flex-wrap gap-2">${flat
    .map((n) => {
      const { icon, cls } = skillMeta(n, "text-rose-200");
      return `<span class="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-rose-900/80 to-rose-800/60 px-2.5 py-1 text-[10px] font-medium text-white shadow-sm">${resumeIcon(icon, `h-3 w-3 ${cls}`)}${escapeHtml(n)}</span>`;
    })
    .join("")}</div>`;
}

export function getSkillsStyle(tplId) {
  const n = Number(tplId) || 1;
  return SKILLS_STYLE_BY_TEMPLATE[n] || "pills";
}

/** Visual skills block for print + preview (not the raw dot cluster). */
export function renderSkillsVisual(skillsText, ui, { dark = false, tplId } = {}) {
  const style = ui.skillsStyle || getSkillsStyle(tplId ?? ui.tplId ?? 1);
  const { groups, flat } = parseSkills(skillsText);
  if (!flat.length) return renderEmpty(ui, dark);

  switch (style) {
    case "pills-dark":
    case "gradient-dark":
      return style === "gradient-dark" ? renderGradientDark(flat) : renderPills(flat, ui, true);
    case "compact-dark":
      return renderCompactDark(flat);
    case "grouped":
    case "academic":
      return style === "academic" ? renderAcademic(groups) : renderGrouped(groups, ui, dark);
    case "outline":
      return renderOutline(flat, ui);
    case "grid":
      return renderGrid(flat, ui);
    case "cards":
      return renderCards(groups, ui);
    case "bars":
      return renderBars(flat, ui, dark);
    case "tags-band":
      return renderTagsBand(groups, ui);
    case "minimal-row":
      return renderMinimalRow(flat, ui);
    case "sky-chips":
      return renderSkyChips(flat);
    case "serif-blocks":
      return renderSerifBlocks(groups, ui);
    case "slate-list":
      return renderSlateList(flat);
    case "rose-tiles":
      return renderRoseTiles(flat);
    case "cyan-stack":
      return renderCyanStack(groups);
    case "swiss-dense":
      return renderSwissDense(flat);
    case "magazine-cols":
      return renderMagazineCols(groups);
    case "plain-cols":
      return renderPlainCols(flat);
    case "bullet-cols":
      return renderBulletCols(flat);
    case "underline":
      return renderUnderline(flat);
    case "pills":
    default:
      return renderPills(flat, ui, dark);
  }
}

/** Editable: textarea + live visual preview. */
export function skillsEditorBlock(draft, ui, tplId, { dark = false, textareaCls, rows = 4 } = {}) {
  const tx = textareaCls || "";
  const preview = renderSkillsVisual(draft.skills, ui, { dark, tplId });
  return `
    <textarea data-f="skills" class="${tx} mb-2 print:hidden" rows="${rows}" placeholder="${escapeHtml(CV_PH.skills)}">${escapeHtml(draft.skills || "")}</textarea>
    <div class="cv-skills-preview" data-skills-preview data-tpl="${tplId}">${preview}</div>`;
}

/** Update skill previews after typing (no full remount). */
export function refreshSkillsPreviews(root, draft, getTemplateUi) {
  root.querySelectorAll("[data-skills-preview]").forEach((el) => {
    const t = Number(el.getAttribute("data-tpl")) || 1;
    const u = getTemplateUi(t);
    const d = Boolean(el.closest(".cv-sidebar"));
    el.innerHTML = renderSkillsVisual(draft.skills, u, { dark: d, tplId: t });
  });
}
