import { CV_THEMES } from "./templates/cv-multipage-core.js";

export const RESUME_TEMPLATE_IDS = Object.fromEntries(
  Array.from({ length: 20 }, (_, i) => [`FLUVO_${i + 1}`, `resume_fluvo_${i + 1}`]),
);

export const RESUME_TEMPLATES = Array.from({ length: 20 }, (_, i) => {
  const n = i + 1;
  const t = CV_THEMES[n];
  return {
    id: `resume_fluvo_${n}`,
    label: `Fluvo ${n} — ${t?.name || "CV"}`,
    description: templateDescription(n, t),
  };
});

function templateDescription(n, t) {
  const layouts = {
    classic: "Single-column international CV · 3 A4 pages",
    "sidebar-left": "Dark left rail · contact & skills · 3 pages",
    "sidebar-right": "Navy right rail · narrative main · 3 pages",
    "split-right": "Split layout · strengths rail · 3 pages",
    ribbon: "Ribbon header · serif academic · 3 pages",
    bands: "Horizontal section bands · engineering · 3 pages",
    banner: "Contact banner strip · executive · 3 pages",
    serif: "Centered formal serif · university · 3 pages",
    swiss: "Swiss grid · minimal hierarchy · 3 pages",
    magazine: "Magazine columns · creative · 3 pages",
    timeline: "Timeline accent · modern · 3 pages",
    academic: "Academic boxed sections · research · 3 pages",
  };
  const layout = layouts[t?.layout] || "3-page A4 CV";
  return `${layout} · ${t?.accent || "blue"} accent`;
}

const KNOWN = new Set(RESUME_TEMPLATES.map((t) => t.id));

export function isKnownResumeTemplateId(id) {
  return typeof id === "string" && KNOWN.has(id);
}

/** One editable multipage form per template (unique theme CSS). */
export function resumeTemplateEditableVariant(templateId) {
  const m = /^resume_fluvo_(\d+)$/.exec(String(templateId || ""));
  return m ? `fluvo_${m[1]}` : "fluvo_1";
}

export const DEFAULT_RESUME_TEMPLATE_ID = RESUME_TEMPLATE_IDS.FLUVO_1;
