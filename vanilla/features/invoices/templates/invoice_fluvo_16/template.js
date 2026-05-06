import { renderFluvoTemplate } from "../shared-template.js";

export function renderInvoiceFluvo16Template(target) {
  renderFluvoTemplate(target, {
    number: 16,
    theme: { shellClass: "mx-auto max-w-4xl overflow-hidden bg-white px-10 py-12 shadow-sm", focusClass: "focus:border-blue-400", tableHeadBgClass: "bg-blue-800", tableBorderClass: "border-blue-200", rowOddClass: "bg-blue-50", totalBgClass: "bg-blue-800 text-white", hero: { wrapClass: "min-h-[12.5rem]", bgClass: "absolute inset-0 bg-[#1e40af]" }, footerAccentHtml: "<div class=\"relative h-3 bg-[#1e40af]\"><div class=\"absolute right-0 top-0 h-full w-16 rounded-bl-full bg-gradient-to-br from-transparent via-white/15 to-white/25\"></div></div>" },
  });
}