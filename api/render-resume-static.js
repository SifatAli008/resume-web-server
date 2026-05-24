import { handleResumeStaticRender } from "../vanilla/lib/resume-render-handlers.js";

export default async function handler(req, res) {
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
  const templateId = url.searchParams.get("templateId");
  if (!templateId) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "templateId required" }));
    return;
  }
  await handleResumeStaticRender(req, res, templateId);
}
