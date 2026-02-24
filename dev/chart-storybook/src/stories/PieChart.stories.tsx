import type { Meta, StoryObj } from "@storybook/react";
import ToastPieChart from "../charts/ToastPieChart";

const meta: Meta<typeof ToastPieChart> = {
  title: "Charts/Pie Chart",
  component: ToastPieChart,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
