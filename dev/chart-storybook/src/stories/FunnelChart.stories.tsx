import type { Meta, StoryObj } from "@storybook/react-vite";
import Widget from "@flitterjs/react";
import { FunnelChart } from "shared/chart";

type StoryArgs = {
  renderer: "svg" | "canvas";
};

const salesData = {
  stages: [
    { label: "Visitors", value: 10000 },
    { label: "Leads", value: 5000 },
    { label: "Qualified", value: 2500 },
    { label: "Proposals", value: 1200 },
    { label: "Closed", value: 600 },
  ],
};

const conversionData = {
  stages: [
    { label: "Signups", value: 4200 },
    { label: "Activated", value: 3100 },
    { label: "Paid", value: 1800 },
    { label: "Retained", value: 1250 },
  ],
};

function AgFunnelStory({
  args,
  data,
  title,
  direction = "vertical",
}: {
  args: StoryArgs;
  data: typeof salesData;
  title: string;
  direction?: "vertical" | "horizontal";
}) {
  return (
    <Widget
      widget={FunnelChart({
        data,
        direction,
        config: {
          title: {
            text: title,
            alignment: "center",
          },
        },
      })}
      width="720px"
      height="420px"
      renderer={args.renderer}
    />
  );
}

const meta: Meta<StoryArgs> = {
  title: "Charts/FunnelChart/Ag",
  parameters: { layout: "centered" },
  args: { renderer: "svg" },
  argTypes: {
    renderer: { control: "inline-radio", options: ["svg", "canvas"] },
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

export const SalesPipeline: Story = {
  render: (args) => (
    <AgFunnelStory
      args={args}
      data={salesData}
      title="Enterprise Sales Pipeline Performance"
    />
  ),
};

export const ConversionRates: Story = {
  render: (args) => (
    <AgFunnelStory
      args={args}
      data={conversionData}
      title="Conversion Drop Off"
    />
  ),
};

export const HorizontalPipeline: Story = {
  render: (args) => (
    <AgFunnelStory
      args={args}
      data={salesData}
      title="Enterprise Sales Pipeline Performance"
      direction="horizontal"
    />
  ),
};
