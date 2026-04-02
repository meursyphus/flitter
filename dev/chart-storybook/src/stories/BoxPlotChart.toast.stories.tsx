import type { Meta, StoryObj } from "@storybook/react-vite";
import Widget from "@flitterjs/react";
import { ToastBoxPlotChart } from "shared/chart";
import { boxPlotLatencyData, boxPlotStoryTitle } from "./boxPlotStoryData";

type StoryArgs = {
  renderer: "svg" | "canvas";
  title: string;
  legendPosition: "top" | "bottom" | "right";
  legendVisible: boolean;
  boxWidth: number;
  whiskerWidth: number;
  animationEnabled: boolean;
  animationDuration: number;
};

function ToastBoxPlotStory({
  args,
  direction = "vertical",
}: {
  args: StoryArgs;
  direction?: "vertical" | "horizontal";
}) {
  return (
    <Widget
      widget={ToastBoxPlotChart({
        data: boxPlotLatencyData,
        direction,
        config: {
          title: { text: args.title, visible: !!args.title },
          legend: { position: args.legendPosition, visible: args.legendVisible },
          boxPlot: { boxWidth: args.boxWidth, whiskerWidth: args.whiskerWidth },
          animation: {
            enabled: args.animationEnabled,
            duration: args.animationDuration,
          },
        },
      })}
      width="800px"
      height="520px"
      renderer={args.renderer}
    />
  );
}

const meta: Meta<StoryArgs> = {
  title: "Charts/BoxPlotChart/Toast",
  parameters: { layout: "centered" },
  args: {
    renderer: "svg",
    title: boxPlotStoryTitle,
    legendPosition: "bottom",
    legendVisible: true,
    boxWidth: 24,
    whiskerWidth: 14,
    animationEnabled: true,
    animationDuration: 300,
  },
  argTypes: {
    renderer: { control: "inline-radio", options: ["svg", "canvas"] },
    title: { control: "text" },
    legendPosition: { control: "select", options: ["top", "bottom", "right"] },
    legendVisible: { control: "boolean" },
    boxWidth: { control: { type: "range", min: 10, max: 40, step: 2 } },
    whiskerWidth: { control: { type: "range", min: 6, max: 30, step: 2 } },
    animationEnabled: { control: "boolean" },
    animationDuration: { control: { type: "range", min: 0, max: 2000, step: 100 } },
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

export const Vertical: Story = {
  render: (args) => <ToastBoxPlotStory args={args} />,
};

export const Horizontal: Story = {
  render: (args) => <ToastBoxPlotStory args={args} direction="horizontal" />,
};
