import {
  Alignment,
  BuildContext,
  Center,
  Container,
  GestureDetector,
  Positioned,
  Stack,
  State,
  StatefulWidget,
  Text,
  TextAlign,
  TextStyle,
  Widget,
} from "@meursyphus/flitter";
import ReactWidget from "@meursyphus/flitter-react";

class ResizableWidget extends StatefulWidget {
  createState(): State<StatefulWidget> {
    return new ResizableState();
  }
}

class ResizableState extends State<ResizableWidget> {
  width = 700;
  height = 480;
  hovered: "left" | "right" | "top" | "bottom" | null = null;

  clamp = (value: number, min: number, max: number) => {
    return Math.min(Math.max(value, min), max);
  };

  handleSize =
    (type: "left" | "right" | "top" | "bottom") => (e: MouseEvent) => {
      const key: "width" | "height" =
        type === "left" || type === "right" ? "width" : "height";
      const delta =
        (key === "width" ? e.movementX : e.movementY) *
        (type === "right" || type === "bottom" ? 1 : -1);

      this.setState(() => {
        this[key] = this.clamp(this[key] + delta * 2, 200, 800);
      });
    };
  getGestureProps = (type: "left" | "right" | "top" | "bottom") => {
    return {
      cursor: (type === "left" || type === "right"
        ? "ew-resize"
        : "ns-resize") as "ew-resize" | "ns-resize",
      onMouseEnter: () => {
        this.setState(() => {
          this.hovered = type;
        });
      },
      onMouseLeave: () => {
        this.setState(() => {
          this.hovered = null;
        });
      },
      onDragMove: this.handleSize(type),
      child: Container({
        color: this.hovered === type ? "blue" : "transparent",
        width: type === "left" || type === "right" ? 4 : undefined,
        height: type === "top" || type === "bottom" ? 4 : undefined,
      }),
    };
  };
  build(_context: BuildContext): Widget {
    return Center({
      child: Container({
        width: this.width,
        height: this.height,
        color: "orange",
        child: Stack({
          alignment: Alignment.center,
          children: [
            Text(
              "When you resize this component, the text automatically wraps. That is, when the size of the container is adjusted, the text is appropriately wrapped and displayed. This feature automates layout calculations, allowing developers to focus more on implementing core functionalities.",
              {
                textAlign: TextAlign.center,
                style: new TextStyle({
                  color: "black",
                  fontSize: 24,
                  fontFamily: "Roboto",
                }),
              },
            ),
            Positioned({
              top: 0,
              bottom: 0,
              right: -2,
              child: GestureDetector({ ...this.getGestureProps("right") }),
            }),
            Positioned({
              top: 0,
              bottom: 0,
              left: -2,
              child: GestureDetector({ ...this.getGestureProps("left") }),
            }),
            Positioned({
              left: 0,
              right: 0,
              top: -2,
              child: GestureDetector({ ...this.getGestureProps("top") }),
            }),
            Positioned({
              left: 0,
              right: 0,
              bottom: -2,
              child: GestureDetector({ ...this.getGestureProps("bottom") }),
            }),
          ],
        }),
      }),
    });
  }
}

export const Resize = () => {
  return (
    <ReactWidget
      widget={new ResizableWidget() as any}
      width="100%"
      height="600px"
    />
  );
};
