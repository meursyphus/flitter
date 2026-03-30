import { toastStylePage } from "../../styles/toast";
import {
  DefaultToastBubbleChart,
  SmallBubblestoastBubbleChart,
  HighOpacityToastBubbleChart,
} from "./examples";

const bubbleConfigSections = [
  {
    title: "Bubble",
    rows: [
      { property: "bubble.minRadius", type: "number", default: "5", description: "Minimum bubble radius (px)" },
      { property: "bubble.maxRadius", type: "number", default: "50", description: "Maximum bubble radius (px)" },
      { property: "bubble.opacity", type: "number", default: "0.6", description: "Bubble fill opacity (0 to 1)" },
    ],
  },
];

export const toastStyle = toastStylePage("bubble-chart", {
  extraConfigSections: bubbleConfigSections,
  examples: [
    {
      title: "Default",
      chart: <DefaultToastBubbleChart />,
      code: `import ToastBubbleChart from "./charts/toast-bubble-chart";
import Widget from "@flitterjs/react";

const chart = ToastBubbleChart({
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
      chart: <SmallBubblestoastBubbleChart />,
      code: `import ToastBubbleChart from "./charts/toast-bubble-chart";
import Widget from "@flitterjs/react";

const chart = ToastBubbleChart({
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
    bubble: { minRadius: 3, maxRadius: 25, opacity: 0.8 },
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
    },
    {
      title: "High Opacity",
      chart: <HighOpacityToastBubbleChart />,
      code: `import ToastBubbleChart from "./charts/toast-bubble-chart";
import Widget from "@flitterjs/react";

const chart = ToastBubbleChart({
  data: {
    datasets: [
      {
        legend: "Europe",
        data: [
          { x: 27700, y: 79.54, value: 58057477, label: "Italy" },
          { x: 28700, y: 78.54, value: 22424609, label: "Germany" },
          { x: 29600, y: 78.27, value: 60270708, label: "UK" },
        ],
      },
    ],
  },
  config: {
    bubble: { opacity: 1.0 },
  },
});

<Widget widget={chart} width="600px" height="400px" />`,
    },
  ],
});
