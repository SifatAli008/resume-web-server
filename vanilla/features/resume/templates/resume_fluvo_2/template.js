import { renderLayoutSidebarPro } from "../resume-professional-parts.js";

export function renderResumeFluvo2Template(draft) {
  return renderLayoutSidebarPro(draft, {
    sidebarBg: "bg-zinc-900",
    accent: "emerald",
    rail: "border-zinc-700",
  });
}
