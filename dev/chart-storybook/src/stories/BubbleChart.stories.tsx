import type { Meta, StoryObj } from "@storybook/react";
import Widget from "@flitterjs/react";
import { BubbleChart } from "flitter-chart";

function ToastDefault() {
  return (
    <Widget
      widget={BubbleChart({
        style: "toast",
        title: "Market Analysis",
        data: {
          datasets: [
            {
              legend: "Tech",
              data: [
                { x: 80, y: 90, value: 50, label: "Apple" },
                { x: 70, y: 85, value: 40, label: "Google" },
                { x: 60, y: 75, value: 35, label: "Meta" },
                { x: 85, y: 70, value: 30, label: "Microsoft" },
              ],
            },
            {
              legend: "Finance",
              data: [
                { x: 50, y: 60, value: 45, label: "JPMorgan" },
                { x: 55, y: 55, value: 38, label: "Goldman" },
                { x: 45, y: 65, value: 28, label: "Citi" },
              ],
            },
            {
              legend: "Healthcare",
              data: [
                { x: 40, y: 80, value: 42, label: "J&J" },
                { x: 35, y: 70, value: 33, label: "Pfizer" },
                { x: 30, y: 75, value: 25, label: "Merck" },
              ],
            },
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
  title: "BubbleChart/Toast",
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <ToastDefault />,
};
