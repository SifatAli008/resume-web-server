import { normalizeResumeDraft } from "./draft.js";
import { normalizeTemplateId } from "./constants.js";
import {
  fitResumeThumbEmbed,
  lockEmbedViewport,
  markPdfReady,
  scheduleEmbedFit,
} from "./resume-embed.js";
import { buildEditableMultipageCv } from "./templates/cv-editable-multipage.js";
import { CV_PH } from "./templates/cv-placeholders.js";

function fillDraftPlaceholders(draft) {
  const fill = (v, ph) => (String(v || "").trim() ? v : ph);
  return {
    ...draft,
    fullName: fill(draft.fullName, CV_PH.fullName),
    title: fill(draft.title, CV_PH.title),
    email: fill(draft.email, CV_PH.email),
    phone: fill(draft.phone, CV_PH.phone),
    location: fill(draft.location, CV_PH.location),
    summary: fill(draft.summary, CV_PH.summary),
    certifications: fill(draft.certifications, CV_PH.certifications),
    languages: fill(draft.languages, CV_PH.languages),
    skills: fill(draft.skills, CV_PH.skills),
  };
}

/** Read-only 3-page CV for Puppeteer / embed=pdf (vanilla HTML templates). */
export async function mountResumePdfEmbed(app, draft) {
  draft = normalizeResumeDraft({ ...draft, templateId: normalizeTemplateId(draft.templateId) });
  const templateId = draft.templateId;
  const invoice = new URLSearchParams(window.location.search).get("invoice") === "1";

  app.replaceChildren();
  const wrap = document.createElement("div");
  wrap.className = "cv-pdf-embed mx-auto bg-white";
  wrap.innerHTML = buildEditableMultipageCv(fillDraftPlaceholders(draft), templateId, {
    invoiceShell: invoice,
    showPhotoEditor: false,
  });
  app.appendChild(wrap);

  const signalReady = () => {
    if (wrap.querySelector("#resume-print-root")) markPdfReady();
  };

  if (document.fonts?.ready) {
    document.fonts.ready.then(() => requestAnimationFrame(signalReady));
  } else {
    requestAnimationFrame(signalReady);
  }

  window.addEventListener("resumeData", (e) => {
    const next = e?.detail;
    if (!next || typeof next !== "object") return;
    mountResumePdfEmbed(app, normalizeResumeDraft(next));
  });
}

export function mountResumeThumbEmbed(app, draft) {
  lockEmbedViewport();
  document.body.style.overflow = "hidden";
  document.documentElement.style.overflow = "hidden";
  mountResumePdfEmbed(app, draft);
  scheduleEmbedFit(() => fitResumeThumbEmbed(app));
}
