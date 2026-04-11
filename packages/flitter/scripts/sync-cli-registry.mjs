import { cp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(scriptDir, "..");
const sourceRoot = path.resolve(packageRoot, "../chart/registry");
const targetRoot = path.resolve(packageRoot, "cli/registry");

function normalizePath(filePath) {
  return filePath.split(path.sep).join("/");
}

async function collectTsconfigPaths(rootDir, currentDir = rootDir) {
  const entries = await readdir(currentDir, { withFileTypes: true });
  const collected = [];

  for (const entry of entries) {
    const absolutePath = path.join(currentDir, entry.name);

    if (entry.isDirectory()) {
      collected.push(...(await collectTsconfigPaths(rootDir, absolutePath)));
      continue;
    }

    if (entry.isFile() && entry.name === "tsconfig.json") {
      collected.push(path.relative(rootDir, absolutePath));
    }
  }

  return collected;
}

function rebaseRelativeSpecifier(specifier, sourceFile, targetFile) {
  if (!specifier.startsWith(".")) {
    return specifier;
  }

  const sourceBaseDir = path.dirname(sourceFile);
  const targetBaseDir = path.dirname(targetFile);
  const resolvedPath = path.resolve(sourceBaseDir, specifier);

  return normalizePath(path.relative(targetBaseDir, resolvedPath));
}

async function rebaseCopiedTsconfigPaths() {
  for (const relativePath of await collectTsconfigPaths(sourceRoot)) {
    const sourceFile = path.join(sourceRoot, relativePath);
    const targetFile = path.join(targetRoot, relativePath);
    const rawConfig = await readFile(targetFile, "utf8");
    const parsedConfig = JSON.parse(rawConfig);
    let changed = false;

    if (typeof parsedConfig.extends === "string") {
      const rebasedExtends = rebaseRelativeSpecifier(parsedConfig.extends, sourceFile, targetFile);
      if (rebasedExtends !== parsedConfig.extends) {
        parsedConfig.extends = rebasedExtends;
        changed = true;
      }
    }

    const compilerOptions = parsedConfig.compilerOptions;
    const paths = compilerOptions?.paths;
    if (paths && typeof paths === "object") {
      for (const [key, values] of Object.entries(paths)) {
        if (!Array.isArray(values)) {
          continue;
        }

        const rebasedValues = values.map((value) =>
          typeof value === "string"
            ? rebaseRelativeSpecifier(value, sourceFile, targetFile)
            : value,
        );

        if (rebasedValues.some((value, index) => value !== values[index])) {
          paths[key] = rebasedValues;
          changed = true;
        }
      }
    }

    if (changed) {
      await writeFile(targetFile, `${JSON.stringify(parsedConfig, null, 2)}\n`);
    }
  }
}

await rm(targetRoot, { recursive: true, force: true });
await cp(sourceRoot, targetRoot, { recursive: true });
await rebaseCopiedTsconfigPaths();
