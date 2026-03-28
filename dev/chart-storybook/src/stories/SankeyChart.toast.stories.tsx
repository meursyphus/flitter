import type { Meta, StoryObj } from "@storybook/react";
import Widget from "@flitterjs/react";
import { ToastSankeyChart } from "shared/chart";

type StoryArgs = {
  renderer: "svg" | "canvas";
};

const energyData = [
  { from: "Solar", to: "Grid", value: 40 },
  { from: "Wind", to: "Grid", value: 30 },
  { from: "Hydro", to: "Grid", value: 20 },
  { from: "Grid", to: "Home", value: 50 },
  { from: "Grid", to: "Industry", value: 40 },
];

const multiLevelData = [
  { from: "Ads", to: "Site", value: 180 },
  { from: "Organic", to: "Site", value: 120 },
  { from: "Site", to: "Trial", value: 150 },
  { from: "Trial", to: "Paid", value: 90 },
  { from: "Paid", to: "Retained", value: 72 },
];

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
    <Widget widget={ToastSankeyChart({ data: energyData })} width="760px" height="420px" renderer={args.renderer} />
  ),
};

export const MultiLevel: Story = {
  render: (args) => (
    <Widget widget={ToastSankeyChart({ data: multiLevelData })} width="760px" height="420px" renderer={args.renderer} />
  ),
};
