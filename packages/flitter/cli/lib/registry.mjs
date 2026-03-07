import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { readText, toRelativeImport } from "./fs.mjs";

const require = createRequire(import.meta.url);

const HEADLESS_SHIMS = {
  "area-chart": {
    symbol: "LineChart",
    aliases: {
      GetScaleFn: "LineChartGetScaleFn",
      GetScaleOptionsFn: "LineChartGetScaleOptionsFn",
    },
  },
  "bar-chart": {
    symbol: "BarChart",
    aliases: {
      GetScaleFn: "BarChartGetScaleFn",
      GetScaleOptionsFn: "BarChartGetScaleOptionsFn",
    },
  },
  "box-plot-chart": {
    symbol: "BoxPlotChart",
    aliases: {
      GetScaleFn: "BoxPlotChartGetScaleFn",
      GetScaleOptionsFn: "BoxPlotChartGetScaleOptionsFn",
    },
  },
  "bubble-chart": {
    symbol: "BubbleChart",
    aliases: {
      GetScaleFn: "BubbleChartGetScaleFn",
      GetScaleOptionsFn: "BubbleChartGetScaleOptionsFn",
    },
  },
  "candlestick-chart": {
    symbol: "CandlestickChart",
    aliases: {
      GetScaleFn: "CandlestickChartGetScaleFn",
      GetScaleOptionsFn: "CandlestickChartGetScaleOptionsFn",
    },
  },
  "combo-chart": { symbol: "ComboChart", aliases: {} },
  "donut-chart": { symbol: "DonutChart", aliases: {} },
  "funnel-chart": { symbol: "FunnelChart", aliases: {} },
  "gantt-chart": { symbol: "GanttChart", aliases: {} },
  "gauge-chart": { symbol: "GaugeChart", aliases: {} },
  "heatmap-chart": { symbol: "HeatmapChart", aliases: {} },
  "histogram-chart": { symbol: "HistogramChart", aliases: {} },
  "line-chart": {
    symbol: "LineChart",
    aliases: {
      GetScaleFn: "LineChartGetScaleFn",
      GetScaleOptionsFn: "LineChartGetScaleOptionsFn",
    },
  },
  "network-chart": { symbol: "NetworkChart", aliases: {} },
  "pie-chart": { symbol: "PieChart", aliases: {} },
  "polar-area-chart": { symbol: "PolarAreaChart", aliases: {} },
  "progress-chart": { symbol: "ProgressChart", aliases: {} },
  "radar-chart": {
    symbol: "RadarChart",
    aliases: {
      GetScaleFn: "RadarChartGetScaleFn",
    },
  },
  "sankey-chart": { symbol: "SankeyChart", aliases: {} },
  "scatter-chart": {
    symbol: "ScatterChart",
    aliases: {
      GetScaleFn: "ScatterChartGetScaleFn",
      GetScaleOptionsFn: "ScatterChartGetScaleOptionsFn",
    },
  },
  "stacked-area-chart": {
    symbol: "LineChart",
    aliases: {
      GetScaleFn: "LineChartGetScaleFn",
      GetScaleOptionsFn: "LineChartGetScaleOptionsFn",
    },
  },
  "stacked-bar-chart": {
    symbol: "BarChart",
    aliases: {
      GetScaleFn: "BarChartGetScaleFn",
      GetScaleOptionsFn: "BarChartGetScaleOptionsFn",
    },
  },
  "sunburst-chart": { symbol: "SunburstChart", aliases: {} },
  "treemap-chart": { symbol: "TreemapChart", aliases: {} },
  "waterfall-chart": { symbol: "WaterfallChart", aliases: {} },
};

export async function loadRegistry() {
  const module = await import("flitter-chart/registry");
  return module.getRegistry ? module.getRegistry() : module.default;
}

export function findRegistryItem(registry, chartName, style) {
  if (style != null) {
    return registry.items.find((item) => item.name === chartName && item.style === style) ?? null;
  }

  const candidates = registry.items.filter(
    (item) =>
      item.name === chartName &&
      item.kind !== "support" &&
      item.kind !== "style-base",
  );

  if (candidates.length === 0) {
    return null;
  }

  const styleless = candidates.find((item) => item.style == null);
  if (styleless) {
    return styleless;
  }

  return (
    candidates.find((item) => item.style === "toast") ??
    (candidates.length === 1 ? candidates[0] : null)
  );
}

export function resolveRegistryItems(registry, selectedItem) {
  const byId = new Map(registry.items.map((item) => [item.id, item]));
  const ordered = [];
  const visited = new Set();

  function visit(item) {
    if (visited.has(item.id)) return;
    visited.add(item.id);
    for (const dependencyId of item.registryDependencies ?? []) {
      const dependency = byId.get(dependencyId);
      if (!dependency) {
        throw new Error(`Unknown registry dependency: ${dependencyId}`);
      }
      visit(dependency);
    }
    ordered.push(item);
  }

  visit(selectedItem);
  return ordered;
}

function buildHeadlessShim(chartName) {
  const metadata = HEADLESS_SHIMS[chartName];
  if (!metadata) {
    throw new Error(`Missing shim metadata for ${chartName}`);
  }

  const aliasLines = Object.entries(metadata.aliases).map(
    ([name, source]) => `export type ${name} = import("flitter-chart").${source};`,
  );

  return `import { Headless } from "flitter-chart";

export * from "flitter-chart";
export default Headless.${metadata.symbol};
${aliasLines.join("\n")}
`;
}

function buildCartesianShim() {
  const members = [
    "AxisCorner",
    "DataLabel",
    "Grid",
    "GridXLine",
    "GridYLine",
    "Label",
    "Layout",
    "Legend",
    "Plot",
    "Title",
    "XAxis",
    "XAxisLabel",
    "XAxisLine",
    "XAxisTick",
    "YAxis",
    "YAxisLabel",
    "YAxisLine",
    "YAxisTick",
    "getScale",
  ];

  return `import { Cartesian } from "flitter-chart";

export type { CartesianContext } from "flitter-chart";
${members.map((member) => `export const ${member} = Cartesian.${member};`).join("\n")}
`;
}

export function generateSupportFiles(outputRoot) {
  const files = [
    {
      target: path.join(outputRoot, "_flitter/shared/cartesian/index.ts"),
      content: buildCartesianShim(),
    },
    {
      target: path.join(outputRoot, "_flitter/shared/label.ts"),
      content: `export { Label } from "flitter-chart";\n`,
    },
    {
      target: path.join(outputRoot, "_flitter/shared/utils/index.ts"),
      content: `export { IgnoreSize, classToFn, deepMerge } from "flitter-chart";
export type { DeepPartial, PickPartial } from "flitter-chart";
`,
    },
    {
      target: path.join(outputRoot, "_flitter/shared/utils/scale.ts"),
      content: `export { getValueEdge, refineScale } from "flitter-chart";
export type { ValueEdge } from "flitter-chart";
`,
    },
    {
      target: path.join(outputRoot, "_flitter/shared/utils/draw-spline-line.ts"),
      content: `export { drawSplineLine } from "flitter-chart";\n`,
    },
  ];

  for (const chartName of Object.keys(HEADLESS_SHIMS).sort()) {
    files.push({
      target: path.join(outputRoot, `_flitter/headless/${chartName}.ts`),
      content: buildHeadlessShim(chartName),
    });
  }

  return files;
}

export function generateStyleBaseOverrides(item, outputRoot) {
  if (item.kind !== "style-base" || item.style !== "ag") {
    return [];
  }

  return [
    {
      target: path.join(outputRoot, "ag-base/index.ts"),
      content: `export { type AgCartesianBaseConfig, defaultAgCartesianBaseConfig } from "./cartesian/config";
export { agTitle } from "./title";
export { agLegend } from "./legend";
export { tooltipContent as agTooltipContent } from "./tooltip";
export * as cartesian from "./cartesian";
export { AgTooltipOverlay } from "./bar-like";
export { AgLineLikeTooltipOverlay } from "./line-like";

const DEFAULT_TICK_SPACING = 160;

export const agScaleOptions = (axisLength: number) => ({
  roughStepCount:
    axisLength > 0
      ? Math.max(2, Math.floor(axisLength / DEFAULT_TICK_SPACING))
      : 10,
});
`,
    },
    {
      target: path.join(outputRoot, "ag-base/bar-like/index.ts"),
      content: `export { AgTooltipOverlay } from "./tooltip-overlay";
export { DataView } from "./data-view";
export { Grid } from "./grid";
export { BarBox } from "./bar-box";
`,
    },
    {
      target: path.join(outputRoot, "ag-base/line-like/index.ts"),
      content: `export { AgLineLikeTooltipOverlay } from "./tooltip-overlay";
export { DataView } from "./data-view";
export { Grid } from "./grid";
`,
    },
  ];
}

export async function renderTemplateFile({
  registry,
  item,
  file,
  outputRoot,
}) {
  const sourcePath = registry.resolveTemplatePath(file.source);
  let content = await readText(sourcePath);
  const targetPath = path.join(outputRoot, file.target);

  const relativeTo = (destination) =>
    toRelativeImport(targetPath, path.join(outputRoot, destination));

  const isPluginStyleIndex =
    item.kind === "plugin-chart" &&
    targetPath.endsWith(`${path.sep}styles${path.sep}${item.style}${path.sep}index.ts`);

  content = content
    .replace(
      /import type \{ StyleConfig \} from "\.\.\/\.\.\/plugin";\n?/gu,
      "",
    )
    .replace(/: StyleConfig<[^>]+> =/gu, " =")
    .replace(
      /(['"])@headless\/([^/'"]+)(?:\/(?:types|provider|controller))?\1/gu,
      (_, quote, chartName) => `${quote}${relativeTo(`_flitter/headless/${chartName}.ts`)}${quote}`,
    )
    .replace(
      /(['"])@shared\/cartesian(?:\/index)?\1/gu,
      (_, quote) => `${quote}${relativeTo("_flitter/shared/cartesian/index.ts")}${quote}`,
    )
    .replace(
      /(['"])@shared\/label\1/gu,
      (_, quote) => `${quote}${relativeTo("_flitter/shared/label.ts")}${quote}`,
    )
    .replace(
      /(['"])@shared\/utils\/scale\1/gu,
      (_, quote) => `${quote}${relativeTo("_flitter/shared/utils/scale.ts")}${quote}`,
    )
    .replace(
      /(['"])@utils\/index\1/gu,
      (_, quote) => `${quote}${relativeTo("_flitter/shared/utils/index.ts")}${quote}`,
    )
    .replace(
      /(['"])@utils\/draw-spline-line\1/gu,
      (_, quote) => `${quote}${relativeTo("_flitter/shared/utils/draw-spline-line.ts")}${quote}`,
    )
    .replace(
      /(['"])@styles\/toast(?:\/([^'"]+))?\1/gu,
      (_, quote, subpath) =>
        `${quote}${relativeTo(subpath ? `toast-base/${subpath}` : "toast-base/index.ts")}${quote}`,
    )
    .replace(
      /(['"])@styles\/ag(?:\/([^'"]+))?\1/gu,
      (_, quote, subpath) =>
        `${quote}${relativeTo(subpath ? `ag-base/${subpath}` : "ag-base/index.ts")}${quote}`,
    )
    .replace(
      /(['"])(?:\.\.\/)+shared\/(bar-like|line-like|point-like)(?:\/index)?\1/gu,
      (_, quote, helperName) => {
        const styleBase = item.style ? `${item.style}-base` : "toast-base";
        return `${quote}${relativeTo(`${styleBase}/${helperName}/index.ts`)}${quote}`;
      },
    )
    .replace(
      /(['"])\.\.\/pie-chart\/([^'"]+)\1/gu,
      (_, quote, subpath) => `${quote}${relativeTo(`toast-pie-chart/${subpath}`)}${quote}`,
    );

  if (isPluginStyleIndex) {
    const configType = registry.pluginChartMetadata[item.name].configTypes[item.style];
    content = content
      .replace(
        /import \{ deepMerge \} from ([^;]+);/u,
        "import { deepMerge, type DeepPartial } from $1;",
      )
      .replace(
        /createConfig: \(config,\s*/u,
        `createConfig: (config: DeepPartial<${configType}> | undefined, `,
      )
      .replace(
        /createConfig: \(config\) =>/u,
        `createConfig: (config?: DeepPartial<${configType}>) =>`,
      );
  }

  return { targetPath, content };
}

export function generatePluginIndex(item, metadata) {
  const styleName = item.style;
  const styleConfigConst = `${styleName}StyleConfig`;
  const configType = metadata.configTypes[styleName];
  const componentName = `${styleName[0].toUpperCase()}${styleName.slice(1)}${metadata.componentName}`;
  const createConfigCall = `${styleConfigConst}.createConfig(config)`;

  return `import type { Widget } from "flitter-core";
import type { DeepPartial } from "flitter-chart";
import { ${metadata.baseName} } from "./base";
import type { ${metadata.customType}, ${metadata.dataType}${metadata.supportsGetScale ? ", GetScaleFn" : ""}${metadata.supportsGetScaleOptions ? ", GetScaleOptionsFn" : ""} } from "./base";
import { ${styleConfigConst}, type ${configType} } from "./styles/${styleName}";

export * from "./base";
export { type ${configType} } from "./styles/${styleName}";

export default function ${componentName}({
  config,
  data,
  custom,
${metadata.supportsGetScaleOptions ? "  getScaleOptions,\n" : ""}${metadata.supportsDirection ? '  direction = "vertical",\n' : ""}  ...rest
}: {
  config?: DeepPartial<${configType}>;
  data: ${metadata.dataType};
  custom?: Partial<${metadata.customType}<${configType}>>;
${metadata.supportsGetScale ? "  getScale?: GetScaleFn;\n" : ""}${metadata.supportsGetScaleOptions ? "  getScaleOptions?: GetScaleOptionsFn;\n" : ""}${metadata.supportsDirection ? '  direction?: "vertical" | "horizontal";\n' : ""}}): Widget {
  return ${metadata.baseName}({
    data,
    config: ${createConfigCall},
    custom: { ...${styleConfigConst}.custom, ...custom },
${metadata.supportsGetScaleOptions ? `    getScaleOptions: getScaleOptions ?? ${styleConfigConst}.getScaleOptions,\n` : ""}${metadata.supportsDirection ? "    direction,\n" : ""}    ...rest,
  });
}
`;
}

export function resolveRegistryPackageRoot(packageName) {
  const candidates =
    packageName === "flitter-chart"
      ? ["flitter-chart/registry", "flitter-chart"]
      : packageName === "flitter-core"
        ? ["flitter-core/component/Tooltip", "flitter-core"]
        : [packageName];

  for (const candidate of candidates) {
    try {
      let currentPath = path.dirname(require.resolve(candidate));
      while (true) {
        if (fs.existsSync(path.join(currentPath, "package.json"))) {
          return currentPath;
        }
        const parent = path.dirname(currentPath);
        if (parent === currentPath) {
          break;
        }
        currentPath = parent;
      }
    } catch {
      continue;
    }
  }

  throw new Error(`Unable to resolve package root for ${packageName}`);
}
