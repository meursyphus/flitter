import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { chromium } from "@playwright/test";

const [storyId, renderer = "svg"] = process.argv.slice(2);
const baseURL = process.env.STORYBOOK_BASE_URL ?? "http://127.0.0.1:6010";

if (!storyId) {
  console.error("usage: node check-story-render.mjs <story-id> [svg|canvas]");
  process.exit(2);
}

const screenshotDir = path.resolve("dev/performance/test-results/single-story");
fs.mkdirSync(screenshotDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });

const consoleErrors = [];
const pageErrors = [];

page.on("console", (message) => {
  if (message.type() === "error" && !message.text().includes("favicon")) {
    consoleErrors.push(message.text());
  }
});

page.on("pageerror", (error) => {
  pageErrors.push(error.message);
});

const url = `${baseURL}/iframe.html?id=${storyId}&viewMode=story&args=renderer:${renderer}`;
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(1200);

const renderSurface = page.locator("svg, canvas").first();
const visible = await renderSurface.isVisible().catch(() => false);

const info = await page.evaluate(() => {
  const svg = document.querySelector("svg");
  const canvas = document.querySelector("canvas");

  if (svg) {
    const bbox = svg.getBoundingClientRect();
    const drawNodes = svg.querySelectorAll(
      "path, rect, circle, ellipse, line, polyline, polygon, text",
    ).length;
    return {
      kind: "svg",
      width: bbox.width,
      height: bbox.height,
      drawNodes,
    };
  }

  if (canvas) {
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return { kind: "canvas", width: canvas.width, height: canvas.height, nonTransparentPixels: 0, uniqueColors: 0 };
    }

    const width = Math.min(canvas.width, 512);
    const height = Math.min(canvas.height, 512);
    const imageData = ctx.getImageData(0, 0, width, height).data;
    let nonTransparentPixels = 0;
    const uniqueColors = new Set();

    for (let index = 0; index < imageData.length; index += 16) {
      const r = imageData[index];
      const g = imageData[index + 1];
      const b = imageData[index + 2];
      const a = imageData[index + 3];
      if (a > 0) nonTransparentPixels += 1;
      uniqueColors.add(`${Math.round(r / 16)}-${Math.round(g / 16)}-${Math.round(b / 16)}-${Math.round(a / 16)}`);
    }

    return {
      kind: "canvas",
      width: canvas.width,
      height: canvas.height,
      nonTransparentPixels,
      uniqueColors: uniqueColors.size,
    };
  }

  return null;
});

const screenshotPath = path.join(
  screenshotDir,
  `${storyId.replace(/[^a-z0-9-_]+/gi, "-").toLowerCase()}--${renderer}.png`,
);

await page.screenshot({ path: screenshotPath, fullPage: true });
await browser.close();

const result = {
  storyId,
  renderer,
  url,
  visible,
  info,
  consoleErrors,
  pageErrors,
  screenshotPath,
};

console.log(JSON.stringify(result, null, 2));

if (!visible || pageErrors.length > 0 || consoleErrors.length > 0 || info == null) {
  process.exit(1);
}

if (info.kind === "svg" && (info.width <= 40 || info.height <= 40 || info.drawNodes <= 1)) {
  process.exit(1);
}

if (info.kind === "canvas" && (info.width <= 40 || info.height <= 40 || info.nonTransparentPixels <= 20 || info.uniqueColors <= 3)) {
  process.exit(1);
}
