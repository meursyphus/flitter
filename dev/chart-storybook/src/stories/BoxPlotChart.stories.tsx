import type { Meta, StoryObj } from "@storybook/react";
import ToastBoxPlotChart from "../charts/ToastBoxPlotChart";

const meta: Meta<typeof ToastBoxPlotChart> = {
  title: "Charts/Box Plot Chart",
  component: ToastBoxPlotChart,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
