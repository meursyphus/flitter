import type { Meta, StoryObj } from "@storybook/react";
import Widget from "@flitterjs/react";
import { ProgressChart } from "shared/chart";

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
    { label: "Done", value: 52, color: "#00a9ff" },
    { label: "Review", value: 18, color: "#ffb840" },
  ],
  max: 100,
};

const meta: Meta<StoryArgs> = {
  title: "TODO/ProgressChart/Ag",
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
    <Widget widget={ProgressChart({ data: singleValue })} width="560px" height="180px" renderer={args.renderer} />
  ),
};

export const Segmented: Story = {
  render: (args) => (
    <Widget widget={ProgressChart({ data: segmented })} width="560px" height="180px" renderer={args.renderer} />
  ),
};
