import type { Meta, StoryObj } from "@storybook/react-vite";
import Widget from "@flitterjs/react";
import { ToastTreemapChart } from "shared/chart";

type StoryArgs = {
  renderer: "svg" | "canvas";
};

const gdpData = {
  datasets: [
    {
      legend: "Documents",
      children: [
        {
          label: "docs",
          children: [
            { label: "pages", secondaryLabel: "1.3GB", value: 1.3 },
            { label: "keynote", secondaryLabel: "2.5GB", value: 2.5 },
            { label: "numbers", secondaryLabel: "1.2GB", value: 1.2 },
          ],
        },
        { label: "photos", secondaryLabel: "5.5GB", value: 5.5 },
        { label: "videos", secondaryLabel: "20.7GB", value: 20.7 },
      ],
    },
    {
      legend: "Downloads",
      children: [
        { label: "recent", secondaryLabel: "5.3GB", value: 5.3 },
        { label: "2020", secondaryLabel: "10.1GB", value: 10.1 },
        { label: "2019", secondaryLabel: "8.2GB", value: 8.2 },
      ],
    },
    {
      legend: "Application",
      value: 16.4,
      secondaryLabel: "16.4GB",
    },
    {
      legend: "Desktop",
      value: 4.5,
      secondaryLabel: "4.5GB",
    },
  ],
};

const meta: Meta<StoryArgs> = {
  title: "Charts/TreemapChart/Toast",
  parameters: { layout: "centered" },
  args: { renderer: "svg" },
  argTypes: {
    renderer: { control: "inline-radio", options: ["svg", "canvas"] },
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

export const Basic: Story = {
  render: (args) => (
    <Widget
      widget={ToastTreemapChart({
        data: gdpData,
        config: {
          title: {
            text: "Used disk space",
            visible: true,
          },
        },
      })}
      width="700px"
      height="420px"
      renderer={args.renderer}
    />
  ),
};
