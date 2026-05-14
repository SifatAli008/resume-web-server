const FLUVO_NAMES = [
  "Executive — ruled header, date-aligned experience, skill tags",
  "Cascade — dark rail, contact, skill proficiency bars",
  "Split gold — summary + experience | strengths column",
  "Classic indigo accent",
  "Classic violet accent",
  "Split purple executive column",
  "Emerald sidebar rail",
  "Engineering bands — green section headers",
  "Bold banner — contact strip + two-column body",
  "Navy rail — main + deep blue skills column",
  "Lavender split — profile + violet skills rail",
  "Formal serif — centered traditional layout",
  "Classic rose accent",
  "Slate sidebar rail",
  "Split cyan strengths column",
  "Classic orange accent",
  "Classic teal accent",
  "Split fuchsia strengths column",
  "Formal neutral serif",
  "Classic purple accent",
  "Rosewood sidebar rail",
];

export const RESUME_TEMPLATE_IDS = Object.fromEntries(
  Array.from({ length: 20 }, (_, i) => [`FLUVO_${i + 1}`, `resume_fluvo_${i + 1}`]),
);

export const RESUME_TEMPLATES = Array.from({ length: 20 }, (_, i) => ({
  id: `resume_fluvo_${i + 1}`,
  label: `Fluvo ${i + 1}`,
  description: FLUVO_NAMES[i] || `Template ${i + 1}`,
}));

const KNOWN = new Set(RESUME_TEMPLATES.map((t) => t.id));

export function isKnownResumeTemplateId(id) {
  return typeof id === "string" && KNOWN.has(id);
}

/** Which WYSIWYG chrome to use while editing (maps all 20 Fluvo ids). */
export function resumeTemplateEditableVariant(templateId) {
  const m = /^resume_fluvo_(\d+)$/.exec(String(templateId || ""));
  const n = m ? Number(m[1]) : 1;
  if ([2, 7, 14, 20].includes(n)) return "sidebar";
  if ([3, 6, 15, 18].includes(n)) return "split";
  if (n === 8) return "bands";
  if (n === 9) return "banner";
  if (n === 10) return "navy";
  if (n === 11) return "lavender";
  if ([12, 19].includes(n)) return "classicSerif";
  return "classic";
}

export const DEFAULT_RESUME_TEMPLATE_ID = RESUME_TEMPLATE_IDS.FLUVO_1;
