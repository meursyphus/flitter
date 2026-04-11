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

// Directories within styles/{style}/ that are family-specific (not core)
const STYLE_FAMILY_DIRS = ["bar-like", "line-like", "polar-like"];

// Mapping from chart family to the shared/ and styles/ subdirs it requires
const FAMILY_DEPS = {
  bar:    { shared: ["bar-like"],  style: ["bar-like"] },
  line:   { shared: ["line-like"], style: ["line-like"] },
  point:  { shared: ["point-like"], style: [] },
  radial: { shared: ["pie-like"], style: ["polar-like"] },
  matrix: { shared: [], style: [] },
};

function styleBaseCoreItem(style) {
  const outputDir = `_shared/${style}`;
  return {
    id: `${style}-base`,
    kind: "style-base",
    name: `${style}-base`,
    style,
    outputDir,
    dependencies: ["flitter-ui"],
    registryDependencies: ["flitter-base"],
    files: mapDir(`styles/${style}`, outputDir, (file) => {
      // Exclude family-specific subdirectories from the core item
      const rel = file.slice(`styles/${style}/`.length);
      return !STYLE_FAMILY_DIRS.some(
        (dir) => rel.startsWith(`${dir}/`) || rel === dir,
      );
    }),
  };
}

function styleFamilyItem(style, family) {
  const deps = FAMILY_DEPS[family];
  if (!deps) return null;
  const outputDir = `_shared/${style}`;
  const id = `${style}-base-${family}`;
  const files = [];

  for (const dir of deps.shared) {
    files.push(...mapDir(`shared/${dir}`, `${outputDir}/${dir}`));
  }
  for (const dir of deps.style) {
    files.push(...mapDir(`styles/${style}/${dir}`, `${outputDir}/${dir}`));
  }

  if (files.length === 0) return null;

  return {
    id,
    kind: "style-family",
    name: `${style}-base-${family}`,
    style,
    family,
    outputDir,
    dependencies: ["flitter-ui"],
    registryDependencies: [`${style}-base`],
    files,
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
];

function pluginChartItem(chart, style, family) {
  const outputDir = `${style}-${chart}`;
  const registryDeps = [`${style}-base`];
  const familyItem = `${style}-base-${family}`;
  if (FAMILY_DEPS[family] && (FAMILY_DEPS[family].shared.length > 0 || FAMILY_DEPS[family].style.length > 0)) {
    registryDeps.push(familyItem);
  }
  return {
    id: outputDir,
    kind: "plugin-chart",
    name: chart,
    style,
    family,
    outputDir,
    dependencies: ["flitter-ui"],
    registryDependencies: registryDeps,
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
    dependencies: ["flitter-ui"],
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
    dependencies: ["flitter-ui"],
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
    dependencies: ["flitter-ui"],
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

// Generate all family items for both styles
const allFamilies = Object.keys(FAMILY_DEPS);
const styleFamilyItems = ["toast", "ag"]
  .flatMap((style) =>
    allFamilies.map((family) => styleFamilyItem(style, family)),
  )
  .filter(Boolean);

export const registryItems = [
  {
    id: "flitter-base",
    kind: "support",
    name: "flitter-base",
    style: null,
    outputDir: "_flitter",
    dependencies: ["flitter-ui"],
    registryDependencies: [],
    files: [],
  },
  styleBaseCoreItem("toast"),
  styleBaseCoreItem("ag"),
  ...styleFamilyItems,
  ...pluginCharts.flatMap(({ name, styles, family }) =>
    styles.map((style) => pluginChartItem(name, style, family)),
  ),
  ...presetCharts.map(({ name, style }) => presetChartItem(name, style)),
  styledCopyChartItem("box-plot-chart", "ag", ["ag-base"]),
  styledCopyChartItem("box-plot-chart", "toast", ["toast-base"]),
  styledCopyChartItem("donut-chart", "ag", ["ag-base", "ag-base-radial"]),
  styledCopyChartItem("donut-chart", "toast", ["toast-base", "toast-base-radial"]),
  styledCopyChartItem("histogram-chart", "ag", ["ag-base"]),
  styledCopyChartItem("histogram-chart", "toast", ["toast-base"]),
  styledCopyChartItem("waterfall-chart", "ag", ["ag-base"]),
  styledCopyChartItem("waterfall-chart", "toast", ["toast-base"]),
  styledCopyChartItem("candlestick-chart", "ag", ["ag-base"]),
  styledCopyChartItem("sankey-chart", "ag", ["ag-base"]),
  styledCopyChartItem("sankey-chart", "toast", ["toast-base"]),
  styledCopyChartItem("treemap-chart", "ag", ["ag-base"]),
  styledCopyChartItem("treemap-chart", "toast", ["toast-base"]),
  styledCopyChartItem("sunburst-chart", "ag", ["ag-base", "ag-base-radial"]),
  styledCopyChartItem("sunburst-chart", "toast", ["toast-base", "toast-base-radial"]),
  styledCopyChartItem("bullet-chart", "ag", ["ag-base"]),
  styledCopyChartItem("bullet-chart", "toast", ["toast-base"]),
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
