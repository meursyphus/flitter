import fs from "node:fs/promises";
import path from "node:path";

export async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function ensureDirectory(directoryPath) {
  await fs.mkdir(directoryPath, { recursive: true });
}

export async function readJson(filePath, parser = JSON.parse) {
  const raw = await fs.readFile(filePath, "utf8");
  return parser(raw);
}

export async function writeJson(filePath, value) {
  await ensureDirectory(path.dirname(filePath));
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

export async function writeText(filePath, content) {
  await ensureDirectory(path.dirname(filePath));
  await fs.writeFile(filePath, content, "utf8");
}

export function toPosix(filePath) {
  return filePath.split(path.sep).join("/");
}

export function toRelativeImport(fromFile, toFile) {
  const rawRelativePath = toPosix(path.relative(path.dirname(fromFile), toFile));
  const withoutExtension = rawRelativePath.replace(/\.(ts|tsx|js|mjs)$/u, "");
  return withoutExtension.startsWith(".") ? withoutExtension : `./${withoutExtension}`;
}

export async function readText(filePath) {
  return fs.readFile(filePath, "utf8");
}
