import type { ApiPageData } from "../types";

export const candlestickChartApiPage: ApiPageData = {
  slug: ["api", "candlestick-chart"],
  title: "Candlestick Chart API",
  description:
    "Complete API reference for the Candlestick Chart, including data format, configuration options, custom parts, and context methods.",
  pageType: "api",
  parent: "api",
  dataFormat: {
    typeName: "CandlestickChartData",
    typeDefinition: `type CandlestickChartRow = Record<string, unknown> & {
  open: number;
  high: number;
  low: number;
  close: number;
};

type CandlestickChartData<TRow extends CandlestickChartRow = CandlestickChartRow> = {
  rows: TRow[];
  xKey: keyof TRow & string;
};`,
    description:
      "Each row represents one candlestick with OHLC values. The xKey specifies which field to use for the x-axis (e.g. date, timestamp, or numeric index).",
  },
  agConfig: {
    sections: [
      {
        title: "Candlestick",
        rows: [
          {
            property: "candlestick.upColor",
            type: "string",
            default: '"rgba(255,255,255,0.98)"',
            description: "Fill color for up candles (close > open).",
          },
          {
            property: "candlestick.downColor",
            type: "string",
            default: '"rgba(91,132,196,0.35)"',
            description: "Fill color for down candles (close < open).",
          },
          {
            property: "candlestick.wickColor",
            type: "string",
            default: '"#5b84c4"',
            description: "Color of the wick (high–low line).",
          },
        ],
      },
    ],
  },
  toastConfig: undefined,
  customParts: [
    { element: "candlestickBox", args: "{ candlestick: Widget; candle: CandlestickChartCandle; geometry: CandlestickChartGeometry; index: number; isHovered: boolean }", description: "Wrapper around each candlestick, providing layout alignment and sizing." },
    { element: "candlestick", args: "{ candle: CandlestickChartCandle; geometry: CandlestickChartGeometry; index: number; isHovered: boolean }", description: "The visual candlestick element (wick + body)." },
    { element: "tooltip", args: "{ label: string; items: { legend: string; color: string; value: number | string }[] }", description: "Tooltip content widget." },
    { element: "xAxis", args: "{ line: Widget; labels: Widget[]; tick: Widget }", description: "The complete x-axis assembly." },
    { element: "yAxis", args: "{ line: Widget; labels: Widget[]; tick: Widget }", description: "The complete y-axis assembly." },
    { element: "xAxisLabel", args: "{ name: string; index: number }", description: "Individual x-axis label." },
    { element: "yAxisLabel", args: "{ name: string; index: number }", description: "Individual y-axis label." },
    { element: "xAxisTick", args: "undefined", description: "X-axis tick mark." },
    { element: "yAxisTick", args: "undefined", description: "Y-axis tick mark." },
    { element: "dataView", args: "{ candlesticks: Widget[] }", description: "Container for all candlesticks in the data area." },
    { element: "layout", args: "{ title: Widget; legends: Widget[]; plot: Widget }", description: "Top-level layout composing title, legends, and the plot area." },
    { element: "plot", args: "{ xAxis: Widget; yAxis: Widget; dataView: Widget; grid: Widget; axisCorner: Widget; tooltipArea: Widget }", description: "The plot area composing axes, data view, grid, and tooltip." },
    { element: "tooltipArea", args: "{ tooltip: Widget | null; hoveredCandlestick: { index: number; candle: CandlestickChartCandle; x: number; y: number; width: number; height: number } | null }", description: "Tooltip positioning area that manages tooltip display." },
    { element: "legend", args: "{ name: string; index: number; isVisible: boolean }", description: "Individual legend item." },
    { element: "title", args: "undefined", description: "Chart title element." },
    { element: "dataLabel", args: "{ value: number; label: string; legend: string }", description: "Data label displayed near a candlestick." },
    { element: "xAxisLine", args: "undefined", description: "X-axis line." },
    { element: "yAxisLine", args: "undefined", description: "Y-axis line." },
    { element: "axisCorner", args: "undefined", description: "Corner element where x and y axes meet." },
    { element: "grid", args: "{ xLine: Widget; yLine: Widget }", description: "Grid container for horizontal and vertical grid lines." },
    { element: "gridXLine", args: "undefined", description: "Individual vertical grid line." },
    { element: "gridYLine", args: "undefined", description: "Individual horizontal grid line." },
  ],
  context: {
    typeName: "CandlestickChartContext",
    properties: [
      { name: "data", type: "CandlestickChartData", description: "Current chart data.", kind: "property" },
      { name: "candles", type: "CandlestickChartCandle[]", description: "Computed candlestick data from raw rows.", kind: "property" },
      { name: "xTicks", type: "CandlestickChartTick[]", description: "Computed x-axis tick labels.", kind: "property" },
      { name: "xValueType", type: '"date" | "number" | "string"', description: "Detected type of x-axis values.", kind: "property" },
      { name: "transform", type: "CandlestickChartTransform", description: "Current transform options.", kind: "property" },
      { name: "width", type: "number", description: "Current chart width in pixels.", kind: "property" },
      { name: "height", type: "number", description: "Current chart height in pixels.", kind: "property" },
      { name: "scale", type: "CandlestickChartScale | null", description: "Computed scale with min, max, and step.", kind: "property" },
      { name: "hoveredCandlestick", type: "{ index: number; anchorKey: GlobalKey } | null", description: "Currently hovered candlestick info.", kind: "property" },
      { name: "config", type: "TConfig", description: "The resolved chart configuration object.", kind: "property" },
      { name: "setSize(width, height)", type: "(width: number, height: number) => void", description: "Update chart dimensions.", kind: "method" },
      { name: "hoverCandlestick(index, anchorKey)", type: "(index: number, anchorKey: GlobalKey) => void", description: "Set hover state on a specific candlestick.", kind: "method" },
      { name: "unhoverCandlestick(index)", type: "(index: number) => void", description: "Clear hover if the specified candlestick is currently hovered.", kind: "method" },
      { name: "unhoverAllCandlesticks()", type: "() => void", description: "Clear all candlestick hover state.", kind: "method" },
      { name: "isCandlestickHovered(index)", type: "(index: number) => boolean", description: "Check if a specific candlestick is hovered.", kind: "method" },
    ],
  },
  overrideExample: `import { CandlestickChart } from "@/components/flitter/charts/candlestick-chart";

<CandlestickChart
  data={{
    rows: bitcoinRows,
    xKey: "date",
  }}
  config={{
    candlestick: {
      upColor: "#22c55e",
      downColor: "#ef4444",
      wickColor: "#6b7280",
    },
  }}
/>`,
};
