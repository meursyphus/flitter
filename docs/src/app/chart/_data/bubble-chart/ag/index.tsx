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
    { title: "Default", chart: <DefaultAgBubbleChart /> },
    { title: "Small Bubbles", chart: <SmallAgBubbleChart /> },
  ],
});
