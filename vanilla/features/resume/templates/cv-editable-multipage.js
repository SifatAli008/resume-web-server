import { getTemplateUi } from "./cv-template-ui.js";
import { articlePhotoClass, pageShell, photoEditorBar } from "./cv-shared-ui.js";
import { readLinksFromRoot } from "./cv-links-ui.js";
import { headerLinks, pickHeader } from "./cv-headers.js";
import { buildInvoiceMultipageCv } from "./cv-invoice-render.js";
import { renderEstellePage } from "./cv-estelle-blocks.js";
import { renderGallegoPage } from "./cv-gallego-blocks.js";
import { renderMitchellPage } from "./cv-mitchell-blocks.js";
import { renderSanchezPage } from "./cv-sanchez-blocks.js";
import { renderAlvaradoPage } from "./cv-alvarado-blocks.js";
import { renderSchumacherPage } from "./cv-schumacher-blocks.js";
import {
  blockCerts,
  blockEdu,
  blockExp,
  blockLang,
  blockProj,
  blockSkillsMain,
  blockSummary,
  sidebarAside,
  splitRail,
} from "./cv-section-blocks.js";
import { defaultResumeDraft, normalizeResumeDraft } from "../draft.js";

function tplNum(templateId) {
  const id = String(templateId || "");
  const fluvo = /^resume_fluvo_(\d+)$/.exec(id);
  if (fluvo) return Number(fluvo[1]);
  const v2 = /^resume_(\d{2})$/.exec(id);
  if (v2) return Number(v2[1]);
  return 1;
}

function wrapSpreadLeft(side, main) {
  return `<div class="cv-spread flex min-h-0 flex-col sm:flex-row print:flex-row">${side}<div class="min-w-0 flex-1 p-5 sm:p-6">${main}</div></div>`;
}

function wrapSpreadRight(main, side) {
  return `<div class="cv-spread flex min-h-0 flex-col sm:flex-row print:flex-row"><div class="min-w-0 flex-1 p-5 sm:p-6">${main}</div>${side}</div>`;
}

function wrapSplit(main, rail) {
  return `<div class="cv-split-grid grid min-h-0 grid-cols-1 sm:grid-cols-[1fr_11.5rem] print:grid-cols-[1fr_11.5rem]"><div class="min-w-0 p-5 sm:p-6 print:p-5">${main}</div>${rail}</div>`;
}

function renderClassic(draft, tplId, ui) {
  const p1 = `${pickHeader(draft, ui)}${headerLinks(draft, ui)}${blockSummary(draft, ui)}${blockSkillsMain(draft, ui, tplId)}${blockExp(draft, ui, [0, 2])}`;
  const p2 = `${blockExp(draft, ui, [2], "Experience (continued)")}${blockProj(draft, ui)}`;
  const p3 = `${blockEdu(draft, ui)}${blockCerts(draft, ui)}${blockLang(draft, ui)}`;
  return pageShell(1, p1, tplId, ui) + pageShell(2, p2, tplId, ui) + pageShell(3, p3, tplId, ui);
}

function renderSidebarLeft(draft, tplId, ui) {
  const sideEdit = sidebarAside(draft, ui, tplId, true);
  const sideView = sidebarAside(draft, ui, tplId, false);
  const p1 = `${blockSummary(draft, ui)}${blockExp(draft, ui, [0, 2])}`;
  const p2 = `${blockExp(draft, ui, [2], "Experience (continued)")}${blockProj(draft, ui)}`;
  const p3 = `${blockEdu(draft, ui)}${blockCerts(draft, ui)}`;
  return (
    pageShell(1, wrapSpreadLeft(sideEdit, p1), tplId, ui) +
    pageShell(2, wrapSpreadLeft(sideView, p2), tplId, ui) +
    pageShell(3, wrapSpreadLeft(sideView, p3), tplId, ui)
  );
}

function renderSidebarRight(draft, tplId, ui) {
  const sideEdit = sidebarAside(draft, ui, tplId, true);
  const sideView = sidebarAside(draft, ui, tplId, false);
  const p1 = `${blockSummary(draft, ui)}${blockExp(draft, ui, [0, 2])}`;
  const p2 = `${blockExp(draft, ui, [2], "Experience (continued)")}${blockProj(draft, ui)}`;
  const p3 = `${blockEdu(draft, ui)}${blockCerts(draft, ui)}${blockLang(draft, ui)}`;
  return (
    pageShell(1, wrapSpreadRight(p1, sideEdit), tplId, ui) +
    pageShell(2, wrapSpreadRight(p2, sideView), tplId, ui) +
    pageShell(3, wrapSpreadRight(p3, sideView), tplId, ui)
  );
}

function renderSplitRight(draft, tplId, ui) {
  const railEdit = splitRail(draft, ui, tplId, true);
  const railView = splitRail(draft, ui, tplId, false);
  const p1 = `${pickHeader(draft, ui)}${headerLinks(draft, ui)}${blockSummary(draft, ui)}${blockExp(draft, ui, [0, 2])}`;
  const p2 = `${blockExp(draft, ui, [2], "Experience (continued)")}${blockProj(draft, ui)}`;
  const p3 = `${blockEdu(draft, ui)}${blockCerts(draft, ui)}`;
  return (
    pageShell(1, wrapSplit(p1, railEdit), tplId, ui) +
    pageShell(2, wrapSplit(p2, railView), tplId, ui) +
    pageShell(3, wrapSplit(p3, railView), tplId, ui)
  );
}

function renderTimeline(draft, tplId, ui) {
  const border = (ui.line || "bg-violet-400").replace(/^bg-/, "border-");
  const tl = (html) => `<div class="cv-timeline cv-timeline-accent border-l-4 ${border} pl-4">${html}</div>`;
  const p1 = tl(`${pickHeader(draft, ui)}${headerLinks(draft, ui)}${blockSummary(draft, ui)}${blockSkillsMain(draft, ui, tplId)}${blockExp(draft, ui, [0, 2])}`);
  const p2 = tl(`${blockExp(draft, ui, [2], "Experience (continued)")}${blockProj(draft, ui)}`);
  const p3 = tl(`${blockEdu(draft, ui)}${blockCerts(draft, ui)}${blockLang(draft, ui)}`);
  return pageShell(1, p1, tplId, ui) + pageShell(2, p2, tplId, ui) + pageShell(3, p3, tplId, ui);
}

function renderAcademic(draft, tplId, ui) {
  const p1 = `${pickHeader(draft, ui)}${headerLinks(draft, ui)}${blockSummary(draft, ui)}${blockExp(draft, ui, [0, 2])}`;
  const p2 = `${blockExp(draft, ui, [2], "Experience (continued)")}${blockProj(draft, ui)}${blockSkillsMain(draft, ui, tplId)}`;
  const p3 = `${blockEdu(draft, ui)}${blockCerts(draft, ui)}${blockLang(draft, ui)}`;
  return pageShell(1, p1, tplId, ui) + pageShell(2, p2, tplId, ui) + pageShell(3, p3, tplId, ui);
}

function renderBands(draft, tplId, ui) {
  return renderClassic(draft, tplId, { ...ui, section: "band" });
}

function renderBanner(draft, tplId, ui) {
  const top = pickHeader(draft, ui);
  const linksOnce = headerLinks(draft, ui);
  const p1 = `${top}${linksOnce}${blockSummary(draft, ui)}${blockExp(draft, ui, [0, 2])}`;
  const p2 = `${blockExp(draft, ui, [2], "Experience (continued)")}${blockProj(draft, ui)}`;
  const p3 = `${blockEdu(draft, ui)}${blockSkillsMain(draft, ui, tplId)}${blockCerts(draft, ui)}${blockLang(draft, ui)}`;
  return pageShell(1, p1, tplId, ui) + pageShell(2, p2, tplId, ui) + pageShell(3, p3, tplId, ui);
}

function renderSerif(draft, tplId, ui) {
  const p1 = `${pickHeader(draft, ui)}${headerLinks(draft, ui)}${blockSummary(draft, ui)}${blockExp(draft, ui, [0, 2])}`;
  const p2 = `${blockExp(draft, ui, [2], "Experience (continued)")}${blockProj(draft, ui)}`;
  const p3 = `${blockEdu(draft, ui)}${blockSkillsMain(draft, ui, tplId)}${blockCerts(draft, ui)}${blockLang(draft, ui)}`;
  return pageShell(1, p1, tplId, ui) + pageShell(2, p2, tplId, ui) + pageShell(3, p3, tplId, ui);
}

function renderMagazine(draft, tplId, ui) {
  const p1 = `${pickHeader(draft, ui)}${headerLinks(draft, ui)}<div class="mb-4 grid gap-6 sm:grid-cols-2">${blockSummary(draft, ui)}${blockSkillsMain(draft, ui, tplId)}</div>${blockExp(draft, ui, [0, 2])}`;
  const p2 = `${blockExp(draft, ui, [2], "Experience (continued)")}${blockProj(draft, ui)}`;
  const p3 = `${blockEdu(draft, ui)}${blockCerts(draft, ui)}${blockLang(draft, ui)}`;
  return pageShell(1, p1, tplId, ui) + pageShell(2, p2, tplId, ui) + pageShell(3, p3, tplId, ui);
}

function renderEstelle(draft, tplId, ui) {
  const body = renderEstellePage(draft, tplId, ui);
  return pageShell(1, body, tplId, ui);
}

function renderGallego(draft, tplId, ui) {
  const body = renderGallegoPage(draft, tplId, ui);
  return pageShell(1, body, tplId, ui);
}

function renderMitchell(draft, tplId, ui) {
  const body = renderMitchellPage(draft, tplId, ui);
  return pageShell(1, body, tplId, ui);
}

function renderSanchez(draft, tplId, ui) {
  const body = renderSanchezPage(draft, tplId, ui);
  return pageShell(1, body, tplId, ui);
}

function renderAlvarado(draft, tplId, ui) {
  const body = renderAlvaradoPage(draft);
  return pageShell(1, body, tplId, ui);
}

function renderSchumacher(draft, tplId, ui) {
  const body = renderSchumacherPage(draft);
  return pageShell(1, body, tplId, ui);
}

const RENDERERS = {
  estelle: renderEstelle,
  gallego: renderGallego,
  mitchell: renderMitchell,
  sanchez: renderSanchez,
  alvarado: renderAlvarado,
  schumacher: renderSchumacher,
  classic: renderClassic,
  "sidebar-left": renderSidebarLeft,
  "sidebar-right": renderSidebarRight,
  "split-right": renderSplitRight,
  ribbon: (d, id, ui) => renderClassic(d, id, { ...ui, header: "ribbon" }),
  bands: renderBands,
  banner: renderBanner,
  serif: renderSerif,
  timeline: renderTimeline,
  magazine: renderMagazine,
  swiss: (d, id, ui) => renderClassic(d, id, { ...ui, section: "minimal", header: "compact" }),
  academic: renderAcademic,
};

export function buildEditableMultipageCv(draft, templateId, options = {}) {
  const { invoiceShell = false, showPhotoEditor = false } = options;
  const tplId = tplNum(templateId);
  const ui = getTemplateUi(tplId);
  if (invoiceShell) {
    return buildInvoiceMultipageCv(draft, templateId, tplId, ui, { showPhotoEditor });
  }
  const render = RENDERERS[ui.layout] || renderClassic;
  const pages = render(draft, tplId, ui);
  const layoutCls = [
    ui.layout === "estelle" ? "cv-layout-estelle" : "",
    ui.layout === "gallego" ? "cv-layout-gallego" : "",
    ui.layout === "mitchell" ? "cv-layout-mitchell" : "",
    ui.layout === "sanchez" ? "cv-layout-sanchez" : "",
    ui.layout === "alvarado" ? "cv-layout-alvarado" : "",
    ui.layout === "schumacher" ? "cv-layout-schumacher" : "",
    ui.layout === "bands" ? "cv-layout-bands" : "",
    ui.layout === "banner" ? "cv-layout-banner" : "",
    ui.layout === "swiss" ? "cv-layout-swiss cv-swiss-barcelona" : "",
    ui.layout === "academic" ? "cv-academic-melbourne" : "",
  ]
    .filter(Boolean)
    .join(" ");
  const photoBar = showPhotoEditor ? photoEditorBar(draft, ui) : "";
  return `<article id="resume-print-root" class="resume-preview-article cv-document cv-desktop-layout cv-tpl-${tplId} ${ui.fontClass || ""} ${layoutCls} ${articlePhotoClass(draft)} mx-auto max-w-[210mm] text-zinc-900 antialiased" data-cv-template="${tplId}" data-invoice-shell="0">${photoBar}${pages}</article>`;
}

export function readEditableMultipageDraft(root, templateId) {
  const get = (sel) => root.querySelector(sel)?.value ?? "";
  const readLinks = readLinksFromRoot(root);
  const links = readLinks ?? [];
  const expWraps = [...root.querySelectorAll("[data-exp-job]")].sort(
    (a, b) => Number(a.getAttribute("data-exp-job")) - Number(b.getAttribute("data-exp-job")),
  );
  const experience = expWraps.map((w) => {
    const desc = w.querySelector('[data-exp-f="desc"]')?.value ?? "";
    const bulletsFromInputs = [...w.querySelectorAll("[data-bullet]")].map((inp) => inp.value ?? "");
    const bullets = desc.trim()
      ? [desc, ...bulletsFromInputs.slice(1)]
      : bulletsFromInputs;
    return {
      role: w.querySelector('[data-exp-f="role"]')?.value ?? "",
      company: w.querySelector('[data-exp-f="company"]')?.value ?? "",
      start: w.querySelector('[data-exp-f="start"]')?.value ?? "",
      end: w.querySelector('[data-exp-f="end"]')?.value ?? "",
      bullets,
    };
  });
  const projWraps = [...root.querySelectorAll("[data-proj-row]")].sort(
    (a, b) => Number(a.getAttribute("data-proj-row")) - Number(b.getAttribute("data-proj-row")),
  );
  const projects = projWraps.map((w) => ({
    name: w.querySelector('[data-proj-f="name"]')?.value ?? "",
    context: w.querySelector('[data-proj-f="context"]')?.value ?? "",
    start: w.querySelector('[data-proj-f="start"]')?.value ?? "",
    end: w.querySelector('[data-proj-f="end"]')?.value ?? "",
    bullets: [...w.querySelectorAll("[data-proj-bullet]")].map((inp) => inp.value ?? ""),
  }));
  const eduWraps = [...root.querySelectorAll("[data-edu-job]")].sort(
    (a, b) => Number(a.getAttribute("data-edu-job")) - Number(b.getAttribute("data-edu-job")),
  );
  const education = eduWraps.map((w) => ({
    school: w.querySelector('[data-edu-f="school"]')?.value ?? "",
    degree: w.querySelector('[data-edu-f="degree"]')?.value ?? "",
    start: w.querySelector('[data-edu-f="start"]')?.value ?? "",
    end: w.querySelector('[data-edu-f="end"]')?.value ?? "",
    notes: w.querySelector('[data-edu-f="notes"]')?.value ?? "",
    bullets: [...w.querySelectorAll("[data-edu-bullet]")].map((inp) => inp.value ?? ""),
  }));
  const refWraps = [...root.querySelectorAll("[data-ref-row]")].sort(
    (a, b) => Number(a.getAttribute("data-ref-row")) - Number(b.getAttribute("data-ref-row")),
  );
  const references = refWraps.map((w) => ({
    name: w.querySelector('[data-ref-f="name"]')?.value ?? "",
    title: w.querySelector('[data-ref-f="title"]')?.value ?? "",
    phone: w.querySelector('[data-ref-f="phone"]')?.value ?? "",
    email: w.querySelector('[data-ref-f="email"]')?.value ?? "",
  }));

  const fb = defaultResumeDraft();
  return normalizeResumeDraft({
    templateId,
    fullName: get('[data-f="fullName"]'),
    title: get('[data-f="title"]'),
    email: get('[data-f="email"]'),
    phone: get('[data-f="phone"]'),
    location: get('[data-f="location"]'),
    showPhoto: root.querySelector('[data-f="showPhoto"]')?.checked ?? false,
    photoUrl: get('[data-f="photoUrl"]'),
    summary: get('[data-f="summary"]'),
    skills: get('[data-f="skills"]'),
    certifications: get('[data-f="certifications"]'),
    languages: get('[data-f="languages"]'),
    awards: get('[data-f="awards"]'),
    links: links.length ? links : fb.links,
    experience: experience.length ? experience : fb.experience,
    projects: projects.length ? projects : fb.projects,
    education: education.length ? education : fb.education,
    references: references.length ? references : fb.references,
  });
}
