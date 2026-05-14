export function escapeHtml(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function safeHref(url) {
  const u = String(url ?? "").trim();
  if (!u) return "";
  const lower = u.toLowerCase();
  if (lower.startsWith("javascript:") || lower.startsWith("data:")) return "";
  if (lower.startsWith("http://") || lower.startsWith("https://") || lower.startsWith("mailto:")) return u;
  if (lower.startsWith("/") && !lower.startsWith("//")) return u;
  if (u.startsWith("#")) return u;
  return `https://${u}`;
}
