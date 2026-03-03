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
    { title: "Default", chart: <DefaultToastBubbleChart /> },
    { title: "Small Bubbles", chart: <SmallBubblestoastBubbleChart /> },
    { title: "High Opacity", chart: <HighOpacityToastBubbleChart /> },
  ],
});
