import type { Meta, StoryObj } from "@storybook/react";
import ToastSunburstChart from "../../charts/ToastSunburstChart";

const meta: Meta<typeof ToastSunburstChart> = {
  title: "Legacy/Sunburst Chart",
  component: ToastSunburstChart,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
