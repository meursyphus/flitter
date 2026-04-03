import type { Meta, StoryObj } from "@storybook/react-vite";
import Widget from "@flitterjs/react";
import { ToastHistogramChart } from "shared/chart";
import { populationDistributionScenario } from "./histogramStoryData";

type StoryArgs = {
  renderer: "svg" | "canvas";
};

function ToastHistogramStory({ args }: { args: StoryArgs }) {
  return (
    <Widget
      widget={ToastHistogramChart({
        data: populationDistributionScenario.data,
        transform: populationDistributionScenario.transform,
        config: {
          title: {
            text: populationDistributionScenario.title,
            position: "top",
            alignment: "center",
          },
        },
      })}
      width="800px"
      height="460px"
      renderer={args.renderer}
    />
  );
}

const meta: Meta<StoryArgs> = {
  title: "In-Review/HistogramChart/Toast",
  parameters: { layout: "centered" },
  args: { renderer: "svg" },
  argTypes: {
    renderer: { control: "inline-radio", options: ["svg", "canvas"] },
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

export const Basic: Story = {
  render: (args) => <ToastHistogramStory args={args} />,
};
