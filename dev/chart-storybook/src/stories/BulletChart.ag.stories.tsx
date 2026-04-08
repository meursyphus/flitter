import type { Meta, StoryObj } from "@storybook/react-vite";
import Widget from "@flitterjs/react";
import { BulletChart } from "shared/chart";
import {
  bulletRevenueData,
  bulletRevenueTitle,
} from "./bulletStoryData";

const TITLE_OPTIONS = ["top-start", "top-center", "top-end", "bottom-start", "bottom-center", "bottom-end"] as const;

type BulletChartArgs = {
  renderer: "svg" | "canvas";
  title: string;
  titlePlacement: (typeof TITLE_OPTIONS)[number];
  valueBarColor: string;
  targetMarkerColor: string;
  valueBarHeightRatio: number;
  targetMarkerHeightRatio: number;
  bulletGap: number;
};

function parseTitlePlacement(placement: string) {
  const [position, alignment] = placement.split("-") as ["top" | "bottom", "start" | "center" | "end"];
  return { position, alignment };
}

function AgBulletChart({
  args,
  direction,
}: {
  args: BulletChartArgs;
  direction: "vertical" | "horizontal";
}) {
  const { position, alignment } = parseTitlePlacement(args.titlePlacement);
  return (
    <Widget
      widget={BulletChart({
        data: bulletRevenueData,
        direction,
        config: {
          title: { text: args.title, position, alignment },
          bullet: {
            valueBarColor: args.valueBarColor,
            targetMarkerColor: args.targetMarkerColor,
            valueBarHeightRatio: args.valueBarHeightRatio,
            targetMarkerHeightRatio: args.targetMarkerHeightRatio,
            gap: args.bulletGap,
          },
        },
      })}
      width={direction === "vertical" ? "700px" : "800px"}
      height={direction === "vertical" ? "520px" : "400px"}
      renderer={args.renderer}
    />
  );
}

const meta: Meta<BulletChartArgs> = {
  title: "Polish/BulletChart/Ag",
  parameters: { layout: "centered" },
  argTypes: {
    renderer: { control: "inline-radio", options: ["svg", "canvas"] },
    title: { control: "text" },
    titlePlacement: { control: "select", options: TITLE_OPTIONS },
    valueBarColor: { control: "color" },
    targetMarkerColor: { control: "color" },
    valueBarHeightRatio: { control: { type: "range", min: 0.1, max: 0.9, step: 0.05 } },
    targetMarkerHeightRatio: { control: { type: "range", min: 0.3, max: 1, step: 0.05 } },
    bulletGap: { control: { type: "range", min: 0, max: 20, step: 1 } },
  },
  args: {
    renderer: "svg",
    title: bulletRevenueTitle,
    titlePlacement: "top-start",
    valueBarColor: "#333",
    targetMarkerColor: "#222",
    valueBarHeightRatio: 0.4,
    targetMarkerHeightRatio: 0.7,
    bulletGap: 4,
  },
};

export default meta;
type Story = StoryObj<BulletChartArgs>;

export const Horizontal: Story = {
  render: (args) => <AgBulletChart args={args} direction="horizontal" />,
};

export const Vertical: Story = {
  render: (args) => <AgBulletChart args={args} direction="vertical" />,
};
