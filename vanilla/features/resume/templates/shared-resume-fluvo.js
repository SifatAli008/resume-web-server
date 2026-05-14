import {
  renderLayoutBannerSplitPro,
  renderLayoutClassicPro,
  renderLayoutFormalSerifPro,
  renderLayoutGreenBarsPro,
  renderLayoutLavenderSidebarPro,
  renderLayoutNavyRailPro,
  renderLayoutSidebarPro,
  renderLayoutSplitPro,
} from "./resume-professional-parts.js";

/** `resume_fluvo_4` … `resume_fluvo_20`: distinct industry layouts & accents. */
const FLUVO_4_20 = [
  (d) => renderLayoutClassicPro(d, "indigo"),
  (d) => renderLayoutClassicPro(d, "violet"),
  (d) => renderLayoutSplitPro(d, "purple"),
  (d) =>
    renderLayoutSidebarPro(d, {
      sidebarBg: "bg-emerald-950",
      accent: "teal",
      rail: "border-emerald-800",
    }),
  (d) => renderLayoutGreenBarsPro(d),
  (d) => renderLayoutBannerSplitPro(d),
  (d) => renderLayoutNavyRailPro(d),
  (d) => renderLayoutLavenderSidebarPro(d),
  (d) => renderLayoutFormalSerifPro(d, "slate"),
  (d) => renderLayoutClassicPro(d, "rose"),
  (d) =>
    renderLayoutSidebarPro(d, {
      sidebarBg: "bg-slate-950",
      accent: "sky",
      rail: "border-slate-800",
    }),
  (d) => renderLayoutSplitPro(d, "cyan"),
  (d) => renderLayoutClassicPro(d, "orange"),
  (d) => renderLayoutClassicPro(d, "teal"),
  (d) => renderLayoutSplitPro(d, "fuchsia"),
  (d) => renderLayoutFormalSerifPro(d, "neutral"),
  (d) => renderLayoutClassicPro(d, "purple"),
  (d) =>
    renderLayoutSidebarPro(d, {
      sidebarBg: "bg-rose-950",
      accent: "rose",
      rail: "border-rose-900",
    }),
];

export function renderResumeFluvoThemed(draft, n) {
  const fn = FLUVO_4_20[n - 4];
  return fn ? fn(draft) : renderLayoutClassicPro(draft, "blue");
}
