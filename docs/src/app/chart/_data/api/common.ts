import type { ApiPageData } from "../types";

export const commonApiPage: ApiPageData = {
  slug: ["api"],
  title: "API Reference",
  description:
    "Common configuration, custom widget patterns, and context interaction patterns shared across all chart types.",
  pageType: "api",
  agConfig: {
    sections: [
      {
        title: "Colors",
        rows: [
          {
            property: "colors.fills",
            type: "string[]",
            default: "AG_FILLS",
            description: "Array of fill colors for chart series.",
          },
          {
            property: "colors.strokes",
            type: "string[]",
            default: "AG_STROKES",
            description: "Array of stroke colors for chart series.",
          },
        ],
      },
      {
        title: "Background",
        rows: [
          {
            property: "background",
            type: "string",
            default: '"white"',
            description: "Chart background color.",
          },
        ],
      },
      {
        title: "Font",
        rows: [
          {
            property: "font.family",
            type: "string",
            default: '"Verdana, sans-serif"',
            description: "Default font family for all text elements.",
          },
          {
            property: "font.size",
            type: "number",
            default: "13",
            description: "Default font size in pixels.",
          },
        ],
      },
      {
        title: "Title",
        rows: [
          {
            property: "title.text",
            type: "string",
            default: '""',
            description: "Title text content.",
          },
          {
            property: "title.visible",
            type: "boolean",
            default: "true",
            description: "Whether the title is visible.",
          },
          {
            property: "title.color",
            type: "string",
            default: '"#181d1f"',
            description: "Title text color.",
          },
          {
            property: "title.fontSize",
            type: "number",
            default: "18",
            description: "Title font size in pixels.",
          },
          {
            property: "title.fontFamily",
            type: "string",
            default: "undefined",
            description:
              "Title font family. Falls back to font.family if not set.",
          },
          {
            property: "title.fontWeight",
            type: "string",
            default: '"bold"',
            description: "Title font weight.",
          },
          {
            property: "title.position",
            type: '"top" | "bottom"',
            default: '"top"',
            description: "Position of the title relative to the chart.",
          },
          {
            property: "title.alignment",
            type: '"start" | "center" | "end"',
            default: '"start"',
            description: "Horizontal alignment of the title.",
          },
        ],
      },
      {
        title: "Subtitle",
        rows: [
          {
            property: "subtitle.visible",
            type: "boolean",
            default: "false",
            description: "Whether the subtitle is visible.",
          },
          {
            property: "subtitle.text",
            type: "string",
            default: '""',
            description: "Subtitle text content.",
          },
          {
            property: "subtitle.color",
            type: "string",
            default: '"#8d949a"',
            description: "Subtitle text color.",
          },
          {
            property: "subtitle.fontSize",
            type: "number",
            default: "14",
            description: "Subtitle font size in pixels.",
          },
          {
            property: "subtitle.fontFamily",
            type: "string",
            default: "undefined",
            description: "Subtitle font family.",
          },
          {
            property: "subtitle.fontWeight",
            type: "string",
            default: "undefined",
            description: "Subtitle font weight.",
          },
        ],
      },
      {
        title: "Legend",
        rows: [
          {
            property: "legend.visible",
            type: "boolean",
            default: "true",
            description: "Whether the legend is visible.",
          },
          {
            property: "legend.position",
            type: '"top" | "bottom" | "right" | "right-top" | "right-center" | "right-bottom"',
            default: '"bottom"',
            description: "Position of the legend relative to the chart.",
          },
          {
            property: "legend.gap",
            type: "number",
            default: "16",
            description: "Gap between legend items in pixels.",
          },
          {
            property: "legend.color",
            type: "string",
            default: '"#585858"',
            description: "Legend text color.",
          },
        ],
      },
      {
        title: "Axis",
        rows: [
          {
            property: "axis.color",
            type: "string",
            default: '"#8a8c8c"',
            description: "Axis line color.",
          },
          {
            property: "axis.thickness",
            type: "number",
            default: "1",
            description: "Axis line thickness in pixels.",
          },
          {
            property: "axis.label.color",
            type: "string",
            default: '"#585858"',
            description: "Axis label text color.",
          },
          {
            property: "axis.label.fontSize",
            type: "number",
            default: "13",
            description: "Axis label font size.",
          },
          {
            property: "axis.label.gap",
            type: "number",
            default: "11",
            description: "Gap between axis labels and the axis line.",
          },
          {
            property: "axis.label.format",
            type: "(name: string, index: number, axis: \"x\" | \"y\") => string",
            default: "(name) => name",
            description: "Formatter function for axis labels.",
          },
          {
            property: "axis.tick.enabled",
            type: "boolean",
            default: "false",
            description: "Whether axis ticks are enabled.",
          },
          {
            property: "axis.tick.size",
            type: "number",
            default: "6",
            description: "Size of axis ticks in pixels.",
          },
          {
            property: "axis.xLine.visible",
            type: "boolean",
            default: "true",
            description: "Whether the x-axis line is visible.",
          },
          {
            property: "axis.yLine.visible",
            type: "boolean",
            default: "true",
            description: "Whether the y-axis line is visible.",
          },
        ],
      },
      {
        title: "Grid",
        rows: [
          {
            property: "grid.color",
            type: "string",
            default: '"#e2e2e2"',
            description: "Grid line color.",
          },
          {
            property: "grid.thickness",
            type: "number",
            default: "1",
            description: "Grid line thickness in pixels.",
          },
          {
            property: "grid.dash",
            type: "number[]",
            default: "[]",
            description: "Dash pattern for grid lines.",
          },
          {
            property: "grid.xLine.visible",
            type: "boolean",
            default: "false",
            description: "Whether vertical grid lines are visible.",
          },
          {
            property: "grid.yLine.visible",
            type: "boolean",
            default: "true",
            description: "Whether horizontal grid lines are visible.",
          },
        ],
      },
      {
        title: "Padding",
        rows: [
          {
            property: "padding.top",
            type: "number",
            default: "20",
            description: "Top padding in pixels.",
          },
          {
            property: "padding.right",
            type: "number",
            default: "20",
            description: "Right padding in pixels.",
          },
          {
            property: "padding.bottom",
            type: "number",
            default: "20",
            description: "Bottom padding in pixels.",
          },
          {
            property: "padding.left",
            type: "number",
            default: "20",
            description: "Left padding in pixels.",
          },
        ],
      },
      {
        title: "Tooltip",
        rows: [
          {
            property: "tooltip.enabled",
            type: "boolean",
            default: "true",
            description: "Whether tooltips are enabled.",
          },
          {
            property: "tooltip.backgroundColor",
            type: "string",
            default: '"white"',
            description: "Tooltip background color.",
          },
          {
            property: "tooltip.textColor",
            type: "string",
            default: '"#181d1f"',
            description: "Tooltip text color.",
          },
          {
            property: "tooltip.borderColor",
            type: "string",
            default: '"#e2e2e2"',
            description: "Tooltip border color.",
          },
          {
            property: "tooltip.borderRadius",
            type: "number",
            default: "4",
            description: "Tooltip border radius in pixels.",
          },
          {
            property: "tooltip.padding",
            type: "number",
            default: "12",
            description: "Tooltip padding in pixels.",
          },
        ],
      },
    ],
  },
  toastConfig: {
    sections: [
      {
        title: "Colors",
        rows: [
          {
            property: "colors",
            type: "string[]",
            default: "TOAST_COLORS",
            description: "Array of colors for chart series.",
          },
        ],
      },
      {
        title: "Font",
        rows: [
          {
            property: "font.family",
            type: "string",
            default: '"Arial"',
            description: "Default font family for all text elements.",
          },
          {
            property: "font.size",
            type: "number",
            default: "11",
            description: "Default font size in pixels.",
          },
        ],
      },
      {
        title: "Title",
        rows: [
          {
            property: "title.text",
            type: "string",
            default: '""',
            description: "Title text content.",
          },
          {
            property: "title.visible",
            type: "boolean",
            default: "true",
            description: "Whether the title is visible.",
          },
          {
            property: "title.color",
            type: "string",
            default: '"#333333"',
            description: "Title text color.",
          },
          {
            property: "title.fontSize",
            type: "number",
            default: "18",
            description: "Title font size in pixels.",
          },
          {
            property: "title.fontFamily",
            type: "string",
            default: "undefined",
            description:
              "Title font family. Falls back to font.family if not set.",
          },
          {
            property: "title.fontWeight",
            type: "string",
            default: '"bold"',
            description: "Title font weight.",
          },
          {
            property: "title.position",
            type: '"top" | "bottom"',
            default: '"top"',
            description: "Position of the title relative to the chart.",
          },
          {
            property: "title.alignment",
            type: '"start" | "center" | "end"',
            default: '"start"',
            description: "Horizontal alignment of the title.",
          },
        ],
      },
      {
        title: "Legend",
        rows: [
          {
            property: "legend.visible",
            type: "boolean",
            default: "true",
            description: "Whether the legend is visible.",
          },
          {
            property: "legend.position",
            type: '"top" | "bottom" | "right" | "right-top" | "right-center" | "right-bottom"',
            default: '"bottom"',
            description: "Position of the legend relative to the chart.",
          },
          {
            property: "legend.gap",
            type: "number",
            default: "12",
            description: "Gap between legend items in pixels.",
          },
        ],
      },
      {
        title: "Axis",
        rows: [
          {
            property: "axis.color",
            type: "string",
            default: '"#333333"',
            description: "Axis line color.",
          },
          {
            property: "axis.thickness",
            type: "number",
            default: "1",
            description: "Axis line thickness in pixels.",
          },
          {
            property: "axis.label.color",
            type: "string",
            default: '"#333333"',
            description: "Axis label text color.",
          },
          {
            property: "axis.label.fontSize",
            type: "number",
            default: "11",
            description: "Axis label font size.",
          },
          {
            property: "axis.label.gap",
            type: "number",
            default: "8",
            description: "Gap between axis labels and the axis line.",
          },
          {
            property: "axis.label.format",
            type: '(name: string, index: number, axis: "x" | "y") => string',
            default: "(name) => name",
            description: "Formatter function for axis labels.",
          },
          {
            property: "axis.tick.size",
            type: "number",
            default: "6",
            description: "Size of axis ticks in pixels.",
          },
        ],
      },
      {
        title: "Grid",
        rows: [
          {
            property: "grid.color",
            type: "string",
            default: '"rgba(0, 0, 0, 0.05)"',
            description: "Grid line color.",
          },
          {
            property: "grid.thickness",
            type: "number",
            default: "1",
            description: "Grid line thickness in pixels.",
          },
        ],
      },
      {
        title: "Padding",
        rows: [
          {
            property: "padding.top",
            type: "number",
            default: "20",
            description: "Top padding in pixels.",
          },
          {
            property: "padding.right",
            type: "number",
            default: "20",
            description: "Right padding in pixels.",
          },
          {
            property: "padding.bottom",
            type: "number",
            default: "20",
            description: "Bottom padding in pixels.",
          },
          {
            property: "padding.left",
            type: "number",
            default: "20",
            description: "Left padding in pixels.",
          },
        ],
      },
      {
        title: "Animation",
        rows: [
          {
            property: "animation.enabled",
            type: "boolean",
            default: "true",
            description: "Whether animations are enabled.",
          },
          {
            property: "animation.duration",
            type: "number",
            default: "300",
            description: "Animation duration in milliseconds.",
          },
          {
            property: "animation.staggerDelay",
            type: "number",
            default: "60",
            description:
              "Stagger delay between animated elements in milliseconds.",
          },
        ],
      },
      {
        title: "Tooltip",
        rows: [
          {
            property: "tooltip.enabled",
            type: "boolean",
            default: "true",
            description: "Whether tooltips are enabled.",
          },
          {
            property: "tooltip.backgroundColor",
            type: "string",
            default: '"rgba(50,50,50,0.6)"',
            description: "Tooltip background color.",
          },
          {
            property: "tooltip.textColor",
            type: "string",
            default: '"white"',
            description: "Tooltip text color.",
          },
          {
            property: "tooltip.borderRadius",
            type: "number",
            default: "4",
            description: "Tooltip border radius in pixels.",
          },
          {
            property: "tooltip.padding",
            type: "number",
            default: "14",
            description: "Tooltip padding in pixels.",
          },
        ],
      },
    ],
  },
  overrideExample: `import { ToastBarChart } from "@/components/flitter/charts/toast-bar-chart";

// Override any custom part by passing a function
<ToastBarChart
  data={data}
  config={{
    ...config,
    bar: { gap: 4, cornerRadius: 6 },
  }}
  custom={{
    bar: (args, context) => {
      // Return a custom Widget for each bar
      return Container({
        decoration: new BoxDecoration({
          color: args.isHovered ? "red" : context.config.colors[0],
          borderRadius: BorderRadius.circular(args.isHovered ? 8 : 4),
        }),
      });
    },
  }}
/>`,
};
