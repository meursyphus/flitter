import type { Meta, StoryObj } from "@storybook/react";
import Widget from "@flitterjs/react";
import { ToastDonutChart } from "shared/chart";

type StoryArgs = {
  renderer: "svg" | "canvas";
};

const data = {
  datasets: [
    { name: "North", value: 34 },
    { name: "South", value: 22 },
    { name: "East", value: 28 },
    { name: "West", value: 16 },
  ],
};

const altData = {
  datasets: [
    { name: "Product A", value: 48 },
    { name: "Product B", value: 27 },
    { name: "Product C", value: 15 },
    { name: "Product D", value: 10 },
  ],
};

const meta: Meta<StoryArgs> = {
  title: "Charts/DonutChart/Toast",
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
    <Widget widget={ToastDonutChart({ data })} width="560px" height="400px" renderer={args.renderer} />
  ),
};

export const CenterLabel: Story = {
  render: (args) => (
    <Widget
      widget={ToastDonutChart({ data: altData, config: { centerText: "100%" } })}
      width="560px"
      height="400px"
      renderer={args.renderer}
    />
  ),
};
