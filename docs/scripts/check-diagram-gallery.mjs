/** Run against the exported site: DIAGRAM_DOCS_URL=http://localhost:3017 pnpm test:diagram-docs */
import assert from "node:assert/strict";
import { mkdir, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const docs = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const base = process.env.DIAGRAM_DOCS_URL ?? "http://localhost:3017";
const artifacts = process.env.DIAGRAM_DOCS_ARTIFACTS;
if (artifacts) await mkdir(artifacts, { recursive: true });
const sourceDir = path.join(docs, "src/app/diagram/_examples");
const slugs = (await readdir(sourceDir)).filter((name) => name.endsWith(".ts") && !["index.ts", "catalog.ts"].includes(name)).map((name) => name.slice(0, -3));
const browser = await chromium.launch({ channel: process.env.DIAGRAM_DOCS_BROWSER });
const context = await browser.newContext({ viewport: { width: 1440, height: 1100 }, permissions: ["clipboard-read", "clipboard-write"] });
const page = await context.newPage();
page.setDefaultTimeout(15000);
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });

async function open(route) {
  const response = await page.goto(`${base}${route}`);
  assert.equal(response.status(), 200, route);
}
async function settle() {
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}
async function svgReady(preview) {
  await preview.locator("svg text").first().waitFor();
  await settle();
}
async function theme(value) {
  if (await page.locator("html").getAttribute("data-theme") !== value) {
    await page.getByRole("button", { name: "Switch color theme" }).filter({ visible: true }).click();
  }
  assert.equal(await page.locator("html").getAttribute("data-theme"), value);
  await settle();
}
async function shot(name, locator = page) {
  if (artifacts) await locator.screenshot({ path: path.join(artifacts, `${name}.png`) });
}

try {
  await open("/diagram/gallery/");
  assert.equal(await page.locator("[data-example]").count(), slugs.length);
  assert.equal(await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Gallery", exact: true }).getAttribute("href"), "/diagram/gallery/");
  await page.getByRole("button", { name: "Workflows", exact: true }).click();
  assert.equal(await page.locator("[data-example]").count(), 2);
  await page.getByRole("button", { name: "Headless", exact: true }).click();
  assert.equal(await page.locator("[data-example]").count(), 1);
  assert.equal(await page.locator("[data-example]").getAttribute("data-example"), "headless");
  await page.getByRole("button", { name: "All", exact: true }).click();
  await svgReady(page.locator("[data-example]").first());
  await shot("gallery-desktop");

  for (const slug of slugs) {
    await open(`/diagram/gallery/${slug}/`);
    const preview = page.locator(`[data-example="${slug}"]`);
    await svgReady(preview);
    const source = await readFile(path.join(sourceDir, `${slug}.ts`), "utf8");
    const sourceBlock = page.locator(".code-surface").nth(1);
    // Copy must deliver the complete file used by the live widget, not an abbreviated sample.
    await sourceBlock.getByRole("button", { name: "Copy code" }).click();
    assert.equal(await page.evaluate(() => navigator.clipboard.readText()), source, `${slug}: copied source`);
    await preview.scrollIntoViewIfNeeded();
    for (const color of ["light", "dark"]) {
      await theme(color);
      for (const renderer of ["SVG", "Canvas"]) {
        await preview.getByRole("button", { name: renderer, exact: true }).click();
        if (renderer === "SVG") await svgReady(preview);
        else {
          await preview.locator("canvas").first().waitFor();
          await settle();
          assert(await preview.locator("canvas").first().evaluate((canvas) => canvas.width > 0 && canvas.height > 0), `${slug}: canvas size`);
        }
        await shot(`${slug}-${color}-${renderer.toLowerCase()}`, preview);
      }
    }
    console.log(`✓ ${slug}: exact source, SVG/Canvas, light/dark`);
  }

  await open("/diagram/gallery/workflow/");
  const workflow = page.locator('[data-example="workflow"]');
  await svgReady(workflow);
  const review = workflow.locator("svg text").filter({ hasText: /^Review deploy$/ });
  // Flitter performs its own hit testing; SVG text is intentionally pointer-events:none.
  async function clickWidget(locator) {
    await locator.waitFor();
    const box = await locator.boundingBox();
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  }
  await clickWidget(review);
  await clickWidget(workflow.locator("svg text").filter({ hasText: /^Mark complete$/ }));
  await workflow.locator("svg text").filter({ hasText: /^Approved just now$/ }).waitFor();
  const before = await review.boundingBox();
  await page.mouse.move(before.x + before.width / 2, before.y + before.height / 2);
  await page.mouse.down();
  await page.mouse.move(before.x + before.width / 2 + 45, before.y + before.height / 2 + 40, { steps: 8 });
  await page.mouse.up();
  const after = await review.boundingBox();
  assert(after.x > before.x + 20 && after.y > before.y + 20, "Custom node drags after its data changes");
  await workflow.getByRole("button", { name: "Reset", exact: true }).click();
  await svgReady(workflow);
  assert.equal(await workflow.locator("svg text").filter({ hasText: /^Approved just now$/ }).count(), 0);
  await workflow.locator("svg text").filter({ hasText: /^Needs one approval$/ }).waitFor();
  console.log("✓ workflow action, node dragging and reset");

  await open("/diagram/api/layout/");
  const layouts = page.getByRole("group", { name: "Choose a layout" });
  for (const label of ["Layered", "Tree (LR)", "Force", "Grid", "Circular"]) {
    await layouts.getByRole("button", { name: label, exact: true }).click();
    assert.equal(await layouts.getByRole("button", { name: label, exact: true }).getAttribute("aria-pressed"), "true");
    await page.locator("main svg text").first().waitFor();
  }
  console.log("✓ five layout choices");

  // Check all diagram links from each guide, including routes retained for existing readers.
  const routes = ["/diagram/", "/diagram/installation/", "/diagram/quick-start/", "/diagram/customization/", "/diagram/headless/", "/diagram/api/", "/diagram/api/nodes-and-handles/", "/diagram/api/edges/", "/diagram/api/controller/", "/diagram/api/styling/", "/diagram/api/interaction/"];
  const links = new Set();
  for (const route of routes) {
    await open(route);
    for (const href of await page.locator('a[href^="/diagram"]').evaluateAll((elements) => elements.map((el) => el.getAttribute("href")))) links.add(href.split("#")[0]);
  }
  for (const href of links) assert.equal((await page.request.get(`${base}${href}`)).status(), 200, href);
  const sitemap = await (await page.request.get(`${base}/sitemap.xml`)).text();
  for (const slug of slugs) assert(sitemap.includes(`/diagram/gallery/${slug}/`), `${slug}: sitemap`);

  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of ["/diagram/gallery/", "/diagram/gallery/workflow/", "/diagram/api/", "/diagram/customization/"]) {
    await open(route);
    await settle();
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${route}: mobile horizontal overflow`);
    await shot(`mobile-${route.split("/").filter(Boolean).join("-")}`);
  }
  await page.getByRole("button", { name: "Open sidebar navigation" }).click();
  await page.getByRole("link", { name: "Gallery", exact: true }).filter({ visible: true }).click();
  await page.waitForURL("**/diagram/gallery/");
  assert.deepEqual(errors, [], "No browser errors");
  console.log(`✓ guide links, mobile navigation and width; ${slugs.length} examples, no browser errors`);
} finally {
  await browser.close();
}
