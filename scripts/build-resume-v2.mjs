import * as esbuild from "esbuild";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outDir = path.join(root, "vanilla", "dist");

const PALETTES = {
  slate: ["#fafafa", "#f4f4f5", "#e4e4e7", "#a1a1aa", "#71717a", "#52525b", "#3f3f46", "#27272a"],
  blue: ["#eff6ff", "#dbeafe", "#bfdbfe", "#93c5fd", "#60a5fa", "#3b82f6", "#2563eb", "#1e3a8a"],
  emerald: ["#ecfdf5", "#d1fae5", "#a7f3d0", "#6ee7b7", "#34d399", "#10b981", "#059669", "#064e3b"],
  amber: ["#fffbeb", "#fef3c7", "#fde68a", "#fcd34d", "#fbbf24", "#f59e0b", "#d97706", "#78350f"],
  indigo: ["#eef2ff", "#e0e7ff", "#c7d2fe", "#a5b4fc", "#818cf8", "#6366f1", "#4f46e5", "#312e81"],
  violet: ["#f5f3ff", "#ede9fe", "#ddd6fe", "#c4b5fd", "#a78bfa", "#8b5cf6", "#7c3aed", "#4c1d95"],
  purple: ["#faf5ff", "#f3e8ff", "#e9d5ff", "#d8b4fe", "#c084fc", "#a855f7", "#9333ea", "#581c87"],
  teal: ["#f0fdfa", "#ccfbf1", "#99f6e4", "#5eead4", "#2dd4bf", "#14b8a6", "#0d9488", "#134e4a"],
  orange: ["#fff7ed", "#ffedd5", "#fed7aa", "#fdba74", "#fb923c", "#f97316", "#ea580c", "#7c2d12"],
  rose: ["#fff1f2", "#ffe4e6", "#fecdd3", "#fda4af", "#fb7185", "#f43f5e", "#e11d48", "#881337"],
  cyan: ["#ecfeff", "#cffafe", "#a5f3fc", "#67e8f9", "#22d3ee", "#06b6d4", "#0891b2", "#164e63"],
  fuchsia: ["#fdf4ff", "#fae8ff", "#f5d0fe", "#f0abfc", "#e879f9", "#d946ef", "#c026d3", "#701a75"],
  sky: ["#f0f9ff", "#e0f2fe", "#bae6fd", "#7dd3fc", "#38bdf8", "#0ea5e9", "#0284c7", "#0c4a6e"],
};

const TPL_PALETTE = [
  "slate",
  "blue",
  "slate",
  "indigo",
  "violet",
  "purple",
  "teal",
  "emerald",
  "slate",
  "sky",
  "teal",
  "slate",
  "rose",
  "slate",
  "cyan",
  "orange",
  "slate",
  "fuchsia",
  "slate",
  "rose",
];

function tokenBlock(n, paletteName) {
  const p = PALETTES[paletteName];
  const keys = ["50", "100", "200", "400", "500", "600", "700", "800"];
  const lines = keys.map((k, i) => `  --cv-a${k}: ${p[i]};`);
  return `[data-template="resume_${String(n).padStart(2, "0")}"] {\n${lines.join("\n")}\n  --cv-icon-sec: var(--cv-a600);\n}\n`;
}

async function buildTokensCss() {
  let css = "/* Generated template accent tokens */\n";
  for (let i = 1; i <= 20; i++) {
    css += tokenBlock(i, TPL_PALETTE[i - 1]) + "\n";
  }
  return css;
}

async function concatCss() {
  const dir = path.join(root, "src", "resume", "styles");
  const parts = [
    "base-print.css",
    "template-fonts.css",
    "section-titles.css",
    "skills-variants.css",
    "layouts.css",
    "canva-design.css",
    "screen-preview.css",
  ];
  const tokens = await buildTokensCss();
  let out = tokens + "\n";
  for (const f of parts) {
    out += await readFile(path.join(dir, f), "utf8");
    out += "\n";
  }
  await mkdir(path.join(root, "vanilla", "app"), { recursive: true });
  await writeFile(path.join(root, "vanilla", "app", "resume-v2-print.css"), out);
}

await mkdir(outDir, { recursive: true });

const shared = {
  bundle: true,
  platform: "node",
  format: "esm",
  target: "es2022",
  jsx: "automatic",
  loader: { ".tsx": "tsx", ".ts": "ts" },
  external: [],
};

await esbuild.build({
  ...shared,
  entryPoints: [path.join(root, "src", "resume", "ssr-entry.tsx")],
  outfile: path.join(outDir, "resume-v2-ssr.mjs"),
  packages: "external",
});

await esbuild.build({
  bundle: true,
  platform: "browser",
  format: "esm",
  target: "es2022",
  jsx: "automatic",
  loader: { ".tsx": "tsx", ".ts": "ts" },
  entryPoints: [path.join(root, "src", "resume", "builder-entry.tsx")],
  outfile: path.join(outDir, "resume-v2-client.mjs"),
});

await concatCss();
console.log("OK resume-v2: vanilla/dist/resume-v2-ssr.mjs, resume-v2-client.mjs, app/resume-v2-print.css");
