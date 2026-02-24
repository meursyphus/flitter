import type { Meta, StoryObj } from "@storybook/react";
import ToastLineChart from "../charts/ToastLineChart";

const meta: Meta<typeof ToastLineChart> = {
  title: "Charts/Line Chart",
  component: ToastLineChart,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
