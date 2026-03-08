import type { Meta, StoryObj } from "@storybook/react";
import { BubbleChart, ToastBubbleChart } from "shared/chart";
import { StyleParityShowcase } from "./_style-parity";

type StoryArgs = {
  renderer: "svg" | "canvas";
};

const data = {
  datasets: [
    {
      legend: "North America",
      data: [
        { x: 41000, y: 79.4, value: 39, label: "Canada" },
        { x: 63000, y: 79.1, value: 334, label: "US" },
        { x: 24000, y: 75.1, value: 128, label: "Mexico" },
      ],
    },
    {
      legend: "Europe",
      data: [
        { x: 51000, y: 81.2, value: 84, label: "Germany" },
        { x: 47000, y: 82.5, value: 68, label: "France" },
        { x: 42000, y: 83.0, value: 48, label: "Spain" },
      ],
    },
    {
      legend: "Asia",
      data: [
        { x: 35000, y: 84.3, value: 125, label: "Japan" },
        { x: 33000, y: 83.6, value: 51, label: "Korea" },
        { x: 21000, y: 78.2, value: 34, label: "Malaysia" },
      ],
    },
  ],
};

const meta: Meta<StoryArgs> = {
  title: "Charts/BubbleChart/Styles",
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
          note: "static bubbles, tooltip transition",
          widget: BubbleChart({
            data,
            config: {
              title: { text: "Life Expectancy per GDP", position: "top", alignment: "center" },
              legend: { visible: true, position: "bottom", gap: 12 },
              bubble: { minRadius: 4, maxRadius: 28, opacity: 0.7 },
            },
          }),
        },
        {
          label: "Toast",
          note: "animated bubbles, lifted hover state",
          widget: ToastBubbleChart({
            data,
            config: {
              title: { text: "Life Expectancy per GDP", position: "top", alignment: "center" },
              legend: { visible: true, position: "bottom", gap: 12 },
              bubble: { minRadius: 5, maxRadius: 36, opacity: 0.6 },
              animation: { enabled: true, duration: 300 },
            },
          }),
        },
      ]}
    />
  ),
};
