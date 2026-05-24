import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { preloadSsr } from "../lib/render-resume-v2-static.js";
import { renderResumeStaticHTML } from "../lib/render-resume-static.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sample = JSON.parse(
  await readFile(path.join(__dirname, "../fixtures/pdf/resume-sample.json"), "utf8"),
);

await preloadSsr();

let failed = 0;
function fail(msg) {
  console.error("FAIL:", msg);
  failed++;
}

for (let n = 1; n <= 20; n++) {
  const id = `resume_${String(n).padStart(2, "0")}`;
  const html = await renderResumeStaticHTML(id, { ...sample, templateId: id }, {
    baseUrl: "http://localhost:3000",
  });
  if (!html.includes('id="resume-print-root"')) fail(`${id}: missing root`);
  if (html.includes("<input")) fail(`${id}: static has inputs`);
  const pages = (html.match(/class="cv-page/g) || []).length;
  if (pages < 3) fail(`${id}: expected 3 pages, got ${pages}`);
  if (!html.includes("cv-v2")) fail(`${id}: missing cv-v2 class`);
  if (!html.includes(`data-template="${id}"`)) fail(`${id}: missing data-template`);
}

if (failed) process.exit(1);
console.log("OK: all 20 Resume V2 templates render (static SSR)");
