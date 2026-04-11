import type { Meta, StoryObj } from "@storybook/react-vite";
import Widget from "@flitterjs/react";
import { CandlestickChart } from "shared/chart";
import {
  bitcoinMonthlyRows,
  bitcoinTimestampRows,
} from "./candlestick.data";

type StoryArgs = {
  renderer: "svg" | "canvas";
};

const meta: Meta<StoryArgs> = {
  title: "In-Review/CandlestickChart/Ag",
  parameters: { layout: "centered" },
  args: { renderer: "svg" },
  argTypes: {
    renderer: { control: "inline-radio", options: ["svg", "canvas"] },
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

function formatUsdAxisLabel(name: string, _index: number, axis: "x" | "y"): string {
  if (axis !== "y") return name;
  const value = Number(name);
  if (!Number.isFinite(value)) return name;
  return `$${Math.round(value).toLocaleString("en-US")}`;
}

export const BitcoinMonthly: Story = {
  render: (args) => (
    <Widget
      widget={CandlestickChart({
        data: {
          rows: bitcoinMonthlyRows,
          xKey: "date",
        },
        config: {
          title: { text: "Bitcoin USD" },
          subtitle: { visible: true, text: "(BTC-USD)" },
          axis: {
            label: {
              format: formatUsdAxisLabel,
            },
          },
        },
      })}
      width="920px"
      height="520px"
      renderer={args.renderer}
    />
  ),
};

export const BitcoinMonthlyTimestamps: Story = {
  render: (args) => (
    <Widget
      widget={CandlestickChart({
        data: {
          rows: bitcoinTimestampRows,
          xKey: "timestamp",
        },
        transform: {
          groupBy: "year",
          tickCount: 8,
        },
        config: {
          title: { text: "Bitcoin USD" },
          subtitle: { visible: true, text: "(BTC-USD)" },
          axis: {
            label: {
              format: formatUsdAxisLabel,
            },
          },
        },
      })}
      width="920px"
      height="520px"
      renderer={args.renderer}
    />
  ),
};
