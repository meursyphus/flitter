import type { Meta, StoryObj } from "@storybook/react";
import Widget from "@flitterjs/react";
import { LineChart } from "flitter-chart";

function ToastDefault() {
  return (
    <Widget
      widget={LineChart({
        style: "toast",
        title: "Monthly Financial Overview",
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          datasets: [
            { legend: "Revenue", values: [120, 90, 150, 80, 200, 130, 250, 100, 300, 180, 350, 220] },
            { legend: "Expenses", values: [100, 130, 85, 160, 90, 180, 70, 200, 95, 250, 110, 280] },
            { legend: "Profit", values: [20, -40, 65, -80, 110, -50, 180, -100, 205, -70, 240, -60] },
          ],
        },
      })}
      width="800px"
      height="500px"
      renderer="svg"
    />
  );
}

function ToastSpline() {
  return (
    <Widget
      widget={LineChart({
        style: "toast",
        title: "Monthly Financial Overview (Spline)",
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          datasets: [
            { legend: "Revenue", values: [120, 90, 150, 80, 200, 130, 250, 100, 300, 180, 350, 220] },
            { legend: "Expenses", values: [100, 130, 85, 160, 90, 180, 70, 200, 95, 250, 110, 280] },
            { legend: "Profit", values: [20, -40, 65, -80, 110, -50, 180, -100, 205, -70, 240, -60] },
          ],
        },
        config: {
          line: { spline: true },
        },
      })}
      width="800px"
      height="500px"
      renderer="svg"
    />
  );
}

const meta: Meta = {
  title: "LineChart/Toast",
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <ToastDefault />,
};

export const Spline: Story = {
  render: () => <ToastSpline />,
};
