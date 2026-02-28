import {
  StatefulWidget,
  State,
  Container,
  EdgeInsets,
  BoxDecoration,
  BorderRadius,
  Radius,
  Border,
  BoxShadow,
  GestureDetector,
  Stack,
  StackFit,
  Positioned,
  ConstraintsTransformBox,
  FractionalTranslation,
  Offset,
  SizedBox,
  Alignment,
  type Widget,
} from "flitter-core";
import type { BarChartContext } from "@headless/bar-chart/types";
import type { ToastBarChartConfig } from "../config";
import { tooltipContent } from "@shared/styles/toast";

function barBorderRadius(
  cornerRadius: number,
  direction: "vertical" | "horizontal",
  value: number,
) {
  if (cornerRadius === 0) return undefined;
  const r = Radius.circular(cornerRadius);
  const z = Radius.zero;

  if (direction === "vertical") {
    return value >= 0
      ? BorderRadius.only({ topLeft: r, topRight: r, bottomLeft: z, bottomRight: z })
      : BorderRadius.only({ topLeft: z, topRight: z, bottomLeft: r, bottomRight: r });
  }
  return value >= 0
    ? BorderRadius.only({ topLeft: z, topRight: r, bottomLeft: z, bottomRight: r })
    : BorderRadius.only({ topLeft: r, topRight: z, bottomLeft: r, bottomRight: z });
}

class _HoverableBar extends StatefulWidget {
  color: string;
  borderRadius: BorderRadius | undefined;
  gap: number;
  tooltip: Widget;
  tooltipPosition: "topCenter" | "centerRight";

  constructor({
    color,
    borderRadius,
    gap,
    tooltip,
    tooltipPosition,
  }: {
    color: string;
    borderRadius: BorderRadius | undefined;
    gap: number;
    tooltip: Widget;
    tooltipPosition: "topCenter" | "centerRight";
  }) {
    super();
    this.color = color;
    this.borderRadius = borderRadius;
    this.gap = gap;
    this.tooltip = tooltip;
    this.tooltipPosition = tooltipPosition;
  }

  createState() {
    return new _HoverableBarState();
  }
}

class _HoverableBarState extends State<_HoverableBar> {
  hovered = false;

  override build() {
    const { color, borderRadius, gap, tooltip, tooltipPosition } = this.widget;

    const decoration = this.hovered
      ? new BoxDecoration({
          color,
          borderRadius,
          border: Border.all({ color: "white", width: 2 }),
          boxShadow: [
            new BoxShadow({ color: "rgba(0,0,0,0.3)", blurRadius: 8 }),
          ],
        })
      : new BoxDecoration({ color, borderRadius });

    const bar = Container({
      margin: EdgeInsets.symmetric({ horizontal: gap }),
      decoration,
    });

    return Stack({
      fit: StackFit.passthrough,
      clipped: false,
      children: [
        GestureDetector({
          cursor: "pointer",
          child: bar,
          onMouseEnter: () => {
            this.setState(() => {
              this.hovered = true;
            });
          },
          onMouseLeave: () => {
            this.setState(() => {
              this.hovered = false;
            });
          },
        }),
        this.hovered
          ? Positioned.fill({
              child: ConstraintsTransformBox({
                constraintsTransform: ConstraintsTransformBox.unconstrained,
                alignment: Alignment[tooltipPosition],
                child: FractionalTranslation({
                  translation:
                    tooltipPosition === "topCenter"
                      ? new Offset({ x: 0, y: -1 })
                      : new Offset({ x: 1, y: 0 }),
                  child: tooltip,
                }),
              }),
            })
          : SizedBox.shrink(),
      ],
    });
  }
}

export function toastBar(
  { legend, value, label, index }: { value: number; label: string; legend: string; index: number },
  context: BarChartContext<ToastBarChartConfig>,
): Widget {
  const { colors, bar } = context.config;
  const idx = context.legends.indexOf(legend);
  const color = colors[idx % colors.length];
  const borderRadius = barBorderRadius(bar.cornerRadius, context.direction, value);
  const isVertical = context.direction === "vertical";

  if (!context.config.tooltip.enabled) {
    return Container({
      margin: EdgeInsets.symmetric({ horizontal: bar.gap }),
      decoration: new BoxDecoration({ color, borderRadius }),
    });
  }

  return new _HoverableBar({
    color,
    borderRadius,
    gap: bar.gap,
    tooltip: tooltipContent({ label, legend, color, value, config: context.config }),
    tooltipPosition: isVertical ? "topCenter" : "centerRight",
  });
}
