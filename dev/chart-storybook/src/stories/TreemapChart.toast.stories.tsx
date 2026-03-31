import type { Meta, StoryObj } from "@storybook/react";
import Widget from "@flitterjs/react";
import { ToastTreemapChart } from "shared/chart";

type StoryArgs = {
  renderer: "svg" | "canvas";
};

const storageData = {
  nodes: [
    { label: "Documents", value: 45 },
    { label: "Photos", value: 30 },
    { label: "Videos", value: 25 },
    { label: "Music", value: 15 },
    { label: "Downloads", value: 12 },
    { label: "Apps", value: 10 },
    { label: "Cache", value: 8 },
    { label: "Other", value: 5 },
  ],
};

const portfolioData = {
  nodes: [
    { label: "US Equities", value: 34, color: "#1f77b4" },
    { label: "Intl Equities", value: 22, color: "#ff7f0e" },
    { label: "Bonds", value: 18, color: "#2ca02c" },
    { label: "Cash", value: 9, color: "#8c564b" },
    { label: "Alternatives", value: 17, color: "#9467bd" },
  ],
};

const meta: Meta<StoryArgs> = {
  title: "Next/TreemapChart/Toast",
  parameters: { layout: "centered" },
  args: { renderer: "svg" },
  argTypes: {
    renderer: { control: "inline-radio", options: ["svg", "canvas"] },
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

export const StorageUsage: Story = {
  render: (args) => (
    <Widget widget={ToastTreemapChart({ data: storageData })} width="700px" height="420px" renderer={args.renderer} />
  ),
};

export const Portfolio: Story = {
  render: (args) => (
    <Widget widget={ToastTreemapChart({ data: portfolioData })} width="700px" height="420px" renderer={args.renderer} />
  ),
};
