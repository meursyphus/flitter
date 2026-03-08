import type { Meta, StoryObj } from "@storybook/react";
import Widget from "@flitterjs/react";
import { GanttChart } from "shared/chart";

type StoryArgs = {
  renderer: "svg" | "canvas";
};

const roadmap = {
  tasks: [
    { id: "discovery", label: "Discovery", start: Date.UTC(2025, 0, 1), end: Date.UTC(2025, 0, 10), progress: 1, group: "Planning" },
    { id: "design", label: "Design", start: Date.UTC(2025, 0, 6), end: Date.UTC(2025, 0, 20), progress: 0.8, group: "Planning" },
    { id: "build", label: "Build", start: Date.UTC(2025, 0, 15), end: Date.UTC(2025, 1, 10), progress: 0.45, group: "Execution", dependencies: ["design"] },
    { id: "launch", label: "Launch", start: Date.UTC(2025, 1, 15), end: Date.UTC(2025, 1, 15), group: "Release", dependencies: ["build"] },
  ],
};

const operations = {
  tasks: [
    { id: "research", label: "User Research", start: Date.UTC(2025, 2, 1), end: Date.UTC(2025, 2, 8), group: "Research" },
    { id: "prototype", label: "Prototype", start: Date.UTC(2025, 2, 7), end: Date.UTC(2025, 2, 20), group: "Design", dependencies: ["research"] },
    { id: "qa", label: "QA", start: Date.UTC(2025, 2, 20), end: Date.UTC(2025, 2, 30), group: "Validation", dependencies: ["prototype"] },
  ],
};

const meta: Meta<StoryArgs> = {
  title: "Charts/GanttChart/Ag",
  parameters: { layout: "centered" },
  args: { renderer: "svg" },
  argTypes: {
    renderer: { control: "inline-radio", options: ["svg", "canvas"] },
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

export const Roadmap: Story = {
  render: (args) => (
    <Widget widget={GanttChart({ data: roadmap })} width="820px" height="360px" renderer={args.renderer} />
  ),
};

export const Operations: Story = {
  render: (args) => (
    <Widget widget={GanttChart({ data: operations })} width="820px" height="320px" renderer={args.renderer} />
  ),
};
