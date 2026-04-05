import type { Meta, StoryObj } from "@storybook/react-vite";
import Widget from "@flitterjs/react";
import { BoxPlotChart } from "shared/chart";
import { boxPlotLatencyData, boxPlotStoryTitle } from "./boxPlotStoryData";

type StoryArgs = {
  renderer: "svg" | "canvas";
  title: string;
  legendPosition: "top" | "bottom" | "right";
  legendVisible: boolean;
  boxWidth: number;
  whiskerWidth: number;
};

function AgBoxPlotStory({
  args,
  direction = "vertical",
}: {
  args: StoryArgs;
  direction?: "vertical" | "horizontal";
}) {
  return (
    <Widget
      widget={BoxPlotChart({
        data: boxPlotLatencyData,
        direction,
        config: {
          title: { text: args.title, visible: !!args.title },
          legend: { position: args.legendPosition, visible: args.legendVisible },
          boxPlot: { boxWidth: args.boxWidth, whiskerWidth: args.whiskerWidth },
        },
      })}
      width="800px"
      height="520px"
      renderer={args.renderer}
    />
  );
}

const meta: Meta<StoryArgs> = {
  title: "Polish/BoxPlotChart/Ag",
  parameters: { layout: "centered" },
  args: {
    renderer: "svg",
    title: boxPlotStoryTitle,
    legendPosition: "bottom",
    legendVisible: true,
    boxWidth: 20,
    whiskerWidth: 12,
  },
  argTypes: {
    renderer: { control: "inline-radio", options: ["svg", "canvas"] },
    title: { control: "text" },
    legendPosition: { control: "select", options: ["top", "bottom", "right"] },
    legendVisible: { control: "boolean" },
    boxWidth: { control: { type: "range", min: 10, max: 40, step: 2 } },
    whiskerWidth: { control: { type: "range", min: 6, max: 30, step: 2 } },
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

export const Vertical: Story = {
  render: (args) => <AgBoxPlotStory args={args} />,
};

export const Horizontal: Story = {
  render: (args) => <AgBoxPlotStory args={args} direction="horizontal" />,
};
