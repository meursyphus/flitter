import type { Meta, StoryObj } from "@storybook/react";
import Widget from "@flitterjs/react";
import { StackedBarChart } from "flitter-chart";

const TITLE_OPTIONS = ["top-start", "top-center", "top-end", "bottom-start", "bottom-center", "bottom-end"] as const;
const LEGEND_POSITIONS = ["top", "bottom", "right", "right-top", "right-center", "right-bottom"] as const;

type StackedBarChartArgs = {
  renderer: "svg" | "canvas";
  title: string;
  direction: "vertical" | "horizontal";
  titlePlacement: (typeof TITLE_OPTIONS)[number];
  legendVisible: boolean;
  legendPosition: (typeof LEGEND_POSITIONS)[number];
  legendGap: number;
  barGap: number;
  animationEnabled: boolean;
  animationDuration: number;
};

function parseTitlePlacement(placement: string) {
  const [position, alignment] = placement.split("-") as ["top" | "bottom", "start" | "center" | "end"];
  return { position, alignment };
}

const defaultData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
  datasets: [
    { legend: "North America", values: [120, 135, 110, 145, 160, 150, 170] },
    { legend: "Europe", values: [90, 85, 100, 95, 110, 105, 120] },
    { legend: "Asia Pacific", values: [65, 80, 75, 90, 85, 95, 100] },
  ],
};

const negativeData = {
  labels: ["Q1 '24", "Q2 '24", "Q3 '24", "Q4 '24", "Q1 '25", "Q2 '25", "Q3 '25"],
  datasets: [
    { legend: "Product A", values: [-20, 15, -5, 30, -10, 25, 8] },
    { legend: "Product B", values: [10, -12, 22, -8, 18, -15, 30] },
    { legend: "Product C", values: [5, -25, 12, 20, -18, 10, -7] },
  ],
};

function ToastStackedBarChart({ args, data }: { args: StackedBarChartArgs; data: typeof defaultData }) {
  const { position, alignment } = parseTitlePlacement(args.titlePlacement);
  return (
    <Widget
      widget={StackedBarChart({
        style: "toast",
        direction: args.direction,
        data,
        config: {
          title: { text: args.title, position, alignment },
          legend: {
            visible: args.legendVisible,
            position: args.legendPosition,
            gap: args.legendGap,
          },
          bar: {
            gap: args.barGap,
          },
          animation: {
            enabled: args.animationEnabled,
            duration: args.animationDuration,
          },
        },
      })}
      width="800px"
      height="500px"
      renderer={args.renderer}
    />
  );
}

const meta: Meta<StackedBarChartArgs> = {
  title: "Charts/StackedBarChart/Toast",
  parameters: { layout: "centered" },
  argTypes: {
    renderer: { control: "inline-radio", options: ["svg", "canvas"] },
    title: { control: "text" },
    direction: { control: "inline-radio", options: ["vertical", "horizontal"] },
    titlePlacement: { control: "select", options: TITLE_OPTIONS },
    legendVisible: { control: "boolean" },
    legendPosition: { control: "select", options: LEGEND_POSITIONS },
    legendGap: { control: { type: "range", min: 0, max: 40, step: 2 } },
    barGap: { control: { type: "range", min: 0, max: 10, step: 1 } },
    animationEnabled: { control: "boolean" },
    animationDuration: { control: { type: "range", min: 0, max: 2000, step: 100 } },
  },
  args: {
    renderer: "svg",
    title: "Monthly Revenue by Region",
    direction: "vertical",
    titlePlacement: "top-center",
    legendVisible: true,
    legendPosition: "bottom",
    legendGap: 12,
    barGap: 0,
    animationEnabled: true,
    animationDuration: 300,
  },
};

export default meta;
type Story = StoryObj<StackedBarChartArgs>;

export const Vertical: Story = {
  render: (args) => <ToastStackedBarChart args={args} data={defaultData} />,
};

export const Horizontal: Story = {
  args: { direction: "horizontal" },
  render: (args) => <ToastStackedBarChart args={args} data={defaultData} />,
};

export const NegativeVertical: Story = {
  args: { title: "Quarterly Profit / Loss" },
  render: (args) => <ToastStackedBarChart args={args} data={negativeData} />,
};

export const NegativeHorizontal: Story = {
  args: { title: "Quarterly Profit / Loss", direction: "horizontal" },
  render: (args) => <ToastStackedBarChart args={args} data={negativeData} />,
};
