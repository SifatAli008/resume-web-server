/** @deprecated Use renderResumeStaticHTML (Resume V2 SSR). */
export const RENDERERS = Object.fromEntries(
  Array.from({ length: 20 }, (_, i) => {
    const id = `resume_${String(i + 1).padStart(2, "0")}`;
    return [id, () => null];
  }),
);

export function renderResumeHtml() {
  throw new Error("Use renderResumeStaticHTML (Resume V2) instead of renderResumeHtml");
}
