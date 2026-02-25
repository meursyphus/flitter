import type { Meta, StoryObj } from "@storybook/react";
import Widget from "@flitterjs/react";
import { BarChart } from "flitter-chart";

function ToastBarChart() {
  return (
    <Widget
      widget={BarChart({
        style: "toast",
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
          datasets: [
            { legend: "Seoul", values: [65, 59, 80, 81, 56, 55, 40] },
            { legend: "Seattle", values: [28, 48, 40, 19, 86, 27, 90] },
            { legend: "Sydney", values: [35, 25, 30, 45, 35, 40, 25] },
          ],
        },
      })}
      width="500px"
      height="350px"
      renderer="svg"
    />
  );
}

const meta: Meta<typeof ToastBarChart> = {
  title: "BarChart/Toast",
  component: ToastBarChart,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
