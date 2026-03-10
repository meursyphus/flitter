import type { Meta, StoryObj } from "@storybook/react";
import Widget from "@flitterjs/react";
import { HistogramChart } from "shared/chart";

type StoryArgs = {
  renderer: "svg" | "canvas";
};

const values = {
  values: [3, 5, 7, 7, 8, 9, 11, 12, 12, 13, 15, 17, 18, 18, 20, 22, 24, 24, 26, 28],
};

const denseValues = {
  values: [5, 7, 8, 9, 10, 11, 11, 12, 12, 13, 14, 15, 15, 16, 16, 17, 18, 19, 20, 22, 24, 25],
  binCount: 8,
};

const meta: Meta<StoryArgs> = {
  title: "Charts/HistogramChart/Ag",
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
    <Widget
      widget={HistogramChart({
        data: values,
        config: { title: { text: "Distribution of Sample Values", alignment: "center" } },
      })}
      width="720px"
      height="400px"
      renderer={args.renderer}
    />
  ),
};

export const CustomBins: Story = {
  render: (args) => (
    <Widget
      widget={HistogramChart({
        data: denseValues,
        config: { title: { text: "Distribution with Custom Bins", alignment: "center" } },
      })}
      width="720px"
      height="400px"
      renderer={args.renderer}
    />
  ),
};
