/** Shared input / button classes for editable CV (print-safe, design-system aligned). */
export const SCROLL = "resize-none [field-sizing:content] scrollbar-none overflow-y-auto";

export const EIN =
  "w-full border-0 border-b border-transparent bg-transparent px-0 py-0.5 outline-none ring-0 text-[14px] leading-[1.45] text-[#18181b] placeholder:text-[#a1a1aa] focus:border-[#e4e4e7] focus:bg-zinc-50/40 print:border-0 print:bg-transparent";

export const EIN_DARK =
  "w-full border-0 border-b border-transparent bg-transparent px-0 py-0.5 outline-none ring-0 text-[14px] leading-[1.45] text-zinc-100 placeholder:text-zinc-500 focus:border-white/30 focus:bg-white/5 print:border-0 print:bg-transparent";

/** name: 1.75rem · weight 800 · tracking -0.025em */
export const CV_NAME = "cv-name-emphasis";

export const EIN_H1 = `${EIN} ${CV_NAME} text-[1.75rem] font-extrabold leading-tight tracking-[-0.025em] text-[#18181b]`;

export const EIN_NAME_SIDEBAR = `${EIN_DARK} ${CV_NAME} text-[1.75rem] font-extrabold leading-tight tracking-[-0.025em]`;

export const EIN_NAME_RIBBON = `${EIN} ${CV_NAME} text-[1.75rem] font-extrabold leading-tight tracking-[-0.025em] text-white placeholder:text-white/50`;

/** title/role: 0.95rem · weight 400 · tracking 0.01em · muted */
export const EIN_TITLE = `${EIN} text-[0.95rem] font-normal tracking-[0.01em] text-[#52525b]`;

export const EIN_SM = `${EIN} text-[13px] text-[#18181b]`;

export const EIN_DATE = `${EIN_SM} tabular-nums text-[#52525b]`;

export const EIN_TX = `${EIN} ${SCROLL} min-h-[4rem] max-h-[min(20rem,45vh)] w-full print:max-h-none print:overflow-visible`;

export const EIN_TX_DARK = `${EIN_DARK} ${SCROLL} min-h-[3rem] max-h-[min(16rem,40vh)] w-full print:max-h-none print:overflow-visible`;

export const BTN =
  "print:hidden no-print inline-flex items-center gap-1 rounded border border-dashed border-zinc-400 px-2 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-50";

export const RM = "print:hidden no-print text-xs text-red-700 hover:text-red-900";
