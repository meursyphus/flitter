import type { Meta, StoryObj } from "@storybook/react";
import DualRenderer from "../../components/DualRenderer";
import {
  Axis,
  Column,
  Container,
  EdgeInsets,
  Expanded,
  GestureDetector,
  MainAxisSize,
  Row,
  ScrollController,
  SingleChildScrollView,
  State,
  StatefulWidget,
  Text,
  type Widget,
} from "flitter-core";

const meta = {
  title: "Scrolling/SingleChildScrollView",
  component: DualRenderer,
} satisfies Meta<typeof DualRenderer>;
export default meta;
type Story = StoryObj<typeof meta>;

class Demo extends StatefulWidget {
  constructor(
    readonly horizontal = false,
    readonly reverse = false,
    readonly nested = false,
  ) {
    super();
  }
  createState() {
    return new DemoState();
  }
}
class DemoState extends State<Demo> {
  controller = new ScrollController();
  dispose() {
    this.controller.dispose();
    super.dispose();
  }
  build(): Widget {
    const items = Array.from({ length: 20 }, (_, index) =>
      Container({
        width: this.widget.horizontal ? 140 : undefined,
        height: 70,
        color: index % 2 ? "#dbeafe" : "#eff6ff",
        padding: EdgeInsets.all(16),
        child: Text(`Item ${index + 1}`),
      }),
    );
    const button = (label: string, onClick: () => void) =>
      GestureDetector({
        onClick,
        child: Container({
          padding: EdgeInsets.all(12),
          color: "#bfdbfe",
          child: Text(label),
        }),
      });
    return Column({
      children: [
        Row({
          children: [
            button("Start", () => this.controller.jumpTo(0)),
            button("Animate to end", () => {
              void this.controller.animateTo(this.controller.maxScrollExtent, {
                duration: 600,
              });
            }),
          ],
        }),
        Expanded({
          child: SingleChildScrollView({
            controller: this.controller,
            reverse: this.widget.reverse,
            scrollDirection: this.widget.horizontal
              ? Axis.horizontal
              : Axis.vertical,
            padding: EdgeInsets.all(12),
            child: this.widget.horizontal
              ? Row({ mainAxisSize: MainAxisSize.min, children: items })
              : Column({
                  mainAxisSize: MainAxisSize.min,
                  children: this.widget.nested
                    ? [
                        Container({
                          height: 140,
                          child: SingleChildScrollView({
                            scrollDirection: Axis.horizontal,
                            child: Row({
                              mainAxisSize: MainAxisSize.min,
                              children: items,
                            }),
                          }),
                        }),
                        ...items,
                      ]
                    : items,
                }),
          }),
        }),
      ],
    });
  }
}

export const Vertical: Story = {
  args: {
    widget: new Demo(),
    width: "360px",
    height: "320px",
    description:
      "Use the wheel or drag the content. The buttons demonstrate jumpTo and animateTo.",
  },
};
export const Horizontal: Story = {
  args: { ...Vertical.args, widget: new Demo(true) },
};
export const Reverse: Story = {
  args: { ...Vertical.args, widget: new Demo(false, true) },
};
export const NestedContent: Story = {
  args: { ...Vertical.args, widget: new Demo(false, false, true) },
};
