import {
  parseResumeRenderRequest,
  resolveTemplateId,
  safePdfFileName,
} from "./parse-resume-render-request.js";
import { resolveResumeWebBaseUrl } from "./resolve-resume-web-base-url.js";
import { renderResumeStaticHTML } from "./render-resume-static.js";
import { renderDesignedResumeToPdf } from "./render-resume-pdf.js";

function jsonError(res, status, message) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify({ error: message }));
}

function queryTemplateId(req) {
  try {
    const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
    return url.searchParams.get("templateId");
  } catch {
    return null;
  }
}

export async function handleResumeStaticRender(req, res, templateId) {
  if (req.method !== "POST") {
    res.writeHead(405, { Allow: "POST" });
    res.end("Method Not Allowed");
    return;
  }

  try {
    const { draft } = await parseResumeRenderRequest(req, templateId);
    const baseUrl = resolveResumeWebBaseUrl(req);
    const html = renderResumeStaticHTML(templateId, draft, { baseUrl });
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(html);
  } catch (e) {
    jsonError(res, e.statusCode || 500, e.message || "Render failed");
  }
}

export async function handleResumePdfRender(req, res, templateId) {
  if (req.method !== "POST") {
    res.writeHead(405, { Allow: "POST" });
    res.end("Method Not Allowed");
    return;
  }

  try {
    const { draft, invoiceShell } = await parseResumeRenderRequest(req, templateId);
    const baseUrl = resolveResumeWebBaseUrl(req);
    const pdf = await renderDesignedResumeToPdf({ templateId, draft, baseUrl, invoiceShell });
    const fileName = safePdfFileName(draft, templateId);
    res.writeHead(200, {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Content-Length": pdf.length,
    });
    res.end(pdf);
  } catch (e) {
    const msg = e.message || "PDF render failed";
    const hint =
      msg.includes("Cannot find module") || msg.includes("puppeteer")
        ? "Install puppeteer or deploy on Vercel with @sparticuz/chromium-min"
        : msg;
    jsonError(res, e.statusCode || 500, hint);
  }
}

export function isResumeRenderPath(pathname) {
  return /\/render\/resume\/(resume_\d{2}|resume_fluvo_\d+)\/(pdf|static)\/?$/.test(pathname);
}

export async function dispatchResumeRender(req, res, pathname) {
  const templateId = resolveTemplateId(pathname, queryTemplateId(req));
  if (!templateId) {
    res.writeHead(404);
    res.end("Not Found");
    return;
  }

  if (pathname.endsWith("/static")) return handleResumeStaticRender(req, res, templateId);
  if (pathname.endsWith("/pdf")) return handleResumePdfRender(req, res, templateId);
  res.writeHead(404);
  res.end("Not Found");
}
