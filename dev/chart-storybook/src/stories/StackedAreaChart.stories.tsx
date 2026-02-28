import type { Meta, StoryObj } from "@storybook/react";
import Widget from "@flitterjs/react";
import { StackedAreaChart } from "flitter-chart";

function ToastDefault() {
  return (
    <Widget
      widget={StackedAreaChart({
        style: "toast",
        title: "Website Traffic Sources",
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          datasets: [
            { legend: "Organic", values: [400, 450, 420, 480, 520, 510, 550, 530, 560, 600, 620, 650] },
            { legend: "Direct", values: [200, 220, 210, 230, 250, 240, 260, 255, 270, 290, 300, 310] },
            { legend: "Social", values: [100, 120, 130, 140, 160, 155, 170, 165, 180, 200, 210, 220] },
            { legend: "Referral", values: [50, 60, 55, 65, 70, 75, 80, 78, 85, 90, 95, 100] },
          ],
        },
      })}
      width="800px"
      height="500px"
      renderer="svg"
    />
  );
}

const meta: Meta = {
  title: "StackedAreaChart/Toast",
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <ToastDefault />,
};
