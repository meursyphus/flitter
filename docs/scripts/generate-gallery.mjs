#!/usr/bin/env node

/**
 * Scans gallery entry files and generates a single entries.generated.ts file.
 *
 * For each gallery/entries/*.tsx file:
 *   1. Strips React/Widget boilerplate to produce a user-facing code snippet
 *   2. Replaces import paths for CLI-installed chart components
 *   3. Parses filename to extract metadata (chartType, style, slug, title)
 *
 * Usage: npm run gen:gallery
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ENTRIES_DIR = path.resolve(__dirname, "../src/app/chart/_data/gallery/entries");
const THUMBS_DIR = path.resolve(__dirname, "../src/app/chart/_data/gallery/thumbnails");
const OUTPUT_PATH = path.resolve(__dirname, "../src/app/chart/_data/gallery/entries.generated.ts");

// ── Helpers (reused from generate-example-strings.mjs) ──────────────────────

function toKebab(str) {
  return str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

function toPascalCase(kebab) {
  return kebab
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
}

function toTitleCase(kebab) {
  return kebab
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

function escapeTemplateLiteral(str) {
  return str.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
}

/** Remove common leading whitespace from lines 2+ */
function dedent(str) {
  const lines = str.split("\n");
  if (lines.length <= 1) return str;

  let minIndent = Infinity;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === "") continue;
    const indent = lines[i].match(/^(\s*)/)[1].length;
    minIndent = Math.min(minIndent, indent);
  }
  if (minIndent === 0 || minIndent === Infinity) return str;

  return lines
    .map((line, i) => (i === 0 ? line : line.substring(Math.min(minIndent, line.length))))
    .join("\n");
}

/** Find the position right after the matching closing paren, handling strings/comments. */
function findMatchingParen(code, startPos) {
  let depth = 1;
  let pos = startPos;
  while (pos < code.length && depth > 0) {
    const ch = code[pos];

    if (ch === '"' || ch === "'") {
      pos++;
      while (pos < code.length && code[pos] !== ch) {
        if (code[pos] === "\\") pos++;
        pos++;
      }
      pos++;
      continue;
    }

    if (ch === "`") {
      pos++;
      while (pos < code.length && code[pos] !== "`") {
        if (code[pos] === "\\") {
          pos++;
        } else if (code[pos] === "$" && pos + 1 < code.length && code[pos + 1] === "{") {
          pos += 2;
          let bd = 1;
          while (pos < code.length && bd > 0) {
            if (code[pos] === "{") bd++;
            else if (code[pos] === "}") bd--;
            if (bd > 0) pos++;
          }
          pos++;
          continue;
        }
        pos++;
      }
      pos++;
      continue;
    }

    if (ch === "/" && pos + 1 < code.length && code[pos + 1] === "/") {
      while (pos < code.length && code[pos] !== "\n") pos++;
      continue;
    }

    if (ch === "/" && pos + 1 < code.length && code[pos + 1] === "*") {
      pos += 2;
      while (pos < code.length && !(code[pos] === "*" && code[pos + 1] === "/")) pos++;
      pos += 2;
      continue;
    }

    if (ch === "(") depth++;
    if (ch === ")") depth--;
    pos++;
  }
  return pos;
}

// ── Core transform (adapted for gallery) ────────────────────────────────────

function transformGalleryEntry(source) {
  let code = source.replace(/["']use client["'];\s*\n\n?/g, "");
  code = code.replace(/import\s+Widget\s+from\s+["']@flitterjs\/react["'];\s*\n/g, "");

  const sharedImportRe = /import\s*\{([^}]+)\}\s*from\s*["']shared\/chart["'];\s*\n/;
  const match = code.match(sharedImportRe);
  if (!match) return null;

  const importContent = match[1].trim();
  let displayName, callName;

  const aliasMatch = importContent.match(/(\w+)\s+as\s+(\w+)/);
  if (aliasMatch) {
    displayName = aliasMatch[1];
    callName = aliasMatch[2];
  } else {
    displayName = importContent.split(",")[0].trim();
    callName = displayName;
  }

  const createWidgetIndex = code.indexOf("export function createWidget()");
  if (createWidgetIndex === -1) return null;

  let importSection = code.substring(0, createWidgetIndex);
  const importPath = `@/components/flitter/charts/${toKebab(displayName)}`;
  importSection = importSection.replace(sharedImportRe, `import ${displayName} from "${importPath}";\n`);
  importSection = importSection.trim();

  const returnIndex = code.indexOf("return", createWidgetIndex);
  if (returnIndex === -1) return null;

  const callStartIdx = code.indexOf(`${callName}(`, returnIndex);
  if (callStartIdx === -1) return null;

  const afterOpenParen = callStartIdx + callName.length + 1;
  const endPos = findMatchingParen(code, afterOpenParen);

  let chartCall = code.substring(callStartIdx, endPos);

  if (callName !== displayName) {
    chartCall = chartCall.replace(callName, displayName);
  }

  chartCall = dedent(chartCall);

  return `${importSection}\n\nconst chart = ${chartCall};`;
}

// ── Filename parsing ────────────────────────────────────────────────────────

function parseFilename(filename) {
  const slug = filename.replace(/\.tsx$/, "");

  // Last segment is style (toast or ag)
  const styleMatch = slug.match(/^(.+)-(toast|ag)$/);
  if (!styleMatch) return null;

  const chartType = styleMatch[1];
  const styleLower = styleMatch[2];
  const style = styleLower === "ag" ? "AG" : "Toast";

  // title: chartType in title case (e.g. "bar-chart" → "Bar Chart")
  const title = toTitleCase(chartType);

  const installCommand = `npx flitter-ui add ${chartType} --${styleLower}`;

  return { slug, chartType, style, title, installCommand };
}

// ── Main ─────────────────────────────────────────────────────────────────────

if (!fs.existsSync(ENTRIES_DIR)) {
  console.log("No entries directory found. Nothing to generate.");
  process.exit(0);
}

const files = fs
  .readdirSync(ENTRIES_DIR)
  .filter((f) => f.endsWith(".tsx"))
  .sort();

if (files.length === 0) {
  console.log("No .tsx files found in entries/. Nothing to generate.");
  process.exit(0);
}

const entries = [];

for (const file of files) {
  const meta = parseFilename(file);
  if (!meta) {
    console.warn(`  Could not parse filename: ${file}`);
    continue;
  }

  const source = fs.readFileSync(path.join(ENTRIES_DIR, file), "utf-8");
  const snippet = transformGalleryEntry(source);
  if (!snippet) {
    console.warn(`  Could not transform: ${file}`);
    continue;
  }

  const thumbnailPath = path.join(THUMBS_DIR, file.replace(/\.tsx$/, ".svg"));
  const thumbnail = fs.existsSync(thumbnailPath)
    ? fs.readFileSync(thumbnailPath, "utf-8")
    : "";

  // Extract exported galleryTitle if present
  const titleMatch = source.match(/export\s+const\s+galleryTitle\s*=\s*["'`]([^"'`]+)["'`]/);
  if (titleMatch) {
    meta.title = titleMatch[1];
  }

  const importAlias = "_" + toPascalCase(meta.slug);
  entries.push({ ...meta, importAlias, file, snippet, thumbnail });
}

if (entries.length === 0) {
  console.log("No valid entries found. Nothing to generate.");
  process.exit(0);
}

// Sort by slug
entries.sort((a, b) => a.slug.localeCompare(b.slug));

// ── Build output ────────────────────────────────────────────────────────────

const lines = [];

lines.push("// Auto-generated by scripts/generate-gallery.mjs");
lines.push("// Do not edit manually. Run: npm run gen:gallery");
lines.push("");

// 1. Component imports
for (const e of entries) {
  const baseName = e.file.replace(/\.tsx$/, "");
  lines.push(`import ${e.importAlias} from "./entries/${baseName}";`);
}
lines.push("");

// 2. Code snippet consts
for (const e of entries) {
  lines.push(`const ${e.importAlias}_code = \`${escapeTemplateLiteral(e.snippet)}\`;`);
  lines.push(`const ${e.importAlias}_thumbnail = \`${escapeTemplateLiteral(e.thumbnail)}\`;`);
  lines.push("");
}

// 3. Type export
lines.push("export type GalleryEntryGenerated = {");
lines.push('  slug: string;');
lines.push('  chartType: string;');
lines.push('  style: "Toast" | "AG";');
lines.push('  title: string;');
lines.push('  Component: React.ComponentType;');
lines.push('  thumbnail: string;');
lines.push('  code: string;');
lines.push('  installCommand: string;');
lines.push("};");
lines.push("");

// 4. Entries array
lines.push("export const galleryEntries: GalleryEntryGenerated[] = [");
for (const e of entries) {
  lines.push("  {");
  lines.push(`    slug: "${e.slug}",`);
  lines.push(`    chartType: "${e.chartType}",`);
  lines.push(`    style: "${e.style}",`);
  lines.push(`    title: "${e.title}",`);
  lines.push(`    Component: ${e.importAlias},`);
  lines.push(`    thumbnail: ${e.importAlias}_thumbnail,`);
  lines.push(`    code: ${e.importAlias}_code,`);
  lines.push(`    installCommand: "${e.installCommand}",`);
  lines.push("  },");
}
lines.push("];");
lines.push("");

// 5. Categories (unique chartTypes, sorted)
const categoryMap = new Map();
for (const e of entries) {
  if (!categoryMap.has(e.chartType)) {
    const label = e.chartType
      .replace(/-chart$/, "")
      .split("-")
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(" ");
    categoryMap.set(e.chartType, label);
  }
}
const sortedCategories = [...categoryMap.entries()].sort((a, b) => a[0].localeCompare(b[0]));

lines.push("export const galleryCategories = [");
for (const [id, label] of sortedCategories) {
  lines.push(`  { id: "${id}", label: "${label}" },`);
}
lines.push("];");
lines.push("");

// 6. Todo categories
lines.push("export const todoCategories = [");
const todos = [
  "box-plot-chart",
  "bullet-chart",
  "candlestick-chart",
  "funnel-chart",
  "histogram-chart",
  "sankey-chart",
  "waterfall-chart",
];
for (const t of todos) {
  lines.push(`  "${t}",`);
}
lines.push("];");
lines.push("");

fs.writeFileSync(OUTPUT_PATH, lines.join("\n"));
console.log(`Done! Generated ${entries.length} gallery entries → entries.generated.ts`);
