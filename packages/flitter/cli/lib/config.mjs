import path from "node:path";
import { fileExists, readJson, writeJson } from "./fs.mjs";

export const FLITTER_CONFIG_FILENAME = "flitter.json";

function parseJsonc(raw) {
  return JSON.parse(
    raw
      .replace(/\/\*[\s\S]*?\*\//gu, "")
      .replace(/^\s*\/\/.*$/gmu, ""),
  );
}

export async function readPackageJson(projectRoot) {
  const packageJsonPath = path.join(projectRoot, "package.json");
  if (!(await fileExists(packageJsonPath))) {
    throw new Error(`package.json not found in ${projectRoot}`);
  }
  return {
    path: packageJsonPath,
    value: await readJson(packageJsonPath),
  };
}

export async function readTsconfig(projectRoot) {
  for (const filename of ["tsconfig.json", "jsconfig.json"]) {
    const configPath = path.join(projectRoot, filename);
    if (await fileExists(configPath)) {
      return {
        path: configPath,
        value: await readJson(configPath, parseJsonc),
      };
    }
  }
  return null;
}

export function detectFramework(packageJson) {
  const dependencies = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  };

  if (dependencies.svelte || dependencies["@sveltejs/kit"]) {
    return "svelte";
  }

  return "react";
}

export async function createDefaultFlitterConfig(projectRoot) {
  const { value: packageJson } = await readPackageJson(projectRoot);
  const tsconfig = await readTsconfig(projectRoot);

  return {
    $schema: "https://flitter.dev/schema/flitter.json",
    tsx: tsconfig != null,
    framework: detectFramework(packageJson),
    aliases: {
      charts: "@/components/chart",
    },
  };
}

export async function readFlitterConfig(projectRoot) {
  const configPath = path.join(projectRoot, FLITTER_CONFIG_FILENAME);
  if (!(await fileExists(configPath))) {
    return null;
  }
  return {
    path: configPath,
    value: await readJson(configPath, parseJsonc),
  };
}

export async function writeFlitterConfig(projectRoot, config) {
  const configPath = path.join(projectRoot, FLITTER_CONFIG_FILENAME);
  await writeJson(configPath, config);
  return configPath;
}

function resolvePathAlias(alias, paths, projectRoot) {
  if (!paths) return null;

  for (const [pattern, targets] of Object.entries(paths)) {
    if (!Array.isArray(targets) || targets.length === 0) continue;
    if (pattern === alias) {
      return path.resolve(projectRoot, targets[0]);
    }

    const wildcardIndex = pattern.indexOf("*");
    if (wildcardIndex === -1) continue;

    const prefix = pattern.slice(0, wildcardIndex);
    const suffix = pattern.slice(wildcardIndex + 1);

    if (!alias.startsWith(prefix) || !alias.endsWith(suffix)) {
      continue;
    }

    const match = alias.slice(prefix.length, alias.length - suffix.length);
    const target = targets[0].replace("*", match);
    return path.resolve(projectRoot, target);
  }

  return null;
}

export async function resolveChartsDirectory(projectRoot, aliasPath) {
  const tsconfig = await readTsconfig(projectRoot);
  const resolvedFromAlias = resolvePathAlias(
    aliasPath,
    tsconfig?.value?.compilerOptions?.paths,
    projectRoot,
  );

  if (resolvedFromAlias) {
    return resolvedFromAlias;
  }

  if (aliasPath.startsWith("@/")) {
    return path.resolve(projectRoot, "src", aliasPath.slice(2));
  }

  if (aliasPath.startsWith("~/")) {
    return path.resolve(projectRoot, aliasPath.slice(2));
  }

  if (aliasPath.startsWith("./") || aliasPath.startsWith("../")) {
    return path.resolve(projectRoot, aliasPath);
  }

  return path.resolve(projectRoot, aliasPath);
}
