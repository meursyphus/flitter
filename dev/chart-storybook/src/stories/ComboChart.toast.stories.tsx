import type { Meta, StoryObj } from "@storybook/react";
import Widget from "@flitterjs/react";
import { ToastComboChart } from "shared/chart";

type StoryArgs = {
  renderer: "svg" | "canvas";
};

const barLineData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May"],
  datasets: [
    { legend: "Revenue", values: [32, 40, 36, 48, 52], type: "bar" as const },
    { legend: "Margin", values: [18, 22, 20, 26, 29], type: "line" as const, yAxisId: "secondary" as const },
  ],
};

const areaOverlayData = {
  labels: ["Q1", "Q2", "Q3", "Q4"],
  datasets: [
    { legend: "Actual", values: [24, 28, 31, 35], type: "bar" as const },
    { legend: "Forecast", values: [20, 26, 30, 38], type: "area" as const, yAxisId: "secondary" as const },
  ],
};

const meta: Meta<StoryArgs> = {
  title: "Charts/ComboChart/Toast",
  parameters: { layout: "centered" },
  args: { renderer: "svg" },
  argTypes: {
    renderer: { control: "inline-radio", options: ["svg", "canvas"] },
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

export const BarAndLine: Story = {
  render: (args) => (
    <Widget widget={ToastComboChart({ data: barLineData })} width="760px" height="420px" renderer={args.renderer} />
  ),
};

export const BarAndArea: Story = {
  render: (args) => (
    <Widget widget={ToastComboChart({ data: areaOverlayData })} width="760px" height="420px" renderer={args.renderer} />
  ),
};
