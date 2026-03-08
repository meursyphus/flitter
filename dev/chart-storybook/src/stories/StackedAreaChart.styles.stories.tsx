import type { Meta, StoryObj } from "@storybook/react";
import { StackedAreaChart, ToastStackedAreaChart } from "shared/chart";
import { StyleParityShowcase } from "./_style-parity";

type StoryArgs = {
  renderer: "svg" | "canvas";
};

const data = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  datasets: [
    { legend: "Organic", values: [400, 450, 420, 480, 520, 510, 550, 530, 560, 600, 620, 650] },
    { legend: "Direct", values: [200, 220, 210, 230, 250, 240, 260, 255, 270, 290, 300, 310] },
    { legend: "Social", values: [100, 120, 130, 140, 160, 155, 170, 165, 180, 200, 210, 220] },
    { legend: "Referral", values: [50, 60, 55, 65, 70, 75, 80, 78, 85, 90, 95, 100] },
  ],
};

const meta: Meta<StoryArgs> = {
  title: "Charts/StackedAreaChart/Styles",
  parameters: { layout: "centered" },
  argTypes: {
    renderer: { control: "inline-radio", options: ["svg", "canvas"] },
  },
  args: {
    renderer: "svg",
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

export const SideBySide: Story = {
  render: (args) => (
    <StyleParityShowcase
      renderer={args.renderer}
      items={[
        {
          label: "Ag",
          note: "single hovered series readout",
          widget: StackedAreaChart({
            data,
            config: {
              title: { text: "Website Traffic Sources", position: "top", alignment: "center" },
              legend: { visible: true, position: "bottom", gap: 12 },
              area: { opacity: 0.7, strokeWidth: 2, spline: false },
            },
          }),
        },
        {
          label: "Toast",
          note: "column-centric multi-series hover",
          widget: ToastStackedAreaChart({
            data,
            config: {
              title: { text: "Website Traffic Sources", position: "top", alignment: "center" },
              legend: { visible: true, position: "bottom", gap: 12 },
              area: { opacity: 0.6, strokeWidth: 2, spline: false },
              animation: { enabled: true, duration: 300 },
            },
          }),
        },
      ]}
    />
  ),
};
