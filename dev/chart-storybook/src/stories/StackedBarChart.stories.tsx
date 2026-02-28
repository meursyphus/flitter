import type { Meta, StoryObj } from "@storybook/react";
import Widget from "@flitterjs/react";
import { StackedBarChart } from "flitter-chart";

function ToastVertical() {
  return (
    <Widget
      widget={StackedBarChart({
        style: "toast",
        title: "Monthly Revenue by Region",
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
          datasets: [
            { legend: "North America", values: [120, 135, 110, 145, 160, 150, 170] },
            { legend: "Europe", values: [90, 85, 100, 95, 110, 105, 120] },
            { legend: "Asia Pacific", values: [65, 80, 75, 90, 85, 95, 100] },
          ],
        },
      })}
      width="800px"
      height="500px"
      renderer="svg"
    />
  );
}

function ToastHorizontal() {
  return (
    <Widget
      widget={StackedBarChart({
        style: "toast",
        title: "Monthly Revenue by Region",
        direction: "horizontal",
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
          datasets: [
            { legend: "North America", values: [120, 135, 110, 145, 160, 150, 170] },
            { legend: "Europe", values: [90, 85, 100, 95, 110, 105, 120] },
            { legend: "Asia Pacific", values: [65, 80, 75, 90, 85, 95, 100] },
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
  title: "StackedBarChart/Toast",
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj;

export const Vertical: Story = {
  render: () => <ToastVertical />,
};

export const Horizontal: Story = {
  render: () => <ToastHorizontal />,
};
