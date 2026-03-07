import type { Meta, StoryObj } from "@storybook/react";
import Widget from "@flitterjs/react";
import { CandlestickChart } from "chart-styles";

type StoryArgs = {
  renderer: "svg" | "canvas";
};

const ohlcData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  datasets: [
    {
      legend: "Price",
      data: [
        { open: 100, high: 115, low: 95, close: 110 },
        { open: 110, high: 120, low: 105, close: 108 },
        { open: 108, high: 125, low: 100, close: 122 },
        { open: 122, high: 130, low: 118, close: 125 },
        { open: 125, high: 128, low: 110, close: 112 },
      ],
    },
  ],
};

const multiMonthData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      legend: "Open Market",
      data: [
        { open: 42, high: 50, low: 38, close: 48 },
        { open: 48, high: 55, low: 44, close: 52 },
        { open: 52, high: 58, low: 49, close: 54 },
        { open: 54, high: 60, low: 46, close: 50 },
        { open: 50, high: 57, low: 47, close: 56 },
        { open: 56, high: 63, low: 53, close: 60 },
      ],
    },
  ],
};

const meta: Meta<StoryArgs> = {
  title: "Charts/CandlestickChart/Toast",
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
    <Widget widget={CandlestickChart({ data: ohlcData })} width="720px" height="420px" renderer={args.renderer} />
  ),
};

export const MultiMonth: Story = {
  render: (args) => (
    <Widget widget={CandlestickChart({ data: multiMonthData })} width="760px" height="420px" renderer={args.renderer} />
  ),
};
