import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderResumeStaticHTML } from "../lib/render-resume-static.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function assertStatic(html, label) {
  if (!html.includes('id="resume-print-root"')) {
    console.error(`FAIL [${label}]: missing #resume-print-root`);
    process.exit(1);
  }
  if (html.includes("<input")) {
    console.error(`FAIL [${label}]: static HTML should not contain inputs`);
    process.exit(1);
  }
  const pages = (html.match(/class="cv-page/g) || []).length;
  if (pages < 3) {
    console.error(`FAIL [${label}]: expected 3 cv-page sections, got ${pages}`);
    process.exit(1);
  }
}

const cases = [
  { file: "resume-sample.json", templateId: "resume_01", needle: "Alex Morgan" },
  { file: "resume-long.json", templateId: "resume_09", needle: "Alexandra" },
];

for (const { file, templateId, needle } of cases) {
  const fixture = JSON.parse(
    await readFile(path.join(__dirname, "../fixtures/pdf", file), "utf8"),
  );
  const html = await renderResumeStaticHTML(templateId, fixture, { baseUrl: "http://localhost:3000" });
  if (!html.includes(needle)) {
    console.error(`FAIL [${file}]: missing content "${needle}"`);
    process.exit(1);
  }
  assertStatic(html, file);
  console.log(`OK [${file}]`, templateId, html.length, "bytes");
}
