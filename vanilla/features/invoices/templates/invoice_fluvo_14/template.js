import { renderFluvoTemplate } from "../shared-template.js";

export function renderInvoiceFluvo14Template(target) {
  renderFluvoTemplate(target, {
    number: 14,
    theme: { shellClass: "mx-auto max-w-4xl overflow-hidden bg-white px-10 py-12 shadow-sm", focusClass: "focus:border-green-400", tableHeadBgClass: "bg-green-700", tableBorderClass: "border-green-200", rowOddClass: "bg-green-50", totalBgClass: "bg-green-700 text-white", hero: { wrapClass: "min-h-[11.5rem]", bgClass: "absolute inset-0 bg-[#166534] bg-[radial-gradient(ellipse_120%_80%_at_20%_30%,rgba(255,255,255,0.1)_0%,transparent_50%),radial-gradient(ellipse_80%_60%_at_80%_70%,rgba(0,0,0,0.1)_0%,transparent_45%)]" }, footerAccentHtml: "<div class=\"h-2 bg-[repeating-linear-gradient(-45deg,#166534,#166534_5px,#fff_5px,#fff_10px)]\"></div>" },
  });
}