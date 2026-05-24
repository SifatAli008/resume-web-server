import { isKnownResumeTemplateId } from "../features/resume/constants.js";

const MAX_BODY_BYTES = 512 * 1024;

export function templateIdFromPathname(pathname) {
  const m = String(pathname || "").match(/\/render\/resume\/(resume_\d{2}|resume_fluvo_\d+)\/(pdf|static)\/?$/);
  return m ? m[1] : null;
}

export function resolveTemplateId(pathname, queryTemplateId) {
  const fromPath = templateIdFromPathname(pathname);
  if (fromPath && isKnownResumeTemplateId(fromPath)) return fromPath;
  if (queryTemplateId && isKnownResumeTemplateId(queryTemplateId)) return queryTemplateId;
  return null;
}

export async function readJsonBody(req) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) throw new Error("Payload too large");
    chunks.push(chunk);
  }
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw.trim()) return {};
  return JSON.parse(raw);
}

/**
 * @returns {{ templateId: string, draft: object }}
 */
export async function parseResumeRenderRequest(req, templateId) {
  if (!templateId || !isKnownResumeTemplateId(templateId)) {
    const err = new Error("Unknown resume template");
    err.statusCode = 404;
    throw err;
  }

  let body;
  try {
    body = await readJsonBody(req);
  } catch (e) {
    const err = new Error(e.message === "Payload too large" ? e.message : "Invalid JSON body");
    err.statusCode = e.message === "Payload too large" ? 413 : 400;
    throw err;
  }

  const draft = body.draft && typeof body.draft === "object" ? body.draft : body;
  if (!draft || typeof draft !== "object") {
    const err = new Error('JSON body must include a "draft" object');
    err.statusCode = 400;
    throw err;
  }

  const invoiceShell = Boolean(body.invoiceShell);
  return { templateId, draft: { ...draft, templateId }, invoiceShell };
}

export function safePdfFileName(draft, templateId) {
  const name = String(draft?.fullName || "resume")
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 60);
  const base = name || "resume";
  return `${base}-${templateId.replace("resume_", "")}.pdf`;
}
