import http from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderInvoiceStaticHTML } from "./features/invoices/static-invoice-html.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = __dirname;
const port = Number(process.env.PORT || 3000);

const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};
const staticTemplateIdRe = /^invoice_fluvo_(?:[1-9]|1\d|20)$/;
const maxStaticRenderBodyBytes = 512 * 1024;

function shouldServeApp(urlPath) {
  return (
    urlPath === "/" ||
    urlPath.startsWith("/invoice/") ||
    urlPath === "/invoice"
  );
}

async function serveFile(res, absolutePath) {
  const ext = path.extname(absolutePath).toLowerCase();
  const contentType = mime[ext] || "application/octet-stream";
  const data = await readFile(absolutePath);
  res.writeHead(200, { "Content-Type": contentType });
  res.end(data);
}

const server = http.createServer(async (req, res) => {
  try {
    const rawUrl = req.url || "/";
    const urlPath = new URL(rawUrl, `http://${req.headers.host}`).pathname;
    const staticMatch = urlPath.match(/^\/render\/invoice\/([^/]+)\/static$/);

    if (staticMatch && req.method !== "POST") {
      res.writeHead(405, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Method Not Allowed");
      return;
    }

    if (req.method === "POST" && staticMatch) {
      const contentType = String(req.headers["content-type"] || "").toLowerCase();
      if (!contentType.includes("application/json")) {
        res.writeHead(415, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Content-Type must be application/json");
        return;
      }
      let body = "";
      for await (const chunk of req) {
        body += chunk;
        if (body.length > maxStaticRenderBodyBytes) {
          res.writeHead(413, { "Content-Type": "text/plain; charset=utf-8" });
          res.end("Payload too large");
          return;
        }
      }
      let payload = {};
      if (body.trim()) {
        try {
          payload = JSON.parse(body);
        } catch {
          res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
          res.end("Invalid JSON payload");
          return;
        }
      }
      const templateId = decodeURIComponent(staticMatch[1] || "").trim();
      if (!staticTemplateIdRe.test(templateId)) {
        res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Invalid templateId");
        return;
      }
      if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
        res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Payload must be a JSON object");
        return;
      }
      if ("draft" in payload && (!payload.draft || typeof payload.draft !== "object" || Array.isArray(payload.draft))) {
        res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("draft must be a JSON object");
        return;
      }
      const draft = payload?.draft && typeof payload.draft === "object" ? payload.draft : payload;
      let html = "";
      try {
        html = renderInvoiceStaticHTML(templateId, draft);
      } catch (err) {
        res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
        res.end(err instanceof Error ? err.message : "Failed to render static invoice HTML");
        return;
      }
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(html);
      return;
    }

    if (shouldServeApp(urlPath)) {
      await serveFile(res, path.join(root, "index.html"));
      return;
    }

    const localPath = path.normalize(path.join(root, urlPath));
    if (!localPath.startsWith(root)) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }

    await serveFile(res, localPath);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not Found");
  }
});

server.listen(port, () => {
  console.log(`Vanilla app running at http://localhost:${port}`);
});
