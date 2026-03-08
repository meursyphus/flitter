import { execFile as execFileCallback } from "node:child_process";
import { promisify } from "node:util";
import { cp, copyFile, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getRegistry } from "../../../packages/chart/registry/index.mjs";
import { runAdd } from "../../../packages/flitter/cli/commands/add.mjs";
import {
  resolveItemOutputDir,
  resolveRegistryItems,
} from "../../../packages/flitter/cli/lib/registry.mjs";

const execFile = promisify(execFileCallback);
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const chartPresetsRoot = path.resolve(scriptDir, "..");
const workspaceRoot = path.resolve(chartPresetsRoot, "../..");
const flitterConfigPath = path.join(chartPresetsRoot, "flitter.json");
const preserveRootEntries = new Set([
  "README.md",
  "flitter.json",
  "node_modules",
  "package.json",
  "scripts",
  "tsconfig.json",
]);
const changedScopeRoots = [
  "packages/chart/registry/templates",
  "packages/chart/registry",
  "packages/flitter/cli",
];

function printHelp() {
  console.log(`chart-presets sync

Usage:
  pnpm --dir shared/chart-presets run sync
  pnpm --dir shared/chart-presets run sync -- --chart <chart-name>
  pnpm --dir shared/chart-presets run sync -- --chart <chart-name> --style <toast|ag>
  pnpm --dir shared/chart-presets run sync -- --changed
`);
}

function parseArgs(argv) {
  const args = {
    charts: [],
    styles: [],
    changed: false,
    help: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--help" || token === "-h") {
      args.help = true;
      continue;
    }
    if (token === "--changed") {
      args.changed = true;
      continue;
    }
    if (token === "--chart") {
      const next = argv[index + 1];
      if (!next) {
        throw new Error("Missing value for --chart");
      }
      args.charts.push(next);
      index += 1;
      continue;
    }
    if (token === "--style") {
      const next = argv[index + 1];
      if (!next) {
        throw new Error("Missing value for --style");
      }
      args.styles.push(next);
      index += 1;
      continue;
    }
    throw new Error(`Unknown argument: ${token}`);
  }

  return args;
}

function toPascalCase(value) {
  return value
    .split("-")
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join("");
}

function generateRootIndex(items, defaultStyle) {
  const groups = new Map();
  const orderedNames = [];

  for (const item of items) {
    if (!groups.has(item.name)) {
      groups.set(item.name, []);
      orderedNames.push(item.name);
    }
    groups.get(item.name).push(item);
  }

  const lines = [];

  for (const name of orderedNames) {
    const variants = groups.get(name);
    const neutralItem =
      variants.find((item) => item.style == null) ??
      variants.find((item) => item.style === defaultStyle) ??
      variants[0];
    const neutralName = toPascalCase(name);

    lines.push(
      `export { default as ${neutralName} } from "./${resolveItemOutputDir(neutralItem, defaultStyle)}";`,
    );

    for (const variant of variants) {
      if (variant === neutralItem || variant.style == null) continue;
      const styleName = toPascalCase(variant.style);
      lines.push(
        `export { default as ${styleName}${neutralName} } from "./${resolveItemOutputDir(variant, defaultStyle)}";`,
      );
    }
  }

  return `${lines.join("\n")}\n`;
}

async function cleanGeneratedEntries(root) {
  const entries = await readdir(root, { withFileTypes: true });
  for (const entry of entries) {
    if (preserveRootEntries.has(entry.name)) continue;
    await rm(path.join(root, entry.name), { recursive: true, force: true });
  }
}

async function copyGeneratedEntries(fromRoot, toRoot) {
  const entries = await readdir(fromRoot, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === "flitter.json") continue;

    const sourcePath = path.join(fromRoot, entry.name);
    const targetPath = path.join(toRoot, entry.name);

    if (entry.isDirectory()) {
      await cp(sourcePath, targetPath, { recursive: true });
      continue;
    }

    await copyFile(sourcePath, targetPath);
  }
}

function groupItemsByName(items) {
  const groups = new Map();
  for (const item of items) {
    if (!groups.has(item.name)) {
      groups.set(item.name, []);
    }
    groups.get(item.name).push(item);
  }
  return groups;
}

function expandChartSelection(allItems, chartNames, requestedStyles) {
  const byName = groupItemsByName(allItems);
  const selected = [];

  for (const chartName of chartNames) {
    const variants = byName.get(chartName);
    if (!variants) {
      throw new Error(`Unknown chart name: ${chartName}`);
    }

    if (requestedStyles.length === 0) {
      selected.push(...variants);
      continue;
    }

    const styleFiltered = variants.filter(
      (item) => item.style != null && requestedStyles.includes(item.style),
    );
    if (styleFiltered.length === 0) {
      throw new Error(
        `No variants found for ${chartName} with styles: ${requestedStyles.join(", ")}`,
      );
    }
    selected.push(...styleFiltered);
  }

  return selected;
}

async function getChangedPaths() {
  const { stdout } = await execFile(
    "git",
    ["status", "--porcelain", "--untracked-files=all", "--", ...changedScopeRoots],
    { cwd: workspaceRoot },
  );

  return stdout
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.slice(3));
}

function detectChangedItems(allItems, changedPaths) {
  const byName = groupItemsByName(allItems);
  const selected = [];
  const seen = new Set();
  let requiresFullSync = false;

  for (const changedPath of changedPaths) {
    const normalized = changedPath.replace(/\\/gu, "/");

    if (
      normalized.startsWith("packages/chart/registry/templates/shared/") ||
      normalized.startsWith("packages/chart/registry/templates/styles/") ||
      normalized.startsWith("packages/chart/registry/index.mjs") ||
      normalized.startsWith("packages/flitter/cli/")
    ) {
      requiresFullSync = true;
      break;
    }

    const chartMatch = normalized.match(
      /^packages\/chart\/registry\/templates\/charts\/([^/]+)\/(?:styles\/([^/]+)\/|base\/|index\.ts|types\.ts|plugin\.ts|$)/u,
    );
    if (!chartMatch) {
      requiresFullSync = true;
      break;
    }

    const [, chartName, style] = chartMatch;
    const variants = byName.get(chartName);
    if (!variants) {
      requiresFullSync = true;
      break;
    }

    const matches =
      style == null
        ? variants
        : variants.filter((item) => item.style === style);

    if (matches.length === 0) {
      requiresFullSync = true;
      break;
    }

    for (const match of matches) {
      if (seen.has(match.id)) continue;
      seen.add(match.id);
      selected.push(match);
    }
  }

  return { requiresFullSync, selected };
}

function dedupeItems(items) {
  const seen = new Set();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

const flitterConfig = JSON.parse(await readFile(flitterConfigPath, "utf8"));
const defaultStyle = flitterConfig.defaultChartStyle ?? "ag";
const registry = getRegistry();
const allItems = registry.items.filter(
  (item) => item.kind !== "support" && item.kind !== "style-base",
);
const args = parseArgs(process.argv.slice(2));

if (args.help) {
  printHelp();
  process.exit(0);
}

if (args.styles.length > 0 && args.charts.length === 0) {
  throw new Error("--style can only be used together with --chart");
}

let items = allItems;
let fullSync = true;

if (args.changed) {
  fullSync = false;
  const changedPaths = await getChangedPaths();
  if (changedPaths.length === 0) {
    console.log("No relevant changes found. chart-presets is already in sync.");
    process.exit(0);
  }

  const detected = detectChangedItems(allItems, changedPaths);
  if (detected.requiresFullSync) {
    console.log("Changed paths touch shared generator code. Falling back to full sync.");
    fullSync = true;
  } else {
    items = detected.selected;
  }
}

if (args.charts.length > 0) {
  fullSync = false;
  items = expandChartSelection(allItems, args.charts, args.styles);
}

items = dedupeItems(items);

const tempRoot = await mkdtemp(path.join(os.tmpdir(), "chart-presets-sync-"));

try {
  await copyFile(flitterConfigPath, path.join(tempRoot, "flitter.json"));

  for (const item of items) {
    await runAdd({
      cwd: tempRoot,
      chartName: item.name,
      style: item.style,
      overwrite: true,
      skipInstall: true,
    });
  }

  await writeFile(
    path.join(tempRoot, "index.ts"),
    generateRootIndex(allItems, defaultStyle),
  );

  if (fullSync) {
    await cleanGeneratedEntries(chartPresetsRoot);
    await copyGeneratedEntries(tempRoot, chartPresetsRoot);
  } else {
    const itemsToCopy = dedupeItems(
      items.flatMap((item) =>
        resolveRegistryItems(registry, item).filter(
          (resolved) => resolved.kind !== "support",
        ),
      ),
    );

    for (const item of itemsToCopy) {
      const outputDir = resolveItemOutputDir(item, defaultStyle);
      await rm(path.join(chartPresetsRoot, outputDir), {
        recursive: true,
        force: true,
      });
      await cp(path.join(tempRoot, outputDir), path.join(chartPresetsRoot, outputDir), {
        recursive: true,
      });
    }

    await copyFile(
      path.join(tempRoot, "index.ts"),
      path.join(chartPresetsRoot, "index.ts"),
    );
  }

  console.log(
    `Synced chart-presets from internal flitter CLI into ${chartPresetsRoot}`,
  );
} finally {
  await rm(tempRoot, { recursive: true, force: true });
}
