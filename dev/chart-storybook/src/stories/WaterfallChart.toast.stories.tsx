import type { Meta, StoryObj } from "@storybook/react";
import Widget from "@flitterjs/react";
import { ToastWaterfallChart } from "shared/chart";

type StoryArgs = {
  renderer: "svg" | "canvas";
};

const revenueData = {
  labels: ["Revenue", "COGS", "Gross Profit", "OpEx", "Tax", "Net Income"],
  values: [500, -200, 300, -150, -50, 100],
  totals: [
    { totalType: "subtotal" as const, index: 2 },
    { totalType: "total" as const, index: 5 },
  ],
};

const negativeData = {
  labels: ["Start", "FX", "Returns", "Costs", "Revisions", "End"],
  values: [220, -30, -45, -20, 18, 143],
  totals: [
    { totalType: "total" as const, index: 0 },
    { totalType: "total" as const, index: 5 },
  ],
};

const meta: Meta<StoryArgs> = {
  title: "Charts/WaterfallChart/Toast",
  parameters: { layout: "centered" },
  args: { renderer: "svg" },
  argTypes: {
    renderer: { control: "inline-radio", options: ["svg", "canvas"] },
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

export const RevenueBridge: Story = {
  render: (args) => (
    <Widget widget={ToastWaterfallChart({ data: revenueData })} width="760px" height="420px" renderer={args.renderer} />
  ),
};

export const NegativeHeavy: Story = {
  render: (args) => (
    <Widget widget={ToastWaterfallChart({ data: negativeData })} width="760px" height="420px" renderer={args.renderer} />
  ),
};
