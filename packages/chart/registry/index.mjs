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
];

const presetCharts = [
  { name: "pie-chart", style: "toast" },
  { name: "radar-chart", style: "toast" },
  { name: "heatmap-chart", style: "toast" },
];

const standaloneCharts = [
  { name: "box-plot-chart" },
  { name: "candlestick-chart" },
  { name: "combo-chart" },
  { name: "donut-chart", registryDependencies: ["toast-base", "toast-pie-chart"] },
  { name: "funnel-chart" },
  { name: "gantt-chart" },
  { name: "gauge-chart" },
  { name: "histogram-chart" },
  { name: "network-chart" },
  { name: "polar-area-chart", registryDependencies: ["toast-base", "toast-pie-chart"] },
  { name: "progress-chart" },
  { name: "sankey-chart" },
  { name: "sunburst-chart" },
  { name: "treemap-chart" },
  { name: "waterfall-chart" },
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
    files: mapDir(`charts/${chart}`, outputDir),
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
