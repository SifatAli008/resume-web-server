import { renderFluvoTemplate } from "../shared-template.js";

export function renderInvoiceFluvo10Template(target) {
  renderFluvoTemplate(target, {
    number: 10,
    theme: { shellClass: "mx-auto max-w-4xl overflow-hidden rounded-xl bg-white px-10 py-12 text-zinc-800 shadow-sm", titleTextClass: "text-[#e8502d]", focusClass: "focus:border-[#e8502d]", tableHeadBgClass: "bg-[#e8502d]", tableBorderClass: "border-orange-200", rowOddClass: "bg-orange-50", totalBgClass: "bg-[#e8502d] text-white" },
  });
}