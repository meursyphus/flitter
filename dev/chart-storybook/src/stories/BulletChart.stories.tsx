import type { Meta, StoryObj } from "@storybook/react";
import Widget from "@flitterjs/react";
import { ToastBulletChart } from "shared/chart";

type BulletChartArgs = {
  renderer: "svg" | "canvas";
  title: string;
};

const defaultData = {
  labels: ["Revenue", "Profit", "Satisfaction", "New Customers", "Market Share"],
  datasets: [
    { value: 275, target: 250, ranges: [150, 225, 300] },
    { value: 45, target: 50, ranges: [20, 40, 60] },
    { value: 4.5, target: 4.2, ranges: [2, 3.5, 5] },
    { value: 1450, target: 1500, ranges: [500, 1000, 2000] },
    { value: 32, target: 35, ranges: [15, 25, 40] },
  ],
};

function ToastBulletChartView({ args, data }: { args: BulletChartArgs; data: typeof defaultData }) {
  return (
    <Widget
      widget={ToastBulletChart({
        data,
        config: {
          title: { text: args.title },
        },
      })}
      width="800px"
      height="400px"
      renderer={args.renderer}
    />
  );
}

const meta: Meta<BulletChartArgs> = {
  title: "TODO/BulletChart/Toast",
  parameters: { layout: "centered" },
  argTypes: {
    renderer: { control: "inline-radio", options: ["svg", "canvas"] },
    title: { control: "text" },
  },
  args: {
    renderer: "svg",
    title: "KPI Dashboard",
  },
};

export default meta;
type Story = StoryObj<BulletChartArgs>;

export const Default: Story = {
  render: (args) => <ToastBulletChartView args={args} data={defaultData} />,
};
