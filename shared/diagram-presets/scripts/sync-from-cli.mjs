import { readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { runAdd } from "../../../packages/flitter/cli/commands/add.mjs";
import { loadRegistry, isDiagramItem, resolveItemOutputDir } from "../../../packages/flitter/cli/lib/registry.mjs";

const presetsRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const preserve = new Set(["README.md", "flitter.json", "node_modules", "package.json", "scripts", "tsconfig.json"]);

for (const entry of await readdir(presetsRoot, { withFileTypes: true })) {
  if (preserve.has(entry.name)) continue;
  await rm(path.join(presetsRoot, entry.name), { recursive: true, force: true });
}

const registry = await loadRegistry();
const items = registry.items.filter(isDiagramItem);
const defaultStyle = "xyflow";
const lines = [];
for (const item of items) {
  await runAdd({ cwd: presetsRoot, chartName: item.name, style: item.style, overwrite: true, skipInstall: true });
  const outputDir = resolveItemOutputDir(item, defaultStyle);
  const pascal = item.name.split("-").map((part) => part[0].toUpperCase() + part.slice(1)).join("");
  const exportName = item.style === defaultStyle ? pascal : `${item.style[0].toUpperCase()}${item.style.slice(1)}${pascal}`;
  lines.push(`export { ${registry.diagramMetadata[item.name].componentName} as ${exportName} } from "./${outputDir}";`);
}
await writeFile(path.join(presetsRoot, "index.ts"), `${lines.join("\n")}\n`);
console.log(`Synced ${items.length} diagram preset(s).`);
