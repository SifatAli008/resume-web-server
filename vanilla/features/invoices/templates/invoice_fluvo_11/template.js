import { renderFluvoTemplate } from "../shared-template.js";

export function renderInvoiceFluvo11Template(target) {
  renderFluvoTemplate(target, {
    number: 11,
    theme: { shellClass: "mx-auto max-w-4xl overflow-hidden bg-white px-10 py-12 shadow-sm", focusClass: "focus:border-rose-400", tableHeadBgClass: "bg-rose-700", tableBorderClass: "border-rose-200", rowOddClass: "bg-rose-50", totalBgClass: "bg-rose-700 text-white", hero: { wrapClass: "min-h-[11.5rem]", bgClass: "absolute inset-0 bg-[#c45c6a] bg-[radial-gradient(ellipse_120%_80%_at_20%_30%,rgba(255,255,255,0.12)_0%,transparent_50%),radial-gradient(ellipse_80%_60%_at_80%_70%,rgba(0,0,0,0.08)_0%,transparent_45%)]" }, footerAccentHtml: "<div class=\"h-2 bg-[repeating-linear-gradient(-45deg,#6b2d2d,#6b2d2d_5px,#fff_5px,#fff_10px)]\"></div>" },
  });
}