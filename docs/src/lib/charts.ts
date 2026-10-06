/**
 * Preset charts as the docs render them.
 *
 * Each factory is the preset from `shared/chart`, plus the site theme and
 * render mode applied underneath the caller's own config. Outside
 * `buildChart()` they behave exactly like the presets, and gallery snippets
 * are generated with the plain preset imports, so none of this leaks into
 * copied code.
 */
import * as presets from "shared/chart";
import type { Theme } from "./theme";

type ChartStyle = "ag" | "toast";

export type ChartRenderOptions = {
  theme: Theme;
  /** false renders the final frame immediately (gallery grids, reels). */
  animate: boolean;
};

type ConfigLayer = Record<string, unknown>;

const ink = "#eef0f4";
const soft = "#a3aab8";
const faint = "#7d8593";
const axisLine = "#454c57";
const surface = "#14171c";

/**
 * Dark overrides per style. Keys that a chart doesn't have are ignored by it,
 * so one layer covers every chart in the style.
 */
const darkLayers: Record<ChartStyle, ConfigLayer> = {
  ag: {
    background: "transparent",
    title: { color: ink },
    subtitle: { color: faint },
    legend: { color: soft },
    axis: { color: axisLine, label: { color: soft } },
    grid: { color: "#252a32" },
    tooltip: {
      backgroundColor: "#1d2128",
      textColor: ink,
      borderColor: "#363c47",
    },
    radar: { gridColor: "#2a3039", axisColor: axisLine },
    radialLabel: { fontColor: ink, nameColor: soft },
    radialTick: { color: axisLine },
    dataCenter: { labelColor: soft, valueColor: ink },
    treemap: { groupTitle: { color: soft } },
    candlestick: {
      upColor: surface,
      crosshairColor: "rgba(238, 240, 244, 0.5)",
    },
  },
  toast: {
    title: { color: ink },
    legend: { color: soft },
    axis: { color: axisLine, label: { color: soft } },
    grid: { color: "rgba(255, 255, 255, 0.06)" },
    tooltip: { backgroundColor: "rgba(36, 41, 50, 0.96)" },
    radar: {
      gridColor: "rgba(255, 255, 255, 0.1)",
      axisColor: "rgba(255, 255, 255, 0.1)",
      tickLabelBackground: "#1d2128",
      tickLabelBorderColor: "rgba(255, 255, 255, 0.08)",
    },
    radialLabel: { fontColor: ink },
    radialTick: { color: axisLine },
    dataCenter: { labelColor: faint, valueColor: ink },
  },
};

const staticLayers: Record<ChartStyle, ConfigLayer | null> = {
  ag: null,
  toast: { animation: { enabled: false } },
};

let active: ChartRenderOptions | null = null;

/**
 * Runs `create` with the given options applied to every chart factory it
 * calls. Factories resolve their config synchronously, so the options only
 * need to be in place for the duration of the call.
 */
export function buildChart<T>(options: ChartRenderOptions, create: () => T): T {
  const previous = active;
  active = options;
  try {
    return create();
  } finally {
    active = previous;
  }
}

function isPlainObject(value: unknown): value is ConfigLayer {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function merge(base: ConfigLayer, override: ConfigLayer): ConfigLayer {
  const result: ConfigLayer = { ...base };
  for (const [key, value] of Object.entries(override)) {
    const current = result[key];
    result[key] =
      isPlainObject(value) && isPlainObject(current) ? merge(current, value) : value;
  }
  return result;
}

function resolveConfig(style: ChartStyle, config: unknown) {
  if (!active) return config;

  let resolved: ConfigLayer = active.theme === "dark" ? darkLayers[style] : {};
  if (isPlainObject(config)) resolved = merge(resolved, config);

  const staticLayer = staticLayers[style];
  if (!active.animate && staticLayer) resolved = merge(resolved, staticLayer);

  return resolved;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function themed<F extends (props: any) => unknown>(factory: F, style: ChartStyle): F {
  const wrapped = (props: { config?: unknown }) =>
    factory({ ...props, config: resolveConfig(style, props.config) });
  return wrapped as F;
}

export const AreaChart = themed(presets.AreaChart, "ag");
export const BarChart = themed(presets.BarChart, "ag");
export const BubbleChart = themed(presets.BubbleChart, "ag");
export const CandlestickChart = themed(presets.CandlestickChart, "ag");
export const DonutChart = themed(presets.DonutChart, "ag");
export const HeatmapChart = themed(presets.HeatmapChart, "ag");
export const LineChart = themed(presets.LineChart, "ag");
export const PieChart = themed(presets.PieChart, "ag");
export const RadarChart = themed(presets.RadarChart, "ag");
export const ScatterChart = themed(presets.ScatterChart, "ag");
export const StackedAreaChart = themed(presets.StackedAreaChart, "ag");
export const StackedBarChart = themed(presets.StackedBarChart, "ag");
export const TreemapChart = themed(presets.TreemapChart, "ag");

export const ToastAreaChart = themed(presets.ToastAreaChart, "toast");
export const ToastBarChart = themed(presets.ToastBarChart, "toast");
export const ToastBubbleChart = themed(presets.ToastBubbleChart, "toast");
export const ToastDonutChart = themed(presets.ToastDonutChart, "toast");
export const ToastHeatmapChart = themed(presets.ToastHeatmapChart, "toast");
export const ToastLineChart = themed(presets.ToastLineChart, "toast");
export const ToastPieChart = themed(presets.ToastPieChart, "toast");
export const ToastRadarChart = themed(presets.ToastRadarChart, "toast");
export const ToastScatterChart = themed(presets.ToastScatterChart, "toast");
export const ToastStackedAreaChart = themed(presets.ToastStackedAreaChart, "toast");
export const ToastStackedBarChart = themed(presets.ToastStackedBarChart, "toast");
export const ToastTreemapChart = themed(presets.ToastTreemapChart, "toast");
