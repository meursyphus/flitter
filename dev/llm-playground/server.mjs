import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, "..", "..");
const docsPublicRoot = path.join(repoRoot, "docs", "public");
const localFiles = {
  "/": path.join(currentDir, "index.html"),
  "/app.js": path.join(currentDir, "app.js"),
  "/styles.css": path.join(currentDir, "styles.css"),
};

const port = Number(process.env.PORT ?? 6011);

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
};

function safePackPath(urlPath) {
  const relativePath = urlPath.replace(/^\/pack\//, "");
  const normalizedPath = path.normalize(relativePath);
  if (normalizedPath.startsWith("..")) return null;
  if (normalizedPath === "llms.txt") {
    return path.join(docsPublicRoot, "llms.txt");
  }
  return path.join(docsPublicRoot, "llm", normalizedPath);
}

async function sendFile(response, filePath) {
  try {
    const file = await fs.readFile(filePath);
    const extension = path.extname(filePath);
    response.writeHead(200, {
      "content-type": contentTypes[extension] ?? "application/octet-stream",
      "cache-control": "no-store",
    });
    response.end(file);
  } catch {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
}

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url ?? "/", `http://${request.headers.host ?? `127.0.0.1:${port}`}`);
  const pathname = url.pathname;

  if (pathname in localFiles) {
    await sendFile(response, localFiles[pathname]);
    return;
  }

  if (pathname === "/data/chart-registry.json") {
    await sendFile(response, path.join(docsPublicRoot, "llm", "chart-registry.json"));
    return;
  }

  if (pathname === "/data/evaluation-cases.json") {
    await sendFile(response, path.join(docsPublicRoot, "llm", "evaluation-cases.json"));
    return;
  }

  if (pathname.startsWith("/pack/")) {
    const filePath = safePackPath(pathname);
    if (!filePath) {
      response.writeHead(400, { "content-type": "text/plain; charset=utf-8" });
      response.end("Bad request");
      return;
    }
    await sendFile(response, filePath);
    return;
  }

  response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
  response.end("Not found");
});

server.listen(port, "127.0.0.1", () => {
  console.log(`LLM playground running at http://127.0.0.1:${port}`);
});
