import type { Meta, StoryObj } from "@storybook/react";
import ToastScatterChart from "../../charts/ToastScatterChart";

const meta: Meta<typeof ToastScatterChart> = {
  title: "Legacy/Scatter Chart",
  component: ToastScatterChart,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
