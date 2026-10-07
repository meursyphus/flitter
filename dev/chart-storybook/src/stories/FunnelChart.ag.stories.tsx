import type { Meta, StoryObj } from "@storybook/react-vite";
import Widget from "@flitterjs/react";
import { FunnelChart } from "shared/chart";

const data = {
  stages: [
    { label: "Visits", value: 12000 },
    { label: "Product views", value: 8400 },
    { label: "Added to cart", value: 4200 },
    { label: "Checkout", value: 2800 },
    { label: "Purchased", value: 2100 },
  ],
};

const meta = {
  title: "Charts/FunnelChart/Ag",
  args: { renderer: "svg" as "svg" | "canvas", legendVisible: false },
  argTypes: {
    renderer: { control: "inline-radio", options: ["svg", "canvas"] },
    legendVisible: { control: "boolean" },
  },
  render: (args) => (
    <Widget
      width="800px"
      height="500px"
      renderer={args.renderer}
      widget={FunnelChart({
        data,
        config: {
          title: { text: "Store Conversion" },
          legend: { visible: args.legendVisible },
        },
      })}
    />
  ),
} satisfies Meta<{ renderer: "svg" | "canvas"; legendVisible: boolean }>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Conversion: Story = {};
export const InteractiveLegend: Story = { args: { legendVisible: true } };
export const Empty: Story = {
  render: (args) => (
    <Widget
      width="800px"
      height="500px"
      renderer={args.renderer}
      widget={FunnelChart({
        data: { stages: [] },
        config: { title: { text: "No conversions yet" } },
      })}
    />
  ),
};
