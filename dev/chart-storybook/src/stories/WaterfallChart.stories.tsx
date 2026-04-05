import type { Meta, StoryObj } from "@storybook/react-vite";
import Widget from "@flitterjs/react";
import { WaterfallChart } from "shared/chart";
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
  title: "Polish/WaterfallChart/Ag",
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
      widget={WaterfallChart({
        data: {
          rows: transferBridgeRows,
          xKey: "player",
          yKey: "amount",
        },
        config: {
          title: { text: "Manchester United Transfers" },
          subtitle: { visible: true, text: "Outgoing Sales & Incoming Signings from Season 2023-2024" },
          waterfall: {
            positiveName: "Outs",
            negativeName: "Ins",
            totalName: "Summary",
            valueFormatter: formatMillions,
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
      widget={WaterfallChart({
        data: {
          rows: operatingBridgeRows,
          xKey: "lineItem",
          yKey: "amount",
          totals: operatingBridgeTotals,
        },
        config: {
          title: { text: "Q2 Operating Bridge" },
          subtitle: { visible: true, text: "ARR to Net Income, FY2025" },
          waterfall: {
            positiveName: "Drivers Up",
            negativeName: "Drivers Down",
            totalName: "Summary",
            valueFormatter: formatMillions,
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
