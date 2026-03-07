import type { Preview } from "@storybook/react";

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
            "ScatterChart",
            "BubbleChart",
            "StackedAreaChart",
            "PieChart",
            "RadarChart",
            "HeatmapChart",
            "BoxPlotChart",
            "CandlestickChart",
            "WaterfallChart",
            "ComboChart",
            "FunnelChart",
            "GaugeChart",
            "TreemapChart",
            "SankeyChart",
            "SunburstChart",
            "DonutChart",
            "HistogramChart",
            "GanttChart",
            "NetworkChart",
            "PolarAreaChart",
            "ProgressChart",
          ],
        ],
      },
    },
  },
};

export default preview;
