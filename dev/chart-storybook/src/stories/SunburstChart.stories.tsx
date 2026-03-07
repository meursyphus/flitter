import type { Meta, StoryObj } from "@storybook/react";
import Widget from "@flitterjs/react";
import { SunburstChart } from "shared/chart";

type StoryArgs = {
  renderer: "svg" | "canvas";
};

const orgData = {
  root: {
    label: "Company",
    children: [
      {
        label: "Engineering",
        children: [
          { label: "Frontend", value: 30 },
          { label: "Backend", value: 25 },
          { label: "DevOps", value: 10 },
        ],
      },
      {
        label: "Design",
        children: [
          { label: "UI/UX", value: 15 },
          { label: "Brand", value: 8 },
        ],
      },
      {
        label: "Sales",
        children: [
          { label: "Domestic", value: 20 },
          { label: "International", value: 12 },
        ],
      },
    ],
  },
};

const deepData = {
  root: {
    label: "Root",
    children: [
      {
        label: "A",
        children: [
          {
            label: "A-1",
            children: [
              { label: "A-1-a", value: 12 },
              { label: "A-1-b", value: 9 },
            ],
          },
          { label: "A-2", value: 18 },
        ],
      },
      {
        label: "B",
        children: [
          { label: "B-1", value: 14 },
          { label: "B-2", value: 11 },
        ],
      },
    ],
  },
};

const meta: Meta<StoryArgs> = {
  title: "Charts/SunburstChart/Toast",
  parameters: { layout: "centered" },
  args: { renderer: "svg" },
  argTypes: {
    renderer: { control: "inline-radio", options: ["svg", "canvas"] },
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

export const Organization: Story = {
  render: (args) => (
    <Widget widget={SunburstChart({ data: orgData })} width="620px" height="460px" renderer={args.renderer} />
  ),
};

export const DeepHierarchy: Story = {
  render: (args) => (
    <Widget widget={SunburstChart({ data: deepData })} width="620px" height="460px" renderer={args.renderer} />
  ),
};
