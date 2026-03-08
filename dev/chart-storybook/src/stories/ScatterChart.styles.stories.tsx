import type { Meta, StoryObj } from "@storybook/react";
import { ScatterChart, ToastScatterChart } from "shared/chart";
import { StyleParityShowcase } from "./_style-parity";

type StoryArgs = {
  renderer: "svg" | "canvas";
};

const data = {
  datasets: [
    {
      legend: "North America",
      data: [
        { x: 41000, y: 79.4, label: "Canada" },
        { x: 63000, y: 79.1, label: "US" },
        { x: 24000, y: 75.1, label: "Mexico" },
      ],
    },
    {
      legend: "Europe",
      data: [
        { x: 51000, y: 81.2, label: "Germany" },
        { x: 47000, y: 82.5, label: "France" },
        { x: 42000, y: 83.0, label: "Spain" },
      ],
    },
    {
      legend: "Asia",
      data: [
        { x: 35000, y: 84.3, label: "Japan" },
        { x: 33000, y: 83.6, label: "Korea" },
        { x: 21000, y: 78.2, label: "Malaysia" },
      ],
    },
  ],
};

const meta: Meta<StoryArgs> = {
  title: "Charts/ScatterChart/Styles",
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
          note: "nearest-point hover with circle markers",
          widget: ScatterChart({
            data,
            config: {
              title: { text: "GDP per Capita vs Life Expectancy", position: "top", alignment: "center" },
              legend: { visible: true, position: "bottom", gap: 12 },
              scatter: { size: 10, strokeWidth: 2 },
            },
          }),
        },
        {
          label: "Toast",
          note: "local hover with per-series marker shapes",
          widget: ToastScatterChart({
            data,
            config: {
              title: { text: "GDP per Capita vs Life Expectancy", position: "top", alignment: "center" },
              legend: { visible: true, position: "bottom", gap: 12 },
              scatter: { size: 10, fill: false, strokeWidth: 2 },
              animation: { enabled: true, duration: 300 },
            },
          }),
        },
      ]}
    />
  ),
};
