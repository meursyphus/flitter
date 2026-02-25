import type { Meta, StoryObj } from "@storybook/react";
import ToastStackedBarChart from "../../charts/ToastStackedBarChart";

const meta: Meta<typeof ToastStackedBarChart> = {
  title: "Legacy/Stacked Bar Chart",
  component: ToastStackedBarChart,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
