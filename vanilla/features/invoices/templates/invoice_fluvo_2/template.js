import { renderFluvoTemplate } from "../shared-template.js";

export function renderInvoiceFluvo2Template(target) {
  renderFluvoTemplate(target, {
    number: 2,
    theme: { shellClass: "mx-auto max-w-4xl bg-white px-10 py-12 text-zinc-800 shadow-sm", titleTextClass: "text-teal-500", focusClass: "focus:border-teal-500", tableHeadBgClass: "bg-teal-500", tableBorderClass: "border-teal-500", rowOddClass: "bg-teal-50/40", totalBgClass: "bg-teal-500 text-white" },
  });
}