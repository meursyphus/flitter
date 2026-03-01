import type { Meta, StoryObj } from "@storybook/react";
import Widget from "@flitterjs/react";
import { StackedAreaChart } from "flitter-chart";

const TITLE_OPTIONS = ["top-start", "top-center", "top-end", "bottom-start", "bottom-center", "bottom-end"] as const;
const LEGEND_POSITIONS = ["top", "bottom", "right", "right-top", "right-center", "right-bottom"] as const;

type StackedAreaChartArgs = {
  renderer: "svg" | "canvas";
  title: string;
  titlePlacement: (typeof TITLE_OPTIONS)[number];
  legendVisible: boolean;
  legendPosition: (typeof LEGEND_POSITIONS)[number];
  legendGap: number;
  areaOpacity: number;
  areaStrokeWidth: number;
  animationEnabled: boolean;
  animationDuration: number;
};

function parseTitlePlacement(placement: string) {
  const [position, alignment] = placement.split("-") as ["top" | "bottom", "start" | "center" | "end"];
  return { position, alignment };
}

const defaultData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  datasets: [
    { legend: "Organic", values: [400, 450, 420, 480, 520, 510, 550, 530, 560, 600, 620, 650] },
    { legend: "Direct", values: [200, 220, 210, 230, 250, 240, 260, 255, 270, 290, 300, 310] },
    { legend: "Social", values: [100, 120, 130, 140, 160, 155, 170, 165, 180, 200, 210, 220] },
    { legend: "Referral", values: [50, 60, 55, 65, 70, 75, 80, 78, 85, 90, 95, 100] },
  ],
};

function ToastStackedAreaChart({ args, data }: { args: StackedAreaChartArgs; data: typeof defaultData }) {
  const { position, alignment } = parseTitlePlacement(args.titlePlacement);
  return (
    <Widget
      widget={StackedAreaChart({
        style: "toast",
        title: args.title,
        data,
        config: {
          title: { position, alignment },
          legend: {
            visible: args.legendVisible,
            position: args.legendPosition,
            gap: args.legendGap,
          },
          area: {
            opacity: args.areaOpacity,
            strokeWidth: args.areaStrokeWidth,
          },
          animation: {
            enabled: args.animationEnabled,
            duration: args.animationDuration,
          },
        },
      })}
      width="800px"
      height="500px"
      renderer={args.renderer}
    />
  );
}

const meta: Meta<StackedAreaChartArgs> = {
  title: "StackedAreaChart/Toast",
  parameters: { layout: "centered" },
  argTypes: {
    renderer: { control: "inline-radio", options: ["svg", "canvas"] },
    title: { control: "text" },
    titlePlacement: { control: "select", options: TITLE_OPTIONS },
    legendVisible: { control: "boolean" },
    legendPosition: { control: "select", options: LEGEND_POSITIONS },
    legendGap: { control: { type: "range", min: 0, max: 40, step: 2 } },
    areaOpacity: { control: { type: "range", min: 0, max: 1, step: 0.1 } },
    areaStrokeWidth: { control: { type: "range", min: 0, max: 10, step: 0.5 } },
    animationEnabled: { control: "boolean" },
    animationDuration: { control: { type: "range", min: 0, max: 2000, step: 100 } },
  },
  args: {
    renderer: "svg",
    title: "Website Traffic Sources",
    titlePlacement: "top-center",
    legendVisible: true,
    legendPosition: "bottom",
    legendGap: 12,
    areaOpacity: 0.6,
    areaStrokeWidth: 2,
    animationEnabled: true,
    animationDuration: 300,
  },
};

export default meta;
type Story = StoryObj<StackedAreaChartArgs>;

export const Default: Story = {
  render: (args) => <ToastStackedAreaChart args={args} data={defaultData} />,
};
