import {
  cp,
  copyFile,
  readFile,
  readdir,
  rm,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(scriptDir, "..");
const distRoot = path.resolve(packageRoot, "dist");
const coreDistRoot = path.resolve(packageRoot, "../core/dist");
const chartDistRoot = path.resolve(packageRoot, "../chart/dist");

await rm(path.join(distRoot, "headless"), { recursive: true, force: true });
await rm(path.join(distRoot, "shared"), { recursive: true, force: true });

await cp(
  path.join(chartDistRoot, "headless"),
  path.join(distRoot, "headless"),
  {
    recursive: true,
  },
);
await cp(path.join(chartDistRoot, "shared"), path.join(distRoot, "shared"), {
  recursive: true,
});

const coreDistFiles = await readdir(coreDistRoot);
const tooltipTypeDefinitions = coreDistFiles.filter((file) =>
  /^Tooltip-.*\.d\.(cts|ts)$/.test(file),
);

if (tooltipTypeDefinitions.length === 0) {
  throw new Error(
    "Could not find bundled Tooltip type definitions in flitter-core/dist.",
  );
}

for (const file of tooltipTypeDefinitions) {
  await copyFile(path.join(coreDistRoot, file), path.join(distRoot, file));
}

await copyFile(
  path.join(coreDistRoot, "index.d.ts"),
  path.join(distRoot, "index.d.ts"),
);
await copyFile(
  path.join(coreDistRoot, "index.d.cts"),
  path.join(distRoot, "index.d.cts"),
);

const chartTypes = await readFile(
  path.join(chartDistRoot, "index.d.ts"),
  "utf8",
);
await writeFile(path.join(distRoot, "chart.d.ts"), chartTypes);
await writeFile(path.join(distRoot, "chart.d.cts"), chartTypes);
