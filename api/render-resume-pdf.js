import { handleResumePdfRender } from "../vanilla/lib/resume-render-handlers.js";

export const config = {
  maxDuration: 60,
  memory: 1024,
};

export default async function handler(req, res) {
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
  const templateId = url.searchParams.get("templateId");
  if (!templateId) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "templateId required" }));
    return;
  }
  await handleResumePdfRender(req, res, templateId);
}
