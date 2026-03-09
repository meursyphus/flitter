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

const basicData = {
  labels: ["Math", "Science", "English", "History"],
  datasets: [
    {
      legend: "Scores",
      data: [
        { min: 45, q1: 60, median: 72, q3: 85, max: 98, outliers: [30] },
        { min: 50, q1: 65, median: 75, q3: 88, max: 95 },
        { min: 40, q1: 55, median: 68, q3: 80, max: 92, outliers: [25, 98] },
        { min: 55, q1: 62, median: 70, q3: 82, max: 90 },
      ],
    },
  ],
};

const comparisonData = {
  labels: ["Q1", "Q2", "Q3", "Q4"],
  datasets: [
    {
      legend: "Product A",
      data: [
        { min: 12, q1: 18, median: 24, q3: 28, max: 34 },
        { min: 10, q1: 16, median: 20, q3: 26, max: 30 },
        { min: 14, q1: 20, median: 26, q3: 30, max: 36 },
        { min: 11, q1: 17, median: 23, q3: 27, max: 31 },
      ],
    },
    {
      legend: "Product B",
      data: [
        { min: 8, q1: 12, median: 18, q3: 22, max: 26 },
        { min: 9, q1: 14, median: 19, q3: 24, max: 28 },
        { min: 7, q1: 11, median: 16, q3: 21, max: 25 },
        { min: 10, q1: 15, median: 20, q3: 24, max: 29 },
      ],
    },
  ],
};

const meta: Meta<StoryArgs> = {
  title: "Charts/BoxPlotChart/Toast",
  parameters: { layout: "centered" },
  args: {
    renderer: "svg",
    title: "",
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

export const Basic: Story = {
  render: (args) => (
    <Widget
      widget={ToastBoxPlotChart({
        data: basicData,
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

export const Comparison: Story = {
  render: (args) => (
    <Widget
      widget={ToastBoxPlotChart({
        data: comparisonData,
        config: {
          title: { text: args.title || "Product Comparison", visible: true },
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
