import http from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

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

function shouldServeApp(urlPath) {
  return urlPath === "/" || urlPath === "/resume" || urlPath.startsWith("/resume/");
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
