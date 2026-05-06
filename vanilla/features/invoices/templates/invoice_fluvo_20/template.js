import { renderFluvoTemplate } from "../shared-template.js";

export function renderInvoiceFluvo20Template(target) {
  renderFluvoTemplate(target, {
    number: 20,
    theme: { shellClass: "mx-auto max-w-4xl bg-white px-10 py-12 text-zinc-800 shadow-sm", titleTextClass: "text-zinc-900", focusClass: "focus:border-indigo-500", tableHeadBgClass: "bg-zinc-900", tableBorderClass: "border-zinc-300", rowOddClass: "bg-zinc-50", totalBgClass: "bg-zinc-900 text-white", topAccentHtml: "<p class=\"mb-4 text-xs font-bold uppercase tracking-[0.2em] text-zinc-500\">pixel crisp edition</p>" },
  });
}