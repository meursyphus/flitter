import type { Meta, StoryObj } from "@storybook/react";
import ToastRadarChart from "../charts/ToastRadarChart";

const meta: Meta<typeof ToastRadarChart> = {
  title: "Charts/Radar Chart",
  component: ToastRadarChart,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
