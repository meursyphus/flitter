import type { Meta, StoryObj } from "@storybook/react";
import ToastTreemapChart from "../../charts/ToastTreemapChart";

const meta: Meta<typeof ToastTreemapChart> = {
  title: "Legacy/Treemap Chart",
  component: ToastTreemapChart,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
