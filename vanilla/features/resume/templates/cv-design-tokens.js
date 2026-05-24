/**
 * Print-first CV design system — single source for spacing & typography classes.
 * @see PROMPT.md quality gates
 */

/** rem spacing scale (do not mix arbitrary px for vertical rhythm) */
export const CV_SPACE = {
  section: "mb-[1.75rem] last:mb-0",
  block: "mb-[1.25rem]",
  item: "mb-[1rem] pb-[1rem] last:mb-0 last:border-0 last:pb-0",
  gridDate: "grid grid-cols-[7rem_minmax(0,1fr)] gap-x-[1.25rem] gap-y-1.5",
};

export const CV_COLOR = {
  textPrimary: "#18181b",
  textSecondary: "#52525b",
  textTertiary: "#a1a1aa",
  surface: "#ffffff",
  borderMuted: "#e4e4e7",
  borderStrong: "#a1a1aa",
};

/** Section icon: 14px SVG */
export const CV_ICON = "h-3.5 w-3.5 shrink-0";

/** Photo frame sizes (px via Tailwind) */
export const PHOTO_SIZE = {
  sidebar: "h-20 w-20",
  header: "h-[4.5rem] w-[4.5rem]",
  headerSm: "h-16 w-16",
  serif: "h-16 w-16",
};

/** Templates with photo on by default */
export const PHOTO_DEFAULT_IDS = new Set([2, 4, 7, 10, 14, 18, 20]);

/** Cambridge (12) + Vienna (19) page padding */
export const FORMAL_PAGE_PADDING = "cv-page-padding-formal";

export function photoSizeClass(ui, { context = "header" } = {}) {
  const layout = ui.layout || "classic";
  if (context === "sidebar" || layout === "sidebar-left" || layout === "sidebar-right") {
    return PHOTO_SIZE.sidebar;
  }
  if (ui.header === "serif" || layout === "serif") return PHOTO_SIZE.serif;
  if (ui.header === "compact" || layout === "swiss") return PHOTO_SIZE.headerSm;
  if (ui.header === "ribbon" || ui.header === "banner") return PHOTO_SIZE.headerSm;
  return PHOTO_SIZE.header;
}

export function pagePaddingClass(tplId) {
  const n = Number(tplId) || 1;
  return n === 12 || n === 19 ? FORMAL_PAGE_PADDING : "";
}
