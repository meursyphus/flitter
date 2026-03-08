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
  type Widget,
} from "flitter-core";

export type HoverTooltipPosition =
  | "topLeft"
  | "topRight"
  | "topCenter"
  | "bottomCenter"
  | "bottomLeft"
  | "bottomRight"
  | "center"
  | "centerLeft"
  | "centerRight";

const positionHelper = {
  topLeft: new Offset({ x: -1, y: -1 }),
  topCenter: new Offset({ x: 0, y: -1 }),
  topRight: new Offset({ x: 1, y: -1 }),
  center: new Offset({ x: 0, y: 0 }),
  centerLeft: new Offset({ x: -1, y: 0 }),
  centerRight: new Offset({ x: 1, y: 0 }),
  bottomCenter: new Offset({ x: 0, y: 1 }),
  bottomLeft: new Offset({ x: -1, y: 1 }),
  bottomRight: new Offset({ x: 1, y: 1 }),
} satisfies Record<HoverTooltipPosition, Offset>;

export class HoverTooltip extends StatefulWidget {
  renderChild: (hovered: boolean) => Widget;
  tooltip?: Widget;
  position: HoverTooltipPosition;
  offset: Offset;
  translation?: Offset;
  cursor: "default" | "pointer";
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;

  constructor({
    renderChild,
    tooltip,
    position = "topCenter",
    offset = Offset.Constants.zero,
    translation,
    cursor = "default",
    onMouseEnter,
    onMouseLeave,
  }: {
    renderChild: (hovered: boolean) => Widget;
    tooltip?: Widget;
    position?: HoverTooltipPosition;
    offset?: Offset;
    translation?: Offset;
    cursor?: "default" | "pointer";
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
  }) {
    super();
    this.renderChild = renderChild;
    this.tooltip = tooltip;
    this.position = position;
    this.offset = offset;
    this.translation = translation;
    this.cursor = cursor;
    this.onMouseEnter = onMouseEnter;
    this.onMouseLeave = onMouseLeave;
  }

  createState() {
    return new HoverTooltipState();
  }
}

class HoverTooltipState extends State<HoverTooltip> {
  hovered = false;

  override build() {
    return Stack({
      fit: StackFit.passthrough,
      clipped: false,
      children: [
        GestureDetector({
          cursor: this.widget.cursor,
          child: this.widget.renderChild(this.hovered),
          onMouseEnter: () => {
            this.widget.onMouseEnter?.();
            this.setState(() => {
              this.hovered = true;
            });
          },
          onMouseLeave: () => {
            this.widget.onMouseLeave?.();
            this.setState(() => {
              this.hovered = false;
            });
          },
        }),
        this.hovered && this.widget.tooltip
          ? Positioned.fill({
              child: FractionalTranslation({
                translation: this.widget.offset,
                child: ConstraintsTransformBox({
                  constraintsTransform: ConstraintsTransformBox.unconstrained,
                  alignment: Alignment[this.widget.position],
                  child: FractionalTranslation({
                    translation:
                      this.widget.translation ?? positionHelper[this.widget.position],
                    child: this.widget.tooltip,
                  }),
                }),
              }),
            })
          : SizedBox.shrink(),
      ],
    });
  }
}
