import type { Meta, StoryObj } from "@storybook/react";
import ToastHeatmapChart from "../charts/ToastHeatmapChart";

const meta: Meta<typeof ToastHeatmapChart> = {
  title: "Charts/Heatmap Chart",
  component: ToastHeatmapChart,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
