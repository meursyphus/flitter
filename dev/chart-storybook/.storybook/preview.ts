import type { Preview } from "@storybook/react-vite";

const preview: Preview = {
  parameters: {
    layout: "centered",
    options: {
      storySort: {
        order: [
          "Charts",
          [
            "BarChart",
            "StackedBarChart",
            "LineChart",
            "AreaChart",
            "StackedAreaChart",
            "ScatterChart",
            "BubbleChart",
            "PieChart",
            "DonutChart",
            "RadarChart",
            "HeatmapChart",
            "TreemapChart",
            "SunburstChart",
            "BoxPlotChart",
            "BulletChart",
            "CandlestickChart",
            "HistogramChart",
            "WaterfallChart",
            "SankeyChart",
            "FunnelChart",
          ],
        ],
      },
    },
  },
};
export default preview;
