import { renderFluvoTemplate } from "../shared-template.js";

export function renderInvoiceFluvo9Template(target) {
  renderFluvoTemplate(target, {
    number: 9,
    theme: { shellClass: "mx-auto max-w-4xl bg-white px-10 py-12 text-zinc-900 shadow-sm", titleTextClass: "text-black", focusClass: "focus:border-black", tableHeadBgClass: "bg-black", tableBorderClass: "border-black/30", rowOddClass: "bg-zinc-100", totalBgClass: "bg-black text-white", sectionRuleClass: "border-black/20" },
  });
}