import type { Meta, StoryObj } from "@storybook/react";
import ToastStackedAreaChart from "../charts/ToastStackedAreaChart";

const meta: Meta<typeof ToastStackedAreaChart> = {
  title: "Charts/Stacked Area Chart",
  component: ToastStackedAreaChart,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
