import { renderFluvoTemplate } from "../shared-template.js";

export function renderInvoiceFluvo18Template(target) {
  renderFluvoTemplate(target, {
    number: 18,
    theme: { shellClass: "mx-auto max-w-4xl overflow-hidden bg-white px-10 py-12 shadow-sm", focusClass: "focus:border-purple-400", tableHeadBgClass: "bg-purple-700", tableBorderClass: "border-purple-200", rowOddClass: "bg-purple-50", totalBgClass: "bg-purple-700 text-white", hero: { wrapClass: "min-h-[12.5rem]", bgClass: "absolute inset-0 bg-[#6b21a8]" }, footerAccentHtml: "<div class=\"relative h-3 bg-[#6b21a8]\"><div class=\"absolute right-0 top-0 h-full w-16 rounded-bl-full bg-gradient-to-br from-transparent via-white/15 to-white/25\"></div></div>" },
  });
}