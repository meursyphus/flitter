import type { Meta, StoryObj } from "@storybook/react";
import Widget from "@flitterjs/react";
import { AreaChart } from "flitter-chart";

function ToastDefault() {
  return (
    <Widget
      widget={AreaChart({
        style: "toast",
        title: "Monthly Cashflow",
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          datasets: [
            { legend: "Operating", values: [50, 35, 80, -20, 120, 45, -30, 95, 60, -15, 110, 70] },
            { legend: "Investing", values: [-40, -60, 20, -80, 10, -50, 30, -70, 15, -45, 25, -35] },
            { legend: "Financing", values: [30, -10, -25, 60, -40, 80, -55, 40, -30, 70, -20, 50] },
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
      widget={AreaChart({
        style: "toast",
        title: "Monthly Cashflow (Spline)",
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          datasets: [
            { legend: "Operating", values: [50, 35, 80, -20, 120, 45, -30, 95, 60, -15, 110, 70] },
            { legend: "Investing", values: [-40, -60, 20, -80, 10, -50, 30, -70, 15, -45, 25, -35] },
            { legend: "Financing", values: [30, -10, -25, 60, -40, 80, -55, 40, -30, 70, -20, 50] },
          ],
        },
        config: {
          area: { spline: true },
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

export const Spline: Story = {
  render: () => <ToastSpline />,
};
