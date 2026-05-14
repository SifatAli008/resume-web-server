import { DEFAULT_RESUME_TEMPLATE_ID, isKnownResumeTemplateId } from "./constants.js";
import { renderResumeHtml } from "./resume-template-renderer.js";

export function renderResumePreviewHtml(draft) {
  const tid = isKnownResumeTemplateId(draft?.templateId) ? draft.templateId : DEFAULT_RESUME_TEMPLATE_ID;
  return renderResumeHtml(tid, draft);
}
