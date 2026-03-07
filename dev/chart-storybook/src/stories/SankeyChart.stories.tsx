import type { Meta, StoryObj } from "@storybook/react";
import Widget from "@flitterjs/react";
import { SankeyChart } from "chart-styles";

type StoryArgs = {
  renderer: "svg" | "canvas";
};

const energyData = {
  nodes: [
    { id: "solar", label: "Solar" },
    { id: "wind", label: "Wind" },
    { id: "hydro", label: "Hydro" },
    { id: "grid", label: "Grid" },
    { id: "home", label: "Home" },
    { id: "industry", label: "Industry" },
  ],
  links: [
    { source: "solar", target: "grid", value: 40 },
    { source: "wind", target: "grid", value: 30 },
    { source: "hydro", target: "grid", value: 20 },
    { source: "grid", target: "home", value: 50 },
    { source: "grid", target: "industry", value: 40 },
  ],
};

const multiLevelData = {
  nodes: [
    { id: "ads", label: "Ads" },
    { id: "organic", label: "Organic" },
    { id: "site", label: "Site" },
    { id: "trial", label: "Trial" },
    { id: "paid", label: "Paid" },
    { id: "retained", label: "Retained" },
  ],
  links: [
    { source: "ads", target: "site", value: 180 },
    { source: "organic", target: "site", value: 120 },
    { source: "site", target: "trial", value: 150 },
    { source: "trial", target: "paid", value: 90 },
    { source: "paid", target: "retained", value: 72 },
  ],
};

const meta: Meta<StoryArgs> = {
  title: "Charts/SankeyChart/Toast",
  parameters: { layout: "centered" },
  args: { renderer: "svg" },
  argTypes: {
    renderer: { control: "inline-radio", options: ["svg", "canvas"] },
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

export const EnergyFlow: Story = {
  render: (args) => (
    <Widget widget={SankeyChart({ data: energyData })} width="760px" height="420px" renderer={args.renderer} />
  ),
};

export const MultiLevel: Story = {
  render: (args) => (
    <Widget widget={SankeyChart({ data: multiLevelData })} width="760px" height="420px" renderer={args.renderer} />
  ),
};
