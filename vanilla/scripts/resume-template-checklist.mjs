/**
 * PROMPT.md §9 — automated registry + static render checks for all 20 templates.
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { TEMPLATE_TOKENS } from "../features/resume/templates/cv-template-tokens.js";
import { getTemplateUi } from "../features/resume/templates/cv-template-ui.js";
import { RENDERERS } from "../features/resume/resume-template-renderer.js";
import { renderResumeStaticHTML } from "../lib/render-resume-static.js";
import { buildEditableMultipageCv } from "../features/resume/templates/cv-editable-multipage.js";
import { encodeResumeDraftBase64Url, decodeResumeDraftBase64Url } from "../features/resume/draft-url.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const sample = JSON.parse(await readFile(path.join(root, "fixtures/pdf/resume-sample.json"), "utf8"));

const css = await readFile(path.join(root, "app/resume-print.css"), "utf8");

let failed = 0;

function fail(msg) {
  console.error("FAIL:", msg);
  failed++;
}

function ok(msg) {
  console.log("OK:", msg);
}

for (let n = 1; n <= 20; n++) {
  const id = `resume_fluvo_${n}`;
  if (!TEMPLATE_TOKENS[n]?.fontClass) fail(`${id}: missing TEMPLATE_TOKENS`);
  const ui = getTemplateUi(n);
  if (!ui.layout) fail(`${id}: missing LAYOUT`);
  if (!RENDERERS[id]) fail(`${id}: missing resume-template-renderer entry`);
  if (!css.includes(`.cv-tpl-${n}`)) fail(`${id}: missing .cv-tpl-${n} in resume-print.css`);
  if (!css.includes(ui.fontClass)) fail(`${id}: missing ${ui.fontClass} in resume-print.css`);

  const draft = { ...sample, templateId: id };
  const html = renderResumeStaticHTML(id, draft, { baseUrl: "http://localhost:3000" });
  if (!html.includes('id="resume-print-root"')) fail(`${id}: no #resume-print-root`);
  if (html.includes("<input")) fail(`${id}: static HTML contains inputs`);
  const pages = (html.match(/class="cv-page /g) || []).length;
  if (pages < 3) fail(`${id}: expected 3 pages, got ${pages}`);

  const inv = buildEditableMultipageCv(draft, id, { invoiceShell: true });
  if (!inv.includes('data-invoice-shell="1"')) fail(`${id}: invoice shell flag missing`);
  const hasMeta =
    inv.includes("cv-meta-row") || inv.includes("cv-banner-strip") || inv.includes("cv-doc-title");
  if (!hasMeta) fail(`${id}: invoice header zone missing`);
  if (!inv.includes("cv-exp-table")) fail(`${id}: invoice experience table missing`);

  const editable = buildEditableMultipageCv(draft, id, { invoiceShell: false });
  if (!editable.includes("grid-cols-[7rem")) fail(`${id}: date grid must use 7rem column`);
  if (!editable.includes("cv-name-emphasis")) fail(`${id}: missing cv-name-emphasis typography`);
}

if (css.includes("transition:") && !css.includes("transition: none")) {
  fail("resume-print.css: disallowed transition rules on CV (use transition: none only)");
}
if (!css.includes("animation: none")) fail("resume-print.css: missing animation: none guard");
if (!css.includes(".cv-page-padding-formal")) fail("resume-print.css: missing formal page padding class");

const zurich = buildEditableMultipageCv({ ...sample, templateId: "resume_fluvo_3" }, "resume_fluvo_3", {
  invoiceShell: false,
});
if (!zurich.includes("cv-header-compact")) fail("resume_fluvo_3: missing compact header");
if (!zurich.includes('class="min-w-0 p-5 sm:p-6 print:p-5"')) fail("resume_fluvo_3: split main column missing padding");
if (!zurich.includes("cv-rail-zurich")) fail("resume_fluvo_3: missing amber rail class");

const roundtrip = { ...sample, templateId: "resume_fluvo_1" };
const enc = encodeResumeDraftBase64Url(roundtrip);
const dec = decodeResumeDraftBase64Url(enc);
if (dec?.fullName !== sample.fullName) fail("draft base64url roundtrip");

if (failed) {
  console.error(`\n${failed} check(s) failed`);
  process.exit(1);
}

ok(`all 20 templates + draft URL roundtrip`);
