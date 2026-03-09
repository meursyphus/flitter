import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const registryRoot = path.dirname(fileURLToPath(import.meta.url));
const templatesRoot = path.join(registryRoot, "templates");

function toPosix(filePath) {
  return filePath.split(path.sep).join("/");
}

function listFiles(relativeDir) {
  const absoluteDir = path.join(templatesRoot, relativeDir);
  if (!fs.existsSync(absoluteDir)) {
    return [];
  }

  const files = [];

  function walk(currentDir) {
    for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
      const entryPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        walk(entryPath);
        continue;
      }
      files.push(toPosix(path.relative(templatesRoot, entryPath)));
    }
  }

  walk(absoluteDir);
  return files.sort();
}

function mapDir(sourceDir, targetDir, filter) {
  return listFiles(sourceDir)
    .filter((file) => (filter ? filter(file) : true))
    .map((source) => ({
      source,
      target: toPosix(path.join(targetDir, path.relative(sourceDir, source))),
    }));
}

function styleBaseItem(style) {
  const outputDir = `${style}-base`;
  return {
    id: outputDir,
    kind: "style-base",
    name: `${style}-base`,
    style,
    outputDir,
    dependencies: ["flitter-ui", "flitter-core"],
    registryDependencies: ["flitter-base"],
    files: [
      ...mapDir(`styles/${style}`, outputDir),
      ...mapDir("shared/bar-like", `${outputDir}/bar-like`),
      ...mapDir("shared/line-like", `${outputDir}/line-like`),
      ...mapDir("shared/point-like", `${outputDir}/point-like`),
    ],
  };
}

const pluginCharts = [
  { name: "bar-chart", styles: ["toast", "ag"], family: "bar" },
  { name: "stacked-bar-chart", styles: ["toast", "ag"], family: "bar" },
  { name: "line-chart", styles: ["toast", "ag"], family: "line" },
  { name: "area-chart", styles: ["toast", "ag"], family: "line" },
  { name: "stacked-area-chart", styles: ["toast", "ag"], family: "line" },
  { name: "scatter-chart", styles: ["toast", "ag"], family: "point" },
  { name: "bubble-chart", styles: ["toast", "ag"], family: "point" },
  { name: "pie-chart", styles: ["toast", "ag"], family: "radial" },
  { name: "radar-chart", styles: ["toast", "ag"], family: "radial" },
  { name: "heatmap-chart", styles: ["toast", "ag"], family: "matrix" },
];

const presetCharts = [
];

const standaloneCharts = [
  { name: "box-plot-chart" },
  { name: "sunburst-chart" },
];

function pluginChartItem(chart, style, family) {
  const outputDir = `${style}-${chart}`;
  return {
    id: outputDir,
    kind: "plugin-chart",
    name: chart,
    style,
    family,
    outputDir,
    dependencies: ["flitter-ui", "flitter-core"],
    registryDependencies: [`${style}-base`],
    files: [
      ...mapDir(`charts/${chart}/base`, `${outputDir}/base`),
      ...mapDir(
        `charts/${chart}/styles/${style}`,
        `${outputDir}/styles/${style}`,
      ),
    ],
  };
}

function presetChartItem(chart, style) {
  const outputDir = `${style}-${chart}`;
  return {
    id: outputDir,
    kind: "copy-chart",
    name: chart,
    style,
    outputDir,
    dependencies: ["flitter-ui", "flitter-core"],
    registryDependencies: [`${style}-base`],
    files: mapDir(`charts/${chart}`, outputDir, (file) => {
      if (!file.startsWith(`charts/${chart}/styles/`)) return true;
      return file.startsWith(`charts/${chart}/styles/${style}/`);
    }),
  };
}

function styledCopyChartItem(chart, style, registryDependencies) {
  const outputDir = `${style}-${chart}`;
  return {
    id: outputDir,
    kind: "copy-chart",
    name: chart,
    style,
    outputDir,
    dependencies: ["flitter-ui", "flitter-core"],
    registryDependencies,
    files: mapDir(`charts/${chart}`, outputDir, (file) => {
      if (!file.startsWith(`charts/${chart}/styles/`)) return true;
      return file.startsWith(`charts/${chart}/styles/${style}/`);
    }),
  };
}

function standaloneChartItem(chart, registryDependencies = ["flitter-base"]) {
  return {
    id: chart,
    kind: "copy-chart",
    name: chart,
    style: null,
    outputDir: chart,
    dependencies: ["flitter-ui", "flitter-core"],
    registryDependencies,
    files: mapDir(`charts/${chart}`, chart),
  };
}

export const pluginChartMetadata = {
  "bar-chart": {
    componentName: "BarChart",
    baseName: "BaseBarChart",
    customType: "BarChartCustom",
    dataType: "BarChartData",
    configTypes: {
      toast: "ToastBarChartConfig",
      ag: "AgBarChartConfig",
    },
    supportsDirection: true,
    supportsGetScale: true,
    supportsGetScaleOptions: true,
  },
  "stacked-bar-chart": {
    componentName: "StackedBarChart",
    baseName: "BaseStackedBarChart",
    customType: "BarChartCustom",
    dataType: "BarChartData",
    configTypes: {
      toast: "ToastStackedBarChartConfig",
      ag: "AgStackedBarChartConfig",
    },
    supportsDirection: true,
    supportsGetScale: true,
    supportsGetScaleOptions: true,
  },
  "line-chart": {
    componentName: "LineChart",
    baseName: "BaseLineChart",
    customType: "LineChartCustom",
    dataType: "LineChartData",
    configTypes: {
      toast: "ToastLineChartConfig",
      ag: "AgLineChartConfig",
    },
    supportsDirection: false,
    supportsGetScale: true,
    supportsGetScaleOptions: true,
  },
  "area-chart": {
    componentName: "AreaChart",
    baseName: "BaseAreaChart",
    customType: "LineChartCustom",
    dataType: "LineChartData",
    configTypes: {
      toast: "ToastAreaChartConfig",
      ag: "AgAreaChartConfig",
    },
    supportsDirection: false,
    supportsGetScale: true,
    supportsGetScaleOptions: true,
  },
  "stacked-area-chart": {
    componentName: "StackedAreaChart",
    baseName: "BaseStackedAreaChart",
    customType: "LineChartCustom",
    dataType: "LineChartData",
    configTypes: {
      toast: "ToastStackedAreaChartConfig",
      ag: "AgStackedAreaChartConfig",
    },
    supportsDirection: false,
    supportsGetScale: true,
    supportsGetScaleOptions: true,
  },
  "scatter-chart": {
    componentName: "ScatterChart",
    baseName: "BaseScatterChart",
    customType: "ScatterChartCustom",
    dataType: "ScatterChartData",
    configTypes: {
      toast: "ToastScatterChartConfig",
      ag: "AgScatterChartConfig",
    },
    supportsDirection: false,
    supportsGetScale: true,
    supportsGetScaleOptions: true,
  },
  "bubble-chart": {
    componentName: "BubbleChart",
    baseName: "BaseBubbleChart",
    customType: "BubbleChartCustom",
    dataType: "BubbleChartData",
    configTypes: {
      toast: "ToastBubbleChartConfig",
      ag: "AgBubbleChartConfig",
    },
    supportsDirection: false,
    supportsGetScale: true,
    supportsGetScaleOptions: true,
  },
  "pie-chart": {
    componentName: "PieChart",
    baseName: "BasePieChart",
    customType: "PieChartCustom",
    dataType: "PieChartData",
    configTypes: {
      toast: "ToastPieChartConfig",
      ag: "AgPieChartConfig",
    },
    supportsDirection: false,
    supportsGetScale: false,
    supportsGetScaleOptions: false,
  },
  "radar-chart": {
    componentName: "RadarChart",
    baseName: "BaseRadarChart",
    customType: "RadarChartCustom",
    dataType: "RadarChartData",
    configTypes: {
      toast: "ToastRadarChartConfig",
      ag: "AgRadarChartConfig",
    },
    supportsDirection: false,
    supportsGetScale: true,
    supportsGetScaleOptions: false,
  },
  "heatmap-chart": {
    componentName: "HeatmapChart",
    baseName: "BaseHeatmapChart",
    customType: "HeatmapCustom",
    dataType: "HeatmapData",
    configTypes: {
      toast: "ToastHeatmapChartConfig",
      ag: "AgHeatmapChartConfig",
    },
    supportsDirection: false,
    supportsGetScale: false,
    supportsGetScaleOptions: false,
  },
};

export const registryItems = [
  {
    id: "flitter-base",
    kind: "support",
    name: "flitter-base",
    style: null,
    outputDir: "_flitter",
    dependencies: ["flitter-ui", "flitter-core"],
    registryDependencies: [],
    files: [],
  },
  styleBaseItem("toast"),
  styleBaseItem("ag"),
  ...pluginCharts.flatMap(({ name, styles, family }) =>
    styles.map((style) => pluginChartItem(name, style, family)),
  ),
  ...presetCharts.map(({ name, style }) => presetChartItem(name, style)),
  styledCopyChartItem("donut-chart", "ag", ["ag-base", "ag-pie-chart"]),
  styledCopyChartItem("donut-chart", "toast", ["toast-base", "toast-pie-chart"]),
  styledCopyChartItem("gauge-chart", "ag", ["ag-base"]),
  styledCopyChartItem("gauge-chart", "toast", ["toast-base"]),
  styledCopyChartItem("histogram-chart", "ag", ["ag-base"]),
  styledCopyChartItem("histogram-chart", "toast", ["toast-base"]),
  styledCopyChartItem("polar-area-chart", "ag", ["ag-base", "ag-pie-chart"]),
  styledCopyChartItem("polar-area-chart", "toast", ["toast-base", "toast-pie-chart"]),
  styledCopyChartItem("progress-chart", "ag", ["ag-base"]),
  styledCopyChartItem("progress-chart", "toast", ["toast-base"]),
  styledCopyChartItem("waterfall-chart", "ag", ["ag-base"]),
  styledCopyChartItem("waterfall-chart", "toast", ["toast-base"]),
  styledCopyChartItem("candlestick-chart", "ag", ["ag-base"]),
  styledCopyChartItem("candlestick-chart", "toast", ["toast-base"]),
  styledCopyChartItem("funnel-chart", "ag", ["ag-base"]),
  styledCopyChartItem("funnel-chart", "toast", ["toast-base"]),
  styledCopyChartItem("gantt-chart", "ag", ["ag-base"]),
  styledCopyChartItem("gantt-chart", "toast", ["toast-base"]),
  styledCopyChartItem("combo-chart", "ag", ["ag-base"]),
  styledCopyChartItem("combo-chart", "toast", ["toast-base"]),
  styledCopyChartItem("network-chart", "ag", ["ag-base"]),
  styledCopyChartItem("network-chart", "toast", ["toast-base"]),
  styledCopyChartItem("sankey-chart", "ag", ["ag-base"]),
  styledCopyChartItem("sankey-chart", "toast", ["toast-base"]),
  styledCopyChartItem("treemap-chart", "ag", ["ag-base"]),
  styledCopyChartItem("treemap-chart", "toast", ["toast-base"]),
  ...standaloneCharts.map(({ name, registryDependencies }) =>
    standaloneChartItem(name, registryDependencies),
  ),
];

export function getRegistry() {
  return {
    registryRoot,
    templatesRoot,
    items: registryItems,
    pluginChartMetadata,
    resolveTemplatePath,
  };
}

export function findRegistryItem(name, style = null) {
  return registryItems.find((item) => item.name === name && item.style === style) ?? null;
}

export function resolveTemplatePath(relativePath) {
  return path.join(templatesRoot, relativePath);
}

export default getRegistry();
