import { agStylePage } from "../../styles/ag";
import {
  BasicAgHeatmapChart,
  ServerLoadAgHeatmap,
  CorrelationMatrixAgHeatmap,
  GithubActivityAgHeatmap,
  SalesByRegionAgHeatmap,
} from "./examples";

const heatmapConfigSections = [
  {
    title: "Heatmap",
    description: "Heatmap-specific visual settings.",
    rows: [
      { property: "heatmap.colorRange", type: "[string, string, string]", default: '["#FDE68A", "#F97316", "#B91C1C"]', description: "Color gradient range [low, mid, high]" },
      { property: "heatmap.segment.gap", type: "number", default: "0", description: "Gap between cells (px)" },
    ],
  },
];

export const agStyle = agStylePage("heatmap-chart", {
  extraConfigSections: heatmapConfigSections,
  examples: [
    {
      title: "Basic Heatmap",
      chart: <BasicAgHeatmapChart />,
      code: `import HeatmapChart from "./charts/heatmap-chart";
import Widget from "@flitterjs/react";

const chart = HeatmapChart({
  data: {
    xLabels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    yLabels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    values: [
      [2, 5, 8, 12, 18, 24, 28, 30, 25, 16, 9, 4],
      [3, 6, 9, 13, 19, 25, 29, 31, 26, 17, 10, 5],
      [4, 7, 11, 15, 21, 27, 32, 34, 28, 19, 12, 6],
      [5, 8, 12, 16, 22, 28, 33, 35, 29, 20, 13, 7],
      [4, 7, 10, 14, 20, 26, 31, 33, 27, 18, 11, 6],
      [3, 5, 8, 11, 17, 23, 27, 29, 24, 15, 9, 4],
      [2, 4, 7, 10, 16, 22, 26, 28, 23, 14, 8, 3],
    ],
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
    },
    {
      title: "Server Load",
      chart: <ServerLoadAgHeatmap />,
      code: `import HeatmapChart from "./charts/heatmap-chart";
import Widget from "@flitterjs/react";

const chart = HeatmapChart({
  data: {
    xLabels: ["00", "02", "04", "06", "08", "10", "12", "14", "16", "18", "20", "22"],
    yLabels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    values: [
      [12, 8, 5, 15, 65, 82, 78, 85, 80, 72, 45, 20],
      [10, 7, 4, 18, 70, 88, 82, 90, 85, 68, 42, 18],
      [14, 9, 6, 20, 72, 85, 80, 88, 82, 70, 48, 22],
      [11, 8, 5, 17, 68, 80, 75, 82, 78, 65, 40, 19],
      [15, 10, 7, 22, 75, 90, 85, 92, 88, 74, 50, 25],
      [8, 5, 3, 10, 25, 35, 40, 38, 32, 28, 20, 12],
      [6, 4, 2, 8, 18, 28, 32, 30, 25, 22, 15, 9],
    ],
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
    },
    {
      title: "Correlation Matrix",
      chart: <CorrelationMatrixAgHeatmap />,
      code: `import HeatmapChart from "./charts/heatmap-chart";
import Widget from "@flitterjs/react";

const chart = HeatmapChart({
  data: {
    xLabels: ["Rev", "Users", "Sess", "Bounce", "Dur", "Pages"],
    yLabels: ["Rev", "Users", "Sess", "Bounce", "Dur", "Pages"],
    values: [
      [100, 85, 78, -45, 62, 70],
      [85, 100, 92, -52, 58, 75],
      [78, 92, 100, -60, 65, 82],
      [-45, -52, -60, 100, -38, -55],
      [62, 58, 65, -38, 100, 72],
      [70, 75, 82, -55, 72, 100],
    ],
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
    },
    {
      title: "Activity Tracker",
      chart: <GithubActivityAgHeatmap />,
      code: `import HeatmapChart from "./charts/heatmap-chart";
import Widget from "@flitterjs/react";

const chart = HeatmapChart({
  data: {
    xLabels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    yLabels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    values: [
      [3, 0, 5, 2, 8, 1, 0, 4, 6, 9, 2, 1],
      [0, 7, 3, 0, 2, 5, 1, 0, 8, 3, 0, 4],
      [5, 2, 0, 6, 1, 0, 9, 3, 2, 0, 7, 2],
      [1, 0, 4, 3, 0, 8, 2, 7, 0, 5, 1, 0],
      [0, 3, 1, 0, 5, 2, 0, 1, 4, 0, 3, 6],
      [2, 1, 0, 0, 1, 0, 3, 0, 1, 2, 0, 0],
      [0, 0, 1, 0, 0, 2, 0, 0, 0, 1, 0, 0],
    ],
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
    },
    {
      title: "Sales by Region",
      chart: <SalesByRegionAgHeatmap />,
      code: `import HeatmapChart from "./charts/heatmap-chart";
import Widget from "@flitterjs/react";

const chart = HeatmapChart({
  data: {
    xLabels: ["Elec", "Cloth", "Food", "Furn", "Sports", "Books"],
    yLabels: ["NA", "EU", "APAC", "LATAM", "ME"],
    values: [
      [420, 280, 350, 180, 220, 150],
      [380, 310, 290, 160, 190, 200],
      [510, 260, 400, 120, 170, 130],
      [180, 220, 310, 90, 140, 80],
      [150, 170, 250, 110, 200, 60],
    ],
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
    },
  ],
});
