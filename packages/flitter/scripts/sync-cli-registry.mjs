import { cp, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(scriptDir, "..");
const sourceRoot = path.resolve(packageRoot, "../chart/registry");
const targetRoot = path.resolve(packageRoot, "cli/registry");

await rm(targetRoot, { recursive: true, force: true });
await cp(sourceRoot, targetRoot, { recursive: true });
