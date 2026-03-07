import { cp, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const registryRoot = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(registryRoot, "../../..");
const sourceRoot = path.join(workspaceRoot, "shared/chart-styles");
const templatesRoot = path.join(registryRoot, "templates");

await rm(templatesRoot, { recursive: true, force: true });
await mkdir(templatesRoot, { recursive: true });

for (const directory of ["charts", "shared", "styles"]) {
  await cp(
    path.join(sourceRoot, directory),
    path.join(templatesRoot, directory),
    { recursive: true },
  );
}

console.log(`Synced chart registry templates from ${sourceRoot} to ${templatesRoot}`);
