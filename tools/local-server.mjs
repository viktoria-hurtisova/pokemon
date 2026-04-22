/**
 * Local dev server: serves the repo root and writes progress/*.json on POST.
 * GitHub Pages has no API — use this only on your machine, then git push.
 *
 * Usage: npm run local
 * Open http://127.0.0.1:8765/
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PORT = Number(process.env.PORT || 8765, 10);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".ico": "image/x-icon",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

function safeListId(id) {
  return typeof id === "string" && /^[a-z0-9-]{1,64}$/i.test(id) ? id : null;
}

function send(res, status, body, headers = {}) {
  res.writeHead(status, { "Cache-Control": "no-store", ...headers });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || "/", "http://127.0.0.1");

  if (req.method === "POST" && url.pathname.startsWith("/api/progress/")) {
    const id = safeListId(url.pathname.replace("/api/progress/", "").split("/")[0]);
    if (!id) return send(res, 400, "Bad list id");
    const buf = await readBody(req);
    let data;
    try {
      data = JSON.parse(buf.toString("utf8") || "{}");
    } catch {
      return send(res, 400, "Invalid JSON");
    }
    if (data === null || typeof data !== "object" || Array.isArray(data)) {
      return send(res, 400, "Body must be a JSON object");
    }
    const out = path.join(ROOT, "progress", id + ".json");
    if (!out.startsWith(path.join(ROOT, "progress"))) {
      return send(res, 400, "Bad path");
    }
    const pretty = JSON.stringify(data, null, 2) + "\n";
    try {
      fs.mkdirSync(path.dirname(out), { recursive: true });
      fs.writeFileSync(out, pretty, "utf8");
    } catch (e) {
      return send(res, 500, String(e && e.message ? e.message : e));
    }
    return send(res, 204, "");
  }

  let filePath = path.normalize(path.join(ROOT, decodeURIComponent(url.pathname)));
  if (!filePath.startsWith(ROOT)) return send(res, 403, "Forbidden");
  if (url.pathname === "/" || url.pathname === "") filePath = path.join(ROOT, "index.html");

  fs.stat(filePath, (err, st) => {
    if (err || !st.isFile()) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      return res.end("Not found");
    }
    const ext = path.extname(filePath).toLowerCase();
    const type = MIME[ext] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": type, "Cache-Control": "no-store" });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, "127.0.0.1", () => {
  console.log("Pokémon collection local server");
  console.log("  URL:   http://127.0.0.1:" + PORT + "/");
  console.log("  Writes progress/*.json when you toggle cards.");
  console.log("  GitHub Pages: commit JSON only (no server there).");
});
