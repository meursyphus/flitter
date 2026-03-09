import type { Meta, StoryObj } from "@storybook/react";
import Widget from "@flitterjs/react";
import { ToastGaugeChart } from "shared/chart";

type StoryArgs = {
  renderer: "svg" | "canvas";
};

const defaultGauge = {
  value: 72,
  min: 0,
  max: 100,
  zones: [
    { min: 0, max: 50, color: "#00bd9f" },
    { min: 50, max: 80, color: "#ffb840" },
    { min: 80, max: 100, color: "#ff5a46" },
  ],
};

const fullRangeGauge = {
  value: 148,
  min: 50,
  max: 200,
  zones: [
    { min: 50, max: 100, color: "#c5f0e7" },
    { min: 100, max: 150, color: "#6ad0c0" },
    { min: 150, max: 200, color: "#0f8c7c" },
  ],
};

const meta: Meta<StoryArgs> = {
  title: "Charts/GaugeChart/Toast",
  parameters: { layout: "centered" },
  args: { renderer: "svg" },
  argTypes: {
    renderer: { control: "inline-radio", options: ["svg", "canvas"] },
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

export const Basic: Story = {
  render: (args) => (
    <Widget widget={ToastGaugeChart({ data: defaultGauge })} width="560px" height="360px" renderer={args.renderer} />
  ),
};

export const FullRange: Story = {
  render: (args) => (
    <Widget widget={ToastGaugeChart({ data: fullRangeGauge })} width="560px" height="360px" renderer={args.renderer} />
  ),
};
