import type { ApiPageData } from "../types";

export const radarChartApiPage: ApiPageData = {
  slug: ["api", "radar-chart"],
  title: "Radar Chart API",
  description:
    "Complete API reference for the Radar Chart, including data format, configuration options, custom parts, and context methods.",
  pageType: "api",
  parent: "api",
  dataFormat: {
    typeName: "RadarChartData",
    typeDefinition: `type RadarChartData = {
  labels: string[];
  datasets: { legend: string; values: number[] }[];
};`,
    description:
      "Each dataset represents a radar polygon with a legend name and values for each axis label.",
  },
  agConfig: {
    sections: [
      {
        title: "Radar",
        rows: [
          {
            property: "radar.fillOpacity",
            type: "number",
            default: "0.3",
            description: "Fill opacity of radar polygons (0 to 1).",
          },
          {
            property: "radar.strokeWidth",
            type: "number",
            default: "2",
            description: "Stroke width of radar polygon outlines.",
          },
          {
            property: "radar.gridColor",
            type: "string",
            default: '"#e2e2e2"',
            description: "Color of the radial grid lines.",
          },
          {
            property: "radar.gridWidth",
            type: "number",
            default: "1",
            description: "Width of radial grid lines.",
          },
          {
            property: "radar.axisColor",
            type: "string",
            default: '"#8a8c8c"',
            description: "Color of the angular axis lines.",
          },
          {
            property: "radar.axisWidth",
            type: "number",
            default: "1",
            description: "Width of angular axis lines.",
          },
          {
            property: "radar.labelMargin",
            type: "number",
            default: "20",
            description: "Margin around the radar plot area for axis labels.",
          },
        ],
      },
    ],
  },
  toastConfig: {
    sections: [
      {
        title: "Radar",
        rows: [
          {
            property: "radar.fillOpacity",
            type: "number",
            default: "0.3",
            description: "Fill opacity of radar polygons (0 to 1).",
          },
          {
            property: "radar.strokeWidth",
            type: "number",
            default: "2",
            description: "Stroke width of radar polygon outlines.",
          },
          {
            property: "radar.gridColor",
            type: "string",
            default: '"rgba(0, 0, 0, 0.1)"',
            description: "Color of the radial grid lines.",
          },
          {
            property: "radar.gridWidth",
            type: "number",
            default: "1",
            description: "Width of radial grid lines.",
          },
          {
            property: "radar.axisColor",
            type: "string",
            default: '"rgba(0, 0, 0, 0.1)"',
            description: "Color of the angular axis lines.",
          },
          {
            property: "radar.axisWidth",
            type: "number",
            default: "1",
            description: "Width of angular axis lines.",
          },
          {
            property: "radar.labelMargin",
            type: "number",
            default: "5",
            description: "Margin around the radar plot area for axis labels.",
          },
        ],
      },
    ],
  },
  customParts: [
    { element: "layout", args: "{ title: Widget; legends: Widget[]; plot: Widget }", description: "Top-level layout composing title, legends, and the plot area." },
    { element: "plot", args: "{ dataView: Widget; tooltipArea: Widget; web: Widget; radialAxis: Widget; angularItems: AngularItem[] }", description: "The plot area with data view, web guides, radial axis, and angular labels." },
    { element: "radialAxis", args: "{ labels: RadialLabelItem[] }", description: "Radial axis with value labels at each ring level." },
    { element: "web", args: "{ angularLines: WebAngularGuide[]; radialLines: WebRadialGuide[] }", description: "The web/grid structure with angular and radial guide lines." },
    { element: "angularLine", args: "{ axisCount: number }", description: "Individual angular guide line from center to edge." },
    { element: "radialLine", args: "undefined", description: "Individual radial (ring) guide line." },
    { element: "angularAxisLabel", args: "{ index: number; label: string; angle: number }", description: "Label at the end of an angular axis." },
    { element: "radialAxisLabel", args: "{ value: number; index: number; ratio: number }", description: "Value label on a radial ring." },
    { element: "dataView", args: "{ radars: Widget[] }", description: "Container for all radar polygon widgets." },
    { element: "radar", args: "{ legend: string; index: number; vertices: RadarVertex[]; isHovered: boolean; hoveredPointIndex: number | null }", description: "Individual radar polygon for a series." },
    { element: "legend", args: "{ name: string; index: number; isVisible: boolean }", description: "Individual legend item." },
    { element: "title", args: "undefined", description: "Chart title element." },
    { element: "tooltip", args: "{ label: string; items: { legend: string; color: string; value: number }[] }", description: "Tooltip content widget." },
    { element: "tooltipArea", args: "{ hoveredRadar: HoveredRadar | null; hoveredPoint: HoveredRadarPoint | null }", description: "Tooltip positioning area." },
  ],
  context: {
    typeName: "RadarChartContext",
    properties: [
      { name: "data", type: "RadarChartData", description: "Current chart data (filtered by hidden series).", kind: "property" },
      { name: "legends", type: "string[]", description: "All legend names from the raw data.", kind: "property" },
      { name: "width", type: "number", description: "Current chart width in pixels.", kind: "property" },
      { name: "height", type: "number", description: "Current chart height in pixels.", kind: "property" },
      { name: "plotWidth", type: "number", description: "Width of the plot area in pixels.", kind: "property" },
      { name: "plotHeight", type: "number", description: "Height of the plot area in pixels.", kind: "property" },
      { name: "scale", type: "RadarChartScale | null", description: "Computed scale with min, max, and step.", kind: "property" },
      { name: "hiddenSeries", type: "ReadonlySet<string>", description: "Set of currently hidden series.", kind: "property" },
      { name: "hoveredRadar", type: "{ index: number; legend: string } | null", description: "Currently hovered radar polygon.", kind: "property" },
      { name: "hoveredPoint", type: "{ index: number; legend: string; pointIndex: number } | null", description: "Currently hovered vertex point.", kind: "property" },
      { name: "config", type: "TConfig", description: "The resolved chart configuration object.", kind: "property" },
      { name: "isSeriesVisible(legend)", type: "(legend: string) => boolean", description: "Check if a series is currently visible.", kind: "method" },
      { name: "toggleSeries(legend)", type: "(legend: string) => void", description: "Toggle visibility of a series.", kind: "method" },
      { name: "showSeries(legend)", type: "(legend: string) => void", description: "Show a hidden series.", kind: "method" },
      { name: "hideSeries(legend)", type: "(legend: string) => void", description: "Hide a visible series.", kind: "method" },
      { name: "showAllSeries()", type: "() => void", description: "Show all hidden series.", kind: "method" },
      { name: "hoverRadar(index, legend)", type: "(index: number, legend: string) => void", description: "Set hover state on a radar polygon.", kind: "method" },
      { name: "unhoverRadar(index, legend)", type: "(index: number, legend: string) => void", description: "Clear hover on a radar polygon.", kind: "method" },
      { name: "unhoverAllRadars()", type: "() => void", description: "Clear all radar hover state.", kind: "method" },
      { name: "isRadarHovered(index, legend)", type: "(index: number, legend: string) => boolean", description: "Check if a specific radar is hovered.", kind: "method" },
      { name: "hoverPoint(index, legend, pointIndex)", type: "(index: number, legend: string, pointIndex: number) => void", description: "Set hover state on a vertex point.", kind: "method" },
      { name: "unhoverPoint(index, legend, pointIndex)", type: "(index: number, legend: string, pointIndex: number) => void", description: "Clear hover on a vertex point.", kind: "method" },
      { name: "unhoverAllPoints()", type: "() => void", description: "Clear all point hover state.", kind: "method" },
      { name: "isPointHovered(index, legend, pointIndex)", type: "(index: number, legend: string, pointIndex: number) => boolean", description: "Check if a specific vertex point is hovered.", kind: "method" },
      { name: "getRadarVertices(index, legend)", type: "(index: number, legend: string) => RadarVertex[] | null", description: "Get computed vertices for a radar polygon.", kind: "method" },
      { name: "getRadarAnchorPosition(index, legend)", type: "(index: number, legend: string) => { x: number; y: number } | null", description: "Get anchor position for a radar polygon.", kind: "method" },
      { name: "setSize(width, height)", type: "(width: number, height: number) => void", description: "Update chart dimensions.", kind: "method" },
      { name: "setPlotSize(width, height)", type: "(width: number, height: number) => void", description: "Update plot area dimensions.", kind: "method" },
    ],
  },
  overrideExample: `import { ToastRadarChart } from "@/components/flitter/charts/toast-radar-chart";

<ToastRadarChart
  data={data}
  config={{
    radar: { fillOpacity: 0.2, strokeWidth: 3 },
  }}
/>`,
};
