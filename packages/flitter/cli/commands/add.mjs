import path from "node:path";
import {
  readFlitterConfig,
  resolveChartsDirectory,
} from "../lib/config.mjs";
import {
  ensureDirectory,
  fileExists,
  writeText,
} from "../lib/fs.mjs";
import { ensureDependencies } from "../lib/install.mjs";
import {
  findRegistryItem,
  generatePluginIndex,
  generateSupportFiles,
  generateStyleBaseOverrides,
  loadRegistry,
  renderTemplateFile,
  resolveRegistryItems,
} from "../lib/registry.mjs";

export async function runAdd({
  cwd,
  chartName,
  style,
  overwrite,
  skipInstall,
}) {
  const flitterConfig = await readFlitterConfig(cwd);
  if (!flitterConfig) {
    throw new Error("flitter.json not found. Run `flitter init` first.");
  }

  const registry = await loadRegistry();
  const selectedItem = findRegistryItem(registry, chartName, style);
  if (!selectedItem) {
    const styleLabel = style ? ` with style ${style}` : "";
    throw new Error(`Registry item not found for ${chartName}${styleLabel}`);
  }

  const outputRoot = await resolveChartsDirectory(
    cwd,
    flitterConfig.value.aliases?.charts ?? "@/components/chart",
  );
  await ensureDirectory(outputRoot);

  const itemsToWrite = resolveRegistryItems(registry, selectedItem);
  const plannedWrites = [];

  for (const item of itemsToWrite) {
    const itemRoot = path.join(outputRoot, item.outputDir);
    const itemExists = await fileExists(itemRoot);

    if (item.id !== selectedItem.id && itemExists) {
      continue;
    }

    if (item.id === selectedItem.id && itemExists && !overwrite) {
      throw new Error(
        `${path.relative(cwd, itemRoot)} already exists. Re-run with --overwrite to replace it.`,
      );
    }

    if (item.kind === "support") {
      plannedWrites.push(
        ...generateSupportFiles(outputRoot).map((file) => ({
          targetPath: file.target,
          content: file.content,
        })),
      );
      continue;
    }

    for (const file of item.files) {
      plannedWrites.push(await renderTemplateFile({ registry, item, file, outputRoot }));
    }

    if (item.kind === "plugin-chart") {
      const metadata = registry.pluginChartMetadata[item.name];
      plannedWrites.push({
        targetPath: path.join(outputRoot, item.outputDir, "index.ts"),
        content: generatePluginIndex(item, metadata),
      });
    }

    plannedWrites.push(
      ...generateStyleBaseOverrides(item, outputRoot).map((file) => ({
        targetPath: file.target,
        content: file.content,
      })),
    );
  }

  for (const write of plannedWrites) {
    await writeText(write.targetPath, write.content);
  }

  if (!skipInstall) {
    const dependencies = itemsToWrite.flatMap((item) => item.dependencies ?? []);
    await ensureDependencies(cwd, dependencies);
  }

  console.log(`Added ${selectedItem.id} into ${path.relative(cwd, outputRoot) || "."}`);
}
