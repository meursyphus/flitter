import type { Meta, StoryObj } from "@storybook/react";
import Widget from "@flitterjs/react";
import { ToastProgressChart } from "shared/chart";

type StoryArgs = {
  renderer: "svg" | "canvas";
};

const singleValue = {
  value: 72,
  max: 100,
  label: "Completion",
};

const segmented = {
  segments: [
    { label: "Done", value: 52, color: "#17a2e6" },
    { label: "Review", value: 18, color: "#f2b544" },
  ],
  max: 100,
};

const meta: Meta<StoryArgs> = {
  title: "Charts/ProgressChart/Toast",
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
    <Widget widget={ToastProgressChart({ data: singleValue })} width="560px" height="180px" renderer={args.renderer} />
  ),
};

export const Segmented: Story = {
  render: (args) => (
    <Widget widget={ToastProgressChart({ data: segmented })} width="560px" height="180px" renderer={args.renderer} />
  ),
};
