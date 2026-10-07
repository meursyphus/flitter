import type { ApiPageData } from "../types";

const sections = [
  {
    title: "Funnel",
    rows: [
      {
        property: "funnel.gap",
        type: "number",
        default: "3",
        description: "Vertical gap between stages in pixels.",
      },
      {
        property: "funnel.widthRatio",
        type: "number",
        default: "0.64",
        description:
          "Fraction of plot width reserved for the funnel; the remaining width holds labels.",
      },
      {
        property: "legend.visible",
        type: "boolean",
        default: "false",
        description:
          "Show interactive stage keys. Hiding a stage preserves the original conversion denominators and color indices.",
      },
      {
        property: "dataLabel.visible",
        type: "boolean",
        default: "true",
        description: "Show labels beside each stage.",
      },
      {
        property: "dataLabel.color",
        type: "string",
        default: "Style legend color",
        description: "Label text color. Set this for a custom background.",
      },
      {
        property: "dataLabel.formatter",
        type: "(stage: FunnelStage) => string",
        default: "Label, value and percentage",
        description:
          "Formats stage labels. percentage is relative to the original first stage; conversion is relative to the original previous stage.",
      },
    ],
  },
];

export const funnelChartApiPage: ApiPageData = {
  slug: ["api", "funnel-chart"],
  title: "Funnel Chart API",
  description:
    "Sequential conversion stages with AG and Toast styles, editable geometry and interactive tooltips.",
  pageType: "api",
  parent: "api",
  dataFormat: {
    typeName: "FunnelChartData",
    typeDefinition: `type FunnelChartData = {
  stages: { label: string; value: number }[];
};`,
    description:
      "Stages remain in input order. Values are non-negative volumes; invalid or negative values become zero. Width is proportional to the largest input value. Empty and all-zero data render without marks. Percentages use the original data even when a stage is hidden.",
  },
  agConfig: {
    sections: [
      ...sections,
      {
        title: "AG Hover",
        rows: [
          {
            property: "funnel.dimOpacity",
            type: "number",
            default: "0.35",
            description:
              "Opacity of other stages while one is hovered. The tooltip follows the pointer.",
          },
        ],
      },
    ],
  },
  toastConfig: {
    sections: [
      ...sections,
      {
        title: "Toast Hover",
        rows: [
          {
            property: "funnel.hoverBorderColor",
            type: "string",
            default: '"white"',
            description: "Outline color of the hovered stage.",
          },
          {
            property: "funnel.hoverBorderWidth",
            type: "number",
            default: "4",
            description:
              "Outline thickness in pixels. The tooltip is anchored to the hovered stage.",
          },
          {
            property: "animation.enabled",
            type: "boolean",
            default: "true",
            description:
              "Enable the entrance reveal. Disable for static exports.",
          },
        ],
      },
    ],
  },
  customParts: [
    {
      element: "layout",
      args: "{ title, legends, plot }",
      description: "Title, stage keys and plot layout.",
    },
    {
      element: "plot",
      args: "{ stages: { stage, widget }[], tooltipArea }",
      description: "Position stage widgets using normalized geometry.",
    },
    {
      element: "stage",
      args: "FunnelStage & { isHovered, dataLabel }",
      description: "Stage shape. Headless owns hover handling.",
    },
    {
      element: "dataLabel",
      args: "FunnelStage",
      description: "Content beside each stage.",
    },
    {
      element: "tooltip",
      args: "FunnelStage",
      description: "Hovered stage details, value and conversion rates.",
    },
    {
      element: "tooltipArea",
      args: "{ stage, tooltip }",
      description: "Style-specific tooltip placement.",
    },
    {
      element: "legend",
      args: "{ name, index, isVisible }",
      description: "Stage key. Headless owns the visibility toggle.",
    },
    { element: "title", args: "undefined", description: "Chart heading." },
  ],
  context: {
    typeName: "FunnelChartContext",
    properties: [
      {
        name: "stages",
        type: "FunnelStage[]",
        description:
          "Visible stages with original indices, value, percentage, conversion and normalized top/height/topWidth/bottomWidth.",
        kind: "property",
      },
      {
        name: "hoveredStage",
        type: "FunnelStage | null",
        description: "Current hovered stage.",
        kind: "property",
      },
      {
        name: "toggleStage(index)",
        type: "(index: number) => void",
        description: "Toggle a stage by its original input index.",
        kind: "method",
      },
      {
        name: "unhoverAllStages()",
        type: "() => void",
        description: "Clear hover state.",
        kind: "method",
      },
    ],
  },
  overrideExample: `import FunnelChart from "@/components/flitter/charts/funnel-chart";

const widget = FunnelChart({
  data: { stages: [
    { label: "Visits", value: 12000 },
    { label: "Trial", value: 4800 },
    { label: "Paid", value: 1200 },
  ] },
  config: { title: { text: "Product Conversion" }, legend: { visible: true } },
});`,
};
