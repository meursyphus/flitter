import type { Meta, StoryObj } from "@storybook/react-vite";
import Widget from "@flitterjs/react";
import { BulletChart } from "shared/chart";

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

const defaultData = {
  labels: ["Revenue", "Profit", "Orders", "Satisfaction", "Market Share"],
  datasets: [
    { value: 275, target: 250, ranges: [150, 225, 300] },
    { value: 220, target: 260, ranges: [150, 225, 300] },
    { value: 210, target: 230, ranges: [100, 200, 300] },
    { value: 190, target: 210, ranges: [100, 175, 300] },
    { value: 245, target: 200, ranges: [150, 225, 300] },
  ],
};

const singleData = {
  labels: ["Revenue ($K)"],
  datasets: [
    { value: 275, target: 250, ranges: [150, 225, 300] },
  ],
};

const performanceData = {
  labels: ["CPU Usage", "Memory", "Disk I/O", "Network", "Response Time"],
  datasets: [
    { value: 72, target: 80, ranges: [40, 60, 100] },
    { value: 85, target: 70, ranges: [30, 60, 100] },
    { value: 45, target: 50, ranges: [25, 50, 100] },
    { value: 60, target: 75, ranges: [30, 55, 100] },
    { value: 90, target: 95, ranges: [50, 75, 100] },
  ],
};

function AgBulletChart({ args, data }: { args: BulletChartArgs; data: typeof defaultData }) {
  const { position, alignment } = parseTitlePlacement(args.titlePlacement);
  return (
    <Widget
      widget={BulletChart({
        data,
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
      width="800px"
      height="400px"
      renderer={args.renderer}
    />
  );
}

const meta: Meta<BulletChartArgs> = {
  title: "TODO/BulletChart/Ag",
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
    title: "KPI Dashboard",
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

export const Default: Story = {
  render: (args) => <AgBulletChart args={args} data={defaultData} />,
};

export const Single: Story = {
  args: { title: "Revenue" },
  render: (args) => <AgBulletChart args={args} data={singleData} />,
};

export const ServerPerformance: Story = {
  args: { title: "Server Performance Metrics" },
  render: (args) => <AgBulletChart args={args} data={performanceData} />,
};
