import { renderFluvoTemplate } from "../shared-template.js";

export function renderInvoiceFluvo6Template(target) {
  renderFluvoTemplate(target, {
    number: 6,
    theme: { shellClass: "mx-auto max-w-4xl bg-white shadow-sm", titleTextClass: "text-white", focusClass: "focus:border-amber-500", tableHeadBgClass: "bg-[#232323]", tableBorderClass: "border-amber-200", rowOddClass: "bg-amber-50", totalBgClass: "bg-amber-500 text-[#232323]", topAccentHtml: "<div class=\"flex min-h-[92px] items-stretch\"><div class=\"flex min-w-[15rem] items-center bg-[#232323] px-6 py-4 text-3xl font-bold uppercase tracking-wide text-white [clip-path:polygon(0_0,86%_0,100%_100%,0_100%)]\">INVOICE</div><div class=\"h-16 w-28 bg-amber-500 [clip-path:polygon(28%_0,100%_0,100%_100%,0_55%)]\"></div></div><div class=\"px-10 py-12\">", footerAccentHtml: "<div class=\"mt-8 flex h-3 w-full\"><div class=\"flex-1 bg-[#232323] [clip-path:polygon(0_0,100%_0,93%_100%,0_100%)]\"></div><div class=\"w-44 bg-amber-500 [clip-path:polygon(7%_0,100%_0,100%_100%,0_100%)]\"></div></div></div>" },
  });
}