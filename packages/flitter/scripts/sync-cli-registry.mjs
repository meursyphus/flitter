import { cp, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(scriptDir, "..");
const sourceRoot = path.resolve(packageRoot, "../chart/registry");
const targetRoot = path.resolve(packageRoot, "cli/registry");

await rm(targetRoot, { recursive: true, force: true });
await cp(sourceRoot, targetRoot, { recursive: true });

// Bundle diagram templates in the same layout as chart templates.
const diagramSourceRoot = path.resolve(packageRoot, "../diagram/registry");
const diagramTargetRoot = path.resolve(packageRoot, "cli/registry-diagram");

await rm(diagramTargetRoot, { recursive: true, force: true });
await cp(diagramSourceRoot, diagramTargetRoot, { recursive: true });
