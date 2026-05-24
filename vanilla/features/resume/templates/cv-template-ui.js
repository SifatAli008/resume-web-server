import { templateWantsPhotoByDefault } from "./cv-defaults.js";
import { SECTION_ICON_BY_TITLE, TEMPLATE_TOKENS } from "./cv-template-tokens.js";

const LAYOUT = {
  1: { name: "Estelle", layout: "estelle", header: "estelle", section: "estelle" },
  2: { name: "Gallego", layout: "gallego", header: "gallego", section: "gallego" },
  3: { name: "Mitchell", layout: "mitchell", header: "mitchell", section: "mitchell" },
  4: { name: "Sanchez", layout: "sanchez", header: "sanchez", section: "sanchez" },
  5: { name: "Sanchez Black", layout: "sanchez", header: "sanchez", section: "sanchez" },
  6: { name: "Alvarado", layout: "alvarado", header: "alvarado", section: "alvarado" },
  7: { name: "Schumacher", layout: "schumacher", header: "schumacher", section: "schumacher" },
  8: { name: "Berlin", layout: "bands", header: "standard", section: "band" },
  9: { name: "Manhattan", layout: "banner", header: "banner", section: "ruled" },
  10: { name: "Sydney", layout: "sidebar-right", header: "sidebar", section: "minimal" },
  11: { name: "Montreal", layout: "split-right", header: "compact", section: "ruled" },
  12: { name: "Cambridge", layout: "serif", header: "serif", section: "double" },
  13: { name: "Milan", layout: "classic", header: "standard", section: "boxed" },
  14: { name: "Stockholm", layout: "sidebar-left", header: "sidebar", section: "minimal" },
  15: { name: "Toronto", layout: "split-right", header: "compact", section: "ruled" },
  16: { name: "Barcelona", layout: "swiss", header: "compact", section: "minimal" },
  17: { name: "Melbourne", layout: "academic", header: "standard", section: "boxed" },
  18: { name: "Paris", layout: "magazine", header: "ribbon", section: "ruled" },
  19: { name: "Vienna", layout: "serif", header: "serif", section: "double" },
  20: { name: "Lisbon", layout: "sidebar-left", header: "sidebar", section: "band" },
};

function linksZoneFor(layout) {
  if (layout === "sidebar-left" || layout === "sidebar-right") return "sidebar";
  if (layout === "split-right") return "rail";
  return "header";
}

export function getTemplateUi(n) {
  const id = Number(n) || 1;
  const tok = { ...(TEMPLATE_TOKENS[id] || TEMPLATE_TOKENS[1]) };
  const lay = LAYOUT[id] || LAYOUT[1];
  return {
    ...tok,
    ...lay,
    tplId: id,
    photoDefault: templateWantsPhotoByDefault(id),
    linksZone: linksZoneFor(lay.layout),
    skillsStyle: tok.skillsStyle,
  };
}

export function sectionIconFor(title) {
  return SECTION_ICON_BY_TITLE[title] || "list";
}

export { SECTION_ICON_BY_TITLE };
