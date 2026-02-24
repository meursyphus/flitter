import type { Meta, StoryObj } from "@storybook/react";
import ToastBarChart from "../charts/ToastBarChart";

const meta: Meta<typeof ToastBarChart> = {
  title: "Charts/Bar Chart",
  component: ToastBarChart,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
