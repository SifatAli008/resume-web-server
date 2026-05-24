/**
 * Maps resume_01…resume_20 → exact layout structure from Untitled design.pdf (20 pages).
 */
export const PDF_DESIGN_NAMES = [
  "Estelle Classic", // 1 UX Designer
  "Eez Contact Split", // 2 Mechatronics — contact stack left
  "Jacqueline Sidebar", // 3 Marketing executive
  "Juliana Sales Split", // 4 Sales — about left
  "Aaron Creative", // 5 Graphic designer
  "Aaron Professional", // 6 Centered professional
  "Estelle Process", // 7 Process engineer classic
  "Olivia Marketing", // 8 Marketing manager sidebar
  "Olivia Product", // 9 Product designer sidebar
  "Harper Web Split", // 10 Web developer split
  "Lorna Web Split", // 11 Web developer variant
  "Samira Graphic Top", // 12 Graphic designer top blocks
  "Sebastian PM", // 13 Project manager classic
  "Sebastian Accountant", // 14 Hero name accountant
  "Juliana Social", // 15 Social coordinator
  "Harper Marketing", // 16 Marketing manager header
  "Estelle Content", // 17 Content creator vertical name
  "Rachelle Copywriter", // 18 Brand strategist two-col
  "Catrine IT Profile", // 19 IT project manager
  "Catrine IT Timeline", // 20 IT PM timeline accent
] as const;

export type PdfLayoutId =
  | "pdf-01-classic"
  | "pdf-02-contact-left"
  | "pdf-03-sidebar-contact"
  | "pdf-04-about-left"
  | "pdf-05-creative-name"
  | "pdf-06-centered-pro"
  | "pdf-07-classic-process"
  | "pdf-08-sidebar-about"
  | "pdf-09-sidebar-product"
  | "pdf-10-web-split"
  | "pdf-11-web-split-alt"
  | "pdf-12-graphic-top"
  | "pdf-13-classic-pm"
  | "pdf-14-hero-accountant"
  | "pdf-15-social-achieve"
  | "pdf-16-marketing-header"
  | "pdf-17-vertical-name"
  | "pdf-18-copywriter-cols"
  | "pdf-19-it-profile"
  | "pdf-20-it-timeline";

export const PDF_LAYOUT_BY_TEMPLATE: Record<string, PdfLayoutId> = {
  resume_01: "pdf-01-classic",
  resume_02: "pdf-02-contact-left",
  resume_03: "pdf-03-sidebar-contact",
  resume_04: "pdf-04-about-left",
  resume_05: "pdf-05-creative-name",
  resume_06: "pdf-06-centered-pro",
  resume_07: "pdf-07-classic-process",
  resume_08: "pdf-08-sidebar-about",
  resume_09: "pdf-09-sidebar-product",
  resume_10: "pdf-10-web-split",
  resume_11: "pdf-11-web-split-alt",
  resume_12: "pdf-12-graphic-top",
  resume_13: "pdf-13-classic-pm",
  resume_14: "pdf-14-hero-accountant",
  resume_15: "pdf-15-social-achieve",
  resume_16: "pdf-16-marketing-header",
  resume_17: "pdf-17-vertical-name",
  resume_18: "pdf-18-copywriter-cols",
  resume_19: "pdf-19-it-profile",
  resume_20: "pdf-20-it-timeline",
};
