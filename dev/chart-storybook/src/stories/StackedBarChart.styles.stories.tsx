import type { Meta, StoryObj } from "@storybook/react";
import { StackedBarChart, ToastStackedBarChart } from "shared/chart";
import { StyleParityShowcase } from "./_style-parity";

type StoryArgs = {
  renderer: "svg" | "canvas";
};

const data = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
  datasets: [
    { legend: "North America", values: [120, 135, 110, 145, 160, 150, 170] },
    { legend: "Europe", values: [90, 85, 100, 95, 110, 105, 120] },
    { legend: "Asia Pacific", values: [65, 80, 75, 90, 85, 95, 100] },
  ],
};

const meta: Meta<StoryArgs> = {
  title: "Charts/StackedBarChart/Styles",
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
          note: "series dimming on hover",
          widget: StackedBarChart({
            data,
            config: {
              title: { text: "Monthly Revenue by Region", position: "top", alignment: "center" },
              legend: { visible: true, position: "bottom", gap: 12 },
              bar: { gap: 0 },
            },
          }),
        },
        {
          label: "Toast",
          note: "lifted hovered segment",
          widget: ToastStackedBarChart({
            data,
            config: {
              title: { text: "Monthly Revenue by Region", position: "top", alignment: "center" },
              legend: { visible: true, position: "bottom", gap: 12 },
              bar: { gap: 0 },
              animation: { enabled: true, duration: 300 },
            },
          }),
        },
      ]}
    />
  ),
};
