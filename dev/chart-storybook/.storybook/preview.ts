import type { Preview } from "@storybook/react-vite";

const preview: Preview = {
  parameters: {
    layout: "centered",
    options: {
      storySort: {
        order: [
          "In-Review",
          [
            "PieChart",
            "RadarChart",
            "TreemapChart",
          ],
          "Next",
          [
            "SunburstChart",
            "SankeyChart",
          ],
          "Polish",
          [
            "BoxPlotChart",
            "CandlestickChart",
            "HistogramChart",
            "WaterfallChart",
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
