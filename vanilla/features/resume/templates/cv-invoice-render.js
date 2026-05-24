/**
 * Invoice-style multipage CV for all 20 layout families.
 * @see https://invoice-web-server-sigma.vercel.app/invoice/invoice_fluvo_10
 */
import { escapeHtml } from "../escape-html.js";
import { articlePhotoClass, pageShell, photoEditorBar } from "./cv-shared-ui.js";
import { bannerContactStrip, headerLinks } from "./cv-headers.js";
import {
  cvDocumentTitle,
  cvExperienceTable,
  cvFromBlock,
  cvMetaRow,
  cvTotalsFooter,
  cvDocumentTitleSerif,
} from "./cv-invoice-layout.js";
import {
  blockEdu,
  blockProj,
  blockSkillsMain,
  sidebarAside,
  splitRail,
} from "./cv-section-blocks.js";

function invoiceCoreMain(draft, ui, tplId, { skills = true, links = false } = {}) {
  const skillsBlk = skills ? blockSkillsMain(draft, ui, tplId) : "";
  const linksBlk = links ? headerLinks(draft, ui) : "";
  return `${cvMetaRow(draft, ui)}${cvDocumentTitle(draft)}${linksBlk}${cvFromBlock(draft, ui)}${skillsBlk}${cvExperienceTable(draft, [0, 2], ui)}`;
}

function invoicePage2(draft, ui) {
  return `${cvExperienceTable(draft, [2], ui, "Experience (continued)")}${blockProj(draft, ui)}`;
}

function invoicePage3(draft, ui, tplId, { eduBlock = true } = {}) {
  const edu = eduBlock ? blockEdu(draft, ui) : "";
  return `${edu}${cvTotalsFooter(draft, ui)}`;
}

function wrapTimeline(html, ui) {
  const border = (ui.line || "bg-violet-400").replace(/^bg-/, "border-");
  return `<div class="cv-timeline cv-timeline-accent border-l-4 ${border} pl-4">${html}</div>`;
}

/** Classic, Milan */
function invoiceClassic(draft, tplId, ui) {
  const p1 = invoiceCoreMain(draft, ui, tplId, { skills: true, links: ui.linksZone === "header" });
  const p2 = invoicePage2(draft, ui);
  const p3 = invoicePage3(draft, ui, tplId);
  return pageShell(1, p1, tplId, ui) + pageShell(2, p2, tplId, ui) + pageShell(3, p3, tplId, ui);
}

/** Sidebar left: Contact | Main */
function invoiceSidebarLeft(draft, tplId, ui) {
  const side = (editable) => sidebarAside(draft, ui, tplId, editable, { invoiceShell: true });
  const p1 = `${cvMetaRow(draft, ui)}${cvDocumentTitle(draft)}${cvFromBlock(draft, ui)}${cvExperienceTable(draft, [0, 2], ui)}`;
  const p2 = invoicePage2(draft, ui);
  const p3 = `${blockEdu(draft, ui)}${cvTotalsFooter(draft, ui)}`;
  return (
    pageShell(1, `<div class="cv-spread flex flex-col sm:flex-row print:flex-row">${side(true)}<div class="min-w-0 flex-1 p-5 sm:p-6">${p1}</div></div>`, tplId, ui) +
    pageShell(2, `<div class="cv-spread flex flex-col sm:flex-row print:flex-row">${side(false)}<div class="min-w-0 flex-1 p-5 sm:p-6">${p2}</div></div>`, tplId, ui) +
    pageShell(3, `<div class="cv-spread flex flex-col sm:flex-row print:flex-row">${side(false)}<div class="min-w-0 flex-1 p-5 sm:p-6">${p3}</div></div>`, tplId, ui)
  );
}

/** Sidebar right: Main | Contact */
function invoiceSidebarRight(draft, tplId, ui) {
  const side = (editable) => sidebarAside(draft, ui, tplId, editable, { invoiceShell: true });
  const p1 = `${cvMetaRow(draft, ui)}${cvDocumentTitle(draft)}${cvFromBlock(draft, ui)}${cvExperienceTable(draft, [0, 2], ui)}`;
  const p2 = invoicePage2(draft, ui);
  const p3 = invoicePage3(draft, ui, tplId);
  return (
    pageShell(1, `<div class="cv-spread flex flex-col sm:flex-row print:flex-row"><div class="min-w-0 flex-1 p-5 sm:p-6">${p1}</div>${side(true)}</div>`, tplId, ui) +
    pageShell(2, `<div class="cv-spread flex flex-col sm:flex-row print:flex-row"><div class="min-w-0 flex-1 p-5 sm:p-6">${p2}</div>${side(false)}</div>`, tplId, ui) +
    pageShell(3, `<div class="cv-spread flex flex-col sm:flex-row print:flex-row"><div class="min-w-0 flex-1 p-5 sm:p-6">${p3}</div>${side(false)}</div>`, tplId, ui)
  );
}

/** Split right: Main | Skills rail */
function invoiceSplitRight(draft, tplId, ui) {
  const rail = (editable) => splitRail(draft, ui, tplId, editable, { invoiceShell: true });
  const p1 = `${cvMetaRow(draft, ui)}${cvDocumentTitle(draft)}${cvFromBlock(draft, ui)}${cvExperienceTable(draft, [0, 2], ui)}`;
  const p2 = invoicePage2(draft, ui);
  const p3 = invoicePage3(draft, ui, tplId, { eduBlock: true });
  return (
    pageShell(1, `<div class="cv-split-grid grid grid-cols-1 sm:grid-cols-[1fr_11.5rem] print:grid-cols-[1fr_11.5rem]"><div class="min-w-0 p-5 sm:p-6 print:p-5">${p1}</div>${rail(true)}</div>`, tplId, ui) +
    pageShell(2, `<div class="cv-split-grid grid grid-cols-1 sm:grid-cols-[1fr_11.5rem] print:grid-cols-[1fr_11.5rem]"><div class="min-w-0 p-5 sm:p-6 print:p-5">${p2}</div>${rail(false)}</div>`, tplId, ui) +
    pageShell(3, `<div class="cv-split-grid grid grid-cols-1 sm:grid-cols-[1fr_11.5rem] print:grid-cols-[1fr_11.5rem]"><div class="min-w-0 p-5 sm:p-6 print:p-5">${p3}</div>${rail(false)}</div>`, tplId, ui)
  );
}

/** Banner: contact strip on page 1 only */
function invoiceBanner(draft, tplId, ui) {
  const strip = `<div class="cv-banner-strip mb-4 bg-zinc-900 px-4 py-2.5 text-center text-[11px] text-white print:bg-zinc-900">${bannerContactStrip(draft, ui)}</div>`;
  const p1 = `${strip}${cvDocumentTitle(draft)}${headerLinks(draft, ui)}${cvFromBlock(draft, ui)}${blockSkillsMain(draft, ui, tplId)}${cvExperienceTable(draft, [0, 2], ui)}`;
  const p2 = invoicePage2(draft, ui);
  const p3 = invoicePage3(draft, ui, tplId);
  return pageShell(1, p1, tplId, ui) + pageShell(2, p2, tplId, ui) + pageShell(3, p3, tplId, ui);
}

/** Serif centered title */
function invoiceSerif(draft, tplId, ui) {
  const p1 = `${cvMetaRow(draft, ui)}${cvDocumentTitleSerif(draft)}${headerLinks(draft, ui)}${cvFromBlock(draft, ui)}${blockSkillsMain(draft, ui, tplId)}${cvExperienceTable(draft, [0, 2], ui)}`;
  const p2 = invoicePage2(draft, ui);
  const p3 = invoicePage3(draft, ui, tplId);
  return pageShell(1, p1, tplId, ui) + pageShell(2, p2, tplId, ui) + pageShell(3, p3, tplId, ui);
}

/** Magazine: profile | skills columns */
function invoiceMagazine(draft, tplId, ui) {
  const p1 = `${cvMetaRow(draft, ui)}${cvDocumentTitle(draft)}${headerLinks(draft, ui)}<div class="mb-4 grid gap-6 sm:grid-cols-2">${cvFromBlock(draft, ui)}${blockSkillsMain(draft, ui, tplId)}</div>${cvExperienceTable(draft, [0, 2], ui)}`;
  const p2 = invoicePage2(draft, ui);
  const p3 = invoicePage3(draft, ui, tplId);
  return pageShell(1, p1, tplId, ui) + pageShell(2, p2, tplId, ui) + pageShell(3, p3, tplId, ui);
}

/** Timeline accent */
function invoiceTimeline(draft, tplId, ui) {
  const p1 = wrapTimeline(invoiceCoreMain(draft, ui, tplId, { skills: true, links: ui.linksZone === "header" }), ui);
  const p2 = wrapTimeline(invoicePage2(draft, ui), ui);
  const p3 = wrapTimeline(invoicePage3(draft, ui, tplId), ui);
  return pageShell(1, p1, tplId, ui) + pageShell(2, p2, tplId, ui) + pageShell(3, p3, tplId, ui);
}

/** Bands: band section headers via ui.section in child blocks — classic + band section style */
function invoiceBands(draft, tplId, ui) {
  return invoiceClassic(draft, tplId, { ...ui, section: "band" });
}

/** Swiss: compact title */
function invoiceSwiss(draft, tplId, ui) {
  const p1 = `${cvMetaRow(draft, ui)}<div class="cv-swiss-title mb-4 border-b border-zinc-900 pb-2"><input data-f="fullName" type="text" class="cv-name-emphasis w-full border-0 bg-transparent text-[1.75rem] font-extrabold tracking-[-0.025em] text-zinc-950 outline-none" value="${escapeHtml(draft.fullName || "")}" /></div>${cvFromBlock(draft, ui)}${blockSkillsMain(draft, ui, tplId)}${cvExperienceTable(draft, [0, 2], ui)}`;
  const p2 = invoicePage2(draft, ui);
  const p3 = invoicePage3(draft, ui, tplId);
  return pageShell(1, p1, tplId, ui) + pageShell(2, p2, tplId, ui) + pageShell(3, p3, tplId, ui);
}

/** Academic */
function invoiceAcademic(draft, tplId, ui) {
  const p1 = `${cvMetaRow(draft, ui)}${cvDocumentTitle(draft)}${cvFromBlock(draft, ui)}${cvExperienceTable(draft, [0, 2], ui)}`;
  const p2 = `${invoicePage2(draft, ui)}${blockSkillsMain(draft, ui, tplId)}`;
  const p3 = invoicePage3(draft, ui, tplId);
  return pageShell(1, p1, tplId, ui) + pageShell(2, p2, tplId, ui) + pageShell(3, p3, tplId, ui);
}

/** Ribbon uses classic invoice body (ribbon colors via tokens on ui) */
function invoiceRibbon(draft, tplId, ui) {
  return invoiceClassic(draft, tplId, { ...ui, header: "ribbon" });
}

const INVOICE_BY_LAYOUT = {
  classic: invoiceClassic,
  "sidebar-left": invoiceSidebarLeft,
  "sidebar-right": invoiceSidebarRight,
  "split-right": invoiceSplitRight,
  ribbon: invoiceRibbon,
  bands: invoiceBands,
  banner: invoiceBanner,
  serif: invoiceSerif,
  timeline: invoiceTimeline,
  magazine: invoiceMagazine,
  swiss: invoiceSwiss,
  academic: invoiceAcademic,
};

export function buildInvoiceMultipageCv(draft, templateId, tplId, ui, options = {}) {
  const { showPhotoEditor = true } = options;
  const render = INVOICE_BY_LAYOUT[ui.layout] || invoiceClassic;
  const pages = render(draft, tplId, ui);
  const layoutCls = [
    "cv-layout-invoice",
    ui.layout === "bands" ? "cv-layout-bands" : "",
    ui.layout === "banner" ? "cv-layout-banner" : "",
  ]
    .filter(Boolean)
    .join(" ");
  const photoBar = showPhotoEditor ? photoEditorBar(draft, ui) : "";
  return `<article id="resume-print-root" class="resume-preview-article cv-document cv-tpl-${tplId} ${ui.fontClass || ""} ${layoutCls} ${articlePhotoClass(draft)} mx-auto max-w-[210mm] text-zinc-900 antialiased" data-cv-template="${tplId}" data-invoice-shell="1">${photoBar}${pages}</article>`;
}
