import { renderFluvoTemplate } from "../shared-template.js";

export function renderInvoiceFluvo7Template(target) {
  renderFluvoTemplate(target, {
    number: 7,
    theme: { shellClass: "mx-auto max-w-4xl bg-white px-10 py-12 text-zinc-800 shadow-sm", titleTextClass: "text-[#00333d]", focusClass: "focus:border-cyan-500", tableHeadBgClass: "bg-[#00333d]", tableBorderClass: "border-cyan-200", rowOddClass: "bg-zinc-100", totalBgClass: "bg-[#00333d] text-white", topAccentHtml: "<div class=\"mb-6\"><div class=\"inline-flex min-w-[15rem] items-center bg-[#00333d] px-6 py-4 text-3xl font-bold uppercase tracking-wide text-white [clip-path:polygon(0_0,88%_0,100%_100%,0_100%)]\">INVOICE</div><div class=\"h-2 w-48 bg-gradient-to-r from-cyan-200 to-cyan-400 [clip-path:polygon(0_0,72%_0,100%_100%,0_100%)]\"></div></div>" },
  });
}