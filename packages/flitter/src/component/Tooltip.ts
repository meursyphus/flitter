import type { BuildContext, Widget } from "@moonmoonbrothers/flutterjs";
import {
  ConstraintsTransformBox,
  GestureDetector,
  Stack,
  StackFit,
  State,
  StatefulWidget,
  Positioned,
  FractionalTranslation,
  Offset,
  SizedBox,
  Alignment,
} from "@moonmoonbrothers/flutterjs";
import { functionalizeClass } from "../utils";

type TooltipPosition =
  | "topLeft"
  | "topRight"
  | "topCenter"
  | "bottomCenter"
  | "bottomLeft"
  | "bottomRight"
  | "center"
  | "centerLeft"
  | "centerRight";

const positionHelper: Record<TooltipPosition, Offset> = {
  topLeft: new Offset({ x: -1, y: -1 }),
  topCenter: new Offset({ x: 0, y: -1 }),
  topRight: new Offset({ x: 1, y: -1 }),
  center: new Offset({ x: 0, y: 0 }),
  centerLeft: new Offset({ x: -1, y: 0 }),
  centerRight: new Offset({ x: 1, y: 0 }),
  bottomCenter: new Offset({ x: 0, y: 1 }),
  bottomLeft: new Offset({ x: -1, y: 1 }),
  bottomRight: new Offset({ x: 1, y: 1 }),
};

class ToolTip extends StatefulWidget {
  child: Widget;
  tooltip: Widget;
  position: TooltipPosition;
  constructor({
    key,
    child,
    tooltip,
    position,
  }: {
    key?: any;
    child: Widget;
    tooltip: Widget;
    position?: TooltipPosition;
  }) {
    super(key);
    this.child = child;
    this.tooltip = tooltip;
    this.position = position ?? "bottomCenter";
  }

  createState(): State<StatefulWidget> {
    return new ToolTipState();
  }
}

class ToolTipState extends State<ToolTip> {
  show: boolean = false;

  handleMouseEnter() {
    this.show = true;
    this.setState(() => {
      this.show = true;
    });
  }
  handleMouseLeave() {
    this.setState(() => {
      this.show = false;
    });
  }

  build(_: BuildContext): Widget {
    return Stack({
      fit: StackFit.passthrough,
      clipped: false,
      children: [
        GestureDetector({
          bubble: {
            mousedown: true,
            mouseenter: true,
            mouseleave: true,
            mousemove: true,
            mouseover: true,
            mouseup: true,
            click: true,
            drag: true,
            dragend: true,
            dragstart: true,
            wheel: true,
          },
          cursor: "default",
          child: this.widget.child,
          onMouseEnter: () => {
            this.handleMouseEnter();
          },
          onMouseLeave: () => {
            this.handleMouseLeave();
          },
        }),
        this.show
          ? Positioned.fill({
              child: ConstraintsTransformBox({
                constraintsTransform: ConstraintsTransformBox.unconstrained,
                alignment: Alignment[this.widget.position],
                child: FractionalTranslation({
                  translation: positionHelper[this.widget.position],
                  child: this.widget.tooltip,
                }),
              }),
            })
          : SizedBox.shrink(),
      ],
    });
  }
}

export default functionalizeClass(ToolTip);
