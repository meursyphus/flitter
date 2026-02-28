import type { Preview } from "@storybook/react";

const preview: Preview = {
  parameters: {
    layout: "centered",
    options: {
      storySort: {
        order: [
          "BarChart",
          "StackedBarChart",
          "LineChart",
          "ScatterChart",
          "BubbleChart",
          "StackedAreaChart",
          "Legacy",
        ],
      },
    },
  },
};

export default preview;
