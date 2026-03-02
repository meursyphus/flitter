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
          ],
          "Legacy",
        ],
      },
    },
  },
};

export default preview;
