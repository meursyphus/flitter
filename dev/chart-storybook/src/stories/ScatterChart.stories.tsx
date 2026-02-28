import type { Meta, StoryObj } from "@storybook/react";
import Widget from "@flitterjs/react";
import { ScatterChart } from "flitter-chart";

function ToastDefault() {
  return (
    <Widget
      widget={ScatterChart({
        style: "toast",
        title: "Height vs Weight",
        data: {
          datasets: [
            {
              legend: "Male",
              data: [
                { x: 170, y: 70, label: "A" },
                { x: 175, y: 80, label: "B" },
                { x: 180, y: 85, label: "C" },
                { x: 165, y: 65, label: "D" },
                { x: 185, y: 90, label: "E" },
                { x: 172, y: 75, label: "F" },
                { x: 178, y: 82, label: "G" },
              ],
            },
            {
              legend: "Female",
              data: [
                { x: 155, y: 50, label: "H" },
                { x: 160, y: 55, label: "I" },
                { x: 165, y: 60, label: "J" },
                { x: 158, y: 52, label: "K" },
                { x: 162, y: 58, label: "L" },
                { x: 168, y: 63, label: "M" },
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
  title: "ScatterChart/Toast",
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <ToastDefault />,
};
