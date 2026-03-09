import type { Meta, StoryObj } from "@storybook/react";
import Widget from "@flitterjs/react";
import { BoxPlotChart, ToastBoxPlotChart } from "shared/chart";

type StoryArgs = {
  renderer: "svg" | "canvas";
};

const data = {
  labels: ["Q1", "Q2", "Q3", "Q4"],
  datasets: [
    {
      legend: "Product A",
      data: [
        { min: 12, q1: 18, median: 24, q3: 28, max: 34, outliers: [5] },
        { min: 10, q1: 16, median: 20, q3: 26, max: 30 },
        { min: 14, q1: 20, median: 26, q3: 30, max: 36, outliers: [8, 42] },
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
  title: "Charts/BoxPlotChart/Styles",
  parameters: { layout: "centered" },
  args: { renderer: "svg" },
  argTypes: {
    renderer: { control: "inline-radio", options: ["svg", "canvas"] },
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

export const AgVsToast: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 24 }}>
      <div>
        <h3 style={{ textAlign: "center", marginBottom: 8, fontFamily: "sans-serif", fontSize: 14, color: "#666" }}>AG Style</h3>
        <Widget
          widget={BoxPlotChart({
            data,
            config: {
              title: { text: "Quarterly Performance", visible: true },
            },
          })}
          width="540px"
          height="380px"
          renderer={args.renderer}
        />
      </div>
      <div>
        <h3 style={{ textAlign: "center", marginBottom: 8, fontFamily: "sans-serif", fontSize: 14, color: "#666" }}>Toast Style</h3>
        <Widget
          widget={ToastBoxPlotChart({
            data,
            config: {
              title: { text: "Quarterly Performance", visible: true },
            },
          })}
          width="540px"
          height="380px"
          renderer={args.renderer}
        />
      </div>
    </div>
  ),
};
