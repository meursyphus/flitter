import type { Meta, StoryObj } from "@storybook/react";
import DualRenderer from "../components/DualRenderer";
import {
  Alignment,
  Container,
  EdgeInsets,
  ListView,
  Text,
  TextStyle,
} from "flitter-core";

const meta = {
  title: "Scrolling/ListView",
  component: DualRenderer,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof DualRenderer>;
export default meta;
type Story = StoryObj<typeof meta>;

export const TenThousandRows: Story = {
  args: {
    width: "340px",
    height: "300px",
    description:
      "10,000 rows. Wheel to scroll; only the viewport and 100px cache are mounted.",
    widget: ListView.builder({
      itemCount: 10000,
      itemExtent: 40,
      cacheExtent: 100,
      itemBuilder: (index) =>
        Container({
          color: index % 2 ? "#f1f5f9" : "#ffffff",
          alignment: Alignment.centerLeft,
          child: Text(`Row ${index + 1}`, {
            style: new TextStyle({ color: "#0f172a", fontSize: 16 }),
          }),
        }),
    }),
  },
};
export const VariableRows: Story = {
  args: {
    width: "340px",
    height: "300px",
    description:
      "Rows are measured lazily. Known offsets are reused when scrolling back.",
    widget: ListView.builder({
      itemCount: 1000,
      cacheExtent: 80,
      itemBuilder: (index) =>
        Container({
          height: 30 + (index % 4) * 15,
          color: index % 2 ? "#dbeafe" : "#eff6ff",
          alignment: Alignment.center,
          child: Text(`Row ${index + 1}`, {
            style: new TextStyle({ color: "#1e3a8a", fontSize: 16 }),
          }),
        }),
    }),
  },
};
export const Horizontal: Story = {
  args: {
    width: "340px",
    height: "160px",
    description:
      "Horizontal fixed-extent virtualization supports trackpad and mouse wheel input.",
    widget: ListView.builder({
      itemCount: 10000,
      itemExtent: 90,
      scrollDirection: "horizontal",
      cacheExtent: 90,
      itemBuilder: (index) =>
        Container({
          color: index % 2 ? "#dcfce7" : "#f0fdf4",
          alignment: Alignment.center,
          child: Text(`${index + 1}`, {
            style: new TextStyle({ color: "#14532d", fontSize: 20 }),
          }),
        }),
    }),
  },
};

export const ReversedPaddedChildren: Story = {
  args: {
    width: "340px",
    height: "260px",
    description:
      "An eager list starts with row 1 at the bottom. Drag or wheel upward; padding scrolls with the content.",
    widget: ListView({
      reverse: true,
      padding: EdgeInsets.all(20),
      itemExtent: 45,
      children: Array.from({ length: 20 }, (_, index) =>
        Container({
          color: index % 2 ? "#fef3c7" : "#fffbeb",
          alignment: Alignment.center,
          child: Text(`Row ${index + 1}`, {
            style: new TextStyle({ color: "#78350f", fontSize: 16 }),
          }),
        }),
      ),
    }),
  },
};
