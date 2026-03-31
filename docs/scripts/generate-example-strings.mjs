#!/usr/bin/env node

/**
 * Reads example component .tsx files and generates { Component, code } pairs.
 *
 * For each _data/{chart}/{style}/examples/*.tsx file:
 *   1. Imports the original React component
 *   2. Strips React/Widget boilerplate to produce a user-facing code snippet
 *   3. Exports named { Component, code } objects
 *
 * Usage: npm run gen:examples
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, "../src/app/chart/_data");

// ── Helpers ──────────────────────────────────────────────────────────────────

function toKebab(str) {
  return str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
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

// ── Core transform ──────────────────────────────────────────────────────────

function transformExample(source) {
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

  const funcIndex = code.indexOf("export default function");
  if (funcIndex === -1) return null;

  let importSection = code.substring(0, funcIndex);
  const importPath = `./charts/${toKebab(displayName)}`;
  importSection = importSection.replace(sharedImportRe, `import ${displayName} from "${importPath}";\n`);
  importSection = importSection.trim();

  const widgetPattern = `widget={${callName}(`;
  const widgetIdx = code.indexOf(widgetPattern);
  if (widgetIdx === -1) return null;

  const callStartIdx = widgetIdx + "widget={".length;
  const afterOpenParen = callStartIdx + callName.length + 1;
  const endPos = findMatchingParen(code, afterOpenParen);

  let chartCall = code.substring(callStartIdx, endPos);

  if (callName !== displayName) {
    chartCall = chartCall.replace(callName, displayName);
  }

  chartCall = dedent(chartCall);

  const funcNameMatch = code.match(/export\s+default\s+function\s+(\w+)/);
  const functionName = funcNameMatch ? funcNameMatch[1] : null;

  return { functionName, snippet: `${importSection}\n\nconst chart = ${chartCall};` };
}

/** Parse examples/index.ts to get export-name → filename mapping */
function parseExportsIndex(indexPath) {
  if (!fs.existsSync(indexPath)) return {};
  const content = fs.readFileSync(indexPath, "utf-8");
  const map = {}; // exportName → filename (without extension)

  const re = /export\s*\{\s*default\s+as\s+(\w+)\s*\}\s*from\s*["']\.\/([^"']+)["']/g;
  let m;
  while ((m = re.exec(content)) !== null) {
    map[m[1]] = m[2];
  }
  return map;
}

// ── Main ─────────────────────────────────────────────────────────────────────

const chartDirs = fs
  .readdirSync(DATA_DIR)
  .filter((d) => fs.statSync(path.join(DATA_DIR, d)).isDirectory() && d.endsWith("-chart"));

let totalGenerated = 0;

for (const chartDir of chartDirs.sort()) {
  for (const style of ["toast", "ag"]) {
    const examplesDir = path.join(DATA_DIR, chartDir, style, "examples");
    if (!fs.existsSync(examplesDir)) continue;

    const files = fs.readdirSync(examplesDir).filter((f) => f.endsWith(".tsx") && f !== "index.tsx");
    if (files.length === 0) continue;

    // Build filename → { functionName, snippet }
    const snippetsByFile = {};
    for (const file of files.sort()) {
      const source = fs.readFileSync(path.join(examplesDir, file), "utf-8");
      const result = transformExample(source);

      if (!result || !result.functionName) {
        console.warn(`⚠  Could not transform: ${chartDir}/${style}/examples/${file}`);
        continue;
      }

      const baseName = file.replace(".tsx", "");
      snippetsByFile[baseName] = result;
    }

    if (Object.keys(snippetsByFile).length === 0) continue;

    // Parse exports index for aliases
    const exportsMap = parseExportsIndex(path.join(examplesDir, "index.ts"));

    // ── Build output ──

    // 1. Component imports
    const componentImports = [];
    for (const [baseName, { functionName }] of Object.entries(snippetsByFile)) {
      componentImports.push(`import _${functionName} from "./examples/${baseName}";`);
    }

    // 2. Code snippet consts
    const codeConsts = [];
    for (const [, { functionName, snippet }] of Object.entries(snippetsByFile)) {
      codeConsts.push(`const _${functionName}_code = \`${escapeTemplateLiteral(snippet)}\`;`);
    }

    // 3. Named exports: { Component, code } pairs
    //    Include both original function names and aliases from index.ts
    const exports = [];
    const exported = new Set();

    // From exports index (preserves order, includes aliases)
    for (const [exportName, fileName] of Object.entries(exportsMap)) {
      const data = snippetsByFile[fileName];
      if (!data) continue;
      exports.push(
        `export const ${exportName} = { Component: _${data.functionName}, code: _${data.functionName}_code };`
      );
      exported.add(exportName);
    }

    // Any functions not covered by exports index
    for (const [, { functionName }] of Object.entries(snippetsByFile)) {
      if (!exported.has(functionName)) {
        exports.push(
          `export const ${functionName} = { Component: _${functionName}, code: _${functionName}_code };`
        );
      }
    }

    // Write file
    const output = [
      "// Auto-generated by scripts/generate-example-strings.mjs",
      "// Do not edit manually. Run: npm run gen:examples",
      "",
      ...componentImports,
      "",
      ...codeConsts,
      "",
      ...exports,
      "",
    ].join("\n");

    const outputPath = path.join(DATA_DIR, chartDir, style, "examples.generated.ts");
    fs.writeFileSync(outputPath, output);
    totalGenerated += Object.keys(snippetsByFile).length;
    console.log(`✓ ${chartDir}/${style}/examples.generated.ts (${Object.keys(snippetsByFile).length} examples)`);
  }
}

console.log(`\nDone! Generated ${totalGenerated} example pairs.`);
