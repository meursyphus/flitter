import fs from "node:fs";
import path from "node:path";
import { getRegistry, resolveTemplatePath } from "./index.mjs";

const registry = getRegistry();
const missing = [];
const warnings = [];

// 1. Check that every file declared in the registry actually exists on disk
for (const item of registry.items) {
  for (const file of item.files) {
    const absolutePath = resolveTemplatePath(file.source);
    if (!fs.existsSync(absolutePath)) {
      missing.push(`${item.id}: ${file.source}`);
    }
  }
}

// 2. Bidirectional style validation for chart items
const chartItems = registry.items.filter(
  (item) => item.kind === "plugin-chart" || item.kind === "copy-chart",
);

// Group chart items by name
const chartsByName = new Map();
for (const item of chartItems) {
  if (!chartsByName.has(item.name)) {
    chartsByName.set(item.name, []);
  }
  chartsByName.get(item.name).push(item);
}

const templatesChartsDir = path.join(
  path.dirname(new URL(import.meta.url).pathname),
  "templates",
  "charts",
);

for (const [chartName, variants] of chartsByName) {
  const chartDir = path.join(templatesChartsDir, chartName);
  const stylesDir = path.join(chartDir, "styles");

  // Get styles declared in registry
  const registryStyles = new Set(
    variants.filter((v) => v.style != null).map((v) => v.style),
  );

  // Check: registry declares style but template dir doesn't exist
  for (const style of registryStyles) {
    const styleTemplateDir = path.join(stylesDir, style);
    if (!fs.existsSync(styleTemplateDir)) {
      missing.push(
        `${chartName}: registry declares style "${style}" but templates/charts/${chartName}/styles/${style}/ does not exist`,
      );
    }
  }

  // Check: template style dir exists but registry doesn't include it
  if (fs.existsSync(stylesDir)) {
    for (const entry of fs.readdirSync(stylesDir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      if (!registryStyles.has(entry.name)) {
        warnings.push(
          `${chartName}: templates/charts/${chartName}/styles/${entry.name}/ exists but registry does not include style "${entry.name}"`,
        );
      }
    }
  }
}

if (missing.length > 0) {
  console.error("Registry validation failed.");
  for (const entry of missing) {
    console.error(`  ERROR: ${entry}`);
  }
}

if (warnings.length > 0) {
  for (const entry of warnings) {
    console.warn(`  WARN: ${entry}`);
  }
}

if (missing.length > 0) {
  process.exit(1);
}

const totalFiles = registry.items.reduce(
  (sum, item) => sum + item.files.length,
  0,
);
console.log(
  `Registry valid: ${registry.items.length} items, ${totalFiles} template files.`,
);
