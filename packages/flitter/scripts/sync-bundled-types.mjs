import { cp, copyFile, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(scriptDir, "..");
const distRoot = path.resolve(packageRoot, "dist");
const coreDistRoot = path.resolve(packageRoot, "../core/dist");
const chartDistRoot = path.resolve(packageRoot, "../chart/dist");
const tooltipTypePattern = /^Tooltip-.*\.d\.(ts|cts)$/;

await rm(path.join(distRoot, "headless"), { recursive: true, force: true });
await rm(path.join(distRoot, "shared"), { recursive: true, force: true });

await cp(path.join(chartDistRoot, "headless"), path.join(distRoot, "headless"), {
  recursive: true,
});
await cp(path.join(chartDistRoot, "shared"), path.join(distRoot, "shared"), {
  recursive: true,
});

const coreDistEntries = await readdir(coreDistRoot);
const tooltipTypes = coreDistEntries.filter((entry) => tooltipTypePattern.test(entry));

if (tooltipTypes.length === 0) {
  throw new Error(`Could not find Tooltip declaration files in ${coreDistRoot}`);
}

for (const entry of await readdir(distRoot)) {
  if (tooltipTypePattern.test(entry)) {
    await rm(path.join(distRoot, entry), { force: true });
  }
}

for (const entry of tooltipTypes) {
  await copyFile(path.join(coreDistRoot, entry), path.join(distRoot, entry));
}

await copyFile(path.join(coreDistRoot, "index.d.ts"), path.join(distRoot, "index.d.ts"));
await copyFile(path.join(coreDistRoot, "index.d.cts"), path.join(distRoot, "index.d.cts"));

const chartTypes = await readFile(path.join(chartDistRoot, "index.d.ts"), "utf8");
await writeFile(path.join(distRoot, "chart.d.ts"), chartTypes);
await writeFile(path.join(distRoot, "chart.d.cts"), chartTypes);
