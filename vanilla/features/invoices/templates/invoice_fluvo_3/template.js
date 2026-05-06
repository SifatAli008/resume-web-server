import { renderFluvoTemplate } from "../shared-template.js";

export function renderInvoiceFluvo3Template(target) {
  renderFluvoTemplate(target, {
    number: 3,
    theme: { shellClass: "mx-auto flex max-w-5xl bg-white shadow-sm", titleTextClass: "text-red-700", focusClass: "focus:border-red-500", tableHeadBgClass: "bg-red-700", tableBorderClass: "border-red-300", rowOddClass: "bg-red-50/60", totalBgClass: "bg-red-700 text-white", topAccentHtml: "<div class=\"w-7 bg-red-900 bg-[linear-gradient(45deg,rgba(255,255,255,0.08)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.08)_50%,rgba(255,255,255,0.08)_75%,transparent_75%,transparent)] bg-[length:16px_16px]\"></div><div class=\"flex-1 px-8 py-10\">", footerAccentHtml: "</div>" },
  });
}