import { renderFluvoTemplate } from "../shared-template.js";

export function renderInvoiceFluvo17Template(target) {
  renderFluvoTemplate(target, {
    number: 17,
    theme: { shellClass: "mx-auto max-w-4xl overflow-hidden bg-white px-10 py-12 shadow-sm", focusClass: "focus:border-teal-400", tableHeadBgClass: "bg-teal-700", tableBorderClass: "border-teal-200", rowOddClass: "bg-teal-50", totalBgClass: "bg-teal-700 text-white", hero: { wrapClass: "min-h-[12.5rem]", bgClass: "absolute inset-0 bg-[#115e59]" }, footerAccentHtml: "<div class=\"relative h-3 bg-[#115e59]\"><div class=\"absolute right-0 top-0 h-full w-16 rounded-bl-full bg-gradient-to-br from-transparent via-white/15 to-white/25\"></div></div>" },
  });
}