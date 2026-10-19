/**
 * Browser checks for the diagram docs, against a dev server or the export:
 *   DIAGRAM_DOCS_URL=http://localhost:3017 pnpm test:diagram-docs
 *
 * Gallery entries come from `_data/gallery/catalog.ts` (only those with
 * `load`), interaction cells from `_data/interactions/cells.ts` (live only
 * when `ready`), so flipping either data file changes what is checked.
 *
 * Every slug, chip and cell is its own step: a failure is recorded and the
 * run goes on, then a summary prints and the exit code is 1 if any failed.
 *
 *   DIAGRAM_DOCS_BROWSER=chrome     Playwright channel (default: bundled Chromium)
 *   DIAGRAM_DOCS_ARTIFACTS=dir      write screenshots there
 *   DIAGRAM_DOCS_THUMBNAILS=1       rewrite public/diagram/thumbnails/<slug>-<theme>.svg
 *                                   from each example's SVG stage (gallery cards use them)
 *   DIAGRAM_DOCS_ONLY=a,b           run only these sections (examples, index, cells,
 *                                   api, links, mobile) or these slugs / cell ids
 */
import assert from "node:assert/strict";
import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { chromium } from "playwright";

const docs = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const diagramDir = path.join(docs, "src/app/diagram");
const thumbnailsDir = path.join(docs, "public/diagram/thumbnails");
const base = process.env.DIAGRAM_DOCS_URL ?? "http://localhost:3017";
const artifacts = process.env.DIAGRAM_DOCS_ARTIFACTS;
const capture = process.env.DIAGRAM_DOCS_THUMBNAILS === "1";
const only = process.env.DIAGRAM_DOCS_ONLY?.split(",").map((s) => s.trim()).filter(Boolean);
if (artifacts) await mkdir(artifacts, { recursive: true });
if (capture) await mkdir(thumbnailsDir, { recursive: true });

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
/** Same order as the filter row in `gallery-grid.tsx`. */
const chips = ["Basics", "Custom parts", "Applications"];

const wants = (section, id) => !only || only.includes(section) || (id !== undefined && only.includes(id));

const browser = await chromium.launch({ channel: process.env.DIAGRAM_DOCS_BROWSER });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, permissions: ["clipboard-read", "clipboard-write"] });
const page = await context.newPage();
page.setDefaultTimeout(15000);
page.setDefaultNavigationTimeout(90000);
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });

const results = [];
/** Runs one named check; browser errors raised during it fail it too. */
async function step(name, fn) {
  const before = errors.length;
  try {
    const note = await fn();
    const raised = errors.slice(before);
    assert.deepEqual(raised, [], "browser errors");
    results.push({ name, ok: true });
    console.log(`✓ ${name}${note ? `: ${note}` : ""}`);
  } catch (error) {
    const raised = errors.slice(before);
    const message = `${String(error.message).split("\n")[0]}${raised.length ? ` [browser: ${raised[0]}]` : ""}`;
    results.push({ name, ok: false, message });
    console.log(`✗ ${name}: ${message}`);
  }
}

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
const svgText = (scope, text) => scope.locator("svg text").filter({ hasText: new RegExp(`^${text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`) });
// Flitter performs its own hit testing; SVG text is pointer-events:none.
async function clickWidget(locator) {
  await locator.first().waitFor();
  const box = await locator.first().boundingBox();
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
}
async function center(locator) {
  await locator.first().waitFor();
  const box = await locator.first().boundingBox();
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
}

/** Read complete node/panel boxes from the live layout, including clipped and Canvas-only content. */
async function layoutSnapshot(preview) {
  const probe = preview.locator('[data-diagram-layout]');
  await page.waitForFunction(el => { try { return el.diagramLayout().nodes.length > 0; } catch { return false; } }, await probe.elementHandle());
  return probe.evaluate(el => el.diagramLayout());
}
const intersects = (a, b) => a.x < b.x + b.width - 0.5 && a.x + a.width > b.x + 0.5 && a.y < b.y + b.height - 0.5 && a.y + a.height > b.y + 0.5;
async function initialLayout(preview, slug) {
  const snapshot = await layoutSnapshot(preview);
  const stage = await preview.locator('[data-diagram-stage]').boundingBox();
  // The tall, top-anchored tree is the only deliberate partial view. Never accept an arbitrary visible node.
  const required = slug === "linear-steps" ? snapshot.nodes.filter(node => node.id === "trigger") : snapshot.nodes;
  assert(required.length, `${slug}: missing required initial nodes`);
  const clipped = required.filter(node => node.x < 7.5 || node.y < 7.5 || node.x + node.width > stage.width - 7.5 || node.y + node.height > stage.height - 7.5);
  assert.deepEqual(clipped, [], `${slug}: initial node bounds must fit with an 8px margin`);
  if (slug === "linear-steps") {
    const header = snapshot.panels.find(panel => panel.role === "diagram-header");
    assert(header && required[0].y >= header.y + header.height + 8, "trigger is fully below the header");
  }
  const hints = snapshot.panels.filter(panel => panel.role === "diagram-hint");
  const statuses = snapshot.panels.filter(panel => panel.role === "diagram-status");
  for (const hint of hints) for (const status of statuses) assert(!intersects(hint, status), `${slug}: hint and status panels intersect`);
  return snapshot;
}

/** Prefer >=10px, but do not crop the graph to force that target on a small stage. */
async function readableText(preview) {
  const snapshot = await layoutSnapshot(preview);
  const stage = await preview.locator('[data-diagram-stage]').boundingBox();
  const nodes = await preview.getAttribute('data-example') === 'linear-steps' ? snapshot.nodes.filter(node => node.id === 'trigger') : snapshot.nodes;
  const width = Math.max(...nodes.map(n => n.x + n.width)) - Math.min(...nodes.map(n => n.x));
  const height = Math.max(...nodes.map(n => n.y + n.height)) - Math.min(...nodes.map(n => n.y));
  const growthToFit = Math.min((stage.width - 16) / width, (stage.height - 16) / height, 1 / nodes[0].scale);
  const small = await preview.locator("svg text").evaluateAll((texts, growthToFit) => texts.flatMap(el => {
    const transform = el.getScreenCTM(), style = getComputedStyle(el), box = el.getBoundingClientRect();
    const stage = el.closest("[data-diagram-stage]")?.getBoundingClientRect();
    if (!transform || !stage || !el.textContent?.trim() || Number(style.opacity) === 0 || box.right < stage.left || box.left > stage.right || box.bottom < stage.top || box.top > stage.bottom) return [];
    const pixels = parseFloat(style.fontSize) * Math.hypot(transform.c, transform.d);
    return pixels < 9.95 && pixels * growthToFit >= 10 ? [{ text: el.textContent, pixels }] : [];
  }), growthToFit);
  assert.deepEqual(small, [], `${await preview.getAttribute("data-example")}: initial text should reach 10px when the complete graph can still fit: ${JSON.stringify(small)}`);
}

/** The example's SVG stage as a standalone file the card can show with <img>. */
async function writeThumbnail(preview, slug, color) {
  await page.mouse.move(0, 0);
  await page.waitForTimeout(1200); // fitView and mount-time layouts animate
  const svg = await preview.locator("svg").last().evaluate((el) => {
    const { width, height } = el.getBoundingClientRect();
    const font = getComputedStyle(el.querySelector("text") ?? el).fontFamily;
    const copy = el.cloneNode(true);
    copy.removeAttribute("style");
    for (const node of [copy, ...copy.querySelectorAll("*")]) {
      for (const name of ["data-render-name", "data-render-type"]) node.removeAttribute(name);
    }
    copy.setAttribute("viewBox", `0 0 ${Math.round(width)} ${Math.round(height)}`);
    copy.setAttribute("width", String(Math.round(width)));
    copy.setAttribute("height", String(Math.round(height)));
    copy.setAttribute("font-family", `${font}, system-ui, -apple-system, "Segoe UI", sans-serif`);
    return new XMLSerializer().serializeToString(copy);
  });
  await writeFile(path.join(thumbnailsDir, `${slug}-${color}.svg`), `${svg}\n`);
}

/* Interaction checks beyond "it renders", keyed by cell id. */
const cellBehaviour = {
  async collapse(el) {
    await svgText(el, "Engineer").waitFor();
    await clickWidget(svgText(el, "▾"));
    await svgText(el, "+2").waitFor();
    assert.equal(await svgText(el, "Engineer").count(), 0, "chevron hides the team");
    await clickWidget(svgText(el, "▸"));
    await svgText(el, "Engineer").waitFor();
    return "chevron collapses and expands";
  },
  async "insert-on-edge"(el) {
    const from = await center(svgText(el, "Trigger"));
    const to = await center(svgText(el, "Action"));
    await page.mouse.move(from.x, (from.y + to.y) / 2, { steps: 4 });
    const plus = svgText(el, "+");
    await plus.waitFor();
    await clickWidget(plus);
    await svgText(el, "New step").waitFor();
    return "hover + click inserts a step";
  },
  async keyboard(el) {
    const x = async () => (await center(svgText(el, "Fetch"))).x;
    await clickWidget(svgText(el, "Fetch"));
    const start = await x();
    await page.keyboard.press("ArrowRight");
    await settle();
    const one = (await x()) - start;
    await page.keyboard.press("Shift+ArrowRight");
    await settle();
    const ten = (await x()) - start - one;
    assert(one > 0 && Math.abs(ten / one - 10) < 1.5, `arrow ${one.toFixed(2)}px, Shift+arrow ${ten.toFixed(2)}px`);
    return "arrow nudges, Shift moves ten times as far";
  },
  async delete(el) {
    await clickWidget(svgText(el, "Delete me"));
    await page.keyboard.press("Backspace");
    await page.waitForFunction(() => ![...document.querySelectorAll('[data-cell="delete"] svg text')].some((t) => t.textContent === "Delete me"));
    await clickWidget(svgText(el, "Start (kept)"));
    await page.keyboard.press("Backspace");
    await page.waitForTimeout(200);
    assert.equal(await svgText(el, "Start (kept)").count(), 1, "Start is vetoed");
    return "Backspace deletes, Start is kept";
  },
  async clipboard(el) {
    await clickWidget(svgText(el, "Fetch"));
    await page.keyboard.press("ControlOrMeta+c");
    await page.keyboard.press("ControlOrMeta+v");
    await page.waitForFunction(() => [...document.querySelectorAll('[data-cell="clipboard"] svg text')].filter((t) => t.textContent === "Fetch").length === 2);
    await page.keyboard.press("ControlOrMeta+d");
    await page.waitForFunction(() => [...document.querySelectorAll('[data-cell="clipboard"] svg text')].filter((t) => t.textContent === "Fetch").length === 3);
    return "copy, paste, duplicate";
  },
  async undo(el) {
    const label = svgText(el, "Review");
    const before = await center(label);
    await page.mouse.move(before.x, before.y);
    await page.mouse.down();
    await page.mouse.move(before.x + 60, before.y + 10, { steps: 6 });
    await page.mouse.up();
    assert((await center(label)).x > before.x + 30, "drag moved the node");
    await page.keyboard.press("ControlOrMeta+z");
    await settle();
    assert(Math.abs((await center(label)).x - before.x) < 2, "undo restores the position");
    await page.keyboard.press("ControlOrMeta+Shift+z");
    await settle();
    assert((await center(label)).x > before.x + 30, "redo moves it again");
    return "drag, undo, redo";
  },
  async front(el) {
    await clickWidget(svgText(el, "Bottom card").first());
    await settle();
    const order = await el.locator("svg text").evaluateAll((els) => els.map((t) => t.textContent).filter((t) => t.endsWith(" card")));
    assert.equal(order.at(-1), "Bottom card", `paint order ${order.join(", ")}`);
    return "clicked card paints last";
  },
  async "context-menu"(el) {
    await svgText(el, "Review").first().waitFor();
    const at = await center(svgText(el, "Review"));
    await page.mouse.click(at.x, at.y, { button: "right" });
    await svgText(el, "Duplicate").waitFor();
    const font = await svgText(el, "Duplicate").first().evaluate(el => getComputedStyle(el).fontFamily);
    assert(font.includes("system-ui"), `menu font: ${font}`);
    assert(await el.locator('svg [filter*="drop-shadow"]').count(), "menu has a shadow");
    await page.keyboard.press("Escape");
    return "right-click opens the menu";
  },
  async layout(el) {
    const before = await center(svgText(el, "Stock"));
    await clickWidget(svgText(el, "Grid"));
    await page.waitForTimeout(800);
    const after = await center(svgText(el, "Stock"));
    assert(Math.hypot(after.x - before.x, after.y - before.y) > 10, "Grid moves the nodes");
    return "buttons re-run the layout";
  },
  async "read-only"(el) {
    const before = await center(svgText(el, "Review"));
    await page.mouse.move(before.x, before.y);
    await page.mouse.down();
    await page.mouse.move(before.x + 60, before.y, { steps: 6 });
    await page.mouse.up();
    const after = await center(svgText(el, "Review"));
    // Dragging a locked node pans the pane, so compare against its neighbour.
    assert(Math.abs((await center(svgText(el, "Draft"))).x - after.x) < 2, "node did not leave its column");
    return "nodes stay put";
  },
  async overlap(el) {
    const target = await svgText(el, "Drop onto me").boundingBox();
    const from = await center(svgText(el, "Drag me"));
    await page.mouse.move(from.x, from.y);
    await page.mouse.down();
    await page.mouse.move(target.x + target.width / 2 + 10, target.y + target.height / 2 + 4, { steps: 10 });
    await page.mouse.up();
    await page.waitForTimeout(300);
    const a = await svgText(el, "Drop onto me").boundingBox();
    const b = await svgText(el, "Drag me").boundingBox();
    assert(Math.abs(a.y - b.y) > 20 || Math.abs(a.x - b.x) > 60, "dropped node is pushed aside");
    return "push on drop";
  },
  async align(el) {
    const box = await el.locator("svg").first().boundingBox();
    await page.keyboard.down("Shift");
    // Right to left from the top corner: the button panel sits top-left.
    await page.mouse.move(box.x + box.width - 4, box.y + 4);
    await page.mouse.down();
    await page.mouse.move(box.x + 4, box.y + box.height - 4, { steps: 10 });
    await page.mouse.up();
    await page.keyboard.up("Shift");
    await clickWidget(svgText(el, "Align left"));
    await settle();
    const xs = await Promise.all(["One", "Two", "Three"].map(async (t) => (await center(svgText(el, t))).x));
    assert(Math.max(...xs) - Math.min(...xs) < 2, `aligned x ${xs.map((x) => x.toFixed(0)).join(", ")}`);
    return "Shift-drag then Align left";
  },
  async "delete-reconnect"(el) {
    await clickWidget(svgText(el, "Remove review"));
    await page.waitForFunction((cell) => ![...document.querySelectorAll(`[data-cell="${cell}"] svg text`)].some((t) => t.textContent === "Review"), "delete-reconnect");
    await svgText(el, "Publish").waitFor();
    return "button removes the middle step";
  },
};

try {
  /* Detail pages: exact source, SVG/Canvas, light/dark (and thumbnails). */
  if (wants("examples") || slugs.some((slug) => only?.includes(slug))) {
    for (const entry of entries) {
      const { slug } = entry;
      if (!wants("examples", slug)) continue;
      await step(`example ${slug}`, async () => {
        await open(`/diagram/gallery/${slug}/`);
        const preview = page.locator(`[data-example="${slug}"]`).first();
        await svgReady(preview);
        const source = await readFile(path.join(diagramDir, "_examples", `${entry.file ?? slug}.ts`), "utf8");
        const code = page.locator("[data-code-tabs]");
        assert.equal(await code.getByRole("tab").first().textContent(), `${slug}.ts`);
        await code.getByRole("button", { name: "Copy code" }).click();
        assert.equal(await page.evaluate(() => navigator.clipboard.readText()), source, "copied source");
        await preview.scrollIntoViewIfNeeded();
        for (const color of ["light", "dark"]) {
          await theme(color);
          for (const renderer of ["SVG", "Canvas"]) {
            await preview.getByRole("button", { name: renderer, exact: true }).click();
            if (renderer === "SVG") {
              await svgReady(preview);
              await page.waitForTimeout(1200);
              await readableText(preview);
              if (slug === "dataflow-graph") {
                const stroke = color === "dark" ? "#93c5fd" : "#2563eb";
                assert(await preview.locator(`svg path[stroke="${stroke}"][stroke-width="2"][fill="none"]`).count(), "minimap has a visible viewport outline");
              }
              if (capture) await writeThumbnail(preview, slug, color);
            } else {
              await preview.locator("canvas").first().waitFor();
              await settle();
              assert(await preview.locator("canvas").first().evaluate((canvas) => canvas.width > 0 && canvas.height > 0), "canvas size");
              if (slug === "dataflow-graph") {
                const pixels = await preview.locator("canvas").first().evaluate((canvas, color) => {
                  const box = canvas.getBoundingClientRect(), scale = canvas.width / box.width;
                  const data = canvas.getContext("2d").getImageData(Math.round((box.width - 165) * scale), Math.round((box.height - 115) * scale), Math.round(150 * scale), Math.round(100 * scale)).data;
                  const node = color === "dark" ? [148, 163, 184] : [100, 116, 139];
                  const outline = color === "dark" ? [147, 197, 253] : [37, 99, 235];
                  let nodes = 0, border = 0;
                  for (let i = 0; i < data.length; i += 4) {
                    if (node.every((v, channel) => Math.abs(data[i + channel] - v) < 4)) nodes++;
                    if (outline.every((v, channel) => Math.abs(data[i + channel] - v) < 4)) border++;
                  }
                  return { nodes, border };
                }, color);
                assert(pixels.nodes > 4 && pixels.border > 4, `minimap contrast in Canvas: ${JSON.stringify(pixels)}`);
              }
            }
            await page.waitForTimeout(1200);
            await initialLayout(preview, slug);
            await shot(`${slug}-${color}-${renderer.toLowerCase()}`, preview);
          }
        }
        return `exact source, SVG/Canvas, light/dark${capture ? ", thumbnails written" : ""}`;
      });
    }

    /* The workflow example's own action, dragging and reset. */
    if (slugs.includes("automation-workflow") && wants("examples", "automation-workflow")) {
      await step("automation-workflow interactions", async () => {
        await open("/diagram/gallery/automation-workflow/");
        const workflow = page.locator('[data-example="automation-workflow"]').first();
        await svgReady(workflow);
        const run = workflow.locator("svg text").filter({ hasText: /Run 12 signups$/ });
        if (!(await run.count())) return "replaced example, action check skipped";
        await clickWidget(run);
        await workflow.locator("svg text").filter({ hasText: /✓ 12 items$/ }).first().waitFor();
        const signup = svgText(workflow, "New signup");
        const before = await signup.boundingBox();
        await page.mouse.move(before.x + before.width / 2, before.y + before.height / 2);
        await page.mouse.down();
        await page.mouse.move(before.x + before.width / 2 + 45, before.y + before.height / 2 + 40, { steps: 8 });
        await page.mouse.up();
        const after = await signup.boundingBox();
        assert(after.x > before.x + 20 && after.y > before.y + 20, "custom node drags after its data changes");
        await workflow.getByRole("button", { name: "Reset", exact: true }).click();
        await svgReady(workflow);
        assert.equal(await workflow.locator("svg text").filter({ hasText: /✓ \d+ items$/ }).count(), 0, "Reset restores the initial state");
        return "run, drag, reset";
      });
    }
  }

  if (wants("examples", "deployment-canvas")) {
    await step("deployment inspector follows deletion", async () => {
      await open("/diagram/gallery/deployment-canvas/");
      const preview = page.locator('[data-example="deployment-canvas"]').first();
      await svgReady(preview);
      await svgText(preview, "Redeploy").waitFor();
      await clickWidget(svgText(preview, "checkout-api").first());
      await page.keyboard.press("Backspace");
      await page.waitForFunction(() => ![...document.querySelectorAll('[data-example="deployment-canvas"] svg text')].some(el => el.textContent === "Redeploy"));
      assert.equal(await svgText(preview, "checkout-api").count(), 0);
      return "deleted service and its Redeploy action disappear";
    });
  }
  if (wants("examples", "state-machine")) {
    await step("state transition labels have separate positions", async () => {
      await open("/diagram/gallery/state-machine/");
      const preview = page.locator('[data-example="state-machine"]').first();
      await svgReady(preview);
      const a = await svgText(preview, "SUBMIT").first().boundingBox();
      const b = await svgText(preview, "RETRY").first().boundingBox();
      assert(a && b && (a.y + a.height < b.y || b.y + b.height < a.y), "SUBMIT and RETRY must not stack");
    });
  }
  if (wants("hero")) {
    await step("landing focuses the decision branch", async () => {
      await open("/diagram/");
      const preview = page.locator('[data-presentation="hero"]').first();
      await svgReady(preview);
      await readableText(preview);
      const label = await svgText(preview, "Qualified lead?").first().boundingBox();
      const stage = await preview.locator('[data-diagram-stage]').boundingBox();
      assert(label && stage && label.x >= stage.x && label.x + label.width <= stage.x + stage.width, "decision is framed inside the hero");
      assert(stage.height <= 380, "hero has a compact stage");
    });
  }

  /* Gallery index: a thumbnail card per entry, every chip filters correctly. */
  if (wants("index")) {
    await step("gallery thumbnails on disk", async () => {
      for (const slug of slugs) for (const color of ["light", "dark"]) {
        await access(path.join(thumbnailsDir, `${slug}-${color}.svg`)).catch(() => assert.fail(`missing ${slug}-${color}.svg (run with DIAGRAM_DOCS_THUMBNAILS=1)`));
      }
      return `${slugs.length * 2} files`;
    });
    await step("gallery index", async () => {
      await open("/diagram/gallery/");
      const cards = page.locator("[data-card]");
      assert.equal(await cards.count(), slugs.length, "one card per listed entry");
      assert.deepEqual(await cards.evaluateAll((els) => els.map((el) => el.getAttribute("data-card"))), slugs, "catalog order");
      assert.equal(await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Gallery", exact: true }).getAttribute("href"), "/diagram/gallery/");
      for (const color of ["light", "dark"]) {
        await theme(color);
        for (let i = 0; i < slugs.length; i++) {
          const img = cards.nth(i).locator(`img[data-thumbnail="${color}"]`);
          await img.scrollIntoViewIfNeeded();
          await page.waitForFunction((el) => el.complete, await img.elementHandle());
          assert(await img.evaluate((el) => el.naturalWidth > 0 && el.getBoundingClientRect().height > 0), `${slugs[i]}: ${color} thumbnail shows`);
          assert.equal(await cards.nth(i).locator(`img[data-thumbnail="${color === "light" ? "dark" : "light"}"]`).isVisible(), false, `${slugs[i]}: only the ${color} thumbnail shows`);
        }
      }
      await page.evaluate(() => scrollTo(0, 0));
      await shot("gallery-desktop");
      return `${slugs.length} cards with light and dark thumbnails`;
    });
    await step(`gallery category filters (${chips.length} chips)`, async () => {
      const filters = page.getByRole("group", { name: "Filter by example type" });
      assert.equal(await filters.getByRole("button").count(), chips.length + 1, "All plus one button per chip");
      for (let i = 0; i < chips.length; i++) {
        await filters.getByRole("button").nth(i + 1).click();
        const expected = entries.filter((e) => (e.category ?? "Applications") === chips[i]).map((e) => e.slug);
        assert.deepEqual(await page.locator("[data-card]").evaluateAll((els) => els.map((el) => el.getAttribute("data-card"))), expected, `chip ${chips[i]}`);
      }
      await filters.getByRole("button", { name: "All", exact: true }).click();
      assert.equal(await page.locator("[data-card]").count(), slugs.length);
      return "every category shows the expected examples";
    });
    await step("gallery titles on one line", async () => {
      for (const width of [1440, 390]) {
        await page.setViewportSize({ width, height: 1100 });
        await settle();
        const wrapped = await page.locator("[data-card] h3").evaluateAll((els) =>
          els.filter((el) => el.getBoundingClientRect().height > parseFloat(getComputedStyle(el).fontSize) * 1.7).map((el) => el.textContent),
        );
        assert.deepEqual(wrapped, [], `wraps at ${width}px`);
      }
      await page.setViewportSize({ width: 1440, height: 900 });
      return "1440px and 390px";
    });
  }

  /* Interactions: every ready cell renders live; some also get exercised. */
  if (wants("cells") || cells.some((cell) => only?.includes(cell.id))) {
    await open("/diagram/interactions/");
    await theme("light");
    await step("interactions page", async () => {
      assert.equal(await page.locator("[data-cell]").count(), cells.length);
      return `${cells.length} cells, ${cells.filter((c) => c.ready).length} live`;
    });
    for (const cell of cells) {
      if (!wants("cells", cell.id)) continue;
      await step(`cell ${cell.id}`, async () => {
        const el = page.locator(`[data-cell="${cell.id}"]`);
        await el.scrollIntoViewIfNeeded();
        if (cell.ready) await svgReady(el);
        else await el.getByText("Live demo in progress").waitFor();
        assert(await el.locator("pre").count(), "snippet");
        assert(!cell.caption.includes("\n"), "caption is one line");
        const note = cell.ready && cellBehaviour[cell.id] ? await cellBehaviour[cell.id](el) : cell.ready ? "renders" : "placeholder";
        await shot(`cell-${cell.id}`, el);
        return note;
      });
    }
  }

  /* API tables come from generated data. */
  if (wants("api")) {
    await step("api sections", async () => {
      await open("/diagram/api/");
      for (const id of ["props", "interaction", "custom", "controller", "types"]) await page.locator(`#${id}`).waitFor();
      assert((await page.locator("table tr").count()) > 100, "API tables rendered");
    });
  }

  /* Every /diagram link resolves; the sitemap lists every listed slug. */
  if (wants("links")) {
    await step("links and sitemap", async () => {
      const routes = ["/diagram/", "/diagram/installation/", "/diagram/quick-start/", "/diagram/gallery/", "/diagram/interactions/", "/diagram/api/", "/diagram/api/flow-diagram/"];
      const links = new Set();
      for (const route of routes) {
        await open(route);
        for (const href of await page.locator('a[href^="/diagram"]').evaluateAll((elements) => elements.map((el) => el.getAttribute("href")))) links.add(href.split("#")[0]);
      }
      for (const href of links) assert.equal((await page.request.get(`${base}${href}`)).status(), 200, href);
      const sitemap = await (await page.request.get(`${base}/sitemap.xml`)).text();
      for (const slug of slugs) assert(sitemap.includes(`/diagram/gallery/${slug}/`), `${slug}: sitemap`);
      for (const route of routes) assert(sitemap.includes(route), `${route}: sitemap`);
      return `${links.size} links`;
    });
  }

  /* Mobile width and navigation. */
  if (wants("mobile")) {
    await step("mobile", async () => {
      await page.setViewportSize({ width: 390, height: 844 });
      for (const route of ["/diagram/", "/diagram/gallery/", `/diagram/gallery/${slugs[0]}/`, "/diagram/interactions/", "/diagram/api/"]) {
        await open(route);
        await settle();
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${route}: mobile horizontal overflow`);
        await shot(`mobile-${route.split("/").filter(Boolean).join("-")}`);
      }
      for (const slug of slugs) {
        await open(`/diagram/gallery/${slug}/`);
        const preview = page.locator(`[data-example="${slug}"]`).first();
        await svgReady(preview);
        await page.waitForTimeout(1200);
        const stage = await preview.locator('[data-diagram-stage]').boundingBox();
        assert(stage.height <= 320, `${slug}: compact mobile stage`);
        await initialLayout(preview, slug);
        await readableText(preview);
        await preview.getByRole("button", { name: "Canvas", exact: true }).click();
        await preview.locator("canvas").waitFor();
        await page.waitForTimeout(1200);
        await initialLayout(preview, slug);
        await preview.getByRole("button", { name: "SVG", exact: true }).click();
        await svgReady(preview);
        const overflowing = await preview.locator('svg text').evaluateAll(texts => texts.filter(el => {
          const stage = el.closest('[data-diagram-stage]').getBoundingClientRect(), box = el.getBoundingClientRect();
          // Fixed hint text is at the bottom; node containment is checked separately above.
          return /Drag an output into empty|right-click empty space|Blue: image|Select → collapse|Double-click frame:|Viewer · hover|Drag a violet FK|Select → append|Right-click a connection →/.test(el.textContent ?? '') && (box.left < stage.left || box.right > stage.right);
        }).map(el => el.textContent));
        assert.deepEqual(overflowing, [], `${slug}: no overflowing hint`);
      }
      await page.setViewportSize({ width: 1440, height: 900 });
    });
  }
  if (wants("mobile") || wants("mobile-navigation")) {
    await step("mobile sidebar navigation", async () => {
      await page.setViewportSize({ width: 390, height: 844 });
      await open("/diagram/gallery/");
      await page.getByRole("button", { name: "Open sidebar navigation" }).click();
      const interactions = page.getByRole("link", { name: "Interactions", exact: true }).filter({ visible: true });
      if (!(await interactions.count())) await page.getByRole("heading", { name: "API", exact: true }).filter({ visible: true }).click();
      await interactions.click();
      await page.waitForURL("**/diagram/interactions/");
      await page.setViewportSize({ width: 1440, height: 900 });
    });
  }

} finally {
  await browser.close();
}

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed (${slugs.length} examples, ${chips.length} chips, ${cells.length} cells)`);
for (const r of failed) console.log(`  ✗ ${r.name}: ${r.message}`);
process.exitCode = failed.length ? 1 : 0;
