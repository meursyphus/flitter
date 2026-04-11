import type { ApiPageData } from "../types";

export const sunburstChartApiPage: ApiPageData = {
  slug: ["api", "sunburst-chart"],
  title: "Sunburst Chart API",
  description:
    "Complete API reference for the Sunburst Chart, including data format, configuration options, custom parts, and context methods.",
  pageType: "api",
  parent: "api",
  dataFormat: {
    typeName: "SunburstChartData",
    typeDefinition: `type SunburstChartNode = {
  label: string;
  value: number;
  children: SunburstChartNode[];
};

type SunburstChartData = {
  nodes: SunburstChartNode[];
};`,
    description:
      "A hierarchical tree structure where each node has a label, value, and optional children. Top-level nodes become the primary branches of the sunburst.",
  },
  agConfig: {
    sections: [
      {
        title: "Sunburst",
        rows: [
          {
            property: "sunburst.innerRadiusRatio",
            type: "number",
            default: "0.18",
            description: "Inner radius ratio for the center hole (0 to 1).",
          },
          {
            property: "sunburst.strokeColor",
            type: "string",
            default: '"white"',
            description: "Color of segment borders.",
          },
          {
            property: "sunburst.strokeWidth",
            type: "number",
            default: "1",
            description: "Width of segment borders.",
          },
          {
            property: "sunburst.hoverStrokeWidth",
            type: "number",
            default: "2",
            description: "Stroke width when a segment is hovered.",
          },
          {
            property: "sunburst.hoverShadowColor",
            type: "string",
            default: '"rgba(0,0,0,0.20)"',
            description: "Shadow color on hovered segments.",
          },
          {
            property: "sunburst.dimOpacity",
            type: "number",
            default: "0.32",
            description: "Opacity of non-hovered segments when one is hovered.",
          },
        ],
      },
      {
        title: "Data Label",
        rows: [
          {
            property: "dataLabel.visible",
            type: "boolean",
            default: "true",
            description: "Whether data labels on segments are visible.",
          },
          {
            property: "dataLabel.minArcLength",
            type: "number",
            default: "22",
            description: "Minimum arc length in pixels for a label to appear.",
          },
          {
            property: "dataLabel.minRingWidth",
            type: "number",
            default: "18",
            description: "Minimum ring width in pixels for a label to appear.",
          },
          {
            property: "dataLabel.minFontSize",
            type: "number",
            default: "8",
            description: "Minimum font size for data labels.",
          },
          {
            property: "dataLabel.maxFontSize",
            type: "number",
            default: "12",
            description: "Maximum font size for data labels.",
          },
          {
            property: "dataLabel.color",
            type: "string",
            default: '"white"',
            description: "Primary text color for data labels.",
          },
          {
            property: "dataLabel.secondaryColor",
            type: "string",
            default: '"rgba(255,255,255,0.82)"',
            description: "Secondary text color for value portion of labels.",
          },
          {
            property: "dataLabel.fontWeight",
            type: "string",
            default: '"600"',
            description: "Font weight for data labels.",
          },
          {
            property: "dataLabel.formatter",
            type: "(args: { label, value, depth, path, branchLabel }) => { label: string; value?: string }",
            default: "Shows label and formatted value",
            description: "Formatter function for data label content.",
          },
        ],
      },
    ],
  },
  toastConfig: {
    sections: [
      {
        title: "Sunburst",
        rows: [
          {
            property: "sunburst.innerRadiusRatio",
            type: "number",
            default: "0.18",
            description: "Inner radius ratio for the center hole (0 to 1).",
          },
          {
            property: "sunburst.strokeColor",
            type: "string",
            default: '"transparent"',
            description: "Color of segment borders.",
          },
          {
            property: "sunburst.strokeWidth",
            type: "number",
            default: "0",
            description: "Width of segment borders.",
          },
          {
            property: "sunburst.hoverBorderColor",
            type: "string",
            default: '"white"',
            description: "Border color when a segment is hovered.",
          },
          {
            property: "sunburst.hoverBorderWidth",
            type: "number",
            default: "4",
            description: "Border width when a segment is hovered.",
          },
          {
            property: "sunburst.hoverShadowColor",
            type: "string",
            default: '"rgba(0,0,0,0.30)"',
            description: "Shadow color on hovered segments.",
          },
          {
            property: "sunburst.dimOpacity",
            type: "number",
            default: "1",
            description: "Opacity of non-hovered segments when one is hovered.",
          },
        ],
      },
      {
        title: "Data Label",
        rows: [
          {
            property: "dataLabel.visible",
            type: "boolean",
            default: "true",
            description: "Whether data labels on segments are visible.",
          },
          {
            property: "dataLabel.minArcLength",
            type: "number",
            default: "24",
            description: "Minimum arc length in pixels for a label to appear.",
          },
          {
            property: "dataLabel.minRingWidth",
            type: "number",
            default: "20",
            description: "Minimum ring width in pixels for a label to appear.",
          },
          {
            property: "dataLabel.minFontSize",
            type: "number",
            default: "8",
            description: "Minimum font size for data labels.",
          },
          {
            property: "dataLabel.maxFontSize",
            type: "number",
            default: "13",
            description: "Maximum font size for data labels.",
          },
          {
            property: "dataLabel.color",
            type: "string",
            default: '"white"',
            description: "Primary text color for data labels.",
          },
          {
            property: "dataLabel.secondaryColor",
            type: "string",
            default: '"rgba(255,255,255,0.86)"',
            description: "Secondary text color for value portion of labels.",
          },
          {
            property: "dataLabel.fontWeight",
            type: "string",
            default: '"700"',
            description: "Font weight for data labels.",
          },
          {
            property: "dataLabel.formatter",
            type: "(args: { label, value, depth, path, branchLabel }) => { label: string; value?: string }",
            default: "Shows label and formatted value",
            description: "Formatter function for data label content.",
          },
        ],
      },
    ],
  },
  customParts: [
    { element: "layout", args: "{ title: Widget; legends: Widget[]; plot: Widget }", description: "Top-level layout composing title, legends, and the plot area." },
    { element: "plot", args: "{ dataView: Widget; tooltipArea: Widget }", description: "The plot area with data view and tooltip." },
    { element: "dataView", args: "{ segments: SunburstChartSegment[] }", description: "Container for all sunburst segments." },
    { element: "segment", args: "FlatSegment & { dataLabel: Widget; isHovered: boolean }", description: "Individual sunburst segment with depth, angles, and path info." },
    { element: "dataLabel", args: "FlatSegment & { isHovered: boolean }", description: "Data label on a sunburst segment." },
    { element: "legend", args: "{ name: string; index: number; isVisible: boolean }", description: "Individual legend item." },
    { element: "title", args: "undefined", description: "Chart title element." },
    { element: "tooltip", args: "HoveredSunburstSegment", description: "Tooltip content for a hovered segment." },
    { element: "tooltipArea", args: "{ tooltip: Widget | null; hoveredSegment: HoveredSunburstSegment | null }", description: "Tooltip positioning area." },
  ],
  context: {
    typeName: "SunburstChartContext",
    properties: [
      { name: "data", type: "SunburstResolvedData", description: "Current resolved chart data (filtered by hidden branches).", kind: "property" },
      { name: "segments", type: "FlatSegment[]", description: "Flattened list of all visible segments with computed angles.", kind: "property" },
      { name: "legends", type: "string[]", description: "All top-level branch labels.", kind: "property" },
      { name: "totalValue", type: "number", description: "Sum of all visible branch values.", kind: "property" },
      { name: "width", type: "number", description: "Current chart width in pixels.", kind: "property" },
      { name: "height", type: "number", description: "Current chart height in pixels.", kind: "property" },
      { name: "hoveredSegmentKey", type: "string | null", description: "Key of the currently hovered segment.", kind: "property" },
      { name: "hoveredSegment", type: "FlatSegment | null", description: "Currently hovered segment data.", kind: "property" },
      { name: "config", type: "TConfig", description: "The resolved chart configuration object.", kind: "property" },
      { name: "isLegendVisible(index)", type: "(index: number) => boolean", description: "Check if a top-level branch is visible.", kind: "method" },
      { name: "toggleLegend(index)", type: "(index: number) => void", description: "Toggle visibility of a top-level branch.", kind: "method" },
      { name: "hoverSegment(key)", type: "(key: string) => void", description: "Set hover state on a segment by key.", kind: "method" },
      { name: "unhoverSegment(key?)", type: "(key?: string) => void", description: "Clear hover on a segment.", kind: "method" },
      { name: "unhoverAllSegments()", type: "() => void", description: "Clear all segment hover state.", kind: "method" },
      { name: "isSegmentHovered(key)", type: "(key: string) => boolean", description: "Check if a specific segment is hovered.", kind: "method" },
      { name: "setSize(width, height)", type: "(width: number, height: number) => void", description: "Update chart dimensions.", kind: "method" },
    ],
  },
  overrideExample: `import { ToastSunburstChart } from "@/components/flitter/charts/toast-sunburst-chart";

<ToastSunburstChart
  data={data}
  config={{
    sunburst: { innerRadiusRatio: 0.25 },
    dataLabel: { visible: true },
  }}
/>`,
};
