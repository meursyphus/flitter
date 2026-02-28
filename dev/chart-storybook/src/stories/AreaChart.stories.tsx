import type { Meta, StoryObj } from "@storybook/react";
import Widget from "@flitterjs/react";
import { AreaChart } from "flitter-chart";

function ToastDefault() {
  return (
    <Widget
      widget={AreaChart({
        style: "toast",
        title: "Monthly Sales Trend",
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          datasets: [
            { legend: "2024", values: [65, 72, 80, 75, 90, 85, 95, 88, 92, 100, 105, 110] },
            { legend: "2025", values: [70, 78, 85, 82, 95, 92, 100, 95, 98, 108, 112, 120] },
            { legend: "2026", values: [55, 60, 68, 72, 80, 78, 85, 82, 88, 95, 100, 105] },
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
  title: "AreaChart/Toast",
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <ToastDefault />,
};
