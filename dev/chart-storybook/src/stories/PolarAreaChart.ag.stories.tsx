import type { Meta, StoryObj } from "@storybook/react";
import Widget from "@flitterjs/react";
import { PolarAreaChart } from "shared/chart";

type StoryArgs = {
  renderer: "svg" | "canvas";
};

const categoryData = {
  datasets: [
    { name: "Analytics", value: 42 },
    { name: "Platform", value: 31 },
    { name: "Growth", value: 25 },
    { name: "Ops", value: 18 },
    { name: "Finance", value: 12 },
  ],
};

const denseData = {
  datasets: [
    { name: "A", value: 12 },
    { name: "B", value: 18 },
    { name: "C", value: 24 },
    { name: "D", value: 16 },
    { name: "E", value: 20 },
    { name: "F", value: 28 },
  ],
};

const meta: Meta<StoryArgs> = {
  title: "Charts/PolarAreaChart/Ag",
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
    <Widget widget={PolarAreaChart({ data: categoryData })} width="560px" height="420px" renderer={args.renderer} />
  ),
};

export const ManyCategories: Story = {
  render: (args) => (
    <Widget widget={PolarAreaChart({ data: denseData })} width="560px" height="420px" renderer={args.renderer} />
  ),
};
