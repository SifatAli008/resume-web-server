import { renderFluvoTemplate } from "../shared-template.js";

export function renderInvoiceFluvo5Template(target) {
  renderFluvoTemplate(target, {
    number: 5,
    theme: { shellClass: "mx-auto max-w-4xl overflow-hidden bg-white shadow-sm", titleTextClass: "text-sky-600", focusClass: "focus:border-sky-500", tableHeadBgClass: "bg-sky-600", tableBorderClass: "border-sky-200", rowOddClass: "bg-sky-50/70", totalBgClass: "bg-sky-600 text-white", topAccentHtml: "<div class=\"relative\"><div class=\"absolute right-0 top-0 h-44 w-56 bg-gradient-to-bl from-sky-200/90 via-indigo-100/40 to-transparent [clip-path:polygon(100%_0,100%_78%,8%_0)]\"></div><div class=\"absolute bottom-0 right-0 h-56 w-72 bg-gradient-to-tr from-transparent via-blue-200/70 to-blue-300/30 [clip-path:polygon(92%_100%,100%_100%,100%_12%,55%_100%)]\"></div></div><div class=\"px-10 py-12\">", footerAccentHtml: "</div>" },
  });
}