import fs from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import { readPackageJson } from "./config.mjs";
import { resolveRegistryPackageRoot } from "./registry.mjs";

async function detectPackageManager(projectRoot) {
  const candidates = [
    { name: "pnpm", lockfile: "pnpm-lock.yaml", command: "pnpm", args: ["add"] },
    { name: "yarn", lockfile: "yarn.lock", command: "yarn", args: ["add"] },
    { name: "bun", lockfile: "bun.lockb", command: "bun", args: ["add"] },
    { name: "bun", lockfile: "bun.lock", command: "bun", args: ["add"] },
    { name: "npm", lockfile: "package-lock.json", command: "npm", args: ["install"] },
  ];

  for (const candidate of candidates) {
    try {
      await fs.access(path.join(projectRoot, candidate.lockfile));
      return candidate;
    } catch {
      continue;
    }
  }

  return { name: "pnpm", command: "pnpm", args: ["add"] };
}

function hasDependency(packageJson, dependencyName) {
  return Boolean(
    packageJson.dependencies?.[dependencyName] ||
      packageJson.devDependencies?.[dependencyName] ||
      packageJson.peerDependencies?.[dependencyName],
  );
}

function resolveInstallSpecifier(packageName, packageManagerName) {
  const packageRoot = resolveRegistryPackageRoot(packageName);
  return packageRoot.includes(`${path.sep}node_modules${path.sep}`)
    ? packageName
    : packageManagerName === "npm"
      ? `file:${packageRoot}`
      : `link:${packageRoot}`;
}

function runCommand(command, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      stdio: "inherit",
      shell: process.platform === "win32",
    });

    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`${command} ${args.join(" ")} failed with exit code ${code ?? 1}`));
    });
  });
}

export async function ensureDependencies(projectRoot, dependencyNames) {
  const { value: packageJson } = await readPackageJson(projectRoot);
  const missing = [...new Set(dependencyNames)].filter(
    (dependencyName) => !hasDependency(packageJson, dependencyName),
  );

  if (missing.length === 0) {
    return;
  }

  const packageManager = await detectPackageManager(projectRoot);
  const specs = missing.map((dependencyName) =>
    resolveInstallSpecifier(dependencyName, packageManager.name),
  );
  await runCommand(packageManager.command, [...packageManager.args, ...specs], projectRoot);
}
