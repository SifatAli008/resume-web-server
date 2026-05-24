import { renderToStaticMarkup } from "react-dom/server";
import { draftToResumeData, mergeWithSample } from "./draft-mapper.js";
import { ResumeDocument } from "./ResumeDocument.js";

export function renderResumeV2Markup(
  rawDraft: Record<string, unknown>,
  options: { editable?: boolean; invoiceShell?: boolean; useSampleFill?: boolean } = {},
) {
  let data = draftToResumeData(rawDraft);
  if (options.useSampleFill !== false) {
    data = mergeWithSample(data);
  }
  return renderToStaticMarkup(
    <ResumeDocument data={data} editable={options.editable} invoiceShell={options.invoiceShell} />,
  );
}

export function renderResumeV2Pages(rawDraft: Record<string, unknown>, options = {}) {
  const inner = renderResumeV2Markup(rawDraft, { ...options, useSampleFill: true });
  return inner;
}
