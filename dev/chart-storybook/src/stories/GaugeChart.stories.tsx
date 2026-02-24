import type { Meta, StoryObj } from "@storybook/react";
import ToastGaugeChart from "../charts/ToastGaugeChart";

const meta: Meta<typeof ToastGaugeChart> = {
  title: "Charts/Gauge Chart",
  component: ToastGaugeChart,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
