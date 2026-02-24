import type { Meta, StoryObj } from "@storybook/react";
import ToastAreaChart from "../charts/ToastAreaChart";

const meta: Meta<typeof ToastAreaChart> = {
  title: "Charts/Area Chart",
  component: ToastAreaChart,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
