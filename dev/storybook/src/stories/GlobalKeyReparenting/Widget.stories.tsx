import type { Meta, StoryObj } from "@storybook/react";
import DualRenderer from "../../components/DualRenderer";
import { BasicStory } from "./example/index.js";

const meta = {
  title: "Framework/GlobalKey Reparenting",
  component: DualRenderer,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    width: "720px",
    height: "360px",
  },
} satisfies Meta<typeof DualRenderer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: BasicStory,
};
