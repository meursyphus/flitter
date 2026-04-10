/**
 * Generates SVG thumbnails for gallery entries using Playwright.
 *
 * Launches a Next.js dev server, opens a single page that renders ALL charts,
 * waits for animations to settle, then extracts each rendered SVG.
 *
 * Usage: npm run gen:thumbs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { spawn, type ChildProcess } from "child_process";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const THUMBS_DIR = path.resolve(__dirname, "../public/charts");

const ANIMATION_WAIT_MS = 5000;
const DEV_PORT = 3099;
const SERVER_TIMEOUT_MS = 120_000;

// ── Helpers ────────────────────────────────────────────────────────────────

/** Wait until a URL responds with 2xx. */
async function waitForServer(
  url: string,
  timeout = SERVER_TIMEOUT_MS,
): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      // server not ready yet
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Dev server not ready after ${timeout}ms`);
}

/** Start the Next.js dev server on DEV_PORT and return the child process. */
function startDevServer(): ChildProcess {
  const child = spawn("npx", ["next", "dev", "--port", String(DEV_PORT)], {
    cwd: path.resolve(__dirname, ".."),
    stdio: "pipe",
    env: { ...process.env, BROWSER: "none" },
  });

  child.stderr?.on("data", (chunk: Buffer) => {
    const msg = chunk.toString();
    if (msg.includes("Error") || msg.includes("error")) {
      process.stderr.write(msg);
    }
  });

  return child;
}

// ── Main ──────────────────────────────────────────────────────────────────

async function main() {
  // Clean out old thumbnails before generating
  if (fs.existsSync(THUMBS_DIR)) {
    for (const file of fs.readdirSync(THUMBS_DIR)) {
      fs.unlinkSync(path.join(THUMBS_DIR, file));
    }
  }
  fs.mkdirSync(THUMBS_DIR, { recursive: true });

  console.log("Starting dev server...");

  const server = startDevServer();
  const baseUrl = `http://localhost:${DEV_PORT}`;

  try {
    await waitForServer(baseUrl);
    console.log("Dev server ready. Launching browser...\n");

    const browser = await chromium.launch();
    const page = await browser.newPage();

    // Navigate to the single page that renders all charts
    await page.goto(`${baseUrl}/thumbnail/`, { waitUntil: "networkidle" });

    // Wait until every chart container has a non-empty SVG
    const totalRendered = await page.waitForFunction(
      () => {
        const containers = document.querySelectorAll("[data-slug]");
        if (containers.length === 0) return false;
        const allReady = Array.from(containers).every((el) => {
          const svg = el.querySelector("svg");
          return svg && svg.children.length > 0;
        });
        return allReady ? containers.length : false;
      },
      { timeout: 60_000 },
    );

    console.log(`All ${await totalRendered.jsonValue()} charts rendered.`);

    // Wait for animations to settle
    await page.waitForTimeout(ANIMATION_WAIT_MS);

    // Extract all SVGs at once
    const results = await page.evaluate(() => {
      const containers = document.querySelectorAll("[data-slug]");
      return Array.from(containers).map((el) => {
        const slug = el.getAttribute("data-slug")!;
        const svg = el.querySelector("svg");
        if (!svg) return { slug, svg: null };
        svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svg.setAttribute("width", "800");
        svg.setAttribute("height", "500");
        return { slug, svg: svg.outerHTML };
      });
    });

    let succeeded = 0;
    for (const { slug, svg } of results) {
      if (svg) {
        fs.writeFileSync(path.join(THUMBS_DIR, `${slug}.svg`), svg);
        console.log(`  ✓ ${slug}.svg`);
        succeeded++;
      } else {
        console.warn(`  ✗ No SVG found for ${slug}`);
      }
    }

    await page.close();
    await browser.close();

    console.log(`\nDone! Generated ${succeeded}/${results.length} thumbnails.`);
  } finally {
    server.kill();
  }
}

await main();
