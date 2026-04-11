import type { Meta, StoryObj } from "@storybook/react-vite";
import Widget from "@flitterjs/react";
import { ToastBulletChart } from "shared/chart";
import {
  bulletRevenueData,
  bulletRevenueTitle,
} from "./bulletStoryData";

type BulletChartArgs = {
  renderer: "svg" | "canvas";
  title: string;
};

function ToastBulletChartView({
  args,
  direction,
}: {
  args: BulletChartArgs;
  direction: "vertical" | "horizontal";
}) {
  return (
    <Widget
      widget={ToastBulletChart({
        data: bulletRevenueData,
        direction,
        config: {
          title: { text: args.title },
        },
      })}
      width={direction === "vertical" ? "700px" : "800px"}
      height={direction === "vertical" ? "520px" : "400px"}
      renderer={args.renderer}
    />
  );
}

const meta: Meta<BulletChartArgs> = {
  title: "Polish/BulletChart/Toast",
  parameters: { layout: "centered" },
  argTypes: {
    renderer: { control: "inline-radio", options: ["svg", "canvas"] },
    title: { control: "text" },
  },
  args: {
    renderer: "svg",
    title: bulletRevenueTitle,
  },
};

export default meta;
type Story = StoryObj<BulletChartArgs>;

export const Horizontal: Story = {
  render: (args) => <ToastBulletChartView args={args} direction="horizontal" />,
};

export const Vertical: Story = {
  render: (args) => <ToastBulletChartView args={args} direction="vertical" />,
};
