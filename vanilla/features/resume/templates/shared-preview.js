import { escapeHtml, safeHref } from "../escape-html.js";

export function nl2br(text) {
  return escapeHtml(text).replace(/\n/g, "<br />");
}

export function dateRange(start, end) {
  const a = String(start ?? "").trim();
  const b = String(end ?? "").trim();
  if (a && b) return `${escapeHtml(a)} – ${escapeHtml(b)}`;
  if (a) return escapeHtml(a);
  if (b) return escapeHtml(b);
  return "";
}

export function contactBits(draft) {
  return [draft.email, draft.phone, draft.location].filter((x) => String(x || "").trim());
}

/**
 * @param {{ anchor: string; muted: string; sep: string }} classes
 */
export function buildLinksHtml(draft, classes) {
  const { anchor, muted, sep } = classes;
  return (draft.links || [])
    .map((l) => {
      const labelRaw = (l.label || "").trim();
      const urlRaw = (l.url || "").trim();
      if (!labelRaw && !urlRaw) return "";
      const href = safeHref(l.url);
      const label = labelRaw || urlRaw || "Link";
      if (!href) return `<span class="${muted}">${escapeHtml(label)}</span>`;
      return `<a class="${anchor}" href="${escapeHtml(href)}">${escapeHtml(label)}</a>`;
    })
    .filter(Boolean)
    .join(`<span class="${sep}" aria-hidden="true">·</span>`);
}
