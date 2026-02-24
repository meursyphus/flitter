import type { Meta, StoryObj } from "@storybook/react";
import ToastCandlestickChart from "../charts/ToastCandlestickChart";

const meta: Meta<typeof ToastCandlestickChart> = {
  title: "Charts/Candlestick Chart",
  component: ToastCandlestickChart,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
