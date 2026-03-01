import type { Meta, StoryObj } from "@storybook/react";
import Widget from "@flitterjs/react";
import { LineChart } from "flitter-chart";

const TITLE_OPTIONS = ["top-start", "top-center", "top-end", "bottom-start", "bottom-center", "bottom-end"] as const;
const LEGEND_POSITIONS = ["top", "bottom", "right", "right-top", "right-center", "right-bottom"] as const;

type LineChartArgs = {
  renderer: "svg" | "canvas";
  title: string;
  titlePlacement: (typeof TITLE_OPTIONS)[number];
  legendVisible: boolean;
  legendPosition: (typeof LEGEND_POSITIONS)[number];
  legendGap: number;
  lineStrokeWidth: number;
  lineSpline: boolean;
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
    { legend: "Housing starts (MoM %)", values: [0, 12.38, -15.46, 5.56, -4.98, 0.84, -4.67, 9.96, -2.44, -0.37, -4.22, 16.91] },
    { legend: "Unemployment rate Δ (pp)", values: [0, 11.2, -8.4, 6.9, -5.8, 7.5, -6.2, 4.9, -4.1, 8.1, -5.6, 7.2] },
    { legend: "CPI MoM (1/10 index pts)", values: [0, 12.69, 13.78, 6.78, 1.52, -1.31, 5.25, 4.93, 6.70, 8.99, 8.97, 10.76] },
  ],
};

function ToastLineChart({ args }: { args: LineChartArgs }) {
  const { position, alignment } = parseTitlePlacement(args.titlePlacement);
  return (
    <Widget
      widget={LineChart({
        style: "toast",
        title: args.title,
        data: defaultData,
        config: {
          title: { position, alignment },
          legend: {
            visible: args.legendVisible,
            position: args.legendPosition,
            gap: args.legendGap,
          },
          line: {
            strokeWidth: args.lineStrokeWidth,
            spline: args.lineSpline,
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

const meta: Meta<LineChartArgs> = {
  title: "LineChart/Toast",
  parameters: { layout: "centered" },
  argTypes: {
    renderer: { control: "inline-radio", options: ["svg", "canvas"] },
    title: { control: "text" },
    titlePlacement: { control: "select", options: TITLE_OPTIONS },
    legendVisible: { control: "boolean" },
    legendPosition: { control: "select", options: LEGEND_POSITIONS },
    legendGap: { control: { type: "range", min: 0, max: 40, step: 2 } },
    lineStrokeWidth: { control: { type: "range", min: 1, max: 10, step: 0.5 } },
    lineSpline: { control: "boolean" },
    animationEnabled: { control: "boolean" },
    animationDuration: { control: { type: "range", min: 0, max: 2000, step: 100 } },
  },
  args: {
    renderer: "svg",
    title: "US Macro Pulse (MoM, 2024)",
    titlePlacement: "top-center",
    legendVisible: true,
    legendPosition: "bottom",
    legendGap: 12,
    lineStrokeWidth: 2,
    lineSpline: false,
    animationEnabled: true,
    animationDuration: 300,
  },
};

export default meta;
type Story = StoryObj<LineChartArgs>;

export const Default: Story = {
  render: (args) => <ToastLineChart args={args} />,
};

export const Spline: Story = {
  args: { lineSpline: true, title: "US Macro Pulse (Spline, 2024)" },
  render: (args) => <ToastLineChart args={args} />,
};
