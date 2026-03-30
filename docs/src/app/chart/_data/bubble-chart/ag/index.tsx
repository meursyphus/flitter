import { agStylePage } from "../../styles/ag";
import {
  DefaultAgBubbleChart,
  SmallAgBubbleChart,
} from "./examples";

const bubbleConfigSections = [
  {
    title: "Bubble",
    rows: [
      { property: "bubble.minRadius", type: "number", default: "3", description: "Minimum bubble radius (px)" },
      { property: "bubble.maxRadius", type: "number", default: "25", description: "Maximum bubble radius (px)" },
      { property: "bubble.opacity", type: "number", default: "0.7", description: "Bubble fill opacity (0 to 1)" },
    ],
  },
];

export const agStyle = agStylePage("bubble-chart", {
  extraConfigSections: bubbleConfigSections,
  examples: [
    {
      title: "Default",
      chart: <DefaultAgBubbleChart />,
      code: `import BubbleChart from "./charts/bubble-chart";
import Widget from "@flitterjs/react";

const chart = BubbleChart({
  data: {
    datasets: [
      {
        legend: "Africa",
        data: [
          { x: 4200, y: 70.35, value: 32209101, label: "Morocco" },
          { x: 6600, y: 72.74, value: 32129324, label: "Algeria" },
          { x: 7100, y: 74.66, value: 9974722, label: "Tunisia" },
        ],
      },
      {
        legend: "America",
        data: [
          { x: 8100, y: 71.41, value: 78410118, label: "Brazil" },
          { x: 31500, y: 79.96, value: 32507874, label: "Canada" },
          { x: 32100, y: 77.43, value: 89302754, label: "United States" },
        ],
      },
    ],
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
    },
    {
      title: "Small Bubbles",
      chart: <SmallAgBubbleChart />,
      code: `import BubbleChart from "./charts/bubble-chart";
import Widget from "@flitterjs/react";

const chart = BubbleChart({
  data: {
    datasets: [
      {
        legend: "Asia",
        data: [
          { x: 5600, y: 71.96, value: 92988000, label: "China" },
          { x: 19200, y: 75.58, value: 48598170, label: "Korea" },
          { x: 29400, y: 81.04, value: 52733300, label: "Japan" },
        ],
      },
    ],
  },
  config: {
    bubble: { minRadius: 2, maxRadius: 20, opacity: 0.8 },
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
    },
  ],
});
