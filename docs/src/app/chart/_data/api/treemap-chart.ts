import type { ApiPageData } from "../types";

export const treemapChartApiPage: ApiPageData = {
  slug: ["api", "treemap-chart"],
  title: "Treemap Chart API",
  description:
    "Complete API reference for the Treemap Chart, including data format, configuration options, custom parts, and context methods.",
  pageType: "api",
  parent: "api",
  dataFormat: {
    typeName: "TreemapData",
    typeDefinition: `type TreemapNode = {
  label: string;
  value?: number;
  secondaryLabel?: string;
  children?: TreemapNode[];
};

type TreemapDataset = {
  legend: string;
  visible?: boolean;
  value?: number;
  secondaryLabel?: string;
  children?: TreemapNode[];
};

type TreemapData = {
  datasets: TreemapDataset[];
};`,
    description:
      "Each dataset represents a group with a legend name and a tree of nodes. Leaf nodes have values; branch nodes aggregate child values.",
  },
  agConfig: {
    sections: [
      {
        title: "Treemap",
        rows: [
          {
            property: "treemap.groupGap",
            type: "number",
            default: "8",
            description: "Gap between dataset groups in pixels.",
          },
          {
            property: "treemap.nodeGap",
            type: "number",
            default: "1",
            description: "Gap between nodes within a group in pixels.",
          },
        ],
      },
      {
        title: "Group Title",
        rows: [
          {
            property: "treemap.groupTitle.visible",
            type: "boolean",
            default: "true",
            description: "Whether group title headers are visible.",
          },
          {
            property: "treemap.groupTitle.fontSize",
            type: "number",
            default: "12",
            description: "Group title font size.",
          },
          {
            property: "treemap.groupTitle.color",
            type: "string",
            default: '"#2f3a46"',
            description: "Group title text color.",
          },
          {
            property: "treemap.groupTitle.gap",
            type: "number",
            default: "6",
            description: "Gap between group title and nodes.",
          },
        ],
      },
      {
        title: "Node",
        rows: [
          {
            property: "treemap.node.minLabelWidth",
            type: "number",
            default: "72",
            description: "Minimum node width in pixels for labels to appear.",
          },
          {
            property: "treemap.node.minLabelHeight",
            type: "number",
            default: "42",
            description: "Minimum node height in pixels for labels to appear.",
          },
          {
            property: "treemap.node.dimOpacity",
            type: "number",
            default: "0.38",
            description: "Opacity of non-hovered nodes when one is hovered.",
          },
          {
            property: "treemap.node.labelColor",
            type: "string",
            default: '"#ffffff"',
            description: "Node label text color.",
          },
          {
            property: "treemap.node.secondaryLabelColor",
            type: "string",
            default: '"rgba(255,255,255,0.84)"',
            description: "Secondary label text color.",
          },
          {
            property: "treemap.node.hoverShadowColor",
            type: "string",
            default: '"rgba(0,0,0,0.10)"',
            description: "Shadow color on hovered nodes.",
          },
        ],
      },
    ],
  },
  toastConfig: {
    sections: [
      {
        title: "Treemap",
        rows: [
          {
            property: "treemap.groupGap",
            type: "number",
            default: "0",
            description: "Gap between dataset groups in pixels.",
          },
          {
            property: "treemap.nodeGap",
            type: "number",
            default: "0",
            description: "Gap between nodes within a group in pixels.",
          },
          {
            property: "treemap.dividerColor",
            type: "string",
            default: '"transparent"',
            description: "Color of divider lines between nodes.",
          },
        ],
      },
      {
        title: "Group Title",
        rows: [
          {
            property: "treemap.groupTitle.visible",
            type: "boolean",
            default: "false",
            description: "Whether group title headers are visible.",
          },
        ],
      },
      {
        title: "Node",
        rows: [
          {
            property: "treemap.node.minLabelWidth",
            type: "number",
            default: "72",
            description: "Minimum node width in pixels for labels to appear.",
          },
          {
            property: "treemap.node.minLabelHeight",
            type: "number",
            default: "42",
            description: "Minimum node height in pixels for labels to appear.",
          },
          {
            property: "treemap.node.labelColor",
            type: "string",
            default: '"#ffffff"',
            description: "Node label text color.",
          },
          {
            property: "treemap.node.secondaryLabelColor",
            type: "string",
            default: '"rgba(255,255,255,0.86)"',
            description: "Secondary label text color.",
          },
          {
            property: "treemap.node.hoverBorderColor",
            type: "string",
            default: '"white"',
            description: "Border color on hovered nodes.",
          },
          {
            property: "treemap.node.hoverBorderWidth",
            type: "number",
            default: "4",
            description: "Border width on hovered nodes.",
          },
          {
            property: "treemap.node.hoverShadowColor",
            type: "string",
            default: '"rgba(0,0,0,0.3)"',
            description: "Shadow color on hovered nodes.",
          },
          {
            property: "treemap.node.hoverScale",
            type: "number",
            default: "1.02",
            description: "Scale factor when a node is hovered.",
          },
        ],
      },
    ],
  },
  customParts: [
    { element: "layout", args: "{ title: Widget; legends: Widget[]; plot: Widget }", description: "Top-level layout composing title, legends, and the plot area." },
    { element: "plot", args: "{ treemap: Widget; tooltipArea: Widget }", description: "The plot area with treemap and tooltip." },
    { element: "title", args: "undefined", description: "Chart title element." },
    { element: "legend", args: "{ name: string; index: number; isVisible: boolean }", description: "Individual legend item." },
    { element: "treemap", args: "{ tree: Widget }", description: "The treemap container." },
    { element: "group", args: "{ title: Widget; nodes: Widget; legend: string; index: number; color: string; ratio: number; isHovered: boolean }", description: "A dataset group with title and nodes." },
    { element: "groupTitle", args: "{ legend: string; index: number }", description: "Group title header." },
    { element: "nodes", args: "{ tree: Widget; legend: string; index: number }", description: "Container for nodes within a group." },
    { element: "node", args: "{ label: string; secondaryLabel?: string; value: number; legend: string; groupIndex: number; index: number; color: string; ratio: number; groupRatio: number; isHovered: boolean; dataLabel: Widget }", description: "Individual treemap node rectangle." },
    { element: "dataLabel", args: "{ label: string; secondaryLabel?: string; value: number; legend: string; groupIndex: number; index: number; ratio: number; groupRatio: number; isHovered: boolean }", description: "Data label inside a treemap node." },
    { element: "tooltip", args: "{ label: string; items: { legend: string; color: string; value: number }[] }", description: "Tooltip content widget." },
    { element: "tooltipArea", args: "{ tooltip: Widget | null; hoveredNode: TreemapHoveredNodeRect | null }", description: "Tooltip positioning area." },
  ],
  context: {
    typeName: "TreemapContext",
    properties: [
      { name: "data", type: "TreemapResolvedData", description: "Current resolved chart data (filtered by hidden series).", kind: "property" },
      { name: "legends", type: "string[]", description: "All dataset legend names.", kind: "property" },
      { name: "totalValue", type: "number", description: "Sum of all visible dataset values.", kind: "property" },
      { name: "width", type: "number", description: "Current chart width in pixels.", kind: "property" },
      { name: "height", type: "number", description: "Current chart height in pixels.", kind: "property" },
      { name: "hiddenSeries", type: "ReadonlySet<string>", description: "Set of currently hidden series names.", kind: "property" },
      { name: "hoveredNode", type: "TreemapHoveredNode | null", description: "Currently hovered node info.", kind: "property" },
      { name: "config", type: "TConfig", description: "The resolved chart configuration object.", kind: "property" },
      { name: "isSeriesVisible(name)", type: "(name: string) => boolean", description: "Check if a series is currently visible.", kind: "method" },
      { name: "toggleSeries(name)", type: "(name: string) => void", description: "Toggle visibility of a series.", kind: "method" },
      { name: "showSeries(name)", type: "(name: string) => void", description: "Show a hidden series.", kind: "method" },
      { name: "hideSeries(name)", type: "(name: string) => void", description: "Hide a visible series.", kind: "method" },
      { name: "showAllSeries()", type: "() => void", description: "Show all hidden series.", kind: "method" },
      { name: "hoverNode(node, anchorKey)", type: "(node: TreemapHoveredNode, anchorKey: GlobalKey) => void", description: "Set hover state on a node.", kind: "method" },
      { name: "unhoverNode(key)", type: "(key: string) => void", description: "Clear hover if the specified node is currently hovered.", kind: "method" },
      { name: "unhoverAllNodes()", type: "() => void", description: "Clear all node hover state.", kind: "method" },
      { name: "isNodeHovered(key)", type: "(key: string) => boolean", description: "Check if a specific node is hovered.", kind: "method" },
      { name: "isGroupHovered(groupIndex)", type: "(groupIndex: number) => boolean", description: "Check if any node in a group is hovered.", kind: "method" },
      { name: "getGroupLayout(size)", type: "(size: TreemapLayoutSize) => TreemapLayout | null", description: "Compute layout for dataset groups.", kind: "method" },
      { name: "getNodeLayout(nodes, size)", type: "(nodes: TreemapResolvedNode[], size: TreemapLayoutSize) => TreemapLayout | null", description: "Compute layout for nodes within a group.", kind: "method" },
      { name: "setSize(width, height)", type: "(width: number, height: number) => void", description: "Update chart dimensions.", kind: "method" },
    ],
  },
  overrideExample: `import { ToastTreemapChart } from "@/components/flitter/charts/toast-treemap-chart";

<ToastTreemapChart
  data={data}
  config={{
    treemap: {
      nodeGap: 2,
      node: { hoverScale: 1.05 },
    },
  }}
/>`,
};
