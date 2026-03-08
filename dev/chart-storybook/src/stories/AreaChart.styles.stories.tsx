import type { Meta, StoryObj } from "@storybook/react";
import { AreaChart, ToastAreaChart } from "shared/chart";
import { StyleParityShowcase } from "./_style-parity";

type StoryArgs = {
  renderer: "svg" | "canvas";
};

const data = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  datasets: [
    { legend: "Housing starts (MoM %)", values: [0, 12.38, -15.46, 5.56, -4.98, 0.84, -4.67, 9.96, -2.44, -0.37, -4.22, 16.91] },
    { legend: "Unemployment rate Δ (pp)", values: [0, 11.2, -8.4, 6.9, -5.8, 7.5, -6.2, 4.9, -4.1, 8.1, -5.6, 7.2] },
    { legend: "CPI MoM (1/10 index pts)", values: [0, 12.69, 13.78, 6.78, 1.52, -1.31, 5.25, 4.93, 6.7, 8.99, 8.97, 10.76] },
  ],
};

const meta: Meta<StoryArgs> = {
  title: "Charts/AreaChart/Styles",
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
          note: "static filled trend",
          widget: AreaChart({
            data,
            config: {
              title: { text: "US Macro Pulse (MoM, 2024)", position: "top", alignment: "center" },
              legend: { visible: true, position: "bottom", gap: 12 },
              area: { strokeWidth: 2, opacity: 0.3, spline: false },
            },
          }),
        },
        {
          label: "Toast",
          note: "animated filled trend",
          widget: ToastAreaChart({
            data,
            config: {
              title: { text: "US Macro Pulse (MoM, 2024)", position: "top", alignment: "center" },
              legend: { visible: true, position: "bottom", gap: 12 },
              area: { strokeWidth: 2, opacity: 0.3, spline: false },
              animation: { enabled: true, duration: 300 },
            },
          }),
        },
      ]}
    />
  ),
};
