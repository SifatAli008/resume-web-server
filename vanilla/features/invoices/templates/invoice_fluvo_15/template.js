import { renderFluvoTemplate } from "../shared-template.js";

export function renderInvoiceFluvo15Template(target) {
  renderFluvoTemplate(target, {
    number: 15,
    theme: { shellClass: "mx-auto max-w-4xl overflow-hidden bg-white px-10 py-12 shadow-sm", focusClass: "focus:border-zinc-400", tableHeadBgClass: "bg-zinc-800", tableBorderClass: "border-zinc-300", rowOddClass: "bg-zinc-50", totalBgClass: "bg-zinc-800 text-white", hero: { wrapClass: "min-h-[12.5rem]", bgClass: "absolute inset-0 bg-[#262626]" }, footerAccentHtml: "<div class=\"relative h-3 bg-[#1c1c1c]\"><div class=\"absolute right-0 top-0 h-full w-16 rounded-bl-full bg-gradient-to-br from-transparent via-white/15 to-white/25\"></div></div>" },
  });
}