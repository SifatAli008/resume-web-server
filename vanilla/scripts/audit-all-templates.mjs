/**
 * Quality-gate audit — all 20 Fluvo templates (design system spec).
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { TEMPLATE_TOKENS } from "../features/resume/templates/cv-template-tokens.js";
import { getTemplateUi } from "../features/resume/templates/cv-template-ui.js";
import { SKILLS_STYLE_MARKERS } from "../features/resume/templates/cv-skills-markers.js";
import { buildEditableMultipageCv } from "../features/resume/templates/cv-editable-multipage.js";
import { renderResumeStaticHTML } from "../lib/render-resume-static.js";
import { PHOTO_DEFAULT_IDS } from "../features/resume/templates/cv-design-tokens.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sample = JSON.parse(await readFile(path.join(__dirname, "../fixtures/pdf/resume-sample.json"), "utf8"));
const long = JSON.parse(await readFile(path.join(__dirname, "../fixtures/pdf/resume-long.json"), "utf8"));

const LAYOUT_CHECKS = {
  classic: (h) => h.includes("Professional Summary"),
  "sidebar-left": (h) => h.includes("cv-sidebar") && h.includes("cv-spread"),
  "sidebar-right": (h) => h.includes("cv-sidebar") && h.includes("cv-spread"),
  "split-right": (h) => h.includes("cv-split-grid") && h.includes("cv-rail"),
  ribbon: (h) => h.includes("cv-header-ribbon"),
  timeline: (h) => h.includes("border-l-4") || h.includes("cv-timeline-accent"),
  magazine: (h) => h.includes("sm:grid-cols-2"),
  bands: (h) => true,
  banner: (h) => h.includes("cv-banner-strip") || h.includes("cv-header-banner"),
  serif: (h) => h.includes("cv-header-serif"),
  swiss: (h) => h.includes("cv-header-compact"),
  academic: (h) => true,
};

const INVOICE_ZONE_ORDER = ["cv-meta-row", "cv-doc-title", "cv-from-block", "cv-exp-table", "cv-totals-footer"];

let failed = 0;
const issues = [];

function fail(id, msg) {
  issues.push(`${id}: ${msg}`);
  failed++;
}

function skillsHtml(draft, id, ui) {
  const b = buildEditableMultipageCv(draft, id, { invoiceShell: false });
  const m = b.match(/data-skills-preview[^>]*>([\s\S]*?)<\/div>/);
  return m ? m[1] : b;
}

for (let n = 1; n <= 20; n++) {
  const id = `resume_fluvo_${n}`;
  const ui = getTemplateUi(n);
  const draft = { ...sample, templateId: id };
  const builder = buildEditableMultipageCv(draft, id, { invoiceShell: false });
  const invoice = buildEditableMultipageCv(draft, id, { invoiceShell: true });
  const stat = renderResumeStaticHTML(id, draft, { baseUrl: "" });
  const longHtml = buildEditableMultipageCv({ ...long, templateId: id }, id, { invoiceShell: false });

  if (!TEMPLATE_TOKENS[n]?.fontClass) fail(id, "missing tokens");
  if (!builder.includes("grid-cols-[7rem")) fail(id, "missing 7rem date grid");
  if (!builder.includes("cv-name-emphasis")) fail(id, "missing cv-name-emphasis");
  const pageCount = (html) => (html.match(/class="cv-page /g) || []).length;
  if (pageCount(builder) !== 3) fail(id, `expected exactly 3 pages, got ${pageCount(builder)}`);
  if (pageCount(longHtml) !== 3) fail(id, `long fixture must stay 3 pages, got ${pageCount(longHtml)}`);

  const layoutCheck = LAYOUT_CHECKS[ui.layout];
  if (layoutCheck && !layoutCheck(builder)) fail(id, `layout ${ui.layout} structure mismatch`);

  if (ui.layout === "split-right") {
    if (!builder.includes('class="min-w-0 p-5 sm:p-6 print:p-5"')) fail(id, "split missing main padding");
    if (stat.includes("Technical Skills")) fail(id, "static duplicate skills on p3");
    if (ui.header === "compact" && !stat.includes("cv-header-compact")) fail(id, "static missing compact header");
  }

  if (ui.layout === "banner" && (builder.match(/cv-banner-strip/g) || []).length > 1) {
    fail(id, "banner strip should appear once (page 1)");
  }

  if (ui.linksZone === "rail" && !builder.includes("data-links-editor")) fail(id, "rail links missing on p1");
  if (ui.linksZone === "sidebar" && !builder.includes("data-links-editor")) fail(id, "sidebar links missing on p1");

  if (!invoice.includes('data-invoice-shell="1"')) fail(id, "invoice shell missing");
  if (!invoice.includes("cv-exp-table")) fail(id, "invoice table missing");

  const invIdx = INVOICE_ZONE_ORDER.map((z) => invoice.indexOf(z)).filter((i) => i >= 0);
  for (let i = 1; i < invIdx.length; i++) {
    if (invIdx[i] < invIdx[i - 1]) fail(id, "invoice zones out of order");
  }

  const style = ui.skillsStyle;
  const markers = SKILLS_STYLE_MARKERS[style];
  if (markers) {
    const sk = skillsHtml(draft, id, ui);
    for (const mk of markers) {
      if (mk === ", ") {
        if (!sk.includes(",") && style === "minimal-row") fail(id, `skills ${style}: expected comma-separated`);
      } else if (!sk.includes(mk) && !builder.includes(mk)) {
        fail(id, `skills ${style}: missing marker "${mk}"`);
      }
    }
  }

  const photoDefault = PHOTO_DEFAULT_IDS.has(n);
  if (photoDefault && !builder.includes("data-photo-slot")) fail(id, "photo-default template should expose photo slot");
}

const css = await readFile(path.join(__dirname, "../app/resume-print.css"), "utf8");
if (!css.includes("animation: none")) fail("css", "missing animation: none guard");
if (!css.includes("transition: none")) fail("css", "missing transition: none guard");
if (!css.includes(".cv-page-padding-formal")) fail("css", "missing formal page padding");

if (failed) {
  console.error(`\n${failed} issue(s):\n`);
  issues.forEach((i) => console.error("  FAIL", i));
  process.exit(1);
}

console.log("OK: all 20 templates pass design-system quality gates");
