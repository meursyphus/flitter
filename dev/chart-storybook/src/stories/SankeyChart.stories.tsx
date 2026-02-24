import type { Meta, StoryObj } from "@storybook/react";
import ToastSankeyChart from "../charts/ToastSankeyChart";

const meta: Meta<typeof ToastSankeyChart> = {
  title: "Charts/Sankey Chart",
  component: ToastSankeyChart,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
