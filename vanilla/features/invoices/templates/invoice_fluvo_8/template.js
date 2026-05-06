import { renderFluvoTemplate } from "../shared-template.js";

export function renderInvoiceFluvo8Template(target) {
  renderFluvoTemplate(target, {
    number: 8,
    theme: { shellClass: "mx-auto max-w-4xl bg-white px-10 py-12 text-zinc-800 shadow-sm", titleTextClass: "text-[#6b6ba3]", focusClass: "focus:border-violet-500", tableHeadBgClass: "bg-[#6b6ba3]", tableBorderClass: "border-violet-200", rowOddClass: "bg-zinc-100", totalBgClass: "bg-[#6b6ba3] text-white" },
  });
}