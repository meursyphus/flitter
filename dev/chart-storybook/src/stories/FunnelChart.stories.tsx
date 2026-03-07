import type { Meta, StoryObj } from "@storybook/react";
import Widget from "@flitterjs/react";
import { FunnelChart } from "chart-styles";

type StoryArgs = {
  renderer: "svg" | "canvas";
};

const salesData = {
  stages: [
    { label: "Visitors", value: 10000 },
    { label: "Leads", value: 5000 },
    { label: "Qualified", value: 2500 },
    { label: "Proposals", value: 1200 },
    { label: "Closed", value: 600 },
  ],
};

const conversionData = {
  stages: [
    { label: "Signups", value: 4200 },
    { label: "Activated", value: 3100 },
    { label: "Paid", value: 1800 },
    { label: "Retained", value: 1250 },
  ],
};

const meta: Meta<StoryArgs> = {
  title: "Charts/FunnelChart/Toast",
  parameters: { layout: "centered" },
  args: { renderer: "svg" },
  argTypes: {
    renderer: { control: "inline-radio", options: ["svg", "canvas"] },
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

export const SalesPipeline: Story = {
  render: (args) => (
    <Widget widget={FunnelChart({ data: salesData })} width="620px" height="420px" renderer={args.renderer} />
  ),
};

export const ConversionRates: Story = {
  render: (args) => (
    <Widget widget={FunnelChart({ data: conversionData })} width="620px" height="420px" renderer={args.renderer} />
  ),
};
