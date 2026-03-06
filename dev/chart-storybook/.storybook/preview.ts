import type { Preview } from "@storybook/react";

const preview: Preview = {
  parameters: {
    layout: "centered",
    options: {
      storySort: {
        order: [
          "Charts",
          [
            "LLMEvaluation",
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
          ],
          "Legacy",
        ],
      },
    },
  },
};

export default preview;
