import { renderFluvoTemplate } from "../shared-template.js";

export function renderInvoiceFluvo4Template(target) {
  renderFluvoTemplate(target, {
    number: 4,
    theme: { shellClass: "mx-auto flex max-w-5xl bg-white shadow-sm", titleTextClass: "text-green-500", focusClass: "focus:border-green-500", tableHeadBgClass: "bg-green-500", tableBorderClass: "border-green-200", rowOddClass: "bg-green-50/70", totalBgClass: "bg-green-500 text-white", topAccentHtml: "<div class=\"relative w-24 overflow-hidden bg-white\"><div class=\"absolute -left-24 top-4 h-80 w-56 rotate-[-14deg] rounded-[42%_58%_55%_45%/48%_42%_58%_52%] bg-gradient-to-br from-green-300/75 via-green-400/30 to-transparent\"></div><div class=\"absolute -left-20 bottom-8 h-72 w-52 rotate-[16deg] rounded-[52%_48%_42%_58%/50%_55%_45%_50%] bg-gradient-to-tr from-sky-200/80 via-sky-300/40 to-transparent\"></div></div><div class=\"flex-1 px-8 py-10\">", footerAccentHtml: "</div>" },
  });
}