import type { Meta, StoryObj } from "@storybook/react";
import ToastFunnelChart from "../charts/ToastFunnelChart";

const meta: Meta<typeof ToastFunnelChart> = {
  title: "Charts/Funnel Chart",
  component: ToastFunnelChart,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
