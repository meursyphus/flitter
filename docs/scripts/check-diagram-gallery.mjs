/**
 * Browser checks for the diagram docs, run against the exported site:
 *   DIAGRAM_DOCS_URL=http://localhost:3017 pnpm test:diagram-docs
 *
 * Gallery entries come from `_data/gallery/catalog.ts` (only those with
 * `load`), interaction cells from `_data/interactions/cells.ts` (live only
 * when `ready`), so flipping either data file changes what is checked.
 */
import assert from "node:assert/strict";
import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { chromium } from "playwright";

const docs = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const diagramDir = path.join(docs, "src/app/diagram");
const base = process.env.DIAGRAM_DOCS_URL ?? "http://localhost:3017";
const artifacts = process.env.DIAGRAM_DOCS_ARTIFACTS;
if (artifacts) await mkdir(artifacts, { recursive: true });

/** Object literals of an exported array, as { key: literal | true }. */
async function readArray(file, name) {
  const sf = ts.createSourceFile(file, await readFile(file, "utf8"), ts.ScriptTarget.Latest, true);
  let items = [];
  ts.forEachChild(sf, (node) => {
    if (!ts.isVariableStatement(node)) return;
    for (const d of node.declarationList.declarations) {
      if (d.name.getText(sf) !== name || !d.initializer || !ts.isArrayLiteralExpression(d.initializer)) continue;
      items = d.initializer.elements.filter(ts.isObjectLiteralExpression).map((obj) =>
        Object.fromEntries(
          obj.properties.filter(ts.isPropertyAssignment).map((p) => {
            const v = p.initializer;
            const value = ts.isStringLiteralLike(v) ? v.text
              : v.kind === ts.SyntaxKind.TrueKeyword ? true
              : v.kind === ts.SyntaxKind.FalseKeyword ? false
              : ts.isArrayLiteralExpression(v) ? v.elements.map((e) => (ts.isStringLiteralLike(e) ? e.text : null))
              : true;
            return [p.name.getText(sf), value];
          }),
        ),
      );
    }
  });
  assert(items.length, `${file}: no ${name} array`);
  return items;
}

const entries = (await readArray(path.join(diagramDir, "_data/gallery/catalog.ts"), "catalog")).filter((e) => e.load);
const cells = await readArray(path.join(diagramDir, "_data/interactions/cells.ts"), "cells");
const slugs = entries.map((e) => e.slug);

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
async function svgReady(locator) {
  await locator.locator("svg text").first().waitFor();
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
// Flitter performs its own hit testing; SVG text is pointer-events:none.
async function clickWidget(locator) {
  await locator.waitFor();
  const box = await locator.boundingBox();
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
}

try {
  /* Gallery index: one card per listed entry, chip filters by interaction. */
  await open("/diagram/gallery/");
  assert.equal(await page.locator("[data-example]").count(), slugs.length);
  assert.equal(await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Gallery", exact: true }).getAttribute("href"), "/diagram/gallery/");
  const filters = page.getByRole("group", { name: "Filter by interaction" });
  const chipButton = filters.getByRole("button").nth(1);
  const chipLabel = await chipButton.textContent();
  await chipButton.click();
  const filtered = await page.locator("[data-example]").count();
  assert(filtered >= 1 && filtered <= slugs.length, `filter ${chipLabel}`);
  await filters.getByRole("button", { name: "All", exact: true }).click();
  assert.equal(await page.locator("[data-example]").count(), slugs.length);
  await svgReady(page.locator("[data-example]").first());
  await shot("gallery-desktop");
  console.log(`✓ gallery index: ${slugs.length} cards, filter "${chipLabel}" → ${filtered}`);

  /* Detail pages: exact source, SVG/Canvas, light/dark. */
  for (const entry of entries) {
    const { slug } = entry;
    await open(`/diagram/gallery/${slug}/`);
    const preview = page.locator(`[data-example="${slug}"]`).first();
    await svgReady(preview);
    const source = await readFile(path.join(diagramDir, "_examples", `${entry.file ?? slug}.ts`), "utf8");
    const code = page.locator("[data-code-tabs]");
    assert.equal(await code.getByRole("tab").first().textContent(), `${slug}.ts`);
    await code.getByRole("button", { name: "Copy code" }).click();
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

  /* The workflow example's own action, dragging and reset. */
  if (slugs.includes("automation-workflow")) {
    await open("/diagram/gallery/automation-workflow/");
    const workflow = page.locator('[data-example="automation-workflow"]').first();
    await svgReady(workflow);
    const review = workflow.locator("svg text").filter({ hasText: /^Review deploy$/ });
    if (await review.count()) {
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
      console.log("✓ automation-workflow: action, drag, reset");
    } else console.log("- automation-workflow: replaced example, action check skipped");
  }

  /* Interactions: every ready cell renders live, the rest show a placeholder. */
  await theme("light");
  await open("/diagram/interactions/");
  assert.equal(await page.locator("[data-cell]").count(), cells.length);
  for (const cell of cells) {
    const el = page.locator(`[data-cell="${cell.id}"]`);
    await el.scrollIntoViewIfNeeded();
    if (cell.ready) await svgReady(el);
    else await el.getByText("Live demo in progress").waitFor();
    assert(await el.locator("pre").count(), `${cell.id}: snippet`);
  }
  const ready = cells.filter((c) => c.ready).length;
  console.log(`✓ interactions: ${ready} live, ${cells.length - ready} placeholder`);

  /* API tables come from generated data. */
  await open("/diagram/api/");
  for (const id of ["props", "interaction", "custom", "controller", "types"]) await page.locator(`#${id}`).waitFor();
  assert((await page.locator("table tr").count()) > 100, "API tables rendered");
  console.log("✓ api sections");

  /* Every /diagram link resolves; the sitemap lists every listed slug. */
  const routes = ["/diagram/", "/diagram/installation/", "/diagram/quick-start/", "/diagram/gallery/", "/diagram/interactions/", "/diagram/api/"];
  const links = new Set();
  for (const route of routes) {
    await open(route);
    for (const href of await page.locator('a[href^="/diagram"]').evaluateAll((elements) => elements.map((el) => el.getAttribute("href")))) links.add(href.split("#")[0]);
  }
  for (const href of links) assert.equal((await page.request.get(`${base}${href}`)).status(), 200, href);
  const sitemap = await (await page.request.get(`${base}/sitemap.xml`)).text();
  for (const slug of slugs) assert(sitemap.includes(`/diagram/gallery/${slug}/`), `${slug}: sitemap`);
  for (const route of routes) assert(sitemap.includes(route), `${route}: sitemap`);

  /* Mobile width and navigation. */
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of ["/diagram/", "/diagram/gallery/", `/diagram/gallery/${slugs[0]}/`, "/diagram/interactions/", "/diagram/api/"]) {
    await open(route);
    await settle();
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${route}: mobile horizontal overflow`);
    await shot(`mobile-${route.split("/").filter(Boolean).join("-")}`);
  }
  await page.getByRole("button", { name: "Open sidebar navigation" }).click();
  await page.getByRole("link", { name: "Interactions", exact: true }).filter({ visible: true }).click();
  await page.waitForURL("**/diagram/interactions/");
  assert.deepEqual(errors, [], "No browser errors");
  console.log(`✓ links, sitemap, mobile; ${slugs.length} examples, ${cells.length} cells, no browser errors`);
} finally {
  await browser.close();
}
