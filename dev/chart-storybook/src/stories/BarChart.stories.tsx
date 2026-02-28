import type { Meta, StoryObj } from "@storybook/react";
import Widget from "@flitterjs/react";
import { BarChart } from "flitter-chart";

function ToastVertical() {
  return (
    <Widget
      widget={BarChart({
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
      widget={BarChart({
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

function ToastNegativeVertical() {
  return (
    <Widget
      widget={BarChart({
        style: "toast",
        title: "Quarterly Profit / Loss",
        data: {
          labels: ["Q1 '24", "Q2 '24", "Q3 '24", "Q4 '24", "Q1 '25", "Q2 '25", "Q3 '25"],
          datasets: [
            { legend: "Product A", values: [-20, 15, -5, 30, -10, 25, 8] },
            { legend: "Product B", values: [10, -12, 22, -8, 18, -15, 30] },
            { legend: "Product C", values: [5, -25, 12, 20, -18, 10, -7] },
          ],
        },
      })}
      width="800px"
      height="500px"
      renderer="svg"
    />
  );
}

function ToastNegativeHorizontal() {
  return (
    <Widget
      widget={BarChart({
        style: "toast",
        title: "Quarterly Profit / Loss",
        direction: "horizontal",
        data: {
          labels: ["Q1 '24", "Q2 '24", "Q3 '24", "Q4 '24", "Q1 '25", "Q2 '25", "Q3 '25"],
          datasets: [
            { legend: "Product A", values: [-20, 15, -5, 30, -10, 25, 8] },
            { legend: "Product B", values: [10, -12, 22, -8, 18, -15, 30] },
            { legend: "Product C", values: [5, -25, 12, 20, -18, 10, -7] },
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
  title: "BarChart/Toast",
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

export const NegativeVertical: Story = {
  render: () => <ToastNegativeVertical />,
};

export const NegativeHorizontal: Story = {
  render: () => <ToastNegativeHorizontal />,
};
