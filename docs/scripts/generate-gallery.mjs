#!/usr/bin/env node

/**
 * Scans gallery entry files and generates a single entries.generated.ts file.
 *
 * Supports two entry formats:
 *   entries/{chartType}/{style}/{exampleName}/index.tsx  (+ optional auxiliary files)
 *
 * For each entry:
 *   - index.tsx is transformed (strip boilerplate, rewrite imports) → main code snippet
 *   - Auxiliary files are lightly transformed (rewrite imports only)
 *   - All files are output as a `files[]` array with filenames
 *
 * Usage: npm run gen:gallery
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ENTRIES_DIR = path.resolve(__dirname, "../src/app/chart/_data/gallery/entries");
const THUMBNAIL_URL_PREFIX = "/charts";
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

// ── Core transforms ─────────────────────────────────────────────────────────

/** Transform the main entry file (index.tsx or single .tsx) — extracts chart call */
function transformMainEntry(source) {
  let code = source.replace(/["']use client["'];\s*\n\n?/g, "");
  code = code.replace(/export\s+const\s+galleryTitle\s*=\s*["'`][^"'`]*["'`];\s*\n\n?/g, "");
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

/** Transform an auxiliary file — rewrite imports only */
function transformAuxFile(source) {
  let code = source.replace(/["']use client["'];\s*\n\n?/g, "");

  // Replace shared/chart imports
  code = code.replace(
    /import\s*\{([^}]+)\}\s*from\s*["']shared\/chart["']/g,
    (_, importContent) => {
      const names = importContent.split(",").map((s) => s.trim()).filter(Boolean);
      return names
        .map((name) => {
          const cleanName = name.split(" as ")[0].trim();
          return `import ${name} from "@/components/flitter/charts/${toKebab(cleanName)}"`;
        })
        .join(";\n");
    },
  );

  return code.trim();
}

// ── Discover entries (folder structure) ─────────────────────────────────────
//
// Expected layout:
//   entries/{chartType}/{style}/{exampleName}/index.tsx  (+ optional aux files)

function discoverEntries() {
  const results = [];
  const chartTypes = fs.readdirSync(ENTRIES_DIR).filter((d) => {
    return fs.statSync(path.join(ENTRIES_DIR, d)).isDirectory();
  });

  for (const chartType of chartTypes) {
    const chartDir = path.join(ENTRIES_DIR, chartType);
    const styles = fs.readdirSync(chartDir).filter((d) => {
      return fs.statSync(path.join(chartDir, d)).isDirectory();
    });

    for (const styleLower of styles) {
      if (styleLower !== "ag" && styleLower !== "toast") {
        console.warn(`  Skipping unknown style directory: ${chartType}/${styleLower}`);
        continue;
      }

      const styleDir = path.join(chartDir, styleLower);
      const examples = fs.readdirSync(styleDir).filter((d) => {
        return fs.statSync(path.join(styleDir, d)).isDirectory();
      });

      for (const exampleName of examples) {
        const exampleDir = path.join(styleDir, exampleName);
        const indexPath = path.join(exampleDir, "index.tsx");
        if (!fs.existsSync(indexPath)) {
          console.warn(`  No index.tsx in ${chartType}/${styleLower}/${exampleName}`);
          continue;
        }

        const style = styleLower === "ag" ? "AG" : "Toast";
        const slug = `${chartType}-${styleLower}-${exampleName}`;
        const title = toTitleCase(chartType);
        const installCommand = `npx flitter-ui add ${chartType} --${styleLower}`;

        // Read all files in the example folder
        const folderFiles = fs
          .readdirSync(exampleDir)
          .filter((f) => f.endsWith(".tsx") || f.endsWith(".ts"))
          .sort((a, b) => {
            if (a === "index.tsx") return -1;
            if (b === "index.tsx") return 1;
            return a.localeCompare(b);
          });

        const codeFiles = [];
        let mainSnippet = null;
        let entryTitle = title;

        for (const file of folderFiles) {
          const source = fs.readFileSync(path.join(exampleDir, file), "utf-8");

          if (file === "index.tsx") {
            mainSnippet = transformMainEntry(source);
            if (!mainSnippet) {
              console.warn(`  Could not transform: ${chartType}/${styleLower}/${exampleName}/index.tsx`);
              break;
            }
            codeFiles.push({ filename: file, code: mainSnippet });

            const titleMatch = source.match(/export\s+const\s+galleryTitle\s*=\s*["'`]([^"'`]+)["'`]/);
            if (titleMatch) entryTitle = titleMatch[1];
          } else {
            codeFiles.push({ filename: file, code: transformAuxFile(source) });
          }
        }

        if (!mainSnippet) continue;

        const importAlias = "_" + toPascalCase(slug);
        const importPath = `${chartType}/${styleLower}/${exampleName}`;

        results.push({
          slug,
          chartType,
          style,
          title: entryTitle,
          installCommand,
          importAlias,
          importPath,
          codeFiles,
        });
      }
    }
  }

  return results;
}

// ── Main ─────────────────────────────────────────────────────────────────────

if (!fs.existsSync(ENTRIES_DIR)) {
  console.log("No entries directory found. Nothing to generate.");
  process.exit(0);
}

const entries = discoverEntries();

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
  lines.push(`import ${e.importAlias} from "./entries/${e.importPath}";`);
}
lines.push("");

// 2. Code file consts + thumbnail consts
for (const e of entries) {
  // files array
  lines.push(`const ${e.importAlias}_files = [`);
  for (const f of e.codeFiles) {
    lines.push(`  { filename: "${f.filename}", code: \`${escapeTemplateLiteral(f.code)}\` },`);
  }
  lines.push(`];`);

  lines.push("");
}

// 3. Type export
lines.push("export type GalleryEntryGenerated = {");
lines.push("  slug: string;");
lines.push("  chartType: string;");
lines.push('  style: "Toast" | "AG";');
lines.push("  title: string;");
lines.push("  Component: React.ComponentType;");
lines.push("  thumbnailUrl: string;");
lines.push("  files: { filename: string; code: string }[];");
lines.push("  installCommand: string;");
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
  lines.push(`    thumbnailUrl: "${THUMBNAIL_URL_PREFIX}/${e.slug}.svg",`);
  lines.push(`    files: ${e.importAlias}_files,`);
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
