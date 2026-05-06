import { renderFluvoTemplate } from "../shared-template.js";

export function renderInvoiceFluvo12Template(target) {
  renderFluvoTemplate(target, {
    number: 12,
    theme: { shellClass: "mx-auto max-w-4xl overflow-hidden bg-white px-10 py-12 shadow-sm", focusClass: "focus:border-zinc-400", tableHeadBgClass: "bg-zinc-900", tableBorderClass: "border-zinc-300", rowOddClass: "bg-zinc-50", totalBgClass: "bg-zinc-900 text-white", hero: { wrapClass: "min-h-[11.5rem]", bgClass: "absolute inset-0 bg-[#0a0a0a] bg-[radial-gradient(ellipse_120%_80%_at_20%_30%,rgba(255,255,255,0.06)_0%,transparent_50%),radial-gradient(ellipse_80%_60%_at_80%_70%,rgba(255,255,255,0.04)_0%,transparent_45%)]" }, footerAccentHtml: "<div class=\"h-2 bg-[repeating-linear-gradient(-45deg,#0a0a0a,#0a0a0a_5px,#fff_5px,#fff_10px)]\"></div>" },
  });
}