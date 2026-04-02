import {
  StatefulWidget,
  State,
  Stack,
  StackFit,
  AnimatedPositioned,
  AnimatedOpacity,
  FractionalTranslation,
  ConstraintsTransformBox,
  SizedBox,
  Offset,
  Curves,
  ZIndex,
  type Widget,
} from "flitter-core";
import type { LineChartCustom } from "flitter-ui/chart";
import type { AgLineChartConfig } from "../config";

const ANIMATION_DURATION = 150;
const FADE_DURATION = 100;

class _AgTooltipArea extends StatefulWidget {
  tooltip: Widget | null;
  hoveredPoint: { index: number; legend: string; x: number; y: number } | null;

  constructor({
    tooltip,
    hoveredPoint,
  }: {
    tooltip: Widget | null;
    hoveredPoint: { index: number; legend: string; x: number; y: number } | null;
  }) {
    super();
    this.tooltip = tooltip;
    this.hoveredPoint = hoveredPoint;
  }

  createState() {
    return new _AgTooltipAreaState();
  }
}

class _AgTooltipAreaState extends State<_AgTooltipArea> {
  pointPixelX = 0;
  pointPixelY = 0;
  wasVisible = false;
  lastTooltip: Widget | null = null;

  override build(): Widget {
    const { tooltip, hoveredPoint } = this.widget;

    if (tooltip != null && hoveredPoint != null) {
      this.lastTooltip = tooltip;
      this.pointPixelX = hoveredPoint.x;
      this.pointPixelY = hoveredPoint.y;
    }

    const isVisible = tooltip != null && hoveredPoint != null;
    const positionDuration = !this.wasVisible && isVisible ? 0 : ANIMATION_DURATION;
    this.wasVisible = isVisible;

    const showTooltip = this.lastTooltip;

    const children: Widget[] = [];

    if (showTooltip != null) {
      children.push(
        AnimatedPositioned({
          duration: positionDuration,
          curve: Curves.easeOut,
          left: this.pointPixelX,
          top: this.pointPixelY,
          child: AnimatedOpacity({
            duration: FADE_DURATION,
            opacity: isVisible ? 1 : 0,
            curve: Curves.easeOut,
            child: FractionalTranslation({
              translation: new Offset({ x: -0.5, y: -1 }),
              child: ConstraintsTransformBox({
                constraintsTransform: ConstraintsTransformBox.unconstrained,
                child: ZIndex({
                  zIndex: 9999,
                  child: showTooltip,
                }),
              }),
            }),
          }),
        }),
      );
    }

    if (children.length === 0) return SizedBox.shrink();

    return Stack({
      fit: StackFit.passthrough,
      clipped: false,
      children,
    });
  }
}

export function agTooltipArea(
  ...[{ tooltip, hoveredPoint }, ctx]: Parameters<LineChartCustom<AgLineChartConfig>["tooltipArea"]>
): Widget {
  if (!ctx.config.tooltip.enabled) return SizedBox.shrink();
  return new _AgTooltipArea({ tooltip, hoveredPoint });
}
