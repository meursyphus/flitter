import type { Meta, StoryObj } from "@storybook/react";
import DualRenderer from "../../components/DualRenderer";
import {
  Column,
  Container,
  EdgeInsets,
  Expanded,
  GestureDetector,
  InteractiveViewer,
  MainAxisSize,
  Matrix4,
  Row,
  State,
  StatefulWidget,
  Text,
  TransformationController,
  type Widget,
} from "flitter-core";

const meta = {
  title: "Interaction/InteractiveViewer",
  component: DualRenderer,
} satisfies Meta<typeof DualRenderer>;
export default meta;
type Story = StoryObj<typeof meta>;

class Demo extends StatefulWidget {
  constructor(
    readonly margin = 0,
    readonly minScale = 0.8,
    readonly maxScale = 2.5,
    readonly panEnabled = true,
  ) {
    super();
  }
  createState() {
    return new DemoState();
  }
}
class DemoState extends State<Demo> {
  controller = new TransformationController();
  dispose() {
    this.controller.dispose();
    super.dispose();
  }
  build(): Widget {
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
            button("Reset", () => {
              this.controller.value = Matrix4.identity();
            }),
            button("Zoom 2×", () => {
              this.controller.value = Matrix4.diagonal3Values(2, 2, 1);
            }),
          ],
        }),
        Expanded({
          child: InteractiveViewer({
            transformationController: this.controller,
            constrained: false,
            boundaryMargin: EdgeInsets.all(this.widget.margin),
            minScale: this.widget.minScale,
            maxScale: this.widget.maxScale,
            panEnabled: this.widget.panEnabled,
            child: Column({
              mainAxisSize: MainAxisSize.min,
              children: Array.from({ length: 8 }, (_, y) =>
                Row({
                  mainAxisSize: MainAxisSize.min,
                  children: Array.from({ length: 8 }, (_, x) =>
                    Container({
                      width: 80,
                      height: 65,
                      color: (x + y) % 2 ? "#bfdbfe" : "#eff6ff",
                      padding: EdgeInsets.all(12),
                      child: Text(`${x}, ${y}`),
                    }),
                  ),
                }),
              ),
            }),
          }),
        }),
      ],
    });
  }
}

export const Bounded: Story = {
  args: {
    width: "360px",
    height: "320px",
    widget: new Demo(),
    description:
      "Wheel to zoom around the cursor; drag to pan. Each renderer has an independent controller.",
  },
};
export const WithBoundaryMargin: Story = {
  args: { ...Bounded.args, widget: new Demo(100) },
};
export const UnboundedPan: Story = {
  args: { ...Bounded.args, widget: new Demo(Infinity) },
};
export const ScaleLimits: Story = {
  args: { ...Bounded.args, widget: new Demo(0, 1, 1.5) },
};
export const ZoomOnly: Story = {
  args: { ...Bounded.args, widget: new Demo(0, 0.8, 2.5, false) },
};
