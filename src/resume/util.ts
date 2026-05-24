export function skillBarPct(label: string, min = 52, max = 94): number {
  let h = 0;
  const s = String(label ?? "");
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  const span = Math.max(1, max - min + 1);
  return Math.min(100, Math.max(0, min + (Math.abs(h) % span)));
}

export function initials(name: string): string {
  return String(name || "?")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export function dotScaleFilled(label: string): number {
  return 1 + (Math.abs(skillBarPct(label, 0, 4)) % 5);
}
