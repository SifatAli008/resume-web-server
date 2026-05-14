import { DEFAULT_RESUME_TEMPLATE_ID, isKnownResumeTemplateId } from "./constants.js";
import { renderResumeFluvo1Template } from "./templates/resume_fluvo_1/template.js";
import { renderResumeFluvo2Template } from "./templates/resume_fluvo_2/template.js";
import { renderResumeFluvo3Template } from "./templates/resume_fluvo_3/template.js";
import { renderResumeFluvo4Template } from "./templates/resume_fluvo_4/template.js";
import { renderResumeFluvo5Template } from "./templates/resume_fluvo_5/template.js";
import { renderResumeFluvo6Template } from "./templates/resume_fluvo_6/template.js";
import { renderResumeFluvo7Template } from "./templates/resume_fluvo_7/template.js";
import { renderResumeFluvo8Template } from "./templates/resume_fluvo_8/template.js";
import { renderResumeFluvo9Template } from "./templates/resume_fluvo_9/template.js";
import { renderResumeFluvo10Template } from "./templates/resume_fluvo_10/template.js";
import { renderResumeFluvo11Template } from "./templates/resume_fluvo_11/template.js";
import { renderResumeFluvo12Template } from "./templates/resume_fluvo_12/template.js";
import { renderResumeFluvo13Template } from "./templates/resume_fluvo_13/template.js";
import { renderResumeFluvo14Template } from "./templates/resume_fluvo_14/template.js";
import { renderResumeFluvo15Template } from "./templates/resume_fluvo_15/template.js";
import { renderResumeFluvo16Template } from "./templates/resume_fluvo_16/template.js";
import { renderResumeFluvo17Template } from "./templates/resume_fluvo_17/template.js";
import { renderResumeFluvo18Template } from "./templates/resume_fluvo_18/template.js";
import { renderResumeFluvo19Template } from "./templates/resume_fluvo_19/template.js";
import { renderResumeFluvo20Template } from "./templates/resume_fluvo_20/template.js";

const RENDERERS = {
  resume_fluvo_1: renderResumeFluvo1Template,
  resume_fluvo_2: renderResumeFluvo2Template,
  resume_fluvo_3: renderResumeFluvo3Template,
  resume_fluvo_4: renderResumeFluvo4Template,
  resume_fluvo_5: renderResumeFluvo5Template,
  resume_fluvo_6: renderResumeFluvo6Template,
  resume_fluvo_7: renderResumeFluvo7Template,
  resume_fluvo_8: renderResumeFluvo8Template,
  resume_fluvo_9: renderResumeFluvo9Template,
  resume_fluvo_10: renderResumeFluvo10Template,
  resume_fluvo_11: renderResumeFluvo11Template,
  resume_fluvo_12: renderResumeFluvo12Template,
  resume_fluvo_13: renderResumeFluvo13Template,
  resume_fluvo_14: renderResumeFluvo14Template,
  resume_fluvo_15: renderResumeFluvo15Template,
  resume_fluvo_16: renderResumeFluvo16Template,
  resume_fluvo_17: renderResumeFluvo17Template,
  resume_fluvo_18: renderResumeFluvo18Template,
  resume_fluvo_19: renderResumeFluvo19Template,
  resume_fluvo_20: renderResumeFluvo20Template,
};

export function renderResumeHtml(templateId, draft) {
  const id = isKnownResumeTemplateId(templateId) ? templateId : DEFAULT_RESUME_TEMPLATE_ID;
  const fn = RENDERERS[id];
  return fn ? fn(draft) : renderResumeFluvo1Template(draft);
}
