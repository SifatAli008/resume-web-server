import { renderFluvoTemplate } from "../shared-template.js";

export function renderInvoiceFluvo19Template(target) {
  renderFluvoTemplate(target, {
    number: 19,
    theme: { shellClass: "mx-auto max-w-4xl border-4 border-black bg-[#fff8e7] px-8 py-8 text-zinc-900 shadow-[8px_8px_0_#141414]", titleClass: "inline-block border-[3px] border-black bg-yellow-300 px-3 py-1 text-3xl font-extrabold uppercase tracking-wide shadow-[4px_4px_0_#141414]", titleTextClass: "text-black", focusClass: "focus:border-blue-700", tableHeadBgClass: "bg-[#0055bf]", tableBorderClass: "border-black", rowOddClass: "bg-[#fff3c4]", totalBgClass: "bg-[#e3000b] text-white border-[3px] border-black shadow-[4px_4px_0_#141414]", topAccentHtml: "<div class=\"mb-6 h-[18px] border-b-[3px] border-black bg-[#00a550] bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.35)_0%,rgba(255,255,255,0.35)_22%,rgba(0,0,0,0.12)_23%,rgba(0,0,0,0.12)_45%,transparent_46%)] bg-[length:16px_16px]\"></div>", sectionRuleClass: "border-black/40" },
  });
}