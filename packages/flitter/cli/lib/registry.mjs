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

const ROOT_PRIMITIVES_IMPORT = "flitter-ui/chart";

function getHeadlessTypeAliases(chartName) {
  switch (chartName) {
    case "bar-chart":
    case "stacked-bar-chart":
      return {
        GetScaleFn: "BarChartGetScaleFn",
        GetScaleOptionsFn: "BarChartGetScaleOptionsFn",
      };
    case "line-chart":
    case "area-chart":
    case "stacked-area-chart":
      return {
        GetScaleFn: "LineChartGetScaleFn",
        GetScaleOptionsFn: "LineChartGetScaleOptionsFn",
      };
    case "scatter-chart":
      return {
        GetScaleFn: "ScatterChartGetScaleFn",
        GetScaleOptionsFn: "ScatterChartGetScaleOptionsFn",
      };
    case "bubble-chart":
      return {
        GetScaleFn: "BubbleChartGetScaleFn",
        GetScaleOptionsFn: "BubbleChartGetScaleOptionsFn",
      };
    case "box-plot-chart":
      return {
        GetScaleFn: "BoxPlotChartGetScaleFn",
        GetScaleOptionsFn: "BoxPlotChartGetScaleOptionsFn",
      };
    case "candlestick-chart":
      return {
        GetScaleFn: "CandlestickChartGetScaleFn",
        GetScaleOptionsFn: "CandlestickChartGetScaleOptionsFn",
      };
    case "radar-chart":
      return {
        GetScaleFn: "RadarChartGetScaleFn",
      };
    default:
      return {};
  }
}

function rewriteHeadlessTypeSpecifiers(specifiers, chartName) {
  const aliases = getHeadlessTypeAliases(chartName);
  return specifiers
    .replace(/\bGetScaleFn\b/gu, aliases.GetScaleFn ? `${aliases.GetScaleFn} as GetScaleFn` : "GetScaleFn")
    .replace(
      /\bGetScaleOptionsFn\b/gu,
      aliases.GetScaleOptionsFn
        ? `${aliases.GetScaleOptionsFn} as GetScaleOptionsFn`
        : "GetScaleOptionsFn",
    );
}

export async function loadRegistry() {
  const module = await import("flitter-chart/registry");
  return module.getRegistry ? module.getRegistry() : module.default;
}

export function findRegistryItem(registry, chartName, style, preferredStyle = "ag") {
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
    candidates.find((item) => item.style === preferredStyle) ??
    candidates.find((item) => item.style === "toast") ??
    (candidates.length === 1 ? candidates[0] : null)
  );
}

export function resolveItemOutputDir(item, defaultStyle) {
  if (item.kind === "style-base" || item.kind === "support" || item.style == null) {
    return item.outputDir;
  }

  return item.style === defaultStyle ? item.name : item.outputDir;
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

function buildHoverTooltipShim() {
  return `import {
  ConstraintsTransformBox,
  GestureDetector,
  Stack,
  StackFit,
  State,
  StatefulWidget,
  Positioned,
  FractionalTranslation,
  Offset,
  SizedBox,
  Alignment,
  type Widget,
} from "flitter-core";

export type HoverTooltipPosition =
  | "topLeft"
  | "topRight"
  | "topCenter"
  | "bottomCenter"
  | "bottomLeft"
  | "bottomRight"
  | "center"
  | "centerLeft"
  | "centerRight";

const positionHelper = {
  topLeft: new Offset({ x: -1, y: -1 }),
  topCenter: new Offset({ x: 0, y: -1 }),
  topRight: new Offset({ x: 1, y: -1 }),
  center: new Offset({ x: 0, y: 0 }),
  centerLeft: new Offset({ x: -1, y: 0 }),
  centerRight: new Offset({ x: 1, y: 0 }),
  bottomCenter: new Offset({ x: 0, y: 1 }),
  bottomLeft: new Offset({ x: -1, y: 1 }),
  bottomRight: new Offset({ x: 1, y: 1 }),
} satisfies Record<HoverTooltipPosition, Offset>;

export class HoverTooltip extends StatefulWidget {
  renderChild: (hovered: boolean) => Widget;
  tooltip?: Widget;
  position: HoverTooltipPosition;
  offset: Offset;
  translation?: Offset;
  cursor: "default" | "pointer";
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;

  constructor({
    renderChild,
    tooltip,
    position = "topCenter",
    offset = Offset.Constants.zero,
    translation,
    cursor = "default",
    onMouseEnter,
    onMouseLeave,
  }: {
    renderChild: (hovered: boolean) => Widget;
    tooltip?: Widget;
    position?: HoverTooltipPosition;
    offset?: Offset;
    translation?: Offset;
    cursor?: "default" | "pointer";
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
  }) {
    super();
    this.renderChild = renderChild;
    this.tooltip = tooltip;
    this.position = position;
    this.offset = offset;
    this.translation = translation;
    this.cursor = cursor;
    this.onMouseEnter = onMouseEnter;
    this.onMouseLeave = onMouseLeave;
  }

  createState() {
    return new HoverTooltipState();
  }
}

class HoverTooltipState extends State<HoverTooltip> {
  hovered = false;

  override build() {
    return Stack({
      fit: StackFit.passthrough,
      clipped: false,
      children: [
        GestureDetector({
          cursor: this.widget.cursor,
          child: this.widget.renderChild(this.hovered),
          onMouseEnter: () => {
            this.widget.onMouseEnter?.();
            this.setState(() => {
              this.hovered = true;
            });
          },
          onMouseLeave: () => {
            this.widget.onMouseLeave?.();
            this.setState(() => {
              this.hovered = false;
            });
          },
        }),
        this.hovered && this.widget.tooltip
          ? Positioned.fill({
              child: FractionalTranslation({
                translation: this.widget.offset,
                child: ConstraintsTransformBox({
                  constraintsTransform: ConstraintsTransformBox.unconstrained,
                  alignment: Alignment[this.widget.position],
                  child: FractionalTranslation({
                    translation:
                      this.widget.translation ?? positionHelper[this.widget.position],
                    child: this.widget.tooltip,
                  }),
                }),
              }),
            })
          : SizedBox.shrink(),
      ],
    });
  }
}
`;
}

export function generateSupportFiles(outputRoot) {
  return [];
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
  targetOutputDir = item.outputDir,
  targetDirs = new Map(),
}) {
  const sourcePath = registry.resolveTemplatePath(file.source);
  let content = await readText(sourcePath);
  const relativeTarget = path.posix.relative(item.outputDir, file.target);
  const normalizedTarget =
    relativeTarget === "" || relativeTarget === "."
      ? targetOutputDir
      : path.join(targetOutputDir, relativeTarget);
  const targetPath = path.join(outputRoot, normalizedTarget);

  const relativeTo = (destination) =>
    toRelativeImport(targetPath, path.join(outputRoot, destination));

  const isPluginStyleIndex =
    item.kind === "plugin-chart" &&
    targetPath.endsWith(`${path.sep}styles${path.sep}${item.style}${path.sep}index.ts`);

  content = content
    .replace(
      /import\s+([A-Za-z_$][\w$]*)\s+from\s+(['"])@headless\/([^/'"]+)\2/gu,
      (_, localName, quote, chartName) => {
        const symbol = HEADLESS_SHIMS[chartName]?.symbol;
        if (!symbol) {
          throw new Error(`Missing headless export mapping for ${chartName}`);
        }
        return `import { ${symbol} as ${localName} } from ${quote}${ROOT_PRIMITIVES_IMPORT}${quote}`;
      },
    )
    .replace(
      /import\s+type\s+\{([^}]+)\}\s+from\s+(['"])@headless\/([^/'"]+)\/types\2/gu,
      (_, specifiers, quote, chartName) =>
        `import type {${rewriteHeadlessTypeSpecifiers(specifiers, chartName)}} from ${quote}${ROOT_PRIMITIVES_IMPORT}${quote}`,
    )
    .replace(
      /export\s+type\s+\{([^}]+)\}\s+from\s+(['"])@headless\/([^/'"]+)\/types\2/gu,
      (_, specifiers, quote, chartName) =>
        `export type {${rewriteHeadlessTypeSpecifiers(specifiers, chartName)}} from ${quote}${ROOT_PRIMITIVES_IMPORT}${quote}`,
    )
    .replace(
      /import\s+\{([^}]+)\}\s+from\s+(['"])@headless\/([^/'"]+)\/(controller|provider)\2/gu,
      (_, specifiers, quote) => `import {${specifiers}} from ${quote}${ROOT_PRIMITIVES_IMPORT}${quote}`,
    )
    .replace(
      /export\s+\{([^}]+)\}\s+from\s+(['"])@headless\/([^/'"]+)\/(controller|provider)\2/gu,
      (_, specifiers, quote) => `export {${specifiers}} from ${quote}${ROOT_PRIMITIVES_IMPORT}${quote}`,
    )
    .replace(
      /import type \{ StyleConfig \} from "\.\.\/\.\.\/plugin";\n?/gu,
      "",
    )
    .replace(/: StyleConfig<[^>]+> =/gu, " =")
    .replace(
      /(['"])@headless\/([^/'"]+)(?:\/(?:types|provider|controller))?\1/gu,
      (_, quote) => `${quote}${ROOT_PRIMITIVES_IMPORT}${quote}`,
    )
    .replace(
      /(['"])@shared\/cartesian(?:\/index)?\1/gu,
      (_, quote) => `${quote}${ROOT_PRIMITIVES_IMPORT}${quote}`,
    )
    .replace(
      /(['"])@shared\/interaction\/hover-tooltip\1/gu,
      (_, quote) => `${quote}${ROOT_PRIMITIVES_IMPORT}${quote}`,
    )
    .replace(
      /(['"])@shared\/label\1/gu,
      (_, quote) => `${quote}${ROOT_PRIMITIVES_IMPORT}${quote}`,
    )
    .replace(
      /(['"])@shared\/utils\/scale\1/gu,
      (_, quote) => `${quote}${ROOT_PRIMITIVES_IMPORT}${quote}`,
    )
    .replace(
      /(['"])@utils\/index\1/gu,
      (_, quote) => `${quote}${ROOT_PRIMITIVES_IMPORT}${quote}`,
    )
    .replace(
      /(['"])@utils\/draw-spline-line\1/gu,
      (_, quote) => `${quote}${ROOT_PRIMITIVES_IMPORT}${quote}`,
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
      (_, quote, subpath) => {
        const pieOutputDir = targetDirs.get("toast-pie-chart") ?? "toast-pie-chart";
        return `${quote}${relativeTo(path.join(pieOutputDir, subpath))}${quote}`;
      },
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
import type { DeepPartial } from "${ROOT_PRIMITIVES_IMPORT}";
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
