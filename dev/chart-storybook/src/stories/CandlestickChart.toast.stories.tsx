import type { Meta, StoryObj } from "@storybook/react-vite";
import Widget from "@flitterjs/react";
import { ToastCandlestickChart } from "shared/chart";
import {
  bitcoinDailyTimestampRows,
  bitcoinMonthlyRows,
} from "./candlestick.data";

type StoryArgs = {
  renderer: "svg" | "canvas";
};

const meta: Meta<StoryArgs> = {
  title: "Polish/CandlestickChart/Toast",
  parameters: { layout: "centered" },
  args: { renderer: "svg" },
  argTypes: {
    renderer: { control: "inline-radio", options: ["svg", "canvas"] },
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

export const BitcoinMonthly: Story = {
  render: (args) => (
    <Widget
      widget={ToastCandlestickChart({
        data: {
          rows: bitcoinMonthlyRows,
          xKey: "date",
        },
        config: {
          title: { text: "Bitcoin USD" },
        },
      })}
      width="920px"
      height="520px"
      renderer={args.renderer}
    />
  ),
};

export const BitcoinDailyTimestamps: Story = {
  render: (args) => (
    <Widget
      widget={ToastCandlestickChart({
        data: {
          rows: bitcoinDailyTimestampRows,
          xKey: "timestamp",
        },
        transform: {
          groupBy: "week",
          tickCount: 9,
        },
        config: {
          title: { text: "Bitcoin USD YTD" },
        },
      })}
      width="920px"
      height="520px"
      renderer={args.renderer}
    />
  ),
};
