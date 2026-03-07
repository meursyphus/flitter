import type { Meta, StoryObj } from "@storybook/react";
import Widget from "@flitterjs/react";
import { BoxPlotChart } from "chart-styles";

type StoryArgs = {
  renderer: "svg" | "canvas";
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
  args: { renderer: "svg" },
  argTypes: {
    renderer: { control: "inline-radio", options: ["svg", "canvas"] },
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

export const Basic: Story = {
  render: (args) => (
    <Widget widget={BoxPlotChart({ data: basicData })} width="720px" height="420px" renderer={args.renderer} />
  ),
};

export const Comparison: Story = {
  render: (args) => (
    <Widget widget={BoxPlotChart({ data: comparisonData })} width="720px" height="420px" renderer={args.renderer} />
  ),
};
