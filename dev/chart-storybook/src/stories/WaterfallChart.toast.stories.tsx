import type { Meta, StoryObj } from "@storybook/react-vite";
import Widget from "@flitterjs/react";
import { ToastWaterfallChart } from "shared/chart";
import {
  axisMoneyLabel,
  formatMillions,
  operatingBridgeRows,
  operatingBridgeTotals,
  transferBridgeRows,
} from "./waterfallStoryData";

type StoryArgs = {
  renderer: "svg" | "canvas";
};

const meta: Meta<StoryArgs> = {
  title: "Polish/WaterfallChart/Toast",
  parameters: { layout: "centered" },
  args: { renderer: "svg" },
  argTypes: {
    renderer: { control: "inline-radio", options: ["svg", "canvas"] },
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

export const TransferBridge: Story = {
  render: (args) => (
    <Widget
      widget={ToastWaterfallChart({
        data: {
          rows: transferBridgeRows,
          xKey: "player",
          yKey: "amount",
        },
        config: {
          title: { text: "Manchester United Transfers" },
          waterfall: {
            positiveName: "Outs",
            negativeName: "Ins",
            totalName: "Summary",
            valueFormatter: formatMillions,
            dataLabel: { visible: true },
          },
          axis: {
            label: {
              format: axisMoneyLabel,
            },
          },
        },
      })}
      width="940px"
      height="560px"
      renderer={args.renderer}
    />
  ),
};

export const OperatingBridge: Story = {
  render: (args) => (
    <Widget
      widget={ToastWaterfallChart({
        data: {
          rows: operatingBridgeRows,
          xKey: "lineItem",
          yKey: "amount",
          totals: operatingBridgeTotals,
        },
        config: {
          title: { text: "Q2 Operating Bridge" },
          waterfall: {
            positiveName: "Drivers Up",
            negativeName: "Drivers Down",
            totalName: "Summary",
            valueFormatter: formatMillions,
            dataLabel: { visible: true },
          },
          axis: {
            label: {
              format: axisMoneyLabel,
            },
          },
        },
      })}
      width="940px"
      height="560px"
      renderer={args.renderer}
    />
  ),
};
