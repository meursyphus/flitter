import type { Meta, StoryObj } from "@storybook/react";
import Widget from "@flitterjs/react";
import { ToastBoxPlotChart } from "shared/chart";

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

const data = {
  labels: ["Budget", "Income", "Expenses", "Debt"],
  datasets: [
    {
      legend: "2020",
      data: [
        { min: 1000, q1: 2500, median: 3714, q3: 5500, max: 7000, outliers: [14000] },
        { min: 1000, q1: 2750, median: 4571, q3: 5250, max: 8000 },
        { min: 3000, q1: 4000, median: 4714, q3: 6000, max: 7000, outliers: [10000] },
        { min: 1000, q1: 2250, median: 3142, q3: 4750, max: 6000, outliers: [9600] },
      ],
    },
    {
      legend: "2021",
      data: [
        { min: 2000, q1: 4500, median: 6714, q3: 11500, max: 13000 },
        { min: 3000, q1: 5750, median: 7571, q3: 8250, max: 9000, outliers: [14000] },
        { min: 5000, q1: 8000, median: 8714, q3: 9000, max: 10000 },
        { min: 7000, q1: 9250, median: 10142, q3: 11750, max: 12000 },
      ],
    },
  ],
};

const meta: Meta<StoryArgs> = {
  title: "Charts/BoxPlotChart/Toast",
  parameters: { layout: "centered" },
  args: {
    renderer: "svg",
    title: "Monthly Revenue",
    legendPosition: "right",
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
  render: (args) => (
    <Widget
      widget={ToastBoxPlotChart({
        data,
        config: {
          title: { text: args.title, visible: !!args.title },
          legend: { position: args.legendPosition, visible: args.legendVisible },
          boxPlot: { boxWidth: args.boxWidth, whiskerWidth: args.whiskerWidth },
          animation: { enabled: args.animationEnabled, duration: args.animationDuration },
        },
      })}
      width="720px"
      height="420px"
      renderer={args.renderer}
    />
  ),
};

export const Horizontal: Story = {
  render: (args) => (
    <Widget
      widget={ToastBoxPlotChart({
        data,
        direction: "horizontal",
        config: {
          title: { text: args.title, visible: !!args.title },
          legend: { position: args.legendPosition, visible: args.legendVisible },
          boxPlot: { boxWidth: args.boxWidth, whiskerWidth: args.whiskerWidth },
          animation: { enabled: args.animationEnabled, duration: args.animationDuration },
        },
      })}
      width="720px"
      height="420px"
      renderer={args.renderer}
    />
  ),
};
