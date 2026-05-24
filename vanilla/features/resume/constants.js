/** Resume V2 — 20 templates aligned to Untitled design.pdf (pages 1–20). */

const PDF_DESIGN_NAMES = [
  "Estelle Classic",
  "Eez Contact Split",
  "Jacqueline Sidebar",
  "Juliana Sales Split",
  "Aaron Creative",
  "Aaron Professional",
  "Estelle Process",
  "Olivia Marketing",
  "Olivia Product",
  "Harper Web Split",
  "Lorna Web Split",
  "Samira Graphic Top",
  "Sebastian PM",
  "Sebastian Accountant",
  "Juliana Social",
  "Harper Marketing",
  "Estelle Content",
  "Rachelle Copywriter",
  "Catrine IT Profile",
  "Catrine IT Timeline",
];

const V2_META = PDF_DESIGN_NAMES.map((name, i) => ({
  name,
  layout: `PDF page ${i + 1} · Canva layout`,
}));

export const RESUME_TEMPLATE_IDS = Object.fromEntries(
  Array.from({ length: 20 }, (_, i) => {
    const n = String(i + 1).padStart(2, "0");
    return [`V2_${i + 1}`, `resume_${n}`];
  }),
);

/** Legacy fluvo IDs map to V2 for saved drafts and old URLs. */
export const LEGACY_FLUVO_IDS = Object.fromEntries(
  Array.from({ length: 20 }, (_, i) => [`resume_fluvo_${i + 1}`, `resume_${String(i + 1).padStart(2, "0")}`]),
);

export const RESUME_TEMPLATES = V2_META.map((t, i) => {
  const n = String(i + 1).padStart(2, "0");
  const id = `resume_${n}`;
  return {
    id,
    label: t.name,
    description: `${t.layout} · 3-page A4`,
    legacyId: `resume_fluvo_${i + 1}`,
  };
});

const KNOWN = new Set([
  ...RESUME_TEMPLATES.map((t) => t.id),
  ...Object.keys(LEGACY_FLUVO_IDS),
]);

export function normalizeTemplateId(templateId) {
  const id = String(templateId || "");
  if (LEGACY_FLUVO_IDS[id]) return LEGACY_FLUVO_IDS[id];
  const fluvo = /^resume_fluvo_(\d+)$/.exec(id);
  if (fluvo) return `resume_${fluvo[1].padStart(2, "0")}`;
  const v2 = /^resume_(\d{1,2})$/.exec(id);
  if (v2) {
    const n = Number(v2[1]);
    if (n >= 1 && n <= 20) return `resume_${String(n).padStart(2, "0")}`;
  }
  return id;
}

export function isKnownResumeTemplateId(id) {
  return typeof id === "string" && KNOWN.has(normalizeTemplateId(id));
}

export function resumeTemplateEditableVariant(templateId) {
  const id = normalizeTemplateId(templateId);
  const m = /^resume_(\d{2})$/.exec(id);
  return m ? `v2_${m[1]}` : "v2_01";
}

export const DEFAULT_RESUME_TEMPLATE_ID = RESUME_TEMPLATE_IDS.V2_1;
