import { cp, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(scriptDir, "..");
const sourceRoot = path.resolve(packageRoot, "../chart/registry");
const targetRoot = path.resolve(packageRoot, "cli/registry");

await rm(targetRoot, { recursive: true, force: true });
await cp(sourceRoot, targetRoot, { recursive: true });

// The diagram registry's templates are the style sources themselves; bundle
// them under templates/styles so the published CLI can copy them.
const diagramSourceRoot = path.resolve(packageRoot, "../diagram/registry");
const diagramStylesRoot = path.resolve(packageRoot, "../diagram/src/styles");
const diagramTargetRoot = path.resolve(packageRoot, "cli/registry-diagram");

await rm(diagramTargetRoot, { recursive: true, force: true });
await cp(diagramSourceRoot, diagramTargetRoot, { recursive: true });
await cp(diagramStylesRoot, path.join(diagramTargetRoot, "templates", "styles"), { recursive: true });
