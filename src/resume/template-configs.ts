import { PDF_DESIGN_NAMES, PDF_LAYOUT_BY_TEMPLATE } from "./pdf-design-map.js";
import type { TemplateConfig } from "./types.js";

/** Per-template styling (PDF structure comes from pdf-layouts). */
const STYLE: Omit<TemplateConfig, "id" | "name" | "layout">[] = [
  { tplClass: "cv-tpl-01", formalPadding: false, photoDefault: false, photoShape: "round", photoSize: "md", sectionTitle: "minimal", skills: "plain-row" },
  { tplClass: "cv-tpl-02", formalPadding: false, photoDefault: true, photoShape: "round", photoSize: "md", sectionTitle: "ruled", skills: "pills" },
  { tplClass: "cv-tpl-03", formalPadding: false, photoDefault: false, photoShape: "round", photoSize: "md", sectionTitle: "minimal", skills: "outline" },
  { tplClass: "cv-tpl-04", formalPadding: false, photoDefault: true, photoShape: "sq", photoSize: "lg", sectionTitle: "boxed", skills: "grid-2col" },
  { tplClass: "cv-tpl-05", formalPadding: false, photoDefault: false, photoShape: "round", photoSize: "md", sectionTitle: "ruled", skills: "progress-bars" },
  { tplClass: "cv-tpl-06", formalPadding: false, photoDefault: false, photoShape: "round", photoSize: "md", sectionTitle: "band", skills: "card-tiles" },
  { tplClass: "cv-tpl-07", formalPadding: false, photoDefault: true, photoShape: "rounded-sm", photoSize: "md", sectionTitle: "double", skills: "pills-dark" },
  { tplClass: "cv-tpl-08", formalPadding: false, photoDefault: true, photoShape: "sq", photoSize: "md", sectionTitle: "band", skills: "tags-band" },
  { tplClass: "cv-tpl-09", formalPadding: false, photoDefault: false, photoShape: "round", photoSize: "md", sectionTitle: "minimal", skills: "dot-scale" },
  { tplClass: "cv-tpl-10", formalPadding: false, photoDefault: true, photoShape: "round", photoSize: "lg", sectionTitle: "ruled", skills: "sky-chips" },
  { tplClass: "cv-tpl-11", formalPadding: false, photoDefault: false, photoShape: "round", photoSize: "md", sectionTitle: "boxed", skills: "academic-list" },
  { tplClass: "cv-tpl-12", formalPadding: true, photoDefault: false, photoShape: "sq", photoSize: "md", sectionTitle: "double", skills: "serif-blocks" },
  { tplClass: "cv-tpl-13", formalPadding: false, photoDefault: false, photoShape: "round", photoSize: "md", sectionTitle: "ruled", skills: "rose-tiles" },
  { tplClass: "cv-tpl-14", formalPadding: false, photoDefault: true, photoShape: "round", photoSize: "sm", sectionTitle: "band", skills: "compact-dark" },
  { tplClass: "cv-tpl-15", formalPadding: false, photoDefault: false, photoShape: "round", photoSize: "md", sectionTitle: "minimal", skills: "cyan-stack" },
  { tplClass: "cv-tpl-16", formalPadding: false, photoDefault: false, photoShape: "round", photoSize: "md", sectionTitle: "ruled", skills: "swiss-dense" },
  { tplClass: "cv-tpl-17", formalPadding: false, photoDefault: true, photoShape: "sq", photoSize: "md", sectionTitle: "boxed", skills: "slate-list" },
  { tplClass: "cv-tpl-18", formalPadding: false, photoDefault: true, photoShape: "rounded-sm", photoSize: "md", sectionTitle: "band", skills: "mag-cols" },
  { tplClass: "cv-tpl-19", formalPadding: true, photoDefault: false, photoShape: "sq", photoSize: "md", sectionTitle: "double", skills: "underline" },
  { tplClass: "cv-tpl-20", formalPadding: false, photoDefault: true, photoShape: "sq", photoSize: "sm", sectionTitle: "minimal", skills: "grad-dark" },
];

export const TEMPLATE_CONFIGS: TemplateConfig[] = PDF_DESIGN_NAMES.map((name, i) => {
  const n = String(i + 1).padStart(2, "0");
  const id = `resume_${n}`;
  return {
    id,
    name,
    layout: PDF_LAYOUT_BY_TEMPLATE[id]!,
    ...STYLE[i]!,
  };
});

export const TEMPLATE_BY_ID = Object.fromEntries(TEMPLATE_CONFIGS.map((c) => [c.id, c]));

export function templateIndex(id: string): number {
  const m = /^resume_(\d{2})$/.exec(id);
  return m ? Number(m[1]) : 1;
}

export function isResumeV2Id(id: string): boolean {
  return id in TEMPLATE_BY_ID;
}
