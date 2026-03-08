import type { Meta, StoryObj } from "@storybook/react";
import Widget from "@flitterjs/react";
import { NetworkChart } from "shared/chart";

type StoryArgs = {
  renderer: "svg" | "canvas";
};

const socialGraph = {
  nodes: [
    { id: "anna", label: "Anna", group: "Team A", size: 3 },
    { id: "ben", label: "Ben", group: "Team A", size: 2 },
    { id: "cleo", label: "Cleo", group: "Team B", size: 3 },
    { id: "drew", label: "Drew", group: "Team B", size: 2 },
    { id: "erin", label: "Erin", group: "Team C", size: 2 },
  ],
  edges: [
    { source: "anna", target: "ben", weight: 3 },
    { source: "anna", target: "cleo", weight: 2 },
    { source: "ben", target: "drew", weight: 1 },
    { source: "cleo", target: "drew", weight: 2 },
    { source: "drew", target: "erin", weight: 1 },
  ],
};

const productGraph = {
  nodes: [
    { id: "api", label: "API", group: "Platform", size: 3 },
    { id: "web", label: "Web", group: "Client", size: 2 },
    { id: "ios", label: "iOS", group: "Client", size: 2 },
    { id: "android", label: "Android", group: "Client", size: 2 },
    { id: "analytics", label: "Analytics", group: "Data", size: 2 },
  ],
  edges: [
    { source: "web", target: "api" },
    { source: "ios", target: "api" },
    { source: "android", target: "api" },
    { source: "api", target: "analytics" },
  ],
};

const meta: Meta<StoryArgs> = {
  title: "Charts/NetworkChart/Ag",
  parameters: { layout: "centered" },
  args: { renderer: "svg" },
  argTypes: {
    renderer: { control: "inline-radio", options: ["svg", "canvas"] },
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

export const SocialGraph: Story = {
  render: (args) => (
    <Widget widget={NetworkChart({ data: socialGraph })} width="700px" height="420px" renderer={args.renderer} />
  ),
};

export const ProductDependencies: Story = {
  render: (args) => (
    <Widget widget={NetworkChart({ data: productGraph })} width="700px" height="420px" renderer={args.renderer} />
  ),
};
