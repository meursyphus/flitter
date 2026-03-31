import type { Preview } from "@storybook/react";

const preview: Preview = {
  parameters: {
    layout: "centered",
    options: {
      storySort: {
        order: [
          "In-Review",
          [
            "BoxPlotChart",
            "CandlestickChart",
            "HistogramChart",
            "WaterfallChart",
          ],
          "Next",
          [
            "PieChart",
            "RadarChart",
            "SunburstChart",
            "TreemapChart",
            "SankeyChart",
          ],
          "TODO",
          [
            "DonutChart",
            "PolarAreaChart",
            "BulletChart",
            "ComboChart",
            "FunnelChart",
            "GanttChart",
            "GaugeChart",
            "NetworkChart",
            "ProgressChart",
          ],
          "Charts",
          [
            "BarChart",
            "StackedBarChart",
            "LineChart",
            "AreaChart",
            "ScatterChart",
            "BubbleChart",
            "StackedAreaChart",
            "HeatmapChart",
          ],
        ],
      },
    },
  },
};

export default preview;
