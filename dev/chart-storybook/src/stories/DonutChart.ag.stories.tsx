import type { Meta, StoryObj } from "@storybook/react-vite";
import Widget from "@flitterjs/react";
import { DonutChart } from "shared/chart";

type StoryArgs = {
  renderer: "svg" | "canvas";
};

const data = {
  datasets: [
    { name: "Chrome", value: 65 },
    { name: "Safari", value: 18 },
    { name: "Firefox", value: 8 },
    { name: "Edge", value: 5 },
    { name: "Other", value: 4 },
  ],
};

const baseConfig = {
  title: {
    text: "Browser Usage Share",
    position: "top" as const,
    alignment: "center" as const,
  },
  subtitle: {
    text: "2024 Global Statistics",
    visible: true,
  },
};

const meta: Meta<StoryArgs> = {
  title: "CHARTS/DonutChart/Ag",
  parameters: { layout: "centered" },
  args: { renderer: "svg" },
  argTypes: {
    renderer: { control: "inline-radio", options: ["svg", "canvas"] },
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

export const Default: Story = {
  render: (args) => (
    <Widget
      widget={DonutChart({ data, config: baseConfig })}
      width="700px"
      height="550px"
      renderer={args.renderer}
    />
  ),
};

export const DataCenterVisible: Story = {
  render: (args) => (
    <Widget
      widget={DonutChart({
        data,
        config: {
          ...baseConfig,
          dataCenter: {
            visible: true,
            mode: "total",
            formatter: ({ total }) => ({
              label: "Share",
              value: `${total}%`,
            }),
          },
        },
      })}
      width="700px"
      height="550px"
      renderer={args.renderer}
    />
  ),
};
