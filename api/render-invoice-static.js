import { renderInvoiceStaticHTML } from "../vanilla/features/invoices/static-invoice-html.js";

const staticTemplateIdRe = /^invoice_fluvo_(?:[1-9]|1\d|20)$/;

function readJSONBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 512 * 1024) {
        reject(new Error("Payload too large"));
      }
    });
    req.on("end", () => {
      if (!body.trim()) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error("Invalid JSON payload"));
      }
    });
    req.on("error", reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  const contentType = String(req.headers["content-type"] || "").toLowerCase();
  if (!contentType.includes("application/json")) {
    res.status(415).send("Content-Type must be application/json");
    return;
  }

  const templateId = String(req.query?.templateId || "").trim();
  if (!staticTemplateIdRe.test(templateId)) {
    res.status(400).send("Invalid templateId");
    return;
  }

  let payload = {};
  try {
    payload = await readJSONBody(req);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid request";
    res.status(message === "Payload too large" ? 413 : 400).send(message);
    return;
  }

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    res.status(400).send("Payload must be a JSON object");
    return;
  }
  if (
    "draft" in payload &&
    (!payload.draft || typeof payload.draft !== "object" || Array.isArray(payload.draft))
  ) {
    res.status(400).send("draft must be a JSON object");
    return;
  }

  const draft =
    payload?.draft && typeof payload.draft === "object" ? payload.draft : payload;

  try {
    const html = renderInvoiceStaticHTML(templateId, draft);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(200).send(html);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to render static invoice HTML";
    res.status(400).send(message);
  }
}

