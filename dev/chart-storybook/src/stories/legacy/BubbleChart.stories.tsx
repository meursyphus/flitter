import type { Meta, StoryObj } from "@storybook/react";
import ToastBubbleChart from "../../charts/ToastBubbleChart";

const meta: Meta<typeof ToastBubbleChart> = {
  title: "Legacy/Bubble Chart",
  component: ToastBubbleChart,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
