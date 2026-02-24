import type { Meta, StoryObj } from "@storybook/react";
import ToastWaterfallChart from "../charts/ToastWaterfallChart";

const meta: Meta<typeof ToastWaterfallChart> = {
  title: "Charts/Waterfall Chart",
  component: ToastWaterfallChart,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
