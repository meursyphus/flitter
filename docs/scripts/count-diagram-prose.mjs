/**
 * Counts reader-facing prose in the diagram docs (todo/diagram.md §6: ≤ 2,500
 * words outside code and tables, no sentence over 20 words).
 *
 *   node scripts/count-diagram-prose.mjs
 *
 * Budgeted: MDX paragraphs, headings and lists; JSX text; prose-like string
 * literals in pages and components. Skipped: code fences, tables, imports,
 * `metadata` exports, className-style strings, `_examples/` (source code).
 * `_data/` strings (captions, table descriptions) are reported separately and
 * only checked for sentence length.
 */
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const docs = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const root = path.join(docs, "src/app/diagram");
const BUDGET = 2500;
const MAX_SENTENCE = 20;

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (/\.(mdx|tsx?)$/.test(entry.name)) out.push(full);
  }
  return out;
}

const words = (text) => text.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w));

function mdxProse(source) {
  const lines = source
    .replace(/^export const metadata = {[\s\S]*?^};$/m, "")
    .replace(/^```[\s\S]*?^```$/gm, "")
    .split("\n");
  return lines
    .filter((line) => !/^\s*(import |export |\||<\/?[A-Za-z][^>]*>\s*$)/.test(line))
    .map((line) =>
      line
        .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
        .replace(/^\s*(#+|[-*]|\d+\.)\s+/, "")
        .replace(/[`*_]/g, ""),
    )
    .filter((line) => line.trim());
}

const SKIP_ATTRS = new Set(["className", "href", "id", "key", "role", "lang", "type", "slug", "size", "d", "viewBox", "fill", "stroke", "data-example"]);
const SKIP_KEYS = new Set(["className", "href", "id", "slug", "file", "layout", "lang", "group", "kind"]);

/** Strings a reader sees as prose, not identifiers, class lists or code. */
function looksLikeProse(text) {
  const t = text.trim();
  if (!t || t.includes("\n") || /[{};=]|=>/.test(t)) return false;
  if (words(t).length < 2) return false;
  if (/^[a-z0-9:[\]\-/.%()_&>!#,\s]+$/.test(t) && /-/.test(t)) return false; // tailwind classes
  return /^[A-Z⌘]/.test(t) || /[.!?]$/.test(t);
}

function tsProse(file, source) {
  const sf = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, file.endsWith("x") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const found = [];
  const visit = (node) => {
    if (ts.isVariableStatement(node) && node.declarationList.declarations.some((d) => d.name.getText(sf) === "metadata")) return;
    if (ts.isImportDeclaration(node)) return;
    if (ts.isJsxAttribute(node) && SKIP_ATTRS.has(node.name.getText(sf))) return;
    if (ts.isJsxAttribute(node) && node.name.getText(sf).startsWith("aria-")) return;
    if (ts.isPropertyAssignment(node) && SKIP_KEYS.has(node.name.getText(sf))) return;
    if (ts.isJsxText(node)) {
      const text = node.getText(sf).replace(/\s+/g, " ").trim();
      if (text) found.push(text);
    } else if ((ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) && looksLikeProse(node.text)) {
      found.push(node.text);
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return found;
}

function routeOf(rel) {
  if (!/(^|\/)page\.(mdx|tsx)$/.test(rel)) return null;
  return `/diagram/${path.dirname(rel)}`.replace(/\/\.$/, "");
}

const files = (await walk(root)).filter((f) => !f.includes(`${path.sep}_examples${path.sep}`) && !f.endsWith(".generated.ts"));
const budgeted = [];
const data = [];
const longSentences = [];

for (const file of files.sort()) {
  const rel = path.relative(root, file);
  const source = await readFile(file, "utf8");
  const texts = file.endsWith(".mdx") ? mdxProse(source) : tsProse(file, source);
  const count = texts.reduce((n, t) => n + words(t).length, 0);
  for (const text of texts) {
    for (const sentence of text.split(/(?<=[.!?])\s+/)) {
      if (words(sentence).length > MAX_SENTENCE) longSentences.push({ rel, sentence, n: words(sentence).length });
    }
  }
  if (!count) continue;
  (rel.startsWith("_data") ? data : budgeted).push({ rel, route: routeOf(rel), count });
}

const pad = (s, n) => String(s).padEnd(n);
const print = (rows) => rows.forEach((r) => console.log(`  ${pad(r.count, 6)}${pad(r.route ?? "", 26)}${r.rel}`));
const total = budgeted.reduce((n, r) => n + r.count, 0);

console.log("Budgeted prose (pages and components)");
print(budgeted);
console.log(`  ${pad(total, 6)}TOTAL (budget ${BUDGET})\n`);
console.log("Data strings: captions and table descriptions (not budgeted)");
print(data);
console.log(`  ${pad(data.reduce((n, r) => n + r.count, 0), 6)}TOTAL\n`);

if (longSentences.length) {
  console.log(`Sentences over ${MAX_SENTENCE} words`);
  for (const s of longSentences) console.log(`  ${s.n}  ${s.rel}: ${s.sentence}`);
} else console.log(`No sentence over ${MAX_SENTENCE} words.`);

if (total > BUDGET || longSentences.length) process.exit(1);
